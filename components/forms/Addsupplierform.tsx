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
  address: z.string().min(1, { message: "Address is required" }),
  contactPerson: z.string().min(1, { message: "Contact Person is required" }),
  mobileNo: z
    .string()
    .min(7, { message: "Mobile number must be at least 7 digits" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Enter a valid mobile number" }),
  email: z.string().email({ message: "Enter a valid Email" }),
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
      address: "",
      contactPerson: "",
      mobileNo: undefined,
      email: "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4080/supplier/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierName: values.supplierName,
          address: values.address,
          contactPerson: values.contactPerson,
          mobileNo: values.mobileNo,
          email: values.email,
        }),
      });
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
        <FormField
          control={form.control}
          name="supplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Supplier1" {...field} />
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
                <Input placeholder="e.g., Sanatnagar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ahmed" {...field} />
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
                <Input
                  type="tel"
                  placeholder="e.g., 7545345"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., unknownname@123.com" {...field} />
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
