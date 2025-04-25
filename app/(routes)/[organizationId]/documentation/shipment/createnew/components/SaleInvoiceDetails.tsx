"use client";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useGlobalModal } from "@/hooks/GlobalModal";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash, UploadCloud } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { SaveDetailsProps } from "./BookingDetails";
import EntityCombobox from "@/components/ui/EntityCombobox";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import { Icons } from "@/components/ui/icons";

interface SaleInvoiceDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
  params: string | string[];
}


function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function SaleInvoiceDetails({ saveProgress, onSectionSubmit, params }: SaleInvoiceDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const organizationId = Array.isArray(params) ? params[0] : params;
  const invoicesFromForm = watch("saleInvoiceDetails.commercialInvoices") || [];
  const [invoices, setInvoices] = useState<any[]>(invoicesFromForm);
  const [uploading, setUploading] = useState(false);
  const [consignees, setConsignees] = useState<{ _id: string; name: string }[]>([]);
  const GlobalModal = useGlobalModal();

  // Fetch consignees on mount
  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const response = await fetch(
          `https://incodocs-server.onrender.com/shipment/consignee/getbyorg/${organizationId}`
        );
        const data = await response.json();
        const mappedConsignees = data.map((consignee: any) => ({
          _id: consignee._id,
          name: consignee.name || consignee.consigneeName,
        }));
        setConsignees(mappedConsignees);
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
      const response = await fetch("https://incodocs-server.onrender.com/shipmentdocsfile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const storageUrl = data.url;
      setValue(fieldName, storageUrl);
      saveProgressSilently(getValues());
    } catch (error) {
      alert("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const openConsigneeForm = () => {
    GlobalModal.title = "Add New Consignee";
    GlobalModal.children = (
      <AddConsigneeForm
        onSuccess={() => {
          fetch(`https://incodocs-server.onrender.com/shipment/consignee/getbyorg/${organizationId}`)
            .then((res) => res.json())
            .then((data) => {
              const mappedConsignees = data.map((consignee: any) => ({
                _id: consignee._id,
                name: consignee.name || consignee.consigneeName,
              }));
              setConsignees(mappedConsignees);
              saveProgressSilently(getValues()); // Save after updating consignees
            });
        }}
      />
    );
    GlobalModal.onOpen();
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
              <EntityCombobox
                entities={consignees}
                value={field.value || ""}
                onChange={(value) => {
                  field.onChange(value);
                  saveProgressSilently(getValues());
                }}
                displayProperty="name"
                placeholder="Select a Consignee"
                onAddNew={openConsigneeForm}
                addNewLabel="Add New Consignee"
              />
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
                placeholder="e.g., Khan"
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
        name="saleInvoiceDetails.numberOfSalesInvoices"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Commercial Invoices</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of invoices"
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
                            placeholder="e.g., 3458H4"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                            required // Enforce required field
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
                                accept=".pdf,.jpg,.png,.jpeg"
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
                                accept=".pdf,.jpg,.png,.jpeg"
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
                                accept=".pdf,.jpg,.png,.jpeg"
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
          <FormItem className="col-span-4 mt-4">
            <FormLabel>Remarks</FormLabel>
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
      {/* Submit Button */}
      <div className="flex justify-end mt-4 col-span-4">
        <Button
          type="button"
          onClick={onSectionSubmit}
          className="h-8"
          disabled={uploading}
        >
          Submit
          {uploading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}