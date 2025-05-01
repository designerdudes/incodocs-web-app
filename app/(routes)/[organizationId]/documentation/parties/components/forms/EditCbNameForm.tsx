"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
import { useGlobalModal } from "@/hooks/GlobalModal";

const formSchema = z.object({
  cbName: z.string().min(1, { message: "Customs Broker Name is required" }),
  cbCode: z.string().min(1, { message: "Customs Broker Code is required" }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Enter a valid email",
    }),
  mobileNo: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const strVal = val.toString();
      return strVal.length >= 10 && /^\d+$/.test(strVal);
    }),
  address: z.string().optional(),
  organizationId: z.string().optional(),
});

interface CBData {
  _id: string;
  cbName: string;
  cbCode: string;
  email?: string;
  mobileNo?: string | number;
  address?: string;
  organizationId?: string;
}

interface EditCBNameFormProps {
  cbData: CBData;
  onSuccess: (updatedBrokerId: string) => void;
}

export default function EditCBNameForm({
  cbData,
  onSuccess,
}: EditCBNameFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const GlobalModal = useGlobalModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cbName: cbData.cbName || "",
      cbCode: cbData.cbCode || "",
      email: cbData.email || "",
      mobileNo: cbData.mobileNo ? cbData.mobileNo.toString() : "",
      address: cbData.address || "",
      organizationId: cbData.organizationId || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        cbName: values.cbName,
        cbCode: values.cbCode,
        email: values.email,
        mobileNo: values.mobileNo,
        address: values.address,
        organizationId: values.organizationId,
      };
      const response = await fetch(
        `https://incodocs-server.onrender.com/shipment/cbname/put/${cbData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to update customs broker");
      const result = await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Customs Broker updated successfully");
      form.reset();
      onSuccess(cbData._id);
    } catch (error) {
      console.error("Error updating customs broker:", error);
      setIsLoading(false);
      toast.error("Failed to update customs broker");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Edit CB Name</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="cbName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CB Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., XYZ Clearing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cbCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CB Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CB123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., cbxyz@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 9876543210" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 45 Shipping Lane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}
