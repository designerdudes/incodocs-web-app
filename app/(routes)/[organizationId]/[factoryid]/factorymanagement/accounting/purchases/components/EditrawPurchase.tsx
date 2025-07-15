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
  supplierId: z.string().optional(),
  ratePerCubicVolume: z.union([z.string().min(1), z.number()]).optional(),
  invoiceNo: z.string().min(1, { message: "Invoice number is required" }),
  invoiceValue: z.number().optional(),
  gstPercentage: z.string().optional(),
  noOfBlocks: z.union([z.string().min(1), z.number()]).optional(),
  paymentProof: z.string().optional(),
  purchaseDate: z.string().min(1).optional(),
});

export default function EditRawForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const factoryId = params.factoryid as string;
  const organisationId = params.organizationId as string;
  const BlockId = searchParams.get("RawPurchasesId");
  const type = searchParams.get("type");
  const [isWithGst, setIsGst] = useState(false);

  const [supplierNames, setSupplierNames] = useState([]);
  const [, setSupplierLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      ratePerCubicVolume: "",
      noOfBlocks: "",
      purchaseDate: "",
      paymentProof: "",
      invoiceNo: "",
      invoiceValue: 0,
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
        const mappedSuppliers = supplierResponse.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        toast.error("Failed to fetch suppliers");
      } finally {
        setSupplierLoading(false);
      }
    };
    fetchingData();
  }, [factoryId]);

  useEffect(() => {
    async function fetchBlockData() {
      if (!BlockId) return;
      try {
        setIsFetching(true);
        const response = await fetchData(
          `/transaction/purchase/rawgetbyid/${BlockId}`
        );
        const data = response.getPurchase;
        if (data.gstPercentage !== undefined && data.gstPercentage !== null) {
          setIsGst(true);
        }

        form.reset({
          supplierId: data?.supplierId?._id || "",
          ratePerCubicVolume: String(data?.ratePerCubicVolume || ""),
          noOfBlocks: String(data?.noOfBlocks || ""),
          invoiceNo: data?.invoiceNo || "",
          invoiceValue: data?.invoiceValue || 0,
          gstPercentage:
            data?.gstPercentage !== undefined ? `${data.gstPercentage}` : "",
          paymentProof: data.paymentProof || "",
          purchaseDate: data?.purchaseDate
            ? moment(data.purchaseDate).format("YYYY-MM-DD")
            : "",
        });
      } catch (error) {
        toast.error("Failed to fetch Block data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchBlockData();
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
                  `/transaction/purchase/updateraw/${BlockId}`,
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Block  updated successfully");
                router.push(`../`)
              } catch (error) {
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
                      onChange={field.onChange}
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
                  <FormLabel>Rate per Cubic Meter</FormLabel>
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
            <FormField
              name="invoiceNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Invoice No." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
