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
import axios from "axios"; // ✅ Import axios for isAxiosError

// Props
interface MarkPaidForm extends React.HTMLAttributes<HTMLDivElement> {
  selectedSlabs?: { slabId: string }[];
}

const formSchema = z.object({
  paymentMethod: z.enum(["cash", "online"]),
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

  const [slabData, setSlabData] = useState<any[]>([]);
  const modal = useGlobalModal();

  useEffect(() => {
  const fetchSlabData = async () => {
    if (!selectedSlabs || selectedSlabs.length === 0) return;

    setIsLoading(true);

    try {
      const slabDataPromises = selectedSlabs.map(async (item) => {
        const slabId = typeof item === "string" ? item : item?.slabId;
        const response = await fetchData(
          `factory-management/inventory/finished/get/${slabId}`
        );
        return response;
      });

      const allSlabData = await Promise.all(slabDataPromises);
      setSlabData(allSlabData);
    } catch (error: unknown) {
      console.error("Error fetching slab data:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch slab data");
      } else {
        toast.error("Something went wrong while fetching slab data");
      }
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
      ids: selectedSlabs?.map((s) => s.slabId),
      cuttingPaymentStatus: {
        status: "paid",
        modeOfPayment: values.paymentMethod,
      },
    };
    await putData(
      `/factory-management/inventory/finished/updatepaymentstatus`,
      payload
    );
    toast.success("Payment status updated successfully");
    modal.onClose();
  } catch (error: unknown) {
    console.error("Error updating payment status:", error);
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to update payment status");
    } else {
      toast.error("An unexpected error occurred");
    }
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
              <h4 className="font-semibold text-sm">Selected Slab NO</h4>
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
                        ₹{amount.toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Total Amount Calculation */}
              <div className="flex justify-between font-semibold text-primary pt-2 border-t mt-2">
                <span>Total Amount</span>
                <span>
                  ₹
                  {slabData
                    .reduce((acc, slab) => {
                      const amt =
                        (((slab?.dimensions?.length?.value || 0) *
                          (slab?.dimensions?.height?.value || 0)) /
                          144) *
                        (slab?.factoryId?.workersCuttingPay || 0);
                      return acc + amt;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
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
