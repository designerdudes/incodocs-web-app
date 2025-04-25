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

// ✅ Schema - Only forwarderName is required
const formSchema = z.object({
  forwarderName: z.string().min(1, { message: "Forwarder Name is required" }),
  address: z.string().optional(),
  responsiblePerson: z.string().optional(),
  mobileNo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{7,}$/.test(val),
      { message: "Mobile number must be at least 7 digits" }
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Enter a valid email" }
    ),
  organizationId: z.string().optional()

});

interface ForwarderFormProps {
  onSuccess?: () => void;
}

function Forwarderform({ onSuccess }: ForwarderFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orgid = useParams().organizationId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      forwarderName: "",
      address: "",
      responsiblePerson: "",
      mobileNo: "",
      email: "",
      organizationId: ""

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
            organizationId: orgid
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to create Forwarder");

      await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Forwarder created successfully");
      window.location.reload();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating Forwarder:", error);
      setIsLoading(false);
      toast.error("Error creating Forwarder");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Forwarder Name (Required) */}
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
        {/* Address (Optional) */}
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
        {/* Responsible Person (Optional) */}
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
        {/* Mobile Number (Optional) */}
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
        {/* Email (Optional) */}
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
        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default Forwarderform;
