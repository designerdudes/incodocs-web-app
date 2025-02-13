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
import { useRouter } from "next/navigation";
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
  // ✅ Slabs Array (with its own length & height inside dimensions)
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
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] =
    React.useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] =
    React.useState<boolean>(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

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
    },
  });

  function handleSlabsInputChange(value: string) {
    const count = parseInt(value, 10);

    if (!isNaN(count) && count > 0) {
      const newSlabs = Array.from({ length: count }, (_, index) => ({
        dimensions: {
          slabNumber: index + 1,
          length: { value: 0, units: "inch" as "inch" },
          height: { value: 0, units: "inch" as "inch" },
        },
      }));

      setSlabs(newSlabs);
      form.setValue("slabs", newSlabs);
    } else {
      setSlabs([]);
      form.setValue("slabs", []);
    }
  }
  React.useEffect(() => {
    form.setValue("noOfSlabs", slabs.length);
  }, [slabs, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await postData("/factory-management/sales/addsale", {
        ...values,
        status: "active",
      });
      toast.success("Sales Record Added Successfully");
      router.push("./factorymanagement/sales/records");
    } catch (error) {
      toast.error("Error creating/updating Sale Record");
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
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Customer Name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="customerId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID</FormLabel>
                  <FormControl>
                    <select
                      disabled={isLoading}
                      {...field}
                      className="block w-full border-slate-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 bg-transparent"
                    >
                      <option value="674774f016639ce732baba5b">
                        674774f016639ce732baba5b
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="customerAddress"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Customer Address"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: GST Number, No of Slabs, Height */}
          <div className={`grid grid-cols-3 gap-3`}>
            <FormField
              name="gstNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter GST Number"
                      disabled={isLoading}
                      {...field}
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
                        field.onChange(e);
                        handleSlabsInputChange(e.target.value);
                      }}
                      value={field.value === 0 ? "" : field.value} // Calls the function
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 3: Length, GST Percentage, Invoice Value */}
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
                              "w-[40%] justify-start text-left font-normal",
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
          {/* Dimensions Inputs */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            {/* ✅ Length Input & Apply Checkbox */}
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
                        ...slab, // ✅ Spread only the current slab, not the whole slabs array
                        dimensions: {
                          ...slab.dimensions,
                          length: {
                            ...slab.dimensions.length, // ✅ Only update length, keeping height unchanged
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

            {/* ✅ Height Input & Apply Checkbox */}
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
                        ...slab, // ✅ Spread only the current slab
                        dimensions: {
                          ...slab.dimensions,
                          height: {
                            ...slab.dimensions.height, // ✅ Only update height, keeping length unchanged
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
                              value={slab.dimensions.height
                                
                                .value}
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
                <TableCell colSpan={8} className="text-right font-bold">
                  Total Area (sqft): {calculateTotalSqft()}
                </TableCell>
              </TableRow>
              <TableRow></TableRow>
            </TableFooter>
          </Table>

          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
