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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, { message: "Organization Name is required" }),
  description: z.string().optional(),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
});

interface Props {
  params: {
    _id: string;
  };
}

export default function EditOrganizationForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: {
        location: "",
        pincode: "",
      },
    },
  });

  const organizationId = params._id;

  // Fetch existing Organization data and reset form values
  useEffect(() => {
    async function fetchorganizationData() {
      try {
        setIsFetching(true);
        const response = await fetchData(`organizations/get/${organizationId}`);

        const data = response;
        // Reset form with fetched values
        form.reset({
          name: data.name || "",
          description: data.description || "",
          address: {
            location: data.address.location || "",
            pincode: data.address.pincode || "",
          },
        });
      } catch (error) {
        console.error("Error fetching Organization data:", error);
        toast.error("Failed to fetch Organization data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchorganizationData();
  }, []);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Organization Update";
    GlobalModal.description = "Are you sure you want to update this Organization?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Organization Name: {values.name}</p>
        <p>Description: {values.description}</p>
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
                await putData(`/organizations/${organizationId}`, values);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Organization updated successfully");

                window.location.reload();
              } catch (error) {
                console.error("Error updating Organization:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating Organization");
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
        <p className="ml-2 text-gray-500">Loading Organization details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4"></div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jabal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., This is a sample organization"
                  {...field}
                />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 343 Example Street" {...field} />
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
                <Input placeholder="e.g., 500008" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
