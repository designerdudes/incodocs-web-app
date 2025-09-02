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
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGlobalModal } from "@/hooks/GlobalModal";


const formSchema = z.object({
  factoryName: z.string().min(1, { message: "Factory name is required" }),
  gstNo: z.string().min(1, { message: "GST No is required" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z.string().min(6, { message: "Pincode must be 6 digits" }),
  }),
  createdAt: z.string().optional(),
  workersCuttingPay: z.number().min(0, { message: "Must be a positive number" }),
  workersPolishingPay: z.number().min(0, { message: "Must be a positive number" }),
});

interface EditFactoryFormProps {
  factoryData: {
    _id: string;
  };
}

export default function EditFactoryForm({ factoryData }: EditFactoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      factoryName: "",
      gstNo: "",
      address: {
        location: "",
        pincode: "",
      },
      createdAt: "",
      workersCuttingPay: 0,
      workersPolishingPay: 0,
    },
  });

    const GlobalModal = useGlobalModal();
  

  const factoryId = factoryData._id;

  useEffect(() => {
    async function fetchFactory() {
      try {
        setFetching(true);
        const data = await fetchData(`/factory/getSingle/${factoryId}`);
        form.reset({
          factoryName: data.factoryName || "",
          gstNo: data.gstNo || "",
          address: {
            location: data.address?.location || "",
            pincode: data.address?.pincode || "",
          },
          createdAt: data.createdAt || "",
          workersCuttingPay: data.workersCuttingPay || 0,
          workersPolishingPay: data.workersPolishingPay || 0,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch factory data");
      } finally {
        setFetching(false);
      }
    }

    fetchFactory();
  }, [factoryId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await putData(`/factory/put/${factoryId}`, values);
      toast.success("Factory updated successfully");

      router.push("./factory");
setTimeout(() => {
      router.refresh();
    }, 1000);

    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update factory");
    } finally {
      setLoading(false);
    }
    GlobalModal.onClose();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Icons.spinner className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading factory data...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="factoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Factory Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Alpha Factory" {...field} />
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
                  <Input placeholder="Eg: GSTIN1234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Hyderabad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: 500001" {...field}  maxLength={6}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workersCuttingPay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cutting Pay</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Eg: 12"
                    min={0}
                    {...field}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workersPolishingPay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Polishing Pay</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Eg: 12"
                    min={0}
                    {...field}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Update Factory
        </Button>
      </form>
    </Form>
  );
}
