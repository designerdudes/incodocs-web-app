"use client";
import React, { useEffect, useState } from "react";
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
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

const formSchema = z.object({
  customerName: z.string().min(3, { message: "Customer name must be at least 3 characters long" }),
  gstNo: z.string().min(1, { message: "GST Number is required" }),
  mobileNumber: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const strVal = val.toString();
      return strVal.length >= 10 && /^\d+$/.test(strVal);
    }, { message: "Mobile number must be at least 10 digits and contain only numbers" }),
  state: z.string().min(1, { message: "State is required" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters long" }),
});

interface EditCustomerFormProps {
  params: { _id: string };
}

export default function EditCustomerForm({ params }: EditCustomerFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      gstNo: "",
      mobileNumber: "",
      state: "",
      address: "",
    },
  });

  const customerId = params._id;

  // Fetch existing customer data
  useEffect(() => {
    async function fetchCustomerData() {
      try {
        setIsFetching(true);
        const response = await fetchWithAuth<any>(
          `/accounting/customer/getsingle/${customerId}`
        );
        const data = response;
        form.reset({
          customerName: data.customerName || "",
          gstNo: data.gstNo || "",
          mobileNumber: data.mobileNumber?.toString() || "",
          state: data.state || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error("Failed to fetch customer data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchCustomerData();
  }, [customerId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Customer Update";
    GlobalModal.description = "Are you sure you want to update this customer?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Customer Name: {values.customerName}</p>
        <p>GST No: {values.gstNo}</p>
        <p>Mobile Number: {values.mobileNumber}</p>
        <p>State: {values.state}</p>
        <p>Address: {values.address}</p>
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
                await putData(`/accounting/customer/update/${customerId}`, values);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Customer updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error updating customer:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating customer");
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

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Icons.spinner className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading customer details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Customer 2" type="text" {...field} />
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
                  <Input placeholder="e.g., 36fdsf34dsf" type="text" {...field} />
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
                    placeholder="e.g., 9876543210"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...field}
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
                  <Input placeholder="e.g., Andhra" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Address One Two Three" type="text" {...field} />
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