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

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Consignee name must be at least 3 characters long" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  mobileNo: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const strVal = val.toString();
      return strVal.length >= 10 && /^\d+$/.test(strVal);
    }, { message: "Mobile number must be at least 10 digits and contain only numbers" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
});

interface Props {
  params: {
    _id: string; // Consignee ID
  };
}

export default function EditConsigneeForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      mobileNo: "",
      email: "",
    },
  });

  const consigneeId = params._id;

  // Fetch existing consignee data and reset form values
  useEffect(() => {
    async function fetchConsigneeData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          `https://incodocs-server.onrender.com/shipment/consignee/getone/${consigneeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch consignee data");
        }
        const data = await response.json();

        // Reset form with fetched values
        form.reset({
          name: data.name || "",
          address: data.address || "",
          mobileNo: data.mobileNo || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error fetching consignee data:", error);
        toast.error("Failed to fetch consignee data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchConsigneeData();
  }, [consigneeId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Consignee Update";
    GlobalModal.description = "Are you sure you want to update this consignee?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Consignee Name: {values.name}</p>
        <p>Address: {values.address}</p>
        <p>Mobile No: {values.mobileNo}</p>
        <p>Email: {values.email}</p>
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
                await putData(
                  `/shipment/consignee/update/${consigneeId}`,
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Consignee updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error updating consignee:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating consignee");
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
        <p className="ml-2 text-gray-500">Loading consignee details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consignee Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Ahmed" type="text" {...field} />
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
                  <Input
                    placeholder="Eg: Hyderabad"
                    type="text"
                    {...field}
                  />
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Ahmedkhan@gmail.com"
                    type="email"
                    {...field}
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