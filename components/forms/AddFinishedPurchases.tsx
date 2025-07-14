"use client";
import * as React from "react";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EntityCombobox from "@/components/ui/EntityCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { fetchData, postData } from "@/axiosUtility/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import CalendarComponent from "../CalendarComponent";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

interface FinishedPurchaseCreateNewFormProps {
  gap: number;
  orgId: string;
}

const formSchema = z.object({
  SupplierId: z.string(),
  factoryId: z.string(),
  invoiceNo: z.string(),
  invoiceValue: z.number().optional(),
  supplierGSTN: z.string().optional(),
  purchaseDate: z.string().optional(),
  gstPercentage: z.enum(["0%", "1%", "5%", "12%", "18%"]).optional(),
  ratePerSqft: z.number().optional(),
  slabs: z
    .array(
      z.object({
        slabNumber: z.number(),
        productName: z.string(),
        quantity: z.number(),
        status: z.string(),
        inStock: z.boolean(),
        dimensions: z.object({
          length: z.object({
            value: z.number(),
            units: z.literal("inch"),
          }),
          height: z.object({
            value: z.number(),
            units: z.literal("inch"),
          }),
        }),
      })
    )
    .optional(),
  noOfSlabs: z.number().optional(),
   paymentProof:z.string().optional(),
});

