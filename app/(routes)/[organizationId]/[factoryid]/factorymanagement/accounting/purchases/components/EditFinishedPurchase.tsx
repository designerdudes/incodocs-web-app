"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useSearchParams, useParams,useRouter } from "next/navigation";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
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
  supplierId: z.string().optional(),
  ratePerSqft: z.union([z.string(), z.number()]).optional(),
  numberofSlabs: z.union([z.string(), z.number()]).optional(),
  invoiceNo: z.string().min(1, { message: "Invoice number is required" }),
  invoiceValue: z.number().optional(),
  gstPercentage: z.string().optional(),
  purchaseDate: z.string().optional(),
  paymentProof: z.string().optional(),
});

export default function EditFinishedPurchase() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [supplierNames, setSupplierNames] = useState<
    { _id: string; name: string }[]
  >([]);
  const GlobalModal = useGlobalModal();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const factoryId = params.factoryid as string;
  const organisationId = params.organizationId as string;
  const SlabId = searchParams.get("FinishedPurchaseId");
  const type = searchParams.get("type");
  const [isWithGst, setIsGst] = useState(false);

  const [, setSupplierLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      ratePerSqft: "",
      numberofSlabs: "",
      purchaseDate: "",
      paymentProof: "",
      invoiceNo: "",
      invoiceValue: 0,
      gstPercentage: "",
    },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setSupplierLoading(true);
        const res = await fetchData(
          `/accounting/supplier/getbyfactory/${factoryId}`
        );
        const supplierData = res || [];
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Failed to fetch suppliers");
      } finally {
        setSupplierLoading(false);
      }
    };
    fetchSuppliers();
  }, [factoryId]);

  useEffect(() => {
    async function fetchSlabData() {
      if (!SlabId)  return;
      try {
        setIsFetching(true);
        const res = await fetchData(
          `/transaction/purchase/slabgetbyid/${SlabId}`
        );
        const data = res.getPurchase;
        if (data.gstPercentage !== undefined && data.gstPercentage !== null) {
          setIsGst(true);
        }

        form.reset({
          supplierId: data?.supplierId?._id || "",
          ratePerSqft: String(data?.ratePerSqft || ""),
          numberofSlabs: String(data?.noOfSlabs || ""),
          invoiceNo: data?.invoiceNo || "",
          invoiceValue: data?.invoiceValue || 0,
          gstPercentage:
            data?.gstPercentage !== undefined ? `${data.gstPercentage}` : "",
          paymentProof: data.paymentProof || "",
          purchaseDate: data?.purchaseDate || "",
        });
      } catch (error) {
        console.error("Error fetching slab data:", error);
        toast.error("Failed to fetch slab data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchSlabData();
  }, [SlabId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    GlobalModal.title = "Confirm Slab Update";
    GlobalModal.description = "Are you sure you want to update this Slab?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Supplier Id: {values.supplierId}</p>
        <p>Rate per Sqft: {values.ratePerSqft}</p>
        <p>No. of Slabs: {values.numberofSlabs}</p>
        <p>Purchase Date: {values.purchaseDate}</p>
        {isWithGst && <p>GST Percentage: {values.gstPercentage}%</p>}
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
                  `/transaction/purchase/updateslab/${SlabId}`,
                  values
                );
                toast.success("Slab updated successfully");
                GlobalModal.onClose();
                router.push(`../`)
              } catch (error) {
                console.error("Error updating slab:", error);
                toast.error("Error updating slab");
              } finally {
                setIsLoading(false);
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
        <p className="ml-2 text-gray-500">Loading Finished details...</p>
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
                      onChange={(value) => field.onChange(value)}
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
              name="ratePerSqft"
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
              name="numberofSlabs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. of Slabs</FormLabel>
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
                              "w-full justify-start text-left font-normal",
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
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GST Percentage */}
            {isWithGst && (
              <FormField
                name="gstPercentage"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Percentage</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select GST Percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="1">1%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="12">12%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <Button type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
