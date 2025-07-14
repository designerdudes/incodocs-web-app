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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";
import { cn } from "@/lib/utils";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

const formSchema = z.object({
  customerId: z
    .object({
      _id: z.string(),
      customerName: z.string(),
    })
    .optional(),

  noOfSlabs: z
    .union([
      z.string().min(1, { message: "Enter number of slabs" }),
      z.number(),
    ])
    .optional(),

  saleDate: z
    .union([z.string().min(1, { message: "Enter date" }), z.date()])
    .optional(),

  factoryId: z
    .object({
      _id: z.string(),
      factoryName: z.string(),
    })
    .optional(),

  slabIds: z.array(z.any()).optional(),

  length: z
    .union([z.string().min(1, { message: "Enter length" }), z.number()])
    .optional(),

  height: z
    .union([z.string().min(1, { message: "Enter height" }), z.number()])
    .optional(),

  invoiceValue: z
    .union([z.string().min(1, { message: "Enter invoice value" }), z.number()])
    .optional(),

  gstPercentage: z
    .union([z.string().min(1, { message: "Enter GST percentage" }), z.number()])
    .optional(),
  paymentProof: z.string().optional(),
});
interface Props {
  params: {
    _id: string;
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
      customerId: {
        _id: "",
        customerName: "",
      },
      noOfSlabs: "",
      saleDate: "",
      factoryId: {
        _id: "",
        factoryName: "",
      },
      slabIds: [],
      length: "",
      height: "",
      invoiceValue: "",
      gstPercentage: "",
      paymentProof: "",
    },
  });

  const SlabId = params._id;

  // Fetch existing lot data and reset form values
  useEffect(() => {
    async function fetchSlabData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `https://incodocs-server.onrender.com/transaction/sale/getbyid/${SlabId}`
        );

        const data = response;
        // Reset form with fetched values
        form.reset({
          customerId: {
            _id: data.customerId?._id || "",
            customerName: data.customerId?.customerName || "",
          },
          noOfSlabs: data.noOfSlabs || "",
          paymentProof: data?.paymentProof || "",
          saleDate: data.saleDate || "",
        });
      } catch (error) {
        console.error("Error fetching lot data:", error);
        toast.error("Failed to fetch lot data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchSlabData();
  }, [SlabId]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Slab Update";
    GlobalModal.description = "Are you sure you want to update this Slab?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>customerName: {values.customerId?.customerName}</p>
        <p>NumberofSlabs: {values.noOfSlabs}</p>
        <p>
          saleDate:{" "}
          {values.saleDate
            ? new Date(values.saleDate).toLocaleDateString()
            : "N/A"}
        </p>
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
                await putData(`/transaction/sale/updatesale/${SlabId}`, values);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Slab updated successfully");

                window.location.reload();
              } catch (error) {
                console.error("Error updating Slab:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating Slab");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: ABC"
                    value={field.value?.customerName || ""}
                    onChange={(e) =>
                      field.onChange({
                        ...field.value,
                        customerName: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*  GST Percentage Field */}
          <FormField
            control={form.control}
            name="noOfSlabs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Slabs</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="eg: 100"
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
            name="paymentProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Proof</FormLabel>
                <FormControl>
                  <FileUploadField
                    name="paymentProof"
                    storageKey="paymentProof"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*  Expense Date Field */}
          <FormField
            name="saleDate"
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
