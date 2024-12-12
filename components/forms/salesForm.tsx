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

interface SalesCreateNewFormProps {
  gap: number;
}

const formSchema = z
  .object({
    customerName: z
      .string()
      .min(3, { message: "Customer name must be at least 3 characters long" }),
    customerAddress: z
      .string()
      .min(5, { message: "Customer address must be at least 5 characters long" }),
    gstNumber: z
      .string()
      .min(3, { message: "GST Number must be at least 3 characters long" }),
    noOfSlabs: z
      .number({ invalid_type_error: "No of Slabs must be a number" })
      .min(1, { message: "No of Slabs must be greater than 0" }),
    height: z
      .number({ invalid_type_error: "Height must be a number" })
      .min(1, { message: "Height must be greater than 0" }),
    length: z
      .number({ invalid_type_error: "Length must be a number" })
      .min(1, { message: "Length must be greater than 0" }),
    salesDate: z
      .string()
      .min(3, { message: "Sales Date must be at least 3 characters long" }),
    gstPercentage: z
      .enum(["0", "1", "5", "12", "18"], {
        errorMap: () => ({ message: "Invalid GST percentage selected" }),
      }),
  });

export function SalesCreateNewForm({ gap }: SalesCreateNewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerAddress: "",
      gstNumber: "",
      noOfSlabs: 1,
      height: 1,
      length: 1,
      salesDate: "",
      gstPercentage: "0",
    },
  });

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

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`grid grid-cols-${gap} gap-3`}>
            {/* Customer Name */}
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

            {/* Customer Address */}
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

            {/* GST Number */}
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
          </div>

          <div className={`grid grid-cols-3 gap-3`}>
            {/* No of Slabs */}
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Height */}
            <FormField
              name="height"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Height"
                      type="number"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Length */}
            <FormField
              name="length"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Length"
                      type="number"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={`grid grid-cols-${gap} gap-3`}>
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
          </div>

          <FormField
            name="salesDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="DD/MM/YYYY"
                    disabled={isLoading}
                    {...field}
                  />
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
