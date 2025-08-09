"use client";
import * as React from "react";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import {
  CalendarIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Search,
  Trash,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import EntityCombobox from "@/components/ui/EntityCombobox";
import CalendarComponent from "../CalendarComponent";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import { Polishedcolumns } from "@/app/(routes)/[organizationId]/[factoryid]/factorymanagement/inventory/finished/components/polishedColumns";
import { DataTable } from "../ui/data-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { MdSearch } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SalesCreateNewFormProps {
  gap: number;
  orgId: string;
  polishedSlabs: any[];
}

const formSchema = z.object({
  customerName: z.string().min(3, "Customer name is required"),
  customerAddress: z.string().optional(),
  customerId: z.string().min(3),
  gstNumber: z.string().optional(),
  noOfSlabs: z.number().optional(),
  slabs: z
    .array(
      z.object({
        dimensions: z.object({
          length: z.object({
            value: z.number().min(0.1),
            units: z.literal("inch").default("inch"),
          }),
          height: z.object({
            value: z.number().min(0.1),
            units: z.literal("inch").default("inch"),
          }),
        }),
      })
    )
    .optional(),
  salesDate: z.string().nonempty(),
  gstPercentage: z.enum(["0", "1", "5", "12", "18"]),
  invoiceNo: z.string().min(3, "Invoice number is required"),
  invoiceValue: z.number().min(1),
  paymentProof: z.string().optional(),
});

