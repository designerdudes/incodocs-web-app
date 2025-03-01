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
  shippingLineName: z.string().min(1, { message: "Shipping Line Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  responsiblePerson: z.string().min(1, { message: "Responsible Person is required" }),
  mobileNo: z
    .string()
    .min(7, { message: "Mobile number must be at least 7 digits" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "Enter a valid mobile number" }),
  email: z.string().email({ message: "Enter a valid Email" }),
});

interface ShippinglineFormProps {
  onSuccess?: () => void;
}

function ShippinglineForm({ onSuccess }: ShippinglineFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingLineName: "",
      address: "",
      responsiblePerson: "",
      mobileNo: undefined,
      email: "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(values)
    try {
      const response = await fetch("https://incodocs-server.onrender.com/shipment/shippingline/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingLineName: values.shippingLineName,
          address: values.address,
          responsiblePerson: values.responsiblePerson,
          mobileNo: values.mobileNo,
          email: values.email,
          organizationId: "674b0a687d4f4b21c6c980ba"
        }),
      });
      if (!response.ok) throw new Error("Failed to create shipping line");
      await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Shipping line created successfully");
      if (onSuccess) onSuccess(); // Trigger refetch
    } catch (error) {
      console.error("Error creating shipping line:", error);
      setIsLoading(false);
      toast.error("Error creating shipping line");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="shippingLineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Line Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Name1" {...field} />
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
          name="responsiblePerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsible Person</FormLabel>
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

export default ShippinglineForm;