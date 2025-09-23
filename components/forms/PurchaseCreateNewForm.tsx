"use client";
import * as React from "react";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
import { postData } from "@/axiosUtility/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Trash ,ChevronsUpDown} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface PurchaseCreateNewFormProps {
  gap: number;
}

const formSchema = z
  .object({
    SupplierName: z
      .string()
      .min(3, { message: "Supplier name must be at least 3 characters long" }),
    SupplierId: z.string().nonempty({ message: "Supplier ID is required" }),
    invoiceNo: z
      .string()
      .min(1, { message: "Invoice number must be provided" }),
    invoiceValue: z
      .number({ invalid_type_error: "Invoice value must be a number" })
      .min(1, { message: "Invoice value must be greater than 0" }),
    supplierGSTN: z
      .string()
      .min(3, { message: "Supplier GSTN must be at least 3 characters long" }),
    purchaseDate: z
      .string()
      .min(3, { message: "Purchase date must be at least 3 characters long" }),
    purchaseType: z.enum(["Raw", "Finished"], {
      errorMap: () => ({ message: "Invalid option selected" }),
    }),
    gstPercentage: z.enum(["0%", "1%", "5%", "12%", "18%"], {
      errorMap: () => ({ message: "Invalid GST Percentage selected" }),
    }),
    rate: z
      .number({ invalid_type_error: "Rate must be a number" })
      .min(1, { message: "Rate must be greater than 0" }),
    blocks: z
      .array(
        z.object({
          dimensions: z.object({
            weight: z.object({
              value: z
                .number()
                .min(0.1, { message: "Weight must be greater than zero" }),
              units: z.literal("tons").default("tons"),
            }),
            length: z.object({
              value: z
                .number()
                .min(0.1, { message: "Length must be greater than zero" }),
              units: z.literal("inch").default("inch"),
            }),
            breadth: z.object({
              value: z
                .number()
                .min(0.1, { message: "Breadth must be greater than zero" }),
              units: z.literal("inch").default("inch"),
            }),
            height: z.object({
              value: z
                .number()
                .min(0.1, { message: "Height must be greater than zero" }),
              units: z.literal("inch").default("inch"),
            }),
          }),
        })
      )
      .min(1, { message: "At least one block is required" })
      .optional(),
    noOfBlocks: z
      .number()
      .min(1, { message: "No of Blocks must be greater than 0" })
      .optional(),
    slabs: z
      .array(
        z.object({
          dimensions: z.object({
            length: z.object({
              value: z
                .number()
                .min(0.1, { message: "Length must be greater than zero" }),
              units: z.literal("inch").default("inch"),
            }),
            height: z.object({
              value: z
                .number()
                .min(0.1, { message: "Height must be greater than zero" }),
              units: z.literal("inch").default("inch"),
            }),
          }),
        })
      )
      .min(1, { message: "At least one slab is required" })
      .optional(),
    noOfSlabs: z
      .number()
      .min(1, { message: "No of Slabs must be greater than 0" })
      .optional(),
  })
  .refine(
    (data) =>
      data.purchaseType === "Raw" ||
      (data.purchaseType === "Finished" && data.rate > 0),
    {
      message: "Rate must be greater than 0",
      path: ["rate"],
    }
  );

