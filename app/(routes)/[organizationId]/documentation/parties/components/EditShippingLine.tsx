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
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// Schema
const formSchema = z.object({
  shippingLineName: z
    .string()
    .min(3, { message: "Shipping line name must be at least 3 characters long" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  responsiblePerson: z
    .string()
    .min(3, { message: "Responsible person must be at least 3 characters long" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  mobileNo: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only numbers" }),
});

interface ShippingLineData {
  shippingLineName: string;
  address: string;
  responsiblePerson: string;
  email: string;
  mobileNo: string;
}

interface Props {
  params: {
    _id: string;
  };
}

export default function EditShippingLineForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const shippingLineId = params._id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingLineName: "",
      address: "",
      responsiblePerson: "",
      email: "",
      mobileNo: "",
    },
  });

  // ✅ Fetch data and populate form
  useEffect(() => {
  const fetchShippingLineData = async () => {
    try {
      setIsFetching(true);
      const data = await fetchData(`/shipment/shippingline/getone/${shippingLineId}`);
      console.log("Fetched shipping line data:", data);

      const shippingLine = data?.shipmentLine;

      const formData: ShippingLineData = {
        shippingLineName: shippingLine?.shippingLineName?.toString() || "",
        address: shippingLine?.address?.toString() || "",
        responsiblePerson: shippingLine?.responsiblePerson?.toString() || "",
        email: shippingLine?.email?.toString() || "",
        mobileNo: shippingLine?.mobileNo?.toString() || "",
      };

      form.reset(formData); // ✅ Properly populate form now
    } catch (error) {
      console.error("Error fetching shipping line data:", error);
      toast.error("Failed to fetch shipping line data");
    } finally {
      setIsFetching(false);
    }
  };

  if (shippingLineId) {
    fetchShippingLineData();
  }
}, [shippingLineId, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Shipping Line Update";
    GlobalModal.description = "Are you sure you want to update this shipping line?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Shipping Line Name: {values.shippingLineName}</p>
        <p>Address: {values.address}</p>
        <p>Responsible Person: {values.responsiblePerson}</p>
        <p>Email: {values.email}</p>
        <p>Mobile No: {values.mobileNo}</p>
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
                await putData(`/shipment/shippingline/put/${shippingLineId}`, values);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Shipping line updated successfully");
                router.refresh();
              } catch (error) {
                console.error("Error updating shipping line:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating shipping line");
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
        <p className="ml-2 text-gray-500">Loading shipping line details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shippingLineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Line Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Noor" type="text" {...field} />
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
                  <Input placeholder="Eg: 303, Ahmed khan manzil" type="text" {...field} />
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
                  <Input placeholder="Eg: Khaja" type="text" {...field} />
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
                  <Input placeholder="Eg: example@gmail.com" type="email" {...field} />
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
                <FormLabel>Mobile No</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: 7013396624" type="text" {...field} />
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
