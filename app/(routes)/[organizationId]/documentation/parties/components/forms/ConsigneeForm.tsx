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
import CalendarComponent from "@/components/CalendarComponent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Enter a valid email",
    }),
  mobileNo: z
    .union([z.string(), z.number()])
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const strVal = val.toString();
        return strVal.length >= 10 && /^\d+$/.test(strVal);
      },
      {
        message:
          "Mobile number must be at least 10 digits and contain only numbers",
      }
    ),
  address: z.string().optional(),
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
numberOfDocuments:z.number(),
  organizationId: z.string().optional(),
  upload: z.any().optional(),
});

interface AddConsigneeFormProps {
  onSuccess?: () => void;
}

export default function ConsigneeForm({ onSuccess }: AddConsigneeFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orgid = useParams().organizationId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobileNo: "",
      address: "",
      organizationId: "",
    },
  });

  const GlobalModal = useGlobalModal();

  
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


function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}


  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        mobileNo: values.mobileNo,
        address: values.address,
        organizationId: orgid,
      };
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipment/consignee/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to create consignee");
      await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Consignee created successfully");
      window.location.reload();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating consignee:", error);
      setIsLoading(false);
      toast.error("Failed to create consignee");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Consignee Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consignee Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Consignee Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consignee Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., abc123@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Consignee Number */}
        <FormField
          control={form.control}
          name="mobileNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consignee Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1234567890" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Consignee Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 343 Main Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="upload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload your documents</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
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
            control={form.control}
            name={`documents.${index}.fileUrl`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., https://example.com/file.pdf"
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
            control={form.control}
            name={`documents.${index}.uploadedBy`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., Ahmed"
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
                      control={form.control}
                      name={`documents.${index}.date`}
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

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