export function PurchaseCreateNewForm({ gap }: PurchaseCreateNewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [supplierLoading, setSupplierLoading] = React.useState(false);
  const [purchaseType, setPurchaseType] = React.useState<"Raw" | "Finished">("Raw");
  const [blocks, setBlocks] = React.useState<any[]>([]);
  const [globalWeight, setGlobalWeight] = React.useState<string>("");
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalBreadth, setGlobalBreadth] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyWeightToAll, setApplyWeightToAll] = React.useState<boolean>(false);
  const [applyLengthToAll, setApplyLengthToAll] = React.useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] = React.useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] = React.useState<boolean>(false);
  const [supplierNames, setSupplierNames] = React.useState<{ _id: string; name: string }[]>([]);

  // Define purchaseTypeOptions
  const purchaseTypeOptions = [
    { _id: "1", name: "Raw" },
    { _id: "2", name: "Finished" },
  ];

  const factoryId = useParams().factoryid;
  const organizationId = "674b0a687d4f4b21c6c980ba";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      SupplierName: "",
      SupplierId: "",
      supplierGSTN: "",
      purchaseDate: "",
      purchaseType: "Raw",
      rate: 0,
      invoiceNo: "",
      invoiceValue: 0,
      gstPercentage: "0%",
      blocks: [],
    },
  });

  React.useEffect(() => {
    const fetchSuppliers = async () => {
      setSupplierLoading(true);
      try {
        const response = await fetchWithAuth<any>(
          "/accounting/supplier/getall"
        );
        const supplierData = response;
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to load suppliers");
      } finally {
        setSupplierLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleAddNewSupplier = () => {
    toast("Add new supplier functionality to be implemented");
  };

  function handleBlocksInputChange(value: string) {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newBlocks = Array.from({ length: count }, (_, index) => ({
        dimensions: {
          length: { value: 0, units: "inch" as "inch" },
          weight: { value: 0, units: "tons" as "tons" },
          breadth: { value: 0, units: "inch" as "inch" },
          height: { value: 0, units: "inch" as "inch" },
        },
      }));
      setBlocks(newBlocks);
      form.setValue("blocks", newBlocks);
      form.setValue("noOfBlocks", count);
    } else {
      setBlocks([]);
      form.setValue("blocks", []);
      form.setValue("noOfBlocks", undefined);
    }
  }

  function handleSlabsInputChange(value: string) {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newSlabs = Array.from({ length: count }, (_, index) => ({
        dimensions: {
          length: { value: 0, units: "inch" as "inch" },
          height: { value: 0, units: "inch" as "inch" },
        },
      }));
      setBlocks(newSlabs);
      form.setValue("slabs", newSlabs);
      form.setValue("noOfSlabs", count);
    } else {
      setBlocks([]);
      form.setValue("slabs", []);
      form.setValue("noOfSlabs", undefined);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await postData("/factory-management/inventory/addlotandblocks", {
        ...values,
        status: "active",
      });
      toast.success("Purchased Added Successfully");
      router.push("./factorymanagement/inventory/raw/lots");
    } catch (error) {
      toast.error("Error creating/updating Purchase");
    } finally {
      setIsLoading(false);
    }
    router.refresh();
  }

  function calculateTotalVolume() {
    const totalVolumeInM = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume = (length.value * breadth.value * height.value) / 1000000;
      return total + (volume || 0);
    }, 0);
    return {
      inM: totalVolumeInM,
    };
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
      const lengthInFeet = (slab.dimensions.length.value || 0) / 12;
      const heightInFeet = (slab.dimensions.height.value || 0) / 12;
      return sum + lengthInFeet * heightInFeet;
    }, 0);
    return totalSqft.toFixed(2);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`grid grid-cols-${gap} gap-3`}>
            {/* Supplier Name */}
            <FormField
              name="SupplierName"
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
                      displayProperty="name"
                      placeholder="Select a Supplier Name"
                      onAddNew={handleAddNewSupplier}
                      addNewLabel="Add New Supplier"
                      disabled={isLoading || supplierLoading}
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
                              "w-[40%] justify-start text-left font-normal",
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
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(date ? date.toISOString() : "")
                            }
                            initialFocus
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                    <select
                      disabled={isLoading}
                      {...field}
                      className="block w-full border-slate-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 bg-transparent"
                    >
                      <option value="0%">0%</option>
                      <option value="1%">1%</option>
                      <option value="5%">5%</option>
                      <option value="12%">12%</option>
                      <option value="18%">18%</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

