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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";

const formSchema = z.object({
    supplierName: z.string().min(1, { message: "Supplier Name is required" }),
    gstNo: z.string().min(1, { message: "GST Number is required" }),
    mobileNumber: z
      .string()
      .min(10, { message: "Mobile number must be at least 10 digits" })
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val), { message: "Enter a valid mobile number" }),
    state: z.string().min(1, { message: "State is required" }),
    factoryAddress: z.string().min(1, { message: "Factory Address is required" }),
  });

interface SupplierFormProps {
  onSuccess?: () => void;
}

function SupplierForm({ onSuccess }: SupplierFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierName: "",
      gstNo: "",
      mobileNumber: undefined,
      state: "",
      factoryAddress: "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(values);
    try {
      const response = await fetch("https://incodocs-server.onrender.com/accounting/suplier/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierName: values.supplierName,
          gstNo: values.gstNo,
          mobileNumber: values.mobileNumber,
          state: values.state,
          factoryAddress: values.factoryAddress,
          organizationId: "674b0a687d4f4b21c6c980ba", // Adjust as needed
        }),
      });
      if (!response.ok) throw new Error("Failed to create supplier");
      await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Supplier created successfully");
      window.location.reload();
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
        <FormField
          control={form.control}
          name="supplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Supplier2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gstNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2dshjfhsd" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="e.g., 234345346425"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Telangana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="factoryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Factory Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Address Andhra Lane 33" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default SupplierForm;