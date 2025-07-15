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
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import EntityCombobox from "@/components/ui/EntityCombobox";

const formSchema = z.object({
  customerName: z.string().optional(),
  customerAddress: z.string().optional(),
  customerId: z
    .object({
      _id: z.string(),
      name: z.string(),
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

  invoiceValue: z.number().optional(),
  gstPercentage: z.string().optional(),
  paymentProof: z.string().optional(),
});

export default function EditSaleForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const [customerLoading, setCustomerLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<{address: string;_id: string;name: string;}[]>([]);
  const params = useParams();
  const router =useRouter();
  const searchParams = useSearchParams();
  const factoryId = params.factoryid as string;
  const organisationId = params.organizationId as string;
  const SlabId = searchParams.get("EditSalesId");
  const type = searchParams.get("type");
    const [isWithGst, setIsGst] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: {
        _id: "",
        name: "",
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
      invoiceValue: 0,
      gstPercentage: "",
      paymentProof: "",
    },
  });
  React.useEffect(() => {
      const fetchingCustomers = async () => {
        try {
          setCustomerLoading(true);
          const customerResponse = await fetchData(
            `/accounting/customer/getbyfactory/${factoryId}`
          );
          const customerData = await customerResponse;
  
          const mappedCustomers = customerData.map((customer: any) => ({
            _id: customer._id,
            name: customer.customerName,
            address: customer.customerAddress, // <- include this
          }));
          setCustomers(mappedCustomers);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          setCustomerLoading(false);
        }
      };
  
      fetchingCustomers();
    }, [customers]);
  

  // Fetch existing lot data and reset form values
  useEffect(() => {
    async function fetchSlabData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `https://incodocs-server.onrender.com/transaction/sale/getbyid/${SlabId}`
        );

        const data = response;
         if (data.gstPercentage !== undefined && data.gstPercentage !== null) {
          setIsGst(true);
        }
        // Reset form with fetched values
        form.reset({
          customerId: {
            _id: data.customerId?._id || "",
            name: data.customerId?.customerName || "", // must match `displayProperty="name"`
          },
          noOfSlabs: data.noOfSlabs || "",
          paymentProof: data?.paymentProof || "",
          saleDate: data.saleDate || "",
          invoiceValue: data?.invoiceValue || 0,
          gstPercentage:
            data?.gstPercentage !== undefined ? `${data.gstPercentage}` : "",
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
        <p>customerName: {values.customerId?.name}</p>
        <p>NumberofSlabs: {values.noOfSlabs}</p>
        {isWithGst && <p>GST Percentage: {values.gstPercentage}%</p>}
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
                router.push(`./`)
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="customerId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Customer</FormLabel>
                  <FormControl>
                    <EntityCombobox
                      entities={customers}
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : field.value?._id ?? ""
                      }
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      displayProperty="name"
                      valueProperty="_id"
                      placeholder="Select Customer"
                      onAddNew={() => {
                        window.open(
                          `/${organisationId}/${factoryId}/factorymanagement/parties/customer/createNew`,
                          "_blank"
                        );
                      }}
                      multiple={false}
                      addNewLabel="Add New Customer"
                      // disabled={isLoading || customerLoading}
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
                  <FormLabel>Sales  Date</FormLabel>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
