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

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().optional(),
  telephoneNo: z.string().optional(),
  address: z.string().optional(),
});

interface AddConsigneeFormProps {
  orgId: string;
  onSuccess?: () => void;
}

export default function AddConsigneeForm({
  orgId,
  onSuccess,
}: AddConsigneeFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      telephoneNo: "",
      address: "",
    },
  });
  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!orgId) {
      toast.error("Organization ID is missing");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        telephoneNo: values.telephoneNo,
        address: values.address,
        organizationId: orgId, // Use dynamic orgId prop
      };
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipment/consignee/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to create consignee");
      await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Consignee created successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating consignee:", error);
      setIsLoading(false);
      toast.error("Failed to create consignee");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Consignee Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consignee Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Consignee Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consignee Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., abc123@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Consignee Number */}
        <FormField
          control={form.control}
          name="telephoneNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consignee Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1234567890" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Consignee Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 343 Main Street" {...field} />
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
