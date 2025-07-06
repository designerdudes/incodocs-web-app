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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import CalendarComponent from "../CalendarComponent";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

const formSchema = z.object({
  expenseName: z
    .string()
    .min(3, { message: "Expense name must be at least 3 characters long" }),
  expenseValue: z
    .number({ invalid_type_error: "Expense value must be a number" })
    .min(1, { message: "Expense value must be greater than 0" }),
  gstPercentage: z.enum(["0", "1", "5", "12", "18"], {
    errorMap: () => ({ message: "Invalid GST percentage selected" }),
  }),
  paidBy: z.string().nonempty({ message: "Paid by is required" }),
  purchasedBy: z.string().nonempty({ message: "Purchased by is required" }),
  paymentProof: z.string().nonempty({ message: "Payment proof is required" }),
  expenseDate: z.string().nonempty({ message: "Expense date is required" }),
  purpose: z.string().optional(),
  billNumber: z.string().optional(),
  itemName: z.string().optional(),
  taxableValue: z.number().optional(),
  igst: z.number().optional(),
  cgst: z.number().optional(),
  sgst: z.number().optional(),
  invoiceValue: z.number().optional(),
});

export default function ExpenseCreateNewForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenseName: "",
      expenseValue: 0,
      gstPercentage: "0",
      paidBy: "",
      purchasedBy: "",
      paymentProof: "",
      expenseDate: "",
      purpose: "",
      billNumber: "",
      itemName: "",
      taxableValue: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      invoiceValue: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    try {
      await postData("/expense/add", {
        ...values,
        status: "active",
      });
      toast.success("Expense Record Added Successfully");
      router.push("./");
    } catch (error) {
      toast.error("Error creating/updating Expense Record");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Expense Name */}
            <FormField
              name="expenseName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Expense Name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expense Value */}
            <FormField
              name="expenseValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Expense Value"
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
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
                      className="w-[100%] block border-slate-500 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm py-3 bg-transparent"
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

            {/* Paid By */}
            <FormField
              name="paidBy"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid By</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Paid By"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchased By */}
            <FormField
              name="purchasedBy"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchased By</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Purchased By"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Payment Proof */}
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

            {/* Expense Date */}
            <FormField
              name="expenseDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Date</FormLabel> {/* Label above input */}
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
                              : "Expense date"}
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
            <FormField
              name="purpose"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Purpose"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="billNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Bill Number"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="itemName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Item Name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="taxableValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxable Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Taxable Value"
                      type="number"
                      disabled={isLoading}
                      {...field}
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
              name="igst"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IGST</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Igst"
                      type="number"
                      disabled={isLoading}
                      {...field}
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
              name="cgst"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CGST</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Cgst"
                      type="number"
                      disabled={isLoading}
                      {...field}
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
              name="sgst"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SGST</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Sgst"
                      type="number"
                      disabled={isLoading}
                      {...field}
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
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
