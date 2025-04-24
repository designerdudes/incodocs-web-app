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
import { useParams } from "next/navigation";

const formSchema = z.object({
  forwarderName: z
    .string()
    .min(1, { message: "Shipping Line Name is required" }),
  address: z.string().optional(),
  responsiblePerson: z
    .string()
    .optional(),
  mobileNo: z
    .string()
    .transform((val) => parseInt(val, 10)) // Convert to number
    .refine((val) => !isNaN(val))
    .optional(),
  email: z.string().optional(),
});

interface ForwarderFormProps {
  onSuccess?: () => void;
}

function ForwarderForm({ onSuccess }: ForwarderFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const organizationId = useParams().organizationId as string; // Get organizationId from URL params

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      forwarderName: "",
      address: "",
      responsiblePerson: "",
      mobileNo: undefined,
      email: "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipment/forwarder/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            forwarderName: values.forwarderName,
            address: values.address,
            responsiblePerson: values.responsiblePerson,
            mobileNo: values.mobileNo,
            email: values.email,
            organizationId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to create Forwarder");
      const data = await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Forwarder created successfully");
      if (onSuccess) onSuccess(); // Reload to reflect new data (temporary solution)
    } catch (error) {
      console.error("Error creating Forwarder:", error);
      setIsLoading(false);
      toast.error("Error creating Forwarder");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Shipping Line Name */}
        <FormField
          control={form.control}
          name="forwarderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forwarder Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Name1" {...field} />
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
                <Input placeholder="e.g., Sanatnagar" {...field} />
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
                <Input placeholder="e.g., Ahmed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Mobile Number */}
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
                  onChange={(e) => field.onChange(e.target.value)} // Keep as string until transform
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g., unknownname@123.com"
                  {...field}
                />
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

export default ForwarderForm;
