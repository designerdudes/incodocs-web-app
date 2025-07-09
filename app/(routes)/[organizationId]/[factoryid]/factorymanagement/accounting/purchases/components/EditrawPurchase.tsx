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
import moment from "moment";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  supplierName: z.string().min(3).optional(),
  supplierGSTN: z.string().min(3).optional(),
  ratePerCubicVolume: z.union([
    z.string().min(1, { message: "Cost must be a valid number" }),
    z.number(),
  ]).optional(),
  numberofBlocks: z.union([
    z.string().min(1, { message: "Enter number of blocks" }),
    z.number(),
  ]).optional(),
  purchaseDate: z.string().min(1, { message: "Enter Date" }).optional(),
});

interface Props {
  params: {
    _id: string;
  };
}

export default function EditLotForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierName: "",
      supplierGSTN: "",
      ratePerCubicVolume: "",
      numberofBlocks: "",
      purchaseDate: "",
    },
  });

  const BlockId = params._id;

  useEffect(() => {
    async function fetchLotData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `/transaction/purchase/rawgetbyid/${BlockId}`
        );
        const result = response;
        const data = result.getPurchase;

        form.reset({
          supplierName: data?.supplierId?.supplierName || "",
          supplierGSTN: data?.supplierId?.supplierGSTN || "",
          ratePerCubicVolume: String(data?.ratePerCubicVolume || ""),
          numberofBlocks: String(data?.noOfBlocks || ""),
          purchaseDate: data?.purchaseDate
            ? moment(data.purchaseDate).format("YYYY-MM-DD")
            : "",
        });
      } catch (error) {
        console.error("Error fetching Block data:", error);
        toast.error("Failed to fetch Block data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchLotData();
  }, [BlockId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Lot Update";
    GlobalModal.description = "Are you sure you want to update this lot?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Supplier Name: {values.supplierName}</p>
        <p>GSTN: {values.supplierGSTN}</p>
        <p>Rate per Sqft: {values.ratePerCubicVolume}</p>
        <p>No. of Blocks: {values.numberofBlocks}</p>
        <p>Purchase Date: {values.purchaseDate}</p>
        
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
                await putData(`/transaction/purchase/updateraw/${BlockId}`, values);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Block  updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error updating Block:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating Block");
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
            name="supplierName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Ahmed Afroz" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplierGSTN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier GSTN</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: 123456789" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ratePerCubicVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate per Sqft</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Eg: 1000"
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
            name="numberofBlocks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Blocks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Eg: 10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
              name="purchaseDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[100%] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "PPP")
                              : "Purchase date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(date ? date.toISOString() : "")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
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
