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
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import EntityCombobox from "@/components/ui/EntityCombobox";
import CalendarComponent from "../CalendarComponent";

interface SalesCreateNewFormProps {
  gap: number;
  orgId: string;
}

const formSchema = z.object({
  customerName: z.string().min(3, "Customer name is required"),
  customerAddress: z.string().optional(),
  customerId: z.string().min(3),
  gstNumber: z.string().min(3),
  noOfSlabs: z.number().min(1),
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
    .min(1),
  salesDate: z.string().nonempty(),
  gstPercentage: z.enum(["0", "1", "5", "12", "18"]),
  invoiceValue: z.number().min(1),
});

export function SalesCreateNewForm({ gap, orgId }: SalesCreateNewFormProps) {
  const [slabs, setSlabs] = React.useState<any[]>([]);
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] = React.useState(false);
  const [applyHeightToAll, setApplyHeightToAll] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [customerLoading, setCustomerLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<
    {
      address: string;
      _id: string;
      name: string;
    }[]
  >([]);
  const factoryId = useParams().factoryid as string;

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerId: "",
      customerAddress: "",
      gstNumber: "",
      noOfSlabs: 0,
      salesDate: "",
      gstPercentage: "0",
      invoiceValue: 0,
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

  const handleSlabsInputChange = (value: string) => {
    const count = parseInt(value, 10);
    console.log("Form Values:", form.getValues());
    if (!isNaN(count) && count > 0) {
      const newSlabs = Array.from({ length: count }, (_, index) => ({
        dimensions: {
          slabNumber: index + 1,
          length: { value: 0, units: "inch" },
          height: { value: 0, units: "inch" },
        },
      }));
      setSlabs(newSlabs);
      // form.setValue("slabs", newSlabs);
      form.setValue("noOfSlabs", count);
    } else {
      setSlabs([]);
      form.setValue("slabs", []);
      form.setValue("noOfSlabs", 0);
    }
  };

  React.useEffect(() => {
    form.setValue("noOfSlabs", slabs.length);
  }, [slabs, form]);

  const calculateSqft = (length?: number, height?: number) => {
    const sqft = ((length || 0) / 12) * ((height || 0) / 12);
    return sqft > 0 ? sqft.toFixed(2) : "0.00";
  };

  const calculateTotalSqft = () => {
    return slabs
      .reduce((sum, slab) => {
        const l = slab.dimensions.length.value;
        const h = slab.dimensions.height.value;
        return sum + (l / 12) * (h / 12);
      }, 0)
      .toFixed(2);
  };

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
                        field.onChange(parseInt(e.target.value) || 0);
                        handleSlabsInputChange(e.target.value);
                      }}
                      value={field.value === 0 ? "" : field.value}
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
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date: any) => {
                          field.onChange(date ? date.toISOString() : "");
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dimensions Inputs */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            <div>
              <Input
                value={globalLength}
                onChange={(e) => setGlobalLength(e.target.value)}
                placeholder="Length (inch)"
                type="number"
                disabled={isLoading}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="checkbox"
                  checked={applyLengthToAll}
                  onChange={(e) => {
                    setApplyLengthToAll(e.target.checked);
                    if (e.target.checked) {
                      const updatedSlabs = slabs.map((slab) => ({
                        ...slab,
                        dimensions: {
                          ...slab.dimensions,
                          length: {
                            ...slab.dimensions.length,
                            value: parseFloat(globalLength) || 0,
                          },
                        },
                      }));
                      setSlabs(updatedSlabs);
                      form.setValue("slabs", updatedSlabs);
                    }
                  }}
                />{" "}
                Apply Length to all rows
              </label>
            </div>

            <div>
              <Input
                value={globalHeight}
                onChange={(e) => setGlobalHeight(e.target.value)}
                placeholder="Height (inch)"
                type="number"
                disabled={isLoading}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="checkbox"
                  checked={applyHeightToAll}
                  onChange={(e) => {
                    setApplyHeightToAll(e.target.checked);
                    if (e.target.checked) {
                      const updatedSlabs = slabs.map((slab) => ({
                        ...slab,
                        dimensions: {
                          ...slab.dimensions,
                          height: {
                            ...slab.dimensions.height,
                            value: parseFloat(globalHeight) || 0,
                          },
                        },
                      }));
                      setSlabs(updatedSlabs);
                      form.setValue("slabs", updatedSlabs);
                    }
                  }}
                />{" "}
                Apply Height to all rows
              </label>
            </div>
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
              {slabs.map((slab, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      name={`slabs.${index}.dimensions.length.value`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              value={slab.dimensions.length.value}
                              placeholder="Enter length"
                              onChange={(e) => {
                                const updatedBlocks = [...slabs];
                                updatedBlocks[index].dimensions.length.value =
                                  parseFloat(e.target.value) || 0;
                                setSlabs(updatedBlocks);
                                form.setValue("slabs", updatedBlocks);
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`slabs.${index}.dimensions.height.value`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              value={slab.dimensions.height.value}
                              placeholder="Enter height"
                              onChange={(e) => {
                                const updatedBlocks = [...slabs];
                                updatedBlocks[index].dimensions.height.value =
                                  parseFloat(e.target.value) || 0;
                                setSlabs(updatedBlocks);
                                form.setValue("slabs", updatedBlocks);
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                        const updatedBlocks = slabs.filter(
                          (_, i) => i !== index
                        );
                        setSlabs(updatedBlocks);
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