{/* Purchase Type */}
<FormField
  name="purchaseType"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Purchase Type</FormLabel>
      <FormControl>
        <div className="relative w-full">
          <Select
            disabled={isLoading}
            onValueChange={(value) => setPurchaseType(value as "Raw" | "Finished")}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 bg-white text-black hover:bg-gray-200 hover:text-blue-600 transition-all duration-150 ease-in-out">
              <SelectValue placeholder="Select Purchase Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Raw">Raw</SelectItem>
              <SelectItem value="Finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
            {/* Rate (Dynamic Field) */}
            <FormField
              name="rate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {purchaseType === "Raw" ? "Rate per Cubic Meter" : "Rate per Sqft"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        purchaseType === "Raw"
                          ? "Enter rate per cubic meter"
                          : "Enter rate per sqft"
                      }
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Raw Specific Fields */}
          {purchaseType === "Raw" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {/* No of Blocks */}
                <FormField
                  name="noOfBlocks"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No of Blocks</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter number of blocks"
                          type="number"
                          disabled={isLoading}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value) || undefined);
                            handleBlocksInputChange(e.target.value);
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
              <div className="grid grid-cols-4 gap-3 mt-3">
                {[
                  {
                    label: "Weight (tons)",
                    value: globalWeight,
                    setter: setGlobalWeight,
                    apply: applyWeightToAll,
                    setApply: setApplyWeightToAll,
                    key: "weight",
                  },
                  {
                    label: "Length (cm)",
                    value: globalLength,
                    setter: setGlobalLength,
                    apply: applyLengthToAll,
                    setApply: setApplyLengthToAll,
                    key: "length",
                  },
                  {
                    label: "Breadth (cm)",
                    value: globalBreadth,
                    setter: setGlobalBreadth,
                    apply: applyBreadthToAll,
                    setApply: setApplyBreadthToAll,
                    key: "breadth",
                  },
                  {
                    label: "Height (cm)",
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
                            const updatedBlocks = blocks.map((block) => ({
                              ...block,
                              dimensions: {
                                ...block.dimensions,
                                [key]: {
                                  ...block.dimensions[key],
                                  value: parseFloat(value) || 0,
                                },
                              },
                            }));
                            setBlocks(updatedBlocks);
                            form.setValue("blocks", updatedBlocks);
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
                    <TableHead>Weight (tons)</TableHead>
                    <TableHead>Length (cm)</TableHead>
                    <TableHead>Breadth (cm)</TableHead>
                    <TableHead>Height (cm)</TableHead>
                    <TableHead>Volume(m³)</TableHead>
                    <TableHead>Vehicle Number</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blocks.map((block, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={block?.dimensions?.weight?.value}
                          placeholder="Enter weight"
                          onChange={(e) => {
                            const updatedBlocks = [...blocks];
                            updatedBlocks[index].dimensions.weight.value =
                              parseFloat(e.target.value) || 0;
                            setBlocks(updatedBlocks);
                            form.setValue("blocks", updatedBlocks);
                          }}
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={block?.dimensions?.length?.value}
                          placeholder="Enter length"
                          onChange={(e) => {
                            const updatedBlocks = [...blocks];
                            updatedBlocks[index].dimensions.length.value =
                              parseFloat(e.target.value) || 0;
                            setBlocks(updatedBlocks);
                            form.setValue("blocks", updatedBlocks);
                          }}
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={block?.dimensions?.breadth?.value}
                          placeholder="Enter breadth"
                          onChange={(e) => {
                            const updatedBlocks = [...blocks];
                            updatedBlocks[index].dimensions.breadth.value =
                              parseFloat(e.target.value) || 0;
                            setBlocks(updatedBlocks);
                            form.setValue("blocks", updatedBlocks);
                          }}
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={block?.dimensions?.height?.value}
                          placeholder="Enter height"
                          onChange={(e) => {
                            const updatedBlocks = [...blocks];
                            updatedBlocks[index].dimensions.height.value =
                              parseFloat(e.target.value) || 0;
                            setBlocks(updatedBlocks);
                            form.setValue("blocks", updatedBlocks);
                          }}
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        {(
                          (block?.dimensions?.length?.value *
                            block?.dimensions?.breadth?.value *
                            block?.dimensions?.height?.value) /
                          1000000
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="string"
                          placeholder="BH 08 BH 0823"
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => {
                            const updatedBlocks = blocks.filter(
                              (_, i) => i !== index
                            );
                            setBlocks(updatedBlocks);
                            form.setValue("blocks", updatedBlocks);
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
                      Total Volume (m³): {calculateTotalVolume().inM.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          {/* Finished Specific Fields */}
          {purchaseType === "Finished" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {/* No of Slabs */}
                <FormField
                  name="noOfSlabs"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No of Slabs</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter number of Slabs"
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
              <div className="grid grid-cols-4 gap-3 mt-3">
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
                            const updatedBlocks = blocks.map((block) => ({
                              ...block,
                              dimensions: {
                                ...block.dimensions,
                                [key]: {
                                  ...block.dimensions[key],
                                  value: parseFloat(value) || 0,
                                },
                              },
                            }));
                            setBlocks(updatedBlocks);
                            form.setValue("slabs", updatedBlocks);
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
                    <TableHead>Length (inch)</TableHead>
                    <TableHead>Height (inch)</TableHead>
                    <TableHead>Area (sqft)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blocks.map((slab, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={slab?.dimensions?.length?.value}
                          placeholder="Enter length"
                          onChange={(e) => {
                            const updatedSlabs = [...blocks];
                            updatedSlabs[index].dimensions.length.value =
                              parseFloat(e.target.value) || 0;
                            setBlocks(updatedSlabs);
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
                            const updatedBlocks = [...blocks];
                            updatedBlocks[index].dimensions.height.value =
                              parseFloat(e.target.value) || 0;
                            setBlocks(updatedBlocks);
                            form.setValue("slabs", updatedBlocks);
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
                            const updatedBlocks = blocks.filter(
                              (_, i) => i !== index
                            );
                            setBlocks(updatedBlocks);
                            form.setValue("slabs", updatedBlocks);
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
                    <TableCell colSpan={5} className="text-right font-bold">
                      Total Area (sqft): {calculateTotalSqft()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}