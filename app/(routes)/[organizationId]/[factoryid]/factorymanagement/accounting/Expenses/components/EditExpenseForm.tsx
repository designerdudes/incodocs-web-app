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
    expenseName: z
    .string()
    .min(3, { message: "expense Name must be reqired" })
    .optional(),
  expenseValue: z
    .number()
    .min(1, { message: "expense Value must be required" })
    .optional(),
  gstPercentage: z
    .union([
      z.string().min(1, { message: " enter the gst Percentage number " }),
      z.number(),
    ])
    .optional(),
    expenseDate: z
    .union([
      z.string().min(1, { message: "select date" }),
      z.number(),
    ])
    .optional(),
});

interface Props {
  params: {
    _id: string; // slab  ID
  };
}
function fetchslabData() {
  throw new Error("Function not implemented.");
}

export default function EditExpenseForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenseName: "",
      expenseValue: 0,
      gstPercentage: "",
      expenseDate: "",
    },
  });

  const id = params._id;

  // Fetch existing slab data and reset form values
  useEffect(() => {
    async function fetchSlabData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          `http://localhost:4080/expense/getbyid/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch slab data");
        }
        const data = await response.json();
        console.log(data)

        // Reset form with fetched values
        form.reset({
          expenseName: data.expenseName || "",
          expenseValue: data.expenseValue || "",
          gstPercentage: data.gstPercentage || "",
          expenseDate: data.expenseDate || "",
        });
      } catch (error) {
        console.error("Error fetching slab data:", error);
        toast.error("Failed to fetch slab data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchSlabData();
  },[id]);
   
  
  

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Lot Update";
    GlobalModal.description = "Are you sure you want to update this lot?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Expense Name: {values.expenseName}</p>
        <p>Expense Value: {values.expenseValue}</p>
        <p>GstPercentage: {values.gstPercentage}</p>
        <p>ExpenseDate: {values.expenseDate}</p>
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
                  `/expense/put/${id}`,
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("slab updated successfully");

                window.location.reload();
              } catch (error) {
                console.error("Error updating slab:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating slab");
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
        <p className="ml-2 text-gray-500">Loading lot details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expenseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>expense Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Lot ABC" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expenseValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>expense Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 1234"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* gst Percentage Field */}
          <FormField
            control={form.control}
            name="gstPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>gst Percentage</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 10%"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* expense Date Field */}
          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>expense Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 01/02/2000"
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


