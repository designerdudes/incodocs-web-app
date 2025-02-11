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

interface Props {
  id: string;
}

const formSchema = z.object({
  slabs: z.array(
    z.object({
      _id: z.string().optional(), // New slabs won't have an _id
      slabNumber: z.number(),
      productName: z.string().optional(), // Required for new slabs
      quantity: z.number().optional(), // Required for new slabs
      status: z.string().optional(), // Required for new slabs
      inStock: z.boolean().optional(), // Required for new slabs
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
    })
  ),
});

export default function EditSlabForm({ id }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slabs, setSlabs] = useState<any[]>([]);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { slabs },
  });
  useEffect(() => {
    form.reset({ slabs });
  }, [slabs]);

  useEffect(() => {
    const fetchSlabData = async () => {
      try {
        const data = await fetchData(
          `/factory-management/inventory/raw/get/${id}`
        );
        console.log("Fetched Data:", data);
        setSlabs(data.SlabsId || []);
        form.reset({ slabs: data.SlabsId || [] });
      } catch (error) {
        console.error("Error fetching slab data:", error);
      }
    };
    fetchSlabData();
  }, [id]);

  const handleDelete = async (slabId: string) => {
    try {
      await axios.delete(
        `http://localhost:4080/factory-management/inventory/finished/delete/${slabId}`
      );

      // ✅ Update state to remove deleted slab
      setSlabs((prev) => prev.filter((slab) => slab._id !== slabId));
      form.setValue(
        "slabs",
        slabs.filter((slab) => slab._id !== slabId) // ✅ Ensure form reflects state update
      );

      toast.success("Slab Deleted Successfully");
    } catch (error) {
      console.error("Error deleting slab:", error);
      toast.error("Failed to delete slab.");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      const updatedSlabs = values.slabs.filter((slab: any) => slab._id);

      // ✅ Check if values actually changed before updating
      if (JSON.stringify(updatedSlabs) === JSON.stringify(slabs)) {
        toast("No changes detected.");
        setIsLoading(false);
        return;
      }

      if (updatedSlabs.length > 0) {
        const updatedSlabsPayload = updatedSlabs.map((slab: any) => ({
          slabNumber: slab.slabNumber,
          dimensions: {
            length: { value: slab.dimensions.length.value || 0, units: "inch" },
            height: { value: slab.dimensions.height.value || 0, units: "inch" },
          },
        }));

        console.log("🟡 Sending Updated Slabs Payload:", updatedSlabsPayload);

        const updateResponse = await axios.put(
          "http://localhost:4080/factory-management/inventory/updateMultipleSlabsValue",
          { slabs: updatedSlabsPayload }
        );

        console.log("✅ Update Response Data:", updateResponse.data);

        if (updateResponse.status === 200) {
          toast.success("Slabs Updated Successfully");

          // ✅ Update UI state with new slabs from API response
          setSlabs(updateResponse.data.updatedSlabs || updatedSlabs);

          // ✅ Ensure form reflects new state
          form.reset({
            slabs: updateResponse.data.updatedSlabs || updatedSlabs,
          });

          // ✅ Prevent unnecessary page navigation after deleting a slab
        } else {
          throw new Error("Unexpected API response");
        }
      }
    } catch (error: any) {
      console.error("❌ Error updating slabs:", error);
      toast.error("Failed to update slabs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Slabs</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          {slabs.map((slab, index) => (
            <div key={slab._id} className="flex items-center gap-4 mb-2">
              <span className="font-semibold">Slab {slab.slabNumber}</span>
              <FormField
                control={form.control}
                name={`slabs.${index}.dimensions.height.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (inches)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`slabs.${index}.dimensions.length.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (inches)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                onClick={() => handleDelete(slab._id)}
                className="bg-red-500 text-white"
              >
                Delete
              </Button>
            </div>
          ))}
          <div className="flex gap-4 mt-4">
            <Button
              type="button"
              onClick={() => {
                const newSlab = {
                  _id: undefined, // No _id for new slabs
                  slabNumber: slabs.length + 1,
                  productName: "steps",
                  quantity: 1,
                  status: "readyForPolish",
                  inStock: true,
                  dimensions: {
                    height: { value: 0, units: "inch" },
                    length: { value: 0, units: "inch" },
                  },
                };

                const updatedSlabs = [...slabs, newSlab];
                setSlabs(updatedSlabs);
                form.setValue("slabs", updatedSlabs); // 🔥 Sync form state with slabs
              }}
            >
              Add Slab
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Slabs
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
