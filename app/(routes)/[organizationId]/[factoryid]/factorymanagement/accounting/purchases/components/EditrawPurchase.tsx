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
import { useSearchParams, useParams } from "next/navigation";
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
import EntityCombobox from "@/components/ui/EntityCombobox";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

const formSchema = z.object({
  supplierId: z.string().min(3).optional(),
  ratePerCubicVolume: z
    .union([
      z.string().min(1, { message: "Cost must be a valid number" }),
      z.number(),
    ])
    .optional(),
  invoiceNo: z.string().min(1, { message: "Invoice number is required" }),
  invoiceValue: z.number().optional(),
  gstPercentage: z
    .union([
      z.string().min(1, { message: " enter the gst Percentage number " }),
      z.number(),
    ])
    .optional(),
  noOfBlocks: z
    .union([
      z.string().min(1, { message: "Enter number of blocks" }),
      z.number(),
    ])
    .optional(),
  paymentProof: z.string().optional(),
  purchaseDate: z.string().min(1, { message: "Enter Date" }).optional(),
});

export default function EditRawForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const router = useParams();
  const searchParams = useSearchParams();
  const factoryId = router.factoryid as string;
  const organisationId = router.organizationId as string;
  const BlockId = searchParams.get("RawPurchasesId");

  const [supplierNames, setSupplierNames] = useState<
    { _id: string; name: string }[]
  >([]);
  const [, setSupplierLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      ratePerCubicVolume: "",
      noOfBlocks: "",
      purchaseDate: "",
      paymentProof: "",
      invoiceNo: "",
      invoiceValue: undefined,
      gstPercentage: "",
    },
  });

  useEffect(() => {
    const fetchingData = async () => {
      try {
        setSupplierLoading(true);
        const supplierResponse = await fetchData(
          `/accounting/supplier/getbyfactory/${factoryId}`
        );
        const supplierData = await supplierResponse;
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        toast.error("Failed to fetch suppliers");
      } finally {
        setSupplierLoading(false);
      }
    };
    fetchingData();
  }, [factoryId]);

  useEffect(() => {
    async function fetchLotData() {
      if (!BlockId) return;
      try {
        setIsFetching(true);
        const response = await fetchData(
          `/transaction/purchase/rawgetbyid/${BlockId}`
        );
        const result = response;
        const data = result.getPurchase;

        form.reset({
          supplierId: data?.supplierId?._id || "",
          ratePerCubicVolume: String(data?.ratePerCubicVolume || ""),
          noOfBlocks: String(data?.noOfBlocks || ""),
          invoiceNo: data?.invoiceNo || "",
          invoiceValue: data?.invoiceValue || "",
          gstPercentage: data?.gstPercentage || "",
          paymentProof: data.paymentProof || "",
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
        <p>Supplier Id: {values.supplierId}</p>
        <p>Rate per Sqft: {values.ratePerCubicVolume}</p>
        <p>No. of Blocks: {values.noOfBlocks}</p>
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
                await putData(
                  `/transaction/purchase/updateraw/${BlockId}`,
                  values
                );
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
        <p className="ml-2 text-gray-500">Loading Raw details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="supplierId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Supplier</FormLabel>
                  <FormControl>
                    <EntityCombobox
                      entities={supplierNames}
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      valueProperty="_id"
                      displayProperty="name"
                      placeholder="Select a Supplier Name"
                      onAddNew={() => {
                        window.open(
                          `/${organisationId}/${factoryId}/factorymanagement/parties/supplier/createNew`,
                          "_blank"
                        );
                      }}
                      multiple={false}
                      addNewLabel="Add New Supplier"
                    />
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
              name="paymentProof"
              render={() => (
                <FormItem>
                  <FormLabel>Payment Proof</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="paymentProof"
                      storageKey="paymentProof"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="noOfBlocks"
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
            {/* Invoice No */}
            <FormField
              name="invoiceNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No.</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Invoice No."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Invoice Value */}
            <FormField
              name="invoiceValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Invoice Value"
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GST Percentage */}
            <FormField
              control={form.control}
              name="gstPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>gst Percentage</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: 10%"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rate per Cubic Volume */}
            <FormField
              name="ratePerCubicVolume"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per Cubic Meter</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter rate per cubic meter"
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
