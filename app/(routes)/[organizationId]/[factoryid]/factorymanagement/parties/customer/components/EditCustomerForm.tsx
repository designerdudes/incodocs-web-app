"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Customer } from "./customerColumns";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSchema } from "@/components/forms/CustomerFormPage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Zod Schemas
export const customerSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  gstNo: z.string().min(1, "gst number is required"),
  mobileNumber: z.number().min(1, "Mobile number required"),
  state: z.string().optional(),
  address: z.string().optional(),
  factoryId: z.string().optional(),
  createdBy: z.any().optional(),
  documents: z
    .array(
      z.object({
        fileName: z.string().optional(),
        fileUrl: z.string().nullable().optional(),
        date: z.string().optional(),
        review: z.string().optional(),
      })
    )
    .optional(),
});

type CustomerFormValues = z.infer<typeof CustomerSchema>;

interface CustomerFormProps {
  params: {
    _id: Customer;
    customerName?: string;
    gstNo?: string;
    mobileNumber?: number;
    state?: string;
    address?: string;
    factoryid: string;
    createdBy?: any;
    createdAt?: Date;
    updatedAt?: Date;
    documents?: {
      fileName?: string;
      fileUrl?: string;
      date?: Date;
      review?: string;
    }[];
  };
}

export default function CustomerFormPage({ params }: CustomerFormProps) {
  const factoryId = params.factoryid;
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const data = params;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: "",
      gstNo: "",
      mobileNumber: undefined,
      state: "",
      address: "",
      factoryId: factoryId,
      documents: [
        {
          fileName: "",
          fileUrl: "",
          date: "",
          review: "",
        },
      ],
    },
  });

  const {
    fields: documentFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  useEffect(() => {
    form.reset({
      factoryId: factoryId,
      customerName: data?.customerName || "",
      mobileNumber: data?.mobileNumber || undefined,
      gstNo: data?.gstNo || "",
      state: data?.state || "",
      address: data?.address || "",
      documents: (data?.documents || []).map((doc: any) => ({
        fileName: doc.fileName || "",
        fileUrl: doc.fileUrl || "",
        date: doc.date || "",
        review: doc.review || "",
      })),
    });
  }, [data, factoryId, form]);

  const handleSubmit = async (values: CustomerFormValues) => {
    setIsLoading(true);
    try {
      await putData(`/accounting/customer/update/${data._id}`, {
        ...values,
        params,
      });

      toast.success("Customer Updated Successfully");
      router.push("../../");
    } catch (error) {
      toast.error("Error updating customer ");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6 mt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid space-y-6 w-full"
        >
          <div className="grid grid-flow-col gap-4">
            {/* lesseeId */}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: Salman"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* lesseeName */}
            <FormField
              control={form.control}
              name="gstNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gst Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Gst"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* mineralName */}
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Eg: 9966807866"
                      disabled={isLoading}
                      {...field}
                      min={0}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* businessLocationNames */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: Rajasthan, Andhra Pradesh"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* File Upload: documents.fileUrl */}
          <div>
            {documentFields.length > 0 && (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Document Upload</TableHead>
                    <TableHead>Document Date</TableHead>
                    <TableHead>Review / Description</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentFields.map((doc, index) => (
                    <TableRow key={doc.id}>
                      {/* File Name */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.fileName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Eg: LeaseAgreement.pdf"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* File Upload */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.fileUrl`}
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <FileUploadField
                                  name={`documents.${index}.fileUrl`}
                                  storageKey="customerDocs"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Date Picker */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.date`}
                          render={({ field }) => (
                            <FormItem>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      {field.value
                                        ? format(new Date(field.value), "PPPP")
                                        : "Pick a date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <CalendarComponent
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) =>
                                      field.onChange(date?.toISOString() || "")
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Review */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.review`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter review"
                                  className="resize-none"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          {/* Add Button + Submit */}
          <div className="flex items-center justify-center w-1/2 gap-4">
            <Button
              className="w-1/2"
              type="button"
              variant="outline"
              onClick={() =>
                append({ fileName: "", fileUrl: "", date: "", review: "" })
              }
            >
              + Add Document
            </Button>

            <Button type="submit" disabled={isLoading} className="w-1/2">
              {isLoading ? "Saving..." : "Update Customer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
