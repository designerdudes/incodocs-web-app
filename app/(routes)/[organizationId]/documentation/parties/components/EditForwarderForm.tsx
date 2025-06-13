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

// ✅ Zod Schema
const formSchema = z.object({
  forwarderName: z
    .string()
    .min(3, { message: "Forwarder name must be at least 3 characters long" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  responsiblePerson: z
    .string()
    .min(3, { message: "Responsible person must be at least 3 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  mobileNo: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const strVal = val.toString();
      return strVal.length >= 10 && /^\d+$/.test(strVal);
    }, { message: "Mobile number must be at least 10 digits and contain only numbers" }),
});

interface Props {
  params: {
    _id: string;
  };
}

export default function EditForwarderForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      forwarderName: "",
      address: "",
      responsiblePerson: "",
      email: "",
      mobileNo: "",
    },
  });

  const forwarderId = params._id;

  // ✅ Fetch data and populate form
  useEffect(() => {
  const fetchForwarderData = async () => {
    try {
      setIsFetching(true);

      const data = await fetchData(`/shipment/forwarder/getone/${forwarderId}`);
      console.log("Forwarder data:", data);

      const forwarder = data?.findForwarder;

      if (!forwarder) {
        throw new Error("Forwarder data not found");
      }

      form.reset({
        forwarderName: forwarder.forwarderName || "",
        address: forwarder.address || "",
        responsiblePerson: forwarder.responsiblePerson || "",
        email: forwarder.email || "",
        mobileNo: forwarder.mobileNo?.toString() || "",
      });
    } catch (error) {
      console.error("Error fetching forwarder data:", error);
      toast.error("Failed to fetch forwarder data");
    } finally {
      setIsFetching(false);
    }
  };

  if (forwarderId) {
    fetchForwarderData();
  }
}, [forwarderId, form]);

  // ✅ Handle Submit with modal
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Forwarder Update";
    GlobalModal.description = "Are you sure you want to update this forwarder?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Forwarder Name: {values.forwarderName}</p>
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
                await putData(`/shipment/forwarder/put/${forwarderId}`, values);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Forwarder updated successfully");
                router.refresh(); // or window.location.reload();
              } catch (error) {
                console.error("Error updating forwarder:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating forwarder");
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

  // ✅ Show loading spinner while fetching
  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Icons.spinner className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading forwarder details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="forwarderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forwarder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Omer" type="text" {...field} />
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
                  <Input placeholder="Eg: Ahmed" type="text" {...field} />
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
                  <Input placeholder="Eg: someone@email.com" type="email" {...field} />
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
                  <Input
                    placeholder="Eg: 7013396624"
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
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
