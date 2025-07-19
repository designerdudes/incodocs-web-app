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
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import EntityCombobox from "@/components/ui/EntityCombobox";
import CalendarComponent from "../CalendarComponent";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

interface SalesCreateNewFormProps {
  gap: number;
  orgId: string;
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
  invoiceNo: z.string().optional(),
  invoiceValue: z.number().min(1),
  paymentProof: z.string().optional(),
});

export function SalesCreateNewForm({ gap, orgId }: SalesCreateNewFormProps) {
  const [slabs, setSlabs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [customerLoading, setCustomerLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<
    {
      address: string;
      _id: string;
      name: string;
    }[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

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
  }, [customers]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const endpoint =
        values.gstPercentage === "0"
          ? "/transaction/sale/add"
          : "/transaction/sale/addgst";

      // prepare data
      const transformedData: any = {
        factoryId: factoryId,
        customerId: values.customerId,
        noOfSlabs: values.noOfSlabs,
        length: slabs[0]?.dimensions.length.value,
        paymentProof: values.paymentProof || "",
        height: slabs[0]?.dimensions.height.value,
        saleDate:
          values.gstPercentage === "0"
            ? new Date(values.salesDate).toISOString() // Without GST
            : values.salesDate.split("T")[0], // With GST (only YYYY-MM-DD)
      };

      if (values.gstPercentage === "0") {
        transformedData.actualInvoiceValue = values.invoiceValue;
        transformedData.slabIds = []; // populate with real slab IDs if available
      } else {
        transformedData.invoiceValue = values.invoiceValue;
        transformedData.gstPercentage = parseFloat(values.gstPercentage);
      }

      await postData(endpoint, transformedData);

      toast.success("Sale record added successfully");
      router.push("./");
    } catch (err) {
      console.error(err);
      toast.error("Error adding sale record");
    } finally {
      setIsLoading(false);
    }
  };

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
                    <select
                      disabled={isLoading}
                      {...field}
                      className="block w-full border-slate-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 bg-transparent"
                    >
                      <option value="0">0%</option>
                      <option value="1">1%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
