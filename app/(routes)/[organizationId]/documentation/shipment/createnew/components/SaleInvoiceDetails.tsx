
"use client";
import React, { useEffect, useState } from "react";
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
import { SaveDetailsProps } from "./BookingDetails";
import EntityCombobox from "@/components/ui/EntityCombobox";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import { Icons } from "@/components/ui/icons";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";

interface SaleInvoiceDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
}

export function SaleInvoiceDetails({ saveProgress, onSectionSubmit }: SaleInvoiceDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const invoicesFromForm = watch("saleInvoiceDetails.commercialInvoices") || [];
  const initialCount = 1;
  const [invoices, setInvoices] = useState<any[]>(
    invoicesFromForm.length > 0
      ? invoicesFromForm
      : Array.from({ length: initialCount }, () => ({
          commercialInvoiceNumber: "",
          clearanceCommercialInvoiceUrl: "",
          actualCommercialInvoiceUrl: "",
          saberInvoiceUrl: "",
        }))
  );
  const [uploading, setUploading] = useState(false);
  const [consignees, setConsignees] = useState<{ _id: string; name: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [invoiceCountToBeDeleted, setInvoiceCountToBeDeleted] = useState<number | null>(null);
  const GlobalModal = useGlobalModal();

  // Set initial form values for numberOfSalesInvoices and commercialInvoices
  useEffect(() => {
    if (!watch("saleInvoiceDetails.numberOfSalesInvoices")) {
      setValue("saleInvoiceDetails.numberOfSalesInvoices", initialCount.toString());
      setValue("saleInvoiceDetails.commercialInvoices", invoices);
      saveProgressSilently(getValues());
    }
  }, [setValue, getValues, watch, invoices]);

  // Fetch consignees on mount
  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const response = await fetch(
          "https://incodocs-server.onrender.com/shipment/consignee/getbyorg/674b0a687d4f4b21c6c980ba"
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
<<<<<<< HEAD
    setValue("saleInvoiceDetails.numberOfSalesInvoices", updatedInvoices.length.toString());
    saveProgressSilently(getValues());
=======
    saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
  };

  const handleInvoiceNumberCountChange = (value: string) => {
    const newCount = Number(value);

    if (newCount < invoices.length) {
      setShowConfirmation(true);
      setInvoiceCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "saleInvoiceDetails.commercialInvoices",
        createNewItem: () => ({
          commercialInvoiceNumber: "",
          clearanceCommercialInvoiceUrl: "",
          actualCommercialInvoiceUrl: "",
          saberInvoiceUrl: "",
<<<<<<< HEAD
        }),
        customFieldSetters: {
          "saleInvoiceDetails.commercialInvoices": (items, setValue) => {
            setValue("saleInvoiceDetails.numberOfSalesInvoices", items.length.toString());
            setInvoices(items);
          },
        },
        saveCallback: saveProgressSilently,
      });
=======
        }
      );
      setInvoices(newInvoices);
      setValue("saleInvoiceDetails.commercialInvoices", newInvoices);
      saveProgress(getValues());
    } else {
      setInvoices([]);
      setValue("saleInvoiceDetails.commercialInvoices", []);
      saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
    }
  };

  const handleConfirmChange = () => {
    if (invoiceCountToBeDeleted !== null) {
      const updatedInvoices = invoices.slice(0, invoiceCountToBeDeleted);
      setInvoices(updatedInvoices);
      setValue("saleInvoiceDetails.commercialInvoices", updatedInvoices);
      setValue("saleInvoiceDetails.numberOfSalesInvoices", updatedInvoices.length.toString());
      saveProgressSilently(getValues());
      setInvoiceCountToBeDeleted(null);
    }
    setShowConfirmation(false);
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
      const storageUrl = data.storageLink;
      setValue(fieldName, storageUrl);
      saveProgress(getValues());
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
          fetch("https://incodocs-server.onrender.com/shipment/consignee/getbyorg/674b0a687d4f4b21c6c980ba")
            .then((res) => res.json())
            .then((data) => {
              const mappedConsignees = data.map((consignee: any) => ({
                _id: consignee._id,
                name: consignee.name || consignee.consigneeName,
              }));
              setConsignees(mappedConsignees);
              saveProgress(getValues()); // Save after updating consignees
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div className="grid grid-cols-4 gap-3">
<<<<<<< HEAD
=======
      {/* Select Consignee */}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
      <FormField
        control={control}
        name="saleInvoiceDetails.consignee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Consignee</FormLabel>
            <FormControl>
              <EntityCombobox
                entities={consignees}
<<<<<<< HEAD
                value={field.value || ""}
                onChange={(value) => {
                  field.onChange(value);
                  saveProgressSilently(getValues());
=======
                value={field.value || null} // Default to null if empty
                onChange={(value) => {
                  field.onChange(value || null); // Ensure null if no selection
                  saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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
<<<<<<< HEAD
=======
      {/* Actual Buyer */}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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
<<<<<<< HEAD
                onBlur={() => saveProgressSilently(getValues())}
=======
                onBlur={() => saveProgress(getValues())}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
<<<<<<< HEAD
=======
      {/* Number of Commercial Invoices */}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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
<<<<<<< HEAD
                value={field.value || initialCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(initialCount.toString());
                    handleInvoiceNumberCountChange(initialCount.toString());
=======
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange("");
                    handleInvoiceNumberCountChange("");
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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
<<<<<<< HEAD

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

=======

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
                            onBlur={() => saveProgress(getValues())}
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
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
      <FormField
        control={control}
        name="saleInvoiceDetails.review"
        render={({ field }) => (
<<<<<<< HEAD
          <FormItem className="mt-4 col-span-4">
=======
          <FormItem className="col-span-4 mt-4">
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment for sale invoice details"
                {...field}
                onBlur={() => saveProgress(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
<<<<<<< HEAD
=======
      {/* Submit Button */}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of invoices. This action cannot be undone."
      />
    </div>
  );
}