"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm, useFormContext } from "react-hook-form";
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
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { FileUploadField } from "../../../shipment/createnew/components/FileUploadField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Path } from "react-hook-form";
import { postData } from "@/axiosUtility/api";
import CalendarComponent from "@/components/CalendarComponent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
// ✅ Schema - Only forwarderName is required

interface ForwarderForm {
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  date: string | null;
  review: string;
}

interface FormData {
  forwarderdetails: number;
  forwarderForm: ForwarderForm[];
}


const formSchema = z.object({
  forwarderName: z.string().min(1, { message: "Forwarder Name is required" }),
  address: z.string().optional(),
  responsiblePerson: z.string().optional(),
  mobileNo: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{7,}$/.test(val),
      { message: "Mobile number must be at least 7 digits" }
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Enter a valid email" }
    ),
    numberOfDocuments: z
        .number(),
    documents: z
        .array(
          z.object({
            fileName: z.string().optional(),
            fileUrl: z.string().optional(),
            uploadedBy: z.string().optional(),
            date: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            review: z.string().optional()
          })
        ),

  organizationId: z.string().optional(),
  upload: z.array(z.string()).optional(),
});

interface ForwarderFormProps {
  onSuccess?: () => void;
}

function Forwarderform({ onSuccess }: ForwarderFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orgid = useParams().organizationId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      forwarderName: "",
      address: "",
      responsiblePerson: "",
      mobileNo: "",
      email: "",
      organizationId: "",
      upload:[]

    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await postData(
        "/shipment/forwarder/create",
        {
          ...values,
        }
      );
      if (!response.ok) throw new Error("Failed to create Forwarder");

      await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Forwarder created successfully");
      window.location.reload();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating Forwarder:", error);
      setIsLoading(false);
      toast.error("Error creating Forwarder");
    }
  };

  const handleCertificateCountChange = (count: string) => {
    const numericCount = parseInt(count, 10);
    const newDocuments = Array.from({ length: numericCount }, (_, index) => ({
      fileName: "",
      fileUrl: "",
      uploadedBy: "",
      date: "",
      review: ""
    }));
    form.setValue("documents", newDocuments);
  };

  const { control, setValue, watch, getValues } = form;
const forwarderDetailsFromForm = watch("documents") || [];

const getFieldName = <T extends FormData>(
  index: number,
  field: keyof ForwarderForm
): Path<T> => `documents[${index}].${field}` as Path<T>;


function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Forwarder Name (Required) */}
        <FormField
          control={form.control}
          name="forwarderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forwarder Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Name1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Address (Optional) */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Sanatnagar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Responsible Person (Optional) */}
        <FormField
          control={form.control}
          name="responsiblePerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsible Person</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Ahmed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Mobile Number (Optional) */}
        <FormField
          control={form.control}
          name="mobileNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="e.g., 7545345"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email (Optional) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g., unknownname@123.com"
                  {...field}
                />
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
                value={field.value as any || ""}
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
      <TableHead colSpan={5} className="text-center text-lg font-semibold">
        Upload Documents
      </TableHead>
    </TableRow>
    <TableRow>
      <TableHead>#</TableHead>
      <TableHead>File Name</TableHead>
      <TableHead>File URL</TableHead>
      <TableHead>Uploaded By</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Review</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {forwarderDetailsFromForm.map((_, index: number) => (
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>

        <TableCell>
          <FormField
            control={control}
            name={getFieldName<FormData>(index, "fileName")}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., coo"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(getValues());
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
            control={control}
            name={getFieldName<FormData>(index, "fileUrl")}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., https://example.com/file.pdf"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(getValues());
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
            control={control}
            name={getFieldName<FormData>(index, "uploadedBy")}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., Ahmed"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(getValues());
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
                      control={control}
                      name={getFieldName<FormData>(index, "date")}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className="w-full">
                                  {field.value
                                    ? format(new Date(field.value as any), "PPPP")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                selected={field.value ? new Date(field.value as any) : undefined}
                                onSelect={(date: Date | undefined) => {
                                  field.onChange(date?.toISOString());
                                  saveProgressSilently(getValues());
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
            control={control}
            name={getFieldName<FormData>(index, "review")}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="review your docs"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(getValues());
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



 
        {/* Submit */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default Forwarderform;
