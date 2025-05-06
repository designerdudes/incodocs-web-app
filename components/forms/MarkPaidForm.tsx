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
import { fetchData, putData } from "@/axiosUtility/api";
import { useEffect, useState } from "react";

// Props
interface MarkPaidForm extends React.HTMLAttributes<HTMLDivElement> {
  BlockData: any;
  gap: number;
  selectedSlabs: { slabId: string; amount: number }[];
}

const formSchema = z.object({
  _id: z.string().optional(),
  blockNumber: z.string().min(3, { message: "Block number is required" }),
  slabId: z.string().min(3, { message: "Slab ID is required" }),
  paymentMethod: z.string().min(2, { message: "Select a payment method" }),
  trimValue: z.object({
    length: z.string().min(1).refine((val) => parseFloat(val) > 0, {
      message: "Length must be greater than zero",
    }),
    height: z.string().min(1).refine((val) => parseFloat(val) > 0, {
      message: "Height must be greater than zero",
    }),
  }),
});

export function MarkPaidForm({
  BlockData,
  className,
  gap,
  selectedSlabs,
  ...props
}: MarkPaidForm) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: BlockData?._id || "",
      slabId: BlockData?.slabId || "",
      blockNumber: BlockData?.blockNumber || "",
      paymentMethod: "cash",
      trimValue: { length: "", height: "" },
    },
  });
console.log(selectedSlabs, "this is seleted slabs");
const [slabData, setSlabData] = useState();



useEffect(() => {
    const fetchSlabData = async () => {
      if (!selectedSlabs || selectedSlabs.length === 0) return; 
      // Exit if no slabs selected

      setIsLoading(true);

      try {
        // Creating an array of promises to fetch data for all selected slabs
        const slabDataPromises = selectedSlabs.map(async (slabid) => {
          const response = await fetchData(
            `factory-management/inventory/finished/get/${slabid}`,
          );
          console.log(response, "response");
          return response; // Return the fetched data for this slab
        });

        // Wait for all the data to be fetched using Promise.all
        const allSlabData = await Promise.all(slabDataPromises);
        console.log(allSlabData, "allSlabData");

        // Store the fetched slab data in state
        setSlabData(allSlabData);
      } catch (error) {
        console.log("An error occurred while updating data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlabData();
  }, [selectedSlabs]);



  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await putData(
        `/factory-management/inventory/finished/put/${BlockData._id}`,
        {
          ...values,
          status: "polished",
        }
      );
      toast.success("Slab data updated successfully");
      router.push("../../");
    } catch (error) {
      toast.error("An error occurred while updating data");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
           

            {/* Payment Method */}
            <FormField
              name="paymentMethod"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded p-2"
                      disabled={isLoading}
                      {...field}
                    >
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="online">Online</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        

          {/* Slab Details List */}
          {slabData && slabData.length > 0 && (
            <div className="border rounded p-4 bg-muted/50 space-y-2">
              <h4 className="font-semibold text-sm">Selected Slabs</h4>
              <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                {slabData.map((slab : any, idx: any) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center border-b pb-1"
                  >
                   <span>Slab ID: {Array.isArray(slabData) ? slabData.join(', ') : slabData}</span>
                    <span className="text-muted-foreground text-xs">
                      ₹{slab.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <span className="mr-2 spinner"></span>}
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}
