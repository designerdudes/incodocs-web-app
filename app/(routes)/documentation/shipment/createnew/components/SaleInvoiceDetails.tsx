"use client";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddConsigneeButton from "./AddConsigneebutton";
import { SaveDetailsProps } from "./BookingDetails";

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function SaleInvoiceDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const invoicesFromForm = watch("saleInvoiceDetails.commercialInvoices") || [];
  const [invoices, setInvoices] = useState<any[]>(invoicesFromForm);
  const [uploading, setUploading] = useState(false);
  const [consignees, setConsignees] = useState<any[]>([]);

  // Fetch consignees on mount
  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const response = await fetch(
          "http://localhost:4080/shipment/consignee/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const data = await response.json();
        setConsignees(data);
      } catch (error) {
        console.error("Error fetching consignees:", error);
      }
    };
    fetchConsignees();
  }, []);

  const handleDelete = (index: number) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    setValue("saleInvoiceDetails.commercialInvoices", updatedInvoices);
    saveProgressSilently(getValues());
  };

  const handleInvoiceNumberCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const currentInvoices = watch("saleInvoiceDetails.commercialInvoices") || [];
      const newInvoices = Array.from({ length: count }, (_, i) =>
        currentInvoices[i] || {
          commercialInvoiceNumber: "",
          clearanceCommercialInvoiceUrl: "",
          actualCommercialInvoiceUrl: "",
          saberInvoiceUrl: "",
        }
      );
      setInvoices(newInvoices);
      setValue("saleInvoiceDetails.commercialInvoices", newInvoices);
      saveProgressSilently(getValues());
    } else {
      setInvoices([]);
      setValue("saleInvoiceDetails.commercialInvoices", []);
      saveProgressSilently(getValues());
    }
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:4080/shipmentdocsfile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const storageUrl = data.storageLink; // Adjust based on actual API response key
      setValue(fieldName, storageUrl);
      saveProgressSilently(getValues());
    } catch (error) {
      alert("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      
      {/* Select Consignee */}
      <FormField
        control={control}
        name="saleInvoiceDetails.consignee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Consignee</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  saveProgressSilently(getValues());
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Consignee" />
                </SelectTrigger>
                <SelectContent>
                  {consignees.map((details: any) => (
                    <SelectItem key={details._id} value={details._id}>
                      {details.name || details.consigneeName} {/* Adjust based on API response */}
                    </SelectItem>
                  ))}
                  <div>
                    <AddConsigneeButton />



                    
                  </div>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Actual Buyer */}
      <FormField
        control={control}
        name="saleInvoiceDetails.actualBuyer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actual Buyer</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., khan"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Number of Commercial Invoices */}
      <FormField
        control={control}
        name="NumberOfSalesInvoices"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Commercial Invoices</FormLabel>
            <FormControl>
              {/* <Input
                type="number"
                placeholder="Enter number of Commercial Invoices"
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (isNaN(value) || value < 0) return;
                  field.onChange(value);
                  handleInvoiceNumberCountChange(e.target.value);
                }}
              /> */}

<Input
  type="number"
  placeholder="Enter number of Commercial Invoices"
  value={field.value === 0 ? "" : field.value}
  onChange={(e) => {
    const value = e.target.value;

    if (value === "") {
      field.onChange(""); 
      handleInvoiceNumberCountChange("");
      return;
    }

    const numericValue = Math.max(0, Number(value));
    field.onChange(numericValue.toString());
    handleInvoiceNumberCountChange(numericValue.toString());
  }}
/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {invoices.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Commercial Invoice Number</TableHead>
                <TableHead>Clearance Commercial Invoice</TableHead>
                <TableHead>Actual Commercial Invoice</TableHead>
                <TableHead>SABER Invoice</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((_: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.commercialInvoices[${index}].commercialInvoiceNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="e.g., 3458h4"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.commercialInvoices[${index}].clearanceCommercialInvoiceUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file)
                                    handleFileUpload(
                                      file,
                                      `saleInvoiceDetails.commercialInvoices[${index}].clearanceCommercialInvoiceUrl`
                                    );
                                }}
                                disabled={uploading}
                              />
                              <Button
                                variant="secondary"
                                className="bg-blue-500 text-white"
                                disabled={uploading}
                              >
                                <UploadCloud className="w-5 h-5 mr-2" />
                                {uploading ? "Uploading..." : "Upload"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.commercialInvoices[${index}].actualCommercialInvoiceUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file)
                                    handleFileUpload(
                                      file,
                                      `saleInvoiceDetails.commercialInvoices[${index}].actualCommercialInvoiceUrl`
                                    );
                                }}
                                disabled={uploading}
                              />
                              <Button
                                variant="secondary"
                                className="bg-blue-500 text-white"
                                disabled={uploading}
                              >
                                <UploadCloud className="w-5 h-5 mr-2" />
                                {uploading ? "Uploading..." : "Upload"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.commercialInvoices[${index}].saberInvoiceUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file)
                                    handleFileUpload(
                                      file,
                                      `saleInvoiceDetails.commercialInvoices[${index}].saberInvoiceUrl`
                                    );
                                }}
                                disabled={uploading}
                              />
                              <Button
                                variant="secondary"
                                className="bg-blue-500 text-white"
                                disabled={uploading}
                              >
                                <UploadCloud className="w-5 h-5 mr-2" />
                                {uploading ? "Uploading..." : "Upload"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Review Field */}
      <FormField
        control={control}
        name="saleInvoiceDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4 mb-4">
            <FormLabel>Review</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment for sale invoice details"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-8">
        <Button type="button" onClick={() => saveProgress(getValues())}>
          Save Progress
        </Button>
      </div>
    </div>
  );
}