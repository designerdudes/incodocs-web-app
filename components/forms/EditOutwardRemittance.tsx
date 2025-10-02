"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "../CalendarComponent";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const outwardRemittanceFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  paymentDate: z.string().optional(),
  amount: z.number().optional(),
  bankName: z.string().optional(),
  method: z.enum(["bank_transfer", "cash", "cheque", "other"]),
  description: z.string().optional(),
  paymentProofUrl: z.string().optional(),
  organizationId: z.string(),
});

type OutwardRemittanceFormValues = z.infer<typeof outwardRemittanceFormSchema>;

interface EditOutwardRemittanceFormProps {
  params: {
    _id: string;
    organizationId: { _id: string; name: string };
    customerName: string;
    paymentDate?: string;
    amount: number;
    bankName?: string;
    method: "bank_transfer" | "cash" | "cheque" | "other";
    description?: string;
    paymentProofUrl?: string;
  };
}

export default function EditOutwardRemittanceForm({
  params,
}: EditOutwardRemittanceFormProps) {
  const orgId = params?.organizationId?._id;
  const remittanceId = params?._id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
   console.log("bdygsgdevfahgdvfhs",params?._id)

  const form = useForm<OutwardRemittanceFormValues>({
    resolver: zodResolver(outwardRemittanceFormSchema),
    defaultValues: {
      customerName: params?.customerName || "",
      paymentDate: params?.paymentDate || "",
      amount: params?.amount || 0,
      bankName: params?.bankName || "",
      method: params?.method || "bank_transfer",
      description: params?.description || "",
      paymentProofUrl: params?.paymentProofUrl || "",
      organizationId: orgId || "",
    },
  });

  // Reset when params change
  useEffect(() => {
    if (params) {
      form.reset({
        customerName: params?.customerName || "",
        paymentDate: params?.paymentDate || "",
        amount: params?.amount || 0,
        bankName: params?.bankName || "",
        method: params?.method || "bank_transfer",
        description: params?.description || "",
        paymentProofUrl: params?.paymentProofUrl || "",
        organizationId: orgId || "",
      });
    }
  }, [params, form, orgId]);

  const onSubmit = async (values: OutwardRemittanceFormValues) => {
    setIsLoading(true);
    try {
      await putData(`/remittance/outward/update/${remittanceId}`, {
        ...values,
        organizationId: orgId,
      });
      toast.success("Outward Remittance updated successfully");
      router.push(`/${orgId}/documentation/remittance/outwardRemittance`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-4 gap-3">
            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter customer name" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Date */}
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {field.value
                            ? format(new Date(field.value), "PPPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          selected={field.value ? new Date(field.value as any) : undefined}
                          onSelect={(date: Date | undefined) => {
                            field.onChange(date?.toISOString());
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      min={0}
                      disabled={isLoading}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseFloat(e.target.value) : 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Name */}
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter bank name" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Method */}
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Proof */}
            <FormField
              control={form.control}
              name="paymentProofUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Proof</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="paymentProofUrl"
                      storageKey="documents_fileUrl"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter description" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
