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
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

const formSchema = z.object({
  slabid: z
    .string()
    .min(3, { message: "Slab Id must be at least 3 characters long" })
    .optional(),
      slabname: z
    .string()
    .min(3, { message: "Slab name must be at least 3 characters long" })
    .optional(),
  length: z
    .string()
    .min(3, { message: "Length must be in Inchs" })
    .optional(),
  height: z
    .union([
      z.string().min(1, { message: "Material cost must be a valid number" }),
      z.number(),
    ])
    .optional(),
 slabphoto: z.string().optional(),
  slabstatus: z
    .string()
    .min(3, { message: "Marker operator must be at least 3 characters long" })
    .optional(),

 

});

interface Props {
  params: {
    _id: string; // Lot ID
  };
}

export default function EditSLabForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slabid: "",
      slabname:"",
      length: "",
      height: "",
      slabphoto: "",
      slabstatus: "",
     
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
          slabid: data.lotName || "",
           slabname: data.lotName || "",
          length: data.materialType || "",
          height: data.materialCost || "",
          slabphoto: data.blockphoto || "",
          slabstatus: data.markerCost || "",
        
        });
      } catch (error) {
        console.error("Error fetching slab data:", error);
        toast.error("Failed to fetch slab data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchLotData();
  }, [lotId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm slab Update";
    GlobalModal.description = "Are you sure you want to update this slab?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Lot Id: {values.slabid}</p>
        <p>Slab Name: {values.slabname}</p>
         <p>Length: {values.length}</p>
        <p>Height: {values.height}</p>
        <p>slabstatus: {values.slabstatus}</p>
       
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
        <p className="ml-2 text-gray-500">Loading slab details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slabid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slab Id</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: slab ABC" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>

              
            )}
          />
           <FormField
            control={form.control}
            name="slabname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slab Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Slab ABC" type="text" {...field} />
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
                <FormLabel>Length (inch)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: inch"
                    type="number"
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
             name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg:10 inch"
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

       

          {/* Marker Cost Field */}
          <FormField
            control={form.control}
            name="slabstatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slab Status</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg:polished"
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
            name="slabphoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slab Photo</FormLabel>
                <FormControl>
                  <FileUploadField
                    name="blockphoto"
                    storageKey="blockphoto"
                    value={field.value}
                    onChange={field.onChange}
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
