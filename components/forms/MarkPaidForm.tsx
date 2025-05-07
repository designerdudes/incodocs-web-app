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
import { useGlobalModal } from "@/hooks/GlobalModal";

// Props
interface MarkPaidForm extends React.HTMLAttributes<HTMLDivElement> {
  selectedSlabs?: { slabId: string; }[];
}

const formSchema = z.object({
  paymentMethod: z.enum(["cash", "card", "online"]),
});

export function MarkPaidForm({ selectedSlabs, ...props }: MarkPaidForm) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "cash",
    },
  });

  console.log(selectedSlabs, "this is seleted slabs");
  const [slabData, setSlabData] = useState<any[]>([]);

  const modal = useGlobalModal();

  useEffect(() => {
    const fetchSlabData = async () => {
      if (!selectedSlabs || selectedSlabs.length === 0) return;
      // Exit if no slabs selected

      setIsLoading(true);

      try {
        // Creating an array of promises to fetch data for all selected slabs
        const slabDataPromises = selectedSlabs.map(async (slabid) => {
          const response = await fetchData(
            `factory-management/inventory/finished/get/${slabid}`
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
      const payload = {
        ids: selectedSlabs,
        cuttingPaymentStatus: {
          status: "paid",
          modeOfPayment: values.paymentMethod,
        },
      };
      console.log(payload, "payload");
      await putData(
        `/factory-management/inventory/finished/updatepaymentstatus`,
        payload
      );
      toast.success("Payment status updated successfully");
      modal.onClose();
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
                    <option value="online">Online</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slab ID */}
          {/* Slab Details List */}
          {slabData && slabData.length > 0 && (
            <div className="border rounded p-4 bg-muted/50 space-y-2">
              <h4 className="font-semibold text-sm">Selected Slabs</h4>
              <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                {slabData.map((slab: any, idx: number) => {
                  const amount =
                    (((slab?.dimensions?.length?.value || 0) *
                      (slab?.dimensions?.height?.value || 0)) /
                      144) *
                    (slab?.factoryId?.workersCuttingPay || 0);

                  return (
                    <li
                      key={idx}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <span>Slab ID: {slab.slabNumber}</span>
                      <span className="text-muted-foreground text-xs">
                        ₹{slab?.cuttingPaymentStatus?.status}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        ₹{amount.toFixed(2)}
                      </span>
                    </li>
                  );
                })}
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
