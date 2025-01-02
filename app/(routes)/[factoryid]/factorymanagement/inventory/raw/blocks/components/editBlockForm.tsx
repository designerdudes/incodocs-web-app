import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
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
  height: z.number().min(1, { message: "Height must be greater than 0" }),
  length: z.number().min(1, { message: "Length must be greater than 0" }),
  breadth: z.number().min(1, { message: "Breadth must be greater than 0" }),
  weight: z.number().min(1, { message: "Weight must be greater than 0" }),
});

interface Props {
  params: {
    _id: string; // Block ID (the same as the route parameter)
  };
}

export default function EditBlockForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: 0,
      length: 0,
      breadth: 0,
      weight: 0,
    },
  });

  const blockId = params._id; // Get the block ID passed as a parameter

  // Watch form fields
  const { height, length, breadth } = useWatch({
    control: form.control,
  });

  // Calculate volume dynamically
  const volume = height * length * breadth;

  // Fetch block data and reset form with values
  useEffect(() => {
    async function fetchBlockData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          `http://localhost:4080/factory-management/inventory/raw/get/${blockId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch block data");
        }
        const data = await response.json();

        // Reset form with fetched values
        form.reset({
          height: data.dimensions?.height?.value || 0,
          length: data.dimensions?.length?.value || 0,
          breadth: data.dimensions?.breadth?.value || 0,
          weight: data.dimensions?.weight?.value || 0,
        });
      } catch (error) {
        console.error("Error fetching block data:", error);
        toast.error("Failed to fetch block data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchBlockData();
  }, [blockId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Block Update";
    GlobalModal.description = "Are you sure you want to update this block?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Height: {values.height}</p>
        <p>Length: {values.length}</p>
        <p>Breadth: {values.breadth}</p>
        <p>Weight: {values.weight}</p>
        <p>Volume: {values.height * values.length * values.breadth}</p>
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
                  `/factory-management/inventory/raw/update/${blockId}`,
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Block updated successfully");
                router.refresh();
              } catch (error) {
                console.error("Error updating block:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating block");
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
        <p className="ml-2 text-gray-500">Loading block details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input placeholder="Height" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length</FormLabel>
                <FormControl>
                  <Input placeholder="Length" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="breadth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breadth</FormLabel>
                <FormControl>
                  <Input placeholder="Breadth" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="Weight" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>Volume (in³)</FormLabel>
          <p className="border p-2 rounded bg-gray-100">{volume || 0}</p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
