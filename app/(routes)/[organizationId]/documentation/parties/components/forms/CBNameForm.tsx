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
    .refine(
      (val) => {
        if (!val) return true;
        const strVal = val.toString();
        return strVal.length >= 10 && /^\d+$/.test(strVal);
      },
      {
        message:
          "Mobile number must be at least 10 digits and contain only numbers",
      }
    ),
  address: z.string().optional(),
});

interface CBNameFormProps {
  orgId: string;
  onSuccess: (newBrokerId: string) => void;
}

export default function CBNameForm({ orgId, onSuccess }: CBNameFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const GlobalModal = useGlobalModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cbName: "",
      cbCode: "",
      email: "",
      mobileNo: "",
      address: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        name: values.cbName, // API expects 'name' based on original CBNameForm
        cbCode: values.cbCode,
        email: values.email,
        mobileNo: values.mobileNo,
        address: values.address,
        organizationId: orgId,
      };
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipment/cbname/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to create customs broker");
      const result = await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Customs Broker created successfully");
      form.reset();
      onSuccess(result._id);
    } catch (error) {
      console.error("Error creating customs broker:", error);
      setIsLoading(false);
      toast.error("Failed to create customs broker");
    }
  };

  return (
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
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
