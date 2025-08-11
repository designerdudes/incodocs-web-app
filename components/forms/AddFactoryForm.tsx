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
import { useRouter } from "next/navigation";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// Factory Form Schema
const formSchema = z.object({
  factoryName: z.string().min(1, { message: "Factory Name is required" }),
  prefix: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.trim().length >= 2 && val.trim().length <= 3),
      {
        message:
          "Prefix must be at least 2 and not more than 3 characters if provided",
      }
    ),
  organizationId: z
    .string()
    .min(1, { message: "Organization must be selected" }),
  gstNo: z.string().min(1, { message: "GST number is required" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .number()
      .min(100000, { message: "Pincode must be at least 6 digits" }),
  }),
  workersCuttingPay: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(0, { message: "Cutting Pay must be a positive number" })
  ),
  workersPolishingPay: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(0, { message: "Polishing Pay must be a positive number" })
  ),
});

interface FactoryFormProps {
  organizationId: string;
  token?: string;
  organizations?: { id: string; name: string }[]; // Optional prop for dynamic organizations
}

export default function FactoryForm({
  organizationId,
  token,
  organizations = [],
}: FactoryFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      factoryName: "",
      prefix: "",
      organizationId, // Preselect the organization
      gstNo: "",
      address: {
        location: "",
        pincode: 0,
      },
      workersCuttingPay: 0,
      workersPolishingPay: 0,
    },
  });

  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    GlobalModal.title = "Confirm Factory Details";
    GlobalModal.description = "Please review the entered details:";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>
          <strong>Factory Name:</strong> {values.factoryName}
        </p>
        <p>
          <strong>Prefix:</strong> {values.prefix}
        </p>

        <p>
          <strong>GST Number:</strong> {values.gstNo}
        </p>
        <p>
          <strong>Address:</strong> {values.address.location}
        </p>
        <p>
          <strong>Pincode:</strong> {values.address.pincode}
        </p>
        <p>
          <strong>Workers Cutting Pay:</strong> {values.workersCuttingPay}
        </p>
        <p>
          <strong>Workers Polishing Pay:</strong> {values.workersPolishingPay}
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              GlobalModal.onClose();
              setIsLoading(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setIsLoading(true);
              try {
                await postData(
                  "/factory/add",
                  {
                    ...values,
                    status: "active",
                  }
                  // {
                  //   headers: {
                  //     Authorization: `Bearer ${token}`,
                  //   },
                  // }
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Factory created successfully");
                form.reset(); // Reset form after submission
                router.refresh(); // Refresh to update FactorySwitcher
              } catch (error) {
                console.error("Error creating Factory:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error creating Factory");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
    GlobalModal.onOpen();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="factoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Factory Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg: Factory A"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prefix</FormLabel>
              <FormControl>
                <Input placeholder="Eg: SAA" {...field} disabled={isLoading} />
              </FormControl>
              {!field.value && (
                <p className="text-xs text-muted-foreground">
                  If left blank, a default prefix will be created using the
                  first 3 letters of the factory name.
                </p>
              )}
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
                <Input
                  placeholder="Eg: 361AAA90823RFS56"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg: 343 Main Street"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg: 500081"
                  // type="number"
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      field.onChange(value);
                    }
                  }}
                  min="0"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workersCuttingPay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workers Cutting Pay</FormLabel>
                <FormControl>
                  <Input
                    // type="number"
                    placeholder="Eg: 1500"
                    step="any"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        field.onChange(value);
                      }
                    }}
                    min="0"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workersPolishingPay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workers Polishing Pay</FormLabel>
                <FormControl>
                  <Input
                    // type="number"
                    placeholder="Eg: 1200"
                    step="any"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        field.onChange(value);
                      }
                    }}
                    min="0"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
