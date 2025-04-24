"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useParams } from "next/navigation";

const formSchema = z.object({
  supplierName: z.string().min(1, { message: "Supplier Name is required" }),
  gstNo: z.string().optional(),
  address: z.string().optional(),
  responsiblePerson: z
    .string()
    .optional(),
  mobileNumber: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val))
    .optional(),
  state: z.string().optional(),
  factoryAddress: z
    .string()
    .optional(),
});

interface SupplierFormProps {
  onSuccess?: () => void;
}

export default function SupplierForm({ onSuccess }: SupplierFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const organizationId = useParams().organizationId as string;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierName: "",
      gstNo: "",
      address: "",
      responsiblePerson: "",
      mobileNumber: undefined,
      state: "",
      factoryAddress: "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipment/supplier/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplierName: values.supplierName,
            gstNo: values.gstNo,
            address: values.address,
            responsiblePerson: values.responsiblePerson,
            mobileNumber: values.mobileNumber,
            state: values.state,
            factoryAddress: values.factoryAddress,
            organizationId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to create supplier");
      await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Supplier created successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating supplier:", error);
      setIsLoading(false);
      toast.error("Error creating supplier");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Supplier Name */}
        <FormField
          control={form.control}
          name="supplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ahmed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* GST Number */}
        <FormField
          control={form.control}
          name="gstNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., hsdfjkghog89r" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., hyd" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Responsible Person */}
        <FormField
          control={form.control}
          name="responsiblePerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsible Person</FormLabel>
              <FormControl>
                <Input placeholder="e.g., khaja" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Mobile Number */}
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="e.g., 89734"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="e.g., telangana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Factory Address */}
        <FormField
          control={form.control}
          name="factoryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Factory Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., mehdipatnam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
