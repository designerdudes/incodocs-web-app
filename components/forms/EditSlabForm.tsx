"use client";

import { fetchData } from "@/axiosUtility/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Block } from "@/app/(routes)/[factoryid]/factorymanagement/inventory/raw/processing/components/incuttingcolumns";

interface Props {
  id: string;
}

const formSchema = z.object({
  dimensions: z.object({
    height: z.object({
      value: z
        .number()
        .positive({ message: "Height must be greater than zero" }),
      units: z.literal("inch"),
    }),
    length: z.object({
      value: z
        .number()
        .positive({ message: "Length must be greater than zero" }),
      units: z.literal("inch"),
    }),
  }),
});

export default function EditSlabForm({ id }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slabs, setSlabs] = useState<any[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dimensions: {
        height: { value: 0, units: "inch" },
        length: { value: 0, units: "inch" },
      },
    },
  });

  useEffect(() => {
    const fetchSlabData = async () => {
      try {
        const data = await fetchData(
          `/factory-management/inventory/raw/get/${id}`
        );
        console.log("Fetched Data:", data);
        setBlock(data);
        setSlabs(data.SlabsId || []);

        // Set initial dimensions if available
        if (
          data.SlabsId &&
          data.SlabsId.length > 0 &&
          data.SlabsId[0].dimensions
        ) {
          form.reset({
            dimensions: {
              height: {
                value: data.SlabsId[0].dimensions.height.value,
                units: "inch",
              },
              length: {
                value: data.SlabsId[0].dimensions.length.value,
                units: "inch",
              },
            },
          });
        }
      } catch (error) {
        console.error("Error fetching slab data:", error);
      }
    };
    fetchSlabData();
  }, [id, form]);

  const handleDelete = async (slabId: string) => {
    try {
      await axios.delete(
        `http://localhost:4080/factory-management/inventory/finished/delete/${slabId}`
      );
      setSlabs((prevSlabs) => prevSlabs.filter((slab) => slab._id !== slabId));
      toast.success("Slab Deleted Successfully");
    } catch (error) {
      console.error("Error deleting slab:", error);
      toast.error("Failed to delete slab.");
    }
  };

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const newSlab = {
        blockId: id,
        factoryId: block?.factoryId,
        productName: slabs[0]?.productName,
        dimensions: form.getValues("dimensions"),
        status: slabs[0]?.status,
      };

      const response = await axios.post(
        "http://localhost:4080/factory-management/inventory/finished/add",
        newSlab
      );

      if (response.status === 201 || response.status === 200) {
        const createdSlab = response.data;
        setSlabs((prevSlabs) => [...prevSlabs, createdSlab]);
        toast.success("Slab Created Successfully");
      } else {
        throw new Error("Failed to create slab");
      }
    } catch (err) {
      console.error("Error creating slab:", err);
      toast.error("Failed to create slab.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      if (slabs.length === 0) {
        toast.error("No slabs available to update");
        return;
      }

      const payload = {
        slabNumbers: slabs.map((slab) => slab.slabNumber),
        dimensions: {
          length: {
            value: values.dimensions.length.value,
            units: "inch",
          },
          height: {
            value: values.dimensions.height.value,
            units: "inch",
          },
        },
      };

      // console.log("🟡 Sending Updated Slabs Payload:", payload);

      const updateResponse = await axios.put(
        "http://localhost:4080/factory-management/inventory/updateMultipleSlabsValue",
        payload
      );

      console.log("✅ Update Response:", updateResponse);

      if (updateResponse.status === 200) {
        // Update local state with new dimensions
        const updatedSlabs = slabs.map((slab) => ({
          ...slab,
          dimensions: values.dimensions,
        }));
        setSlabs(updatedSlabs);
        toast.success("Slabs Updated Successfully");

        // Refresh the data
        const refreshedData = await fetchData(
          `/factory-management/inventory/raw/get/${id}`
        );
        setSlabs(refreshedData.SlabsId || []);
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      console.error("❌ Error updating slabs:", error);
      toast.error("Failed to update slabs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Slabs</h2>

      {/* Display existing slabs in readonly mode */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Selected Slabs</h3>
        <div className="grid gap-2">
          {slabs.map((slab) => (
            <div
              key={slab._id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div>
                <span className="font-medium">Slab {slab.slabNumber}</span>
                <span className="ml-4 text-sm text-gray-600">
                  Current dimensions: {slab.dimensions?.height?.value || 0}"H x{" "}
                  {slab.dimensions?.length?.value || 0}"L
                </span>
              </div>
              <Button
                onClick={() => handleDelete(slab._id)}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Single form for dimensions */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dimensions.height.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (inches)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensions.length.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (inches)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" onClick={handleCreate}>
              Add Slab
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update All Slabs
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
