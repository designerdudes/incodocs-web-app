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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  lotName: z
    .string()
    .min(3, { message: "Lot name must be at least 3 characters long" })
    .optional(),
  materialType: z
    .string()
    .min(3, { message: "Material type must be at least 3 characters long" })
    .optional(),
  materialCost: z
    .union([
      z.string().min(1, { message: "Material cost must be a valid number" }),
      z.number(),
    ])
    .optional(),
  markerCost: z
    .union([
      z.string().min(1, { message: "Marker cost must be a valid number" }),
      z.number(),
    ])
    .optional(),
  transportCost: z
    .union([
      z.string().min(1, { message: "Transport cost must be a valid number" }),
      z.number(),
    ])
    .optional(),
  markerOperatorName: z
    .string()
    .min(3, { message: "Marker operator must be at least 3 characters long" })
    .optional(),
});

interface Props {
  params: {
    _id: string; // Lot ID
  };
}

export default function EditLotForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lotName: "",
      materialType: "",
      materialCost: "",
      markerCost: "",
      transportCost: "",
      markerOperatorName: "",
    },
  });

  const lotId = params._id;

  // Fetch existing lot data and reset form values
  useEffect(() => {
    async function fetchLotData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `/factory-management/inventory/lot/getbyid/${lotId}`
        );
        
        const data = response;

        // Reset form with fetched values
        form.reset({
          lotName: data.lotName || "",
          materialType: data.materialType || "",
          materialCost: data.materialCost || "",
          markerCost: data.markerCost || "",
          transportCost: data.transportCost || "",
          markerOperatorName: data.markerOperatorName || "",
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
        <p>Lot Name: {values.lotName}</p>
        <p>Material Type: {values.materialType}</p>
        <p>Material Cost: {values.materialCost}</p>
        <p>Marker Cost: {values.markerCost}</p>
        <p>Transport Cost: {values.transportCost}</p>
        <p>Marker Operator: {values.markerOperatorName}</p>
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
            name="lotName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Machine</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Machine Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tiles">Single Blade Slab Cutter</SelectItem>
                    <SelectItem value="Slabs">Multi Slab Cutter</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="materialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Material XYZ"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Material Cost Field */}
          <FormField
            control={form.control}
            name="materialCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Cost</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 1000"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
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
            name="markerCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (inches)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Eg: 10"
                                    type="number"
                                      className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transport Cost Field */}
          <FormField
            control={form.control}
            name="transportCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>breadth (inches)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Eg: 10"
                              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    type="number"
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Marker Operator Field */}
          <FormField
            control={form.control}
            name="markerOperatorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marker Operator Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Operator John"
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
