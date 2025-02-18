"use client";

import { fetchData, putData } from "@/axiosUtility/api";
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
      slabNumber: z.number(),
      dimensions: z.object({
        length: z.object({
          value: z.number(),
          units: z.string(),
        }),
        height: z.object({
          value: z.number(),
          units: z.string(),
        }),
      }),
    })
  ),
});


export default function EditSlabForm({ id
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slabs, setSlabs] = useState<any[]>([]);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { slabs },
  });

  useEffect(() => {
    const fetchSlabData = async () => {
      try {
        const data = await fetchData(`/factory-management/inventory/raw/get/${id}`);
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
      await axios.delete(`http://localhost:4080/factory-management/inventory/finished/delete/${slabId}`);
      setSlabs((prev) => prev.filter((slab) => slab._id !== slabId));
      toast.success("Slab Deleted Successfully");
    } catch (error) {
      console.error("Error deleting slab:", error);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await putData(`/factory-management/inventory/updateMultipleSlabsValue`, {
        ...values,
      });

      toast.success("Slab Values Updated Successfully");
      router.back();
    } catch (error) {
      console.error("Validation or API error:", error);
      toast.error("An error occurred while updating data");
    }
    finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Edit Slabs</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button onClick={() => handleDelete(slab._id)} className="bg-red-500 text-white">
                Delete
              </Button>
            </div>
          ))}
          <Button type="submit" disabled={isLoading}>
            Update Slabs
          </Button>
        </form>
      </Form>
    </div>
  );
}
