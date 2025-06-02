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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
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
import { postData } from "@/axiosUtility/api";


const formSchema = z.object({
  shippingLineName: z
    .string()
    .min(1, { message: "Shipping Line Name is required" }),
  address: z.string().optional(),
  responsiblePerson: z.string().optional(),
  mobileNo: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && val.length >= 7), {
      message: "Enter a valid mobile number with at least 7 digits",
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Enter a valid Email",
    }),
  documents: z
    .array(
      z.object({
        fileName: z.string().optional(),
        fileUrl: z.string().optional(),
        date: z.string().datetime({ message: "Invalid date format" }).optional(),
        review: z.string().optional()
      })
    ).optional(),
  numberOfDocuments: z.number().optional(),
  organizationId: z.string().optional(),
  createdBy: z.string().optional(),
});

interface ShippinglineFormProps {
  onSuccess?: () => void;
  orgId?: string;
  currentUser?: string;
}

function ShippingLineForm({ onSuccess, orgId, currentUser }: ShippinglineFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orgid = orgId

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingLineName: "",
      address: "",
      responsiblePerson: "",
      mobileNo: "",
      email: "",
      organizationId: orgid,
      documents: [],
      createdBy: currentUser || "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // console.log(values);
    try {
      const response = await postData(
        "shipment/shippingline/create",
        {
          ...values,
          organizationId: orgid,
        }
      );
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Shipping line created successfully");
      window.location.reload();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating shipping line:", error);
      setIsLoading(false);
      toast.error("Error creating shipping line");
    }
  };

  const handleCertificateCountChange = (count: string) => {
    const numericCount = parseInt(count, 10);
    const newDocuments = Array.from({ length: numericCount }, (_, index) => ({
      fileName: "",
      fileUrl: "",
      date: "",
      review: ""
    }));
    form.setValue("documents", newDocuments);
  };


  function saveProgressSilently(data: any) {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="shippingLineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Line Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Name1" {...field} />
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
                <Input placeholder="e.g., Sanatnagar" {...field} />
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
                <Input placeholder="e.g., Ahmed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g., someone@example.com"
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
              {/* <TableHead colSpan={5} className="text-center text-lg font-semibold">
                Upload Documents
              </TableHead> */}
            </TableRow>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>File URL</TableHead>
              {/* <TableHead>Uploaded By</TableHead> */}
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
                {/* <TableCell>
                  <FormField
                    control={form.control}
                    name={`documents.${index}.uploadedBy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="e.g., Ahmed"
                            value={currentUser || ""}
                            onChange={field.onChange}
                            onBlur={() => {
                              field.onBlur();
                              saveProgressSilently(form.getValues());
                            }}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </TableCell> */}
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
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date: any) => {
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

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default ShippingLineForm;
