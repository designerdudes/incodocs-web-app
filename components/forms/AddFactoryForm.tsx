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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// Factory Form Schema
const formSchema = z.object({
  factoryName: z.string().min(1, { message: "Factory Name is required" }),
  organizationId: z
    .string()
    .min(1, { message: "Organization must be selected" }),
  gstNo: z.string().min(1, { message: "GST number is required" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
  workersCuttingPay: z
    .number()
    .min(1, { message: "Cutting Pay must be a positive number" }),
  workersPolishingPay: z
    .number()
    .min(1, { message: "Polishing Pay must be a positive number" }),
});

const organizations = [
  { id: "674b0a687d4f4b21c6c980ba", name: "Organization Jabal" },
];

function FactoryForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      factoryName: "",
      organizationId: "",
      gstNo: "",
      address: {
        location: "",
        pincode: "",
      },
      workersCuttingPay: 0,
      workersPolishingPay: 0,
    },
  });

  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    GlobalModal.title = "Confirm Factory Details";
    GlobalModal.description = "Please review the entered details:";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>
          <strong>Factory Name:</strong> {values.factoryName}
        </p>
        <p>
          <strong>Organization:</strong>{" "}
          {organizations.find((org) => org.id === values.organizationId)?.name}
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
          <strong>Workers Cutting Pay:</strong>{values.workersCuttingPay}
        </p>
        <p>
          <strong>Workers Polishing Pay:</strong>{values.workersPolishingPay}
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
              try {
                await postData("/factory/add", {
                  ...values,
                  status: "active",
                });
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Factory created/updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error creating/updating Factory:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error creating/updating Factory");
              }
            }}
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
                <Input placeholder="Eg: Factory A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organizationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Input placeholder="Eg: 361AAA90823RFS56" {...field} />
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
                <Input placeholder="Eg: 343 Main Street" {...field} />
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
                <Input placeholder="Eg: 500081" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Workers Cutting Pay */}
        <FormField
          control={form.control}
          name="workersCuttingPay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workers Cutting Pay</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Eg: 1500"
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Workers Polishing Pay */}
        <FormField
          control={form.control}
          name="workersPolishingPay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workers Polishing Pay</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Eg: 1200"
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
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

export default FactoryForm;
