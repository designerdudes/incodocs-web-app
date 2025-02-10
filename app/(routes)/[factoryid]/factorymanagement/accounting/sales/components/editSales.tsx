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
  customerName: z
    .string()
    .min(3, { message: " name must be at least 3 characters long" })
    .optional(),
    customerGSTN: z
    .string()
    .min(3, { message: "Enter GSTNumber " })
    .optional(),
    NumberOfSlabs: z
    .union([
      z.string().min(1, { message: " Enter NumberOfSlabs" }),
      z.number(),
    ])
    .optional(),
    saleDate: z
    .union([
      z.string().min(1, { message: "Enter date" }),
      z.number(),
    ])
    .optional(),
});

interface Props {
  params: {
    _id: string; // Lot ID
  };
}

export default function EditLotForm({ params }: Props){
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName:"",
      customerGSTN: "",
      NumberOfSlabs: "",
      saleDate: "",
    },
  });

  const lotId = params._id;

  // Fetch existing lot data and reset form values
  useEffect(() => {
    async function fetchLotData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          `http://localhost:4080/factory-management/inventory/lot/getbyid/${lotId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch lot data");
        }
        const data = await response.json();

        // Reset form with fetched values
        form.reset({
           customerName: data.customerName || "",
           customerGSTN: data.customerGSTN|| "",
           NumberOfSlabs: data.NumberOfSlabs || "",
           saleDate: data.saleDate || "",
        });
      } catch (error) {
        console.error("Error fetching lot data:", error);
        toast.error("Failed to fetch lot data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchLotData();
  }, [lotId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Lot Update";
    GlobalModal.description = "Are you sure you want to update this lot?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>customerName: {values.customerName}</p>
        <p>customerGSTN: {values.customerGSTN}</p>
        <p>NumberofSlabs: {values.NumberOfSlabs}</p>
        <p>saleDate: {values.saleDate}</p>
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
                  `/factory-management/inventory/lot/update/${lotId}`,
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Lot updated successfully");

                window.location.reload();
              } catch (error) {
                console.error("Error updating lot:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating lot");
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

  // if (isFetching) {
  //   return (
  //     <div className="flex items-center justify-center h-60">
  //       <Icons.spinner className="h-6 w-6 animate-spin" />
  //       <p className="ml-2 text-gray-500">Loading lot details...</p>
  //     </div>
  //   );
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>customerName</FormLabel>
                <FormControl>
                  <Input placeholder="Eg:  ABC" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerGSTN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>customerGSTN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg:123456789"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*  GST Percentage Field */}
          <FormField
            control={form.control}
            name="NumberOfSlabs"
            render={({ field }) => (
              <FormItem>
                <FormLabel> NumberOfSlabs</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 100"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*  Expense Date Field */}
          <FormField
            control={form.control}
            name="saleDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel> saleDate</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg:10/02/2025"
                    type="number"
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