export default function FinishedPurchaseCreateNewForm({
  gap,
  orgId,
}: FinishedPurchaseCreateNewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [supplierLoading, setSupplierLoading] = React.useState(false);
  const [slabs, setSlabs] = React.useState<any[]>([]);
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] =
    React.useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] =
    React.useState<boolean>(false);
  const [supplierNames, setSupplierNames] = React.useState<
    { _id: string; name: string }[]
  >([]);

  const factoryId = useParams().factoryid as string;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      SupplierId: "",
      factoryId,
      invoiceNo: "",
      invoiceValue: undefined,
      supplierGSTN: "",
      purchaseDate: "",
      ratePerSqft: undefined,
      gstPercentage: "0%",
      slabs: [],
      noOfSlabs: undefined,
      paymentProof:"",

    },
  });

  React.useEffect(() => {
    const fetchingData = async () => {
      try {
        setSupplierLoading(true);
        const supplierResponse = await fetchData(
          `/accounting/supplier/getbyfactory/${factoryId}`
        );
        const supplierData = await supplierResponse;
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        toast.error("Failed to fetch suppliers");
      } finally {
        setSupplierLoading(false);
      }
    };
    fetchingData();
  }, [supplierNames]);

  const handleAddNewSupplier = () => {
    toast("Add new supplier functionality to be implemented");
  };

  function handleSlabsInputChange(value: string) {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newSlabs = Array.from({ length: count }, (_, index) => ({
        slabNumber: index + 1,
        productName: "steps",
        quantity: 1,
        status: "readyForPolish",
        inStock: true,
        dimensions: {
          length: { value: parseFloat(globalLength) || 0, units: "inch" },
          height: { value: parseFloat(globalHeight) || 0, units: "inch" },
        },
      }));
      setSlabs(newSlabs);
      // form.setValue("slabs", newSlabs);
      form.setValue("noOfSlabs", count);
    } else {
      setSlabs([]);
      form.setValue("slabs", []);
      form.setValue("noOfSlabs", undefined);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const gstValue = values.gstPercentage
        ? parseFloat(values.gstPercentage.toString())
        : 0;

      const apiUrl =
        gstValue > 0
          ? "/transaction/purchase/addslabgst"
          : "/transaction/purchase/addslab";

      const payload: any = {
        factoryId: values.factoryId,
        supplierId: values.SupplierId,
        invoiceNo: values.invoiceNo,
        purchaseDate: values.purchaseDate || new Date().toISOString(),
        paymentProof: values.paymentProof || "",
        noOfSlabs: values.noOfSlabs || 0,
        length: values.slabs?.[0]?.dimensions?.length?.value || 0,
        height: values.slabs?.[0]?.dimensions?.height?.value || 0,
        ratePerSqft: values.ratePerSqft || 0,
      };

      if (gstValue > 0) {
        // GST-based purchase
        payload.invoiceValue = values.invoiceValue || 0;
        payload.gstPercentage = gstValue;
      } else {
        // Actual (non-GST) purchase
        payload.actualInvoiceValue = values.invoiceValue || 0;

        payload.slabs =
          values.slabs?.map((slab, index) => ({
            factoryId: values.factoryId,
            slabNumber: slab.slabNumber || `S${index + 1}`,
            productName: slab.productName || "steps",
            quantity: slab.quantity || 1,
            dimensions: {
              length: {
                value: slab.dimensions?.length?.value || 0,
                units: slab.dimensions?.length?.units || "inch",
              },
              height: {
                value: slab.dimensions?.height?.value || 0,
                units: slab.dimensions?.height?.units || "inch",
              },
            },
            status: slab.status || "readyForPolish",
            inStock: slab.inStock ?? true,
          })) || [];
      }

      await postData(apiUrl, payload);
      toast.success("Finished Purchase Added Successfully");
      router.push("../");
    } catch (error) {
      console.error("Error creating finished purchase:", error);
      toast.error("Error creating finished purchase");
    } finally {
      setIsLoading(false);
    }
  }
  function calculateSqft(length?: number, height?: number): string {
    const lengthInFeet = (length || 0) / 12;
    const heightInFeet = (height || 0) / 12;
    const area = lengthInFeet * heightInFeet;
    return area > 0 ? area.toFixed(2) : "0.00";
  }

  function calculateTotalSqft(): string {
    const slabs = form.getValues("slabs") || [];
    const totalSqft = slabs.reduce((sum, slab) => {
      const lengthInFeet = (slab.dimensions?.length?.value || 0) / 12;
      const heightInFeet = (slab.dimensions?.height?.value || 0) / 12;
      return sum + lengthInFeet * heightInFeet;
    }, 0);
    return totalSqft.toFixed(2);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Supplier Name */}
            <FormField
              name="SupplierId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Supplier</FormLabel>
                  <FormControl>
                    <EntityCombobox
                      entities={supplierNames}
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      valueProperty="_id" // ✅ Ensure supplier ID is passed
                      displayProperty="name"
                      placeholder="Select a Supplier Name"
                      onAddNew={() => {
                        window.open(
                          `/${orgId}/${factoryId}/factorymanagement/parties/supplier/createNew`,
                          "_blank"
                        );
                      }}
                      multiple={false}
                      addNewLabel="Add New Supplier"
                      // disabled={isLoading || supplierLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Date */}
            <FormField
              name="purchaseDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[100%] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "PPP")
                              : "Purchase date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(date ? date.toISOString() : "")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Invoice No */}
            <FormField
              name="invoiceNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No.</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Invoice No."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Invoice Value */}
            <FormField
              name="invoiceValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Invoice Value"
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                        control={form.control}
                        name="paymentProof"
                        render={() => (
                          <FormItem>
                            <FormLabel>Payment Proof</FormLabel>
                            <FormControl>
                              <FileUploadField
                                name="paymentProof"
                                storageKey="paymentProof"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

            {/* GST Percentage */}
            <FormField
              name="gstPercentage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Percentage</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select GST Percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0%">0%</SelectItem>
                        <SelectItem value="1%">1%</SelectItem>
                        <SelectItem value="5%">5%</SelectItem>
                        <SelectItem value="12%">12%</SelectItem>
                        <SelectItem value="18%">18%</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rate per Sqft */}
            <FormField
              name="ratePerSqft"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per Sqft</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter rate per sqft"
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Slabs Section */}
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="noOfSlabs"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No of Slabs</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter number of slabs"
                      type="number"
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value) || undefined);
                        handleSlabsInputChange(e.target.value);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dimensions Inputs */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[
              {
                label: "Length (inch)",
                value: globalLength,
                setter: setGlobalLength,
                apply: applyLengthToAll,
                setApply: setApplyLengthToAll,
                key: "length",
              },
              {
                label: "Height (inch)",
                value: globalHeight,
                setter: setGlobalHeight,
                apply: applyHeightToAll,
                setApply: setApplyHeightToAll,
                key: "height",
              },
            ].map(({ label, value, setter, apply, setApply, key }) => (
              <div key={key}>
                <Input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={label}
                  type="number"
                  disabled={isLoading}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  <input
                    type="checkbox"
                    checked={apply}
                    onChange={(e) => {
                      setApply(e.target.checked);
                      if (e.target.checked) {
                        const updatedSlabs = slabs.map((slab) => ({
                          ...slab,
                          dimensions: {
                            ...slab.dimensions,
                            [key]: {
                              value: parseFloat(value) || 0,
                              units: "inch",
                            },
                          },
                        }));
                        setSlabs(updatedSlabs);
                        form.setValue("slabs", updatedSlabs);
                      }
                    }}
                  />{" "}
                  Apply {label} to all rows
                </label>
              </div>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Slab Number</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Length (inch)</TableHead>
                <TableHead>Height (inch)</TableHead>
                <TableHead>Area (sqft)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slabs.map((slab, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={slab?.slabNumber}
                      placeholder="Enter slab number"
                      onChange={(e) => {
                        const updatedSlabs = [...slabs];
                        updatedSlabs[index].slabNumber =
                          parseInt(e.target.value) || index + 1;
                        setSlabs(updatedSlabs);
                        form.setValue("slabs", updatedSlabs);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={slab?.productName}
                      placeholder="Enter product name"
                      onChange={(e) => {
                        const updatedSlabs = [...slabs];
                        updatedSlabs[index].productName = e.target.value || "";
                        setSlabs(updatedSlabs);
                        form.setValue("slabs", updatedSlabs);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={slab?.quantity}
                      placeholder="Enter quantity"
                      onChange={(e) => {
                        const updatedSlabs = [...slabs];
                        updatedSlabs[index].quantity =
                          parseInt(e.target.value) || 1;
                        setSlabs(updatedSlabs);
                        form.setValue("slabs", updatedSlabs);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={slab?.dimensions?.length?.value}
                      placeholder="Enter length"
                      onChange={(e) => {
                        const updatedSlabs = [...slabs];
                        updatedSlabs[index].dimensions.length = {
                          value: parseFloat(e.target.value) || 0,
                          units: "inch",
                        };
                        setSlabs(updatedSlabs);
                        form.setValue("slabs", updatedSlabs);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={slab?.dimensions?.height?.value}
                      placeholder="Enter height"
                      onChange={(e) => {
                        const updatedSlabs = [...slabs];
                        updatedSlabs[index].dimensions.height = {
                          value: parseFloat(e.target.value) || 0,
                          units: "inch",
                        };
                        setSlabs(updatedSlabs);
                        form.setValue("slabs", updatedSlabs);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    {calculateSqft(
                      slab?.dimensions?.length?.value,
                      slab?.dimensions?.height?.value
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => {
                        const updatedSlabs = slabs.filter(
                          (_, i) => i !== index
                        );
                        setSlabs(updatedSlabs);
                        form.setValue("slabs", updatedSlabs);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8} className="text-right font-bold">
                  Total Area (sqft): {calculateTotalSqft()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Finished Purchase"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
