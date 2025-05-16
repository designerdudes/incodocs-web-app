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
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values)
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 grid grid-cols-2 w-full">
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
                    className="w-[40%]" // Limit width to 40%
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
                    className="w-[40%]" // Limit width to 40%
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
                    className="w-[40%] block border-slate-500 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm py-3 bg-transparent"
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
                    className="w-[40%]" // Limit width to 40%
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
                    className="w-[40%]" // Limit width to 40%
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Proof */}
          <FormField
            name="paymentProof"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Proof</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Payment Proof"
                    disabled={isLoading}
                    className="w-[40%]" // Limit width to 40%
                    {...field}
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
                            "w-[40%] justify-start text-left font-normal",
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

          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
