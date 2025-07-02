"use client";
import React, { useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";
import { postData } from "@/axiosUtility/api";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

const formSchema = z.object({
  supplierName: z.string().min(1, { message: "Supplier Name is required" }),
  gstNo: z.string().optional(),
  address: z.string().optional(),
  responsiblePerson: z.string().optional(),
  mobileNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{7,}$/.test(val), {
      message: "Enter a valid mobile number with at least 7 digits",
    }),
  numberOfDocuments: z.number().optional(),
  documents: z.array(
    z.object({
      fileName: z.string().optional(),
      fileUrl: z.string().optional(),
      uploadedBy: z.string().optional(),
      date: z.string().datetime({ message: "Invalid date format" }).optional(),
      review: z.string().optional(),
    })
  ),
  state: z.string().optional(),
  factoryAddress: z.string().optional(),
  organizationId: z.string().optional(),
  createdBy: z.string().optional(),
});

interface SupplierFormProps {
  onSuccess?: () => void;
  orgId?: string;
  currentUser?: string;
}

export default function Supplierform({
  onSuccess,
  orgId,
  currentUser,
}: SupplierFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orgid = orgId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierName: "",
      gstNo: "",
      address: "",
      responsiblePerson: "",
      mobileNumber: "",
      state: "",
      factoryAddress: "",
      organizationId: orgid,
      documents: [],
      createdBy: currentUser || "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await postData("shipment/supplier/create", {
        ...values,
        organizationId: orgid,
      });
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Supplier created successfully");
      window.location.reload();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating Supplier:", error);
      setIsLoading(false);
      toast.error("Error creating Supplier");
    }
  };

  function saveProgressSilently(data: any) {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  }

  const handleCertificateCountChange = (count: string) => {
    const numericCount = parseInt(count, 10);
    const newDocuments = Array.from({ length: numericCount }, (_, index) => ({
      fileName: "",
      fileUrl: "",
      date: "",
      review: "",
    }));
    form.setValue("documents", newDocuments);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ahmed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gstNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., hsdfjkghog89r" {...field} />
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
                    <Input placeholder="e.g., hyd" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsiblePerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsible Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., khaja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="e.g., 89734"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., telangana" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factoryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Factory Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., mehdipatnam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfDocuments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Documents</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of documents"
                      value={(field.value as any) || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          field.onChange(1);
                          handleCertificateCountChange("1");
                          return;
                        }
                        const numericValue = Number(value);
                        field.onChange(numericValue);
                        handleCertificateCountChange(numericValue.toString());
                      }}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>File URL</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.watch("documents")?.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`documents.${index}.fileName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g., coo"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={() => {
                                  field.onBlur();
                                  saveProgressSilently(form.getValues());
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        name={`documents.${index}.fileUrl`}
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <FileUploadField
                                name={`documents.${index}.fileUrl`}
                                storageKey="documents_fileUrl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        control={form.control}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`documents.${index}.date`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline" className="w-full">
                                    {field.value
                                      ? format(
                                          new Date(field.value as any),
                                          "PPPP"
                                        )
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
                                      ? new Date(field.value as any)
                                      : undefined
                                  }
                                  onSelect={(date: Date | undefined) => {
                                    field.onChange(date?.toISOString());
                                    saveProgressSilently(form.getValues());
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`documents.${index}.review`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="review your docs"
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={() => {
                                  field.onBlur();
                                  saveProgressSilently(form.getValues());
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