export function SalesCreateNewForm({
  gap,
  orgId,
  polishedSlabs,
}: SalesCreateNewFormProps) {
  const [slabs, setSlabs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [customerLoading, setCustomerLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [customers, setCustomers] = React.useState<
    {
      address: string;
      _id: string;
      name: string;
    }[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [search, setSearch] = React.useState("");
  const [selectedSlabs, setSelectedSlabs] = React.useState<string[]>([]);
  const filteredSlabs = polishedSlabs.filter((slab) => {
    const slabNumber = slab?.slabNumber?.toString().toLowerCase() || "";
    const blockNumber = slab?.blockNumber?.toString().toLowerCase() || "";
    const materialType =
      slab?.blockId?.lotId?.materialType?.toLowerCase() || "";
    const query = search.toLowerCase();

    return (
      slabNumber.includes(query) ||
      blockNumber.includes(query) ||
      materialType.includes(query)
    );
  });

  const toggleSlab = (id: string) => {
    setSelectedSlabs((prev) =>
      prev.includes(id) ? prev.filter((slabId) => slabId !== id) : [...prev, id]
    );
  };

  const factoryId = useParams().factoryid as string;

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerId: "",
      customerAddress: "",
      gstNumber: "",
      noOfSlabs: undefined,
      salesDate: "",
      gstPercentage: "0",
      invoiceNo: "",
      invoiceValue: undefined,
      paymentProof: "",
      slabs: [],
    },
  });

  React.useEffect(() => {
    const fetchingCustomers = async () => {
      try {
        setCustomerLoading(true);
        const customerResponse = await fetchData(
          `/accounting/customer/getbyfactory/${factoryId}`
        );
        const customerData = await customerResponse;

        const mappedCustomers = customerData.map((customer: any) => ({
          _id: customer._id,
          name: customer.customerName,
          address: customer.customerAddress, // <- include this
        }));
        setCustomers(mappedCustomers);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setCustomerLoading(false);
      }
    };

    fetchingCustomers();
  }, [customers, factoryId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (selectedSlabs.length < 1 && values.gstPercentage === "0") {
        toast.error("Please select at least one slab.");
        setIsLoading(false);
        return;
      }
      const endpoint =
        values.gstPercentage !== "0"
          ? "/transaction/sale/addgst"
          : "/transaction/sale/add";

      // prepare data
      const transformedData: any = {
        factoryId: factoryId,
        customerId: values.customerId,
        noOfSlabs: values.noOfSlabs,
        slabIds: selectedSlabs,
        // length: slabs[0]?.dimensions.length.value,
        // height: slabs[0]?.dimensions.height.value,
        invoiceNo: values.invoiceNo,
        paymentProof: values.paymentProof || "",
        saleDate:
          values.gstPercentage === "0"
            ? new Date(values.salesDate).toISOString() // Without GST
            : values.salesDate.split("T")[0], // With GST (only YYYY-MM-DD)
      };

      if (values.gstPercentage !== "0") {
        transformedData.invoiceValue = values.invoiceValue;
        transformedData.gstPercentage = parseFloat(values.gstPercentage);
        transformedData.slabIds = []; // populate with real slab IDs if available
      } else {
        transformedData.actualInvoiceValue = values.invoiceValue;
        transformedData.noOfSlabs = selectedSlabs?.length;
      }
      // console.log(transformedData);
      // console.log("Transformed Data:", transformedData);
      await postData(endpoint, transformedData);
      // console.log("Sale record added successfully:", transformedData);
      toast.success("Sale record added successfully");
      router.push("./");
    } catch (err) {
      console.error(err);
      toast.error("Error adding sale record");
    } finally {
      setIsLoading(false);
    }
  };

  const gstPercentage = form.watch("gstPercentage");

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Validation Errors:", errors);
          })}
          className="space-y-6"
        >
          {/* Row 1: Customer Name, Customer ID, Customer Address */}
          <div className={`grid grid-cols-3 gap-3`}>
            <FormField
              name="customerId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Customer</FormLabel>
                  <FormControl>
                    <EntityCombobox
                      entities={customers}
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        const selectedCustomer = customers.find(
                          (c) => c._id === value
                        );
                        if (selectedCustomer) {
                          form.setValue("customerName", selectedCustomer.name);
                          form.setValue(
                            "customerAddress",
                            selectedCustomer.address || ""
                          ); // optional: check for `address`
                        }
                      }}
                      displayProperty="name"
                      valueProperty="_id"
                      placeholder="Select Customer"
                      onAddNew={() => {
                        window.open(
                          `/${orgId}/${factoryId}/factorymanagement/parties/customer/createNew`,
                          "_blank"
                        );
                      }}
                      multiple={false}
                      addNewLabel="Add New Customer"
                      // disabled={isLoading || customerLoading}
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
            <FormField
              name="gstPercentage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Percentage</FormLabel>
                  <FormControl>
                    <Select disabled={isLoading} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select GST Percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="0" value="0">
                          0%
                        </SelectItem>
                        <SelectItem key="1" value="1">
                          1%
                        </SelectItem>
                        <SelectItem key="5" value="5">
                          5%
                        </SelectItem>
                        <SelectItem key="12" value="12">
                          12%
                        </SelectItem>
                        <SelectItem key="18" value="18">
                          18%
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {gstPercentage !== "0" && (
              <FormField
                name="noOfSlabs"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number Of Slabs</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of slabs"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined
                          )
                        }
                        min={0}
                        onWheel={(e) =>
                          e.target instanceof HTMLElement && e.target.blur()
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="invoiceNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No.</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      placeholder="Enter Invoice No."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      min={0}
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="salesDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full">
                          {field.value ? (
                            format(new Date(field.value), "PPPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 text-sm flex flex-col relative"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        startMonth={new Date(2010, 0)}
                        endMonth={new Date(2025, 11)}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString());
                        }}
                        captionLayout="dropdown"
                        classNames={{
                          caption: "flex justify-between items-center",
                          caption_label: "text-sm font-medium hidden",
                          dropdown: "border rounded p-0 text-xs",
                          months: "flex flex-col",
                        }}
                        className="bg-white p-4 rounded-xl shadow-md"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {gstPercentage === "0" && (
            <div className="text-right">
              <Button
                type="button"
                variant="outline"
                className="text-sm"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <>
                    Hide Slabs <ChevronUp />
                  </>
                ) : (
                  <>
                    Show Slabs <ChevronDown />
                  </>
                )}
              </Button>
            </div>
          )}

          {show && (
            <div>
              <div className=" relative mb-4 w-1/3 flex justify-between items-center">
                <Input
                  type="text"
                  placeholder="Search by Slab, Block, or Material Type"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search size={14} className="absolute right-2 opacity-50" />
              </div>
              <Table>
                {filteredSlabs.length < 1 ? (
                  <TableCaption>No Slabs Available For Sale</TableCaption>
                ) : (
                  <TableCaption>List Of Your Slabs For Sale</TableCaption>
                )}
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Slab Number</TableHead>
                    <TableHead>Block Number</TableHead>
                    <TableHead>Material Type</TableHead>
                    <TableHead className="text-right">Length</TableHead>
                    <TableHead className="text-right">Height</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlabs.map((slab) => (
                    <TableRow key={slab._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSlabs.includes(slab._id)}
                          onCheckedChange={() => toggleSlab(slab._id)}
                        />
                      </TableCell>
                      <TableCell>{slab?.slabNumber || "N/A"}</TableCell>
                      <TableCell>{slab?.blockNumber || "N/A"}</TableCell>
                      <TableCell>
                        {slab?.blockId?.lotId?.materialType || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {slab?.dimensions?.length?.value || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {slab?.dimensions?.height?.value || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
