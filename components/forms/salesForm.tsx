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
import { postData } from "@/axiosUtility/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
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
import CustomerForm from "@/app/(routes)/[factoryid]/factorymanagement/accounting/Parties/components/forms/AddCustomerForm";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { values } from "lodash";

interface SalesCreateNewFormProps {
  gap: number;
}

const formSchema = z.object({
  customerName: z
    .string()
    .min(3, { message: "Customer name must be at least 3 characters long" }),
  customerId: z.string().min(3, { message: "Customer ID is required" }),
  customerAddress: z
    .string()
    .min(5, { message: "Customer address must be at least 5 characters long" }),
  gstNumber: z
    .string()
    .min(3, { message: "GST Number must be at least 3 characters long" }),
  noOfSlabs: z
    .number()
    .min(1, { message: "No of Slabs must be greater than 0" }),
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
    .min(1, { message: "At least one slab is required" }),
  salesDate: z.string().nonempty({ message: "Sales Date is required" }),
  gstPercentage: z.enum(["0", "1", "5", "12", "18"], {
    errorMap: () => ({ message: "Invalid GST percentage selected" }),
  }),
  invoiceValue: z
    .number({ invalid_type_error: "Invoice value must be a number" })
    .min(1, { message: "Invoice value must be greater than 0" }),
});

export function SalesCreateNewForm({ gap }: SalesCreateNewFormProps) {
  const [slabs, setSlabs] = React.useState<any[]>([]);
  const [slabsCount, setSlabsCount] = React.useState(0);
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] =
    React.useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [customerLoading, setCustomerLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<
    { _id: string; name: string }[]
  >([]);

  const router = useRouter();
  const { onOpen, setTitle, setChildren } = useGlobalModal();
  const params = useParams();
  const customerId = params?.id as string;
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
    const fetchCustomers = async () => {
      setCustomerLoading(true);
      try {
        const response = await fetch(
          "https://incodocs-server.onrender.com/accounting/customer/getall"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const customerData = await response.json();

        // Validate response before mapping
        if (Array.isArray(customerData)) {
          const mappedCustomers = customerData.map((customer: any) => ({
            _id: customer._id,
            name: customer.customerName, // Make sure this key exists in the response
          }));
          setCustomers(mappedCustomers);
        } else {
          console.error("Invalid response format:", customerData);
          toast.error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers");
      } finally {
        setCustomerLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleAddNewCustomer = () => {
    setTitle("Enter Customer Details");
    setChildren(<CustomerForm />);
    onOpen();
  };

  function handleSlabsInputChange(value: any) {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      setSlabsCount(count);
      const defaultDimensions = {
        length: { value: 0, units: "inch" as "inch" },
        height: { value: 0, units: "inch" as "inch" },
        status: "readyForPolish" as "readyForPolish",
      };
      form.setValue(
        "slabs",
        Array.from({ length: count }, () => ({ dimensions: defaultDimensions }))
      );
    } else {
      setSlabsCount(0);
      form.setValue("slabs", []);
    }
  }

  React.useEffect(() => {
    if (applyLengthToAll || applyHeightToAll) {
      const updatedSlabs = form.getValues("slabs") || [];
      const newSlabs = updatedSlabs.map((slab) => ({
        dimensions: {
          ...slab.dimensions,
          length: applyLengthToAll
            ? { value: Number(globalLength) || 0, units: "inch" as "inch" }
            : slab.dimensions.length,
          height: applyHeightToAll
            ? { value: Number(globalHeight) || 0, units: "inch" as "inch" }
            : slab.dimensions.height,
        },
      }));
      form.setValue("slabs", newSlabs, { shouldValidate: true });
    }
  }, [globalLength, globalHeight, applyLengthToAll, applyHeightToAll, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form for ID:", values);
    setIsLoading(true);
    try {
      await postData("/transaction/sale/add", {
        ...values,
        factoryId: "67b59a9909b5da78090bfd40",
        status: "active",
      });
      toast.success("Sales Record Updated Successfully");
      router.push("./");
    } catch (error) {
      console.error(error);
      toast.error("Error updating Sale Record");
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
      const lengthInFeet = (slab.dimensions.length.value || 0) / 12;
      const heightInFeet = (slab.dimensions.height.value || 0) / 12;
      return sum + lengthInFeet * heightInFeet;
    }, 0);
    return totalSqft.toFixed(2); // Round to 2 decimal places
  }

  function handleDeleteRow(index: number) {
    const updatedSlabs = [...form.getValues("slabs")];
    updatedSlabs.splice(index, 1);
    setSlabsCount(updatedSlabs.length);
    form.setValue("slabs", updatedSlabs);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: Customer Name, Customer ID, Customer Address */}
          <div className={`grid grid-cols-3 gap-3`}>
            <FormField
              name="customerName"
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
                      }}
                      displayProperty="name"
                      placeholder="Select a Customer"
                      onAddNew={handleAddNewCustomer}
                      addNewLabel="Add New Customer"
                      disabled={isLoading || customerLoading}
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
          </div>

          {/* Row 3: GST Percentage, Invoice Value, Sales Date */}
          <div className={`grid grid-cols-3 gap-3`}>
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
                      className=" block w-full border-slate-500 rounded-md shadow-sm focus:ring-indigo-500
                       focus:border-indigo-500 sm:text-sm py-3 bg-transparent"
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
                              : "Sale date"}
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
          </div>
          <div>
            <FormField
              name="noOfSlabs"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Slabs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of slabs"
                      disabled={isLoading}
                      value={field.value === 0 ? "" : field.value} // Display empty string if value is 0
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);

                        if (isNaN(value) || value < 0) return; // Prevents negative values

                        field.onChange(value);
                        handleSlabsInputChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Length(inches)"
                type="number"
                value={globalLength}
                onChange={(e) => setGlobalLength(e.target.value)}
                disabled={isLoading}
              />
              <label className="text-sm font-medium flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={applyLengthToAll}
                  onChange={(e) => setApplyLengthToAll(e.target.checked)}
                />{" "}
                Apply Length (inches) to all rows
              </label>
            </div>
            <div>
              <Input
                placeholder="Height(inches)"
                type="number"
                value={globalHeight}
                onChange={(e) => setGlobalHeight(e.target.value)}
                disabled={isLoading}
              />
              <label className="text-sm font-medium flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={applyHeightToAll}
                  onChange={(e) => setApplyHeightToAll(e.target.checked)}
                />{" "}
                Apply Height (inches) to all rows
              </label>
            </div>
          </div>
          {slabsCount > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Length(inches)</TableHead>
                  <TableHead>Height(inches)</TableHead>
                  <TableHead>Area (sqft)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.getValues("slabs").map((slab, index) => (
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
                                placeholder="Length"
                                type="number"
                                value={slab.dimensions.length.value}
                                onChange={(e) => {
                                  const slabs = form.getValues("slabs");
                                  slabs[index].dimensions.length.value =
                                    parseFloat(e.target.value) || 0;
                                  form.setValue("slabs", slabs, {
                                    shouldValidate: true,
                                  });
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
                                placeholder="Height"
                                type="number"
                                value={slab.dimensions.height.value}
                                onChange={(e) => {
                                  const slabs = form.getValues("slabs");
                                  slabs[index].dimensions.height.value =
                                    parseFloat(e.target.value) || 0;
                                  form.setValue("slabs", slabs, {
                                    shouldValidate: true,
                                  });
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
                        slab.dimensions.length.value,
                        slab.dimensions.height.value
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        disabled={isLoading}
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
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submiting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
