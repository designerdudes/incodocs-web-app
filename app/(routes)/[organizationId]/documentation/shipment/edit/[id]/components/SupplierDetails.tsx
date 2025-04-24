
"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash, UploadCloud } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import SupplierForm from "@/components/forms/Addsupplierform";
import { useGlobalModal } from "@/hooks/GlobalModal";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { Icons } from "@/components/ui/icons";

interface SupplierDetailsProps {
  shipmentId: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
}

export function SupplierDetails({
  shipmentId,
  saveProgress,
  onSectionSubmit,
}: SupplierDetailsProps) {
  const { control, setValue, watch } = useFormContext();
  const [supplierNames, setSupplierNames] = useState<
    { _id: string; name: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();

  // Watch form values
  const formValues = watch("supplierDetails") || {};

  // Manage invoices with useFieldArray
  const {
    fields: invoiceFields,
    append: appendInvoice,
    remove: removeInvoice,
  } = useFieldArray({
    control,
    name: "supplierDetails.clearance.invoices",
  });

  // Fetch supplier names
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierResponse = await fetch(
          "https://incodocs-server.onrender.com/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const supplierData = await supplierResponse.json();
        setSupplierNames(
          Array.isArray(supplierData)
            ? supplierData.map((supplier: any) => ({
                _id: supplier._id,
                name: supplier.supplierName,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        toast.error("Failed to load suppliers");
      }
    };
    fetchData();
  }, []);

  // Autosave form data when supplierDetails changes
  useEffect(() => {
    if (formValues) {
      saveProgress({ supplierDetails: formValues });
    }
  }, [formValues, saveProgress]);

  // Handle File Upload
  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipmentdocsfile/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("File upload failed");
      const data = await response.json();
      setValue(fieldName, data.storageLink, { shouldDirty: true });
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const openSupplierForm = () => {
    GlobalModal.title = "Add New Supplier";
    GlobalModal.children = (
      <SupplierForm
        onSuccess={() => {
          fetch(
            "https://incodocs-server.onrender.com/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba"
          )
            .then((res) => res.json())
            .then((data) => {
              setSupplierNames(
                Array.isArray(data)
                  ? data.map((supplier: any) => ({
                      _id: supplier._id,
                      name: supplier.supplierName,
                    }))
                  : []
              );
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  // Handle section submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSectionSubmit();
    } catch (error) {
      console.error("Error submitting Supplier Details:", error);
      toast.error("Failed to submit Supplier Details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Clearance Supplier Name */}
      <FormField
        control={control}
        name="supplierDetails.clearance.supplierName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Supplier Name</FormLabel>
            <FormControl>
              <EntityCombobox
                entities={supplierNames}
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
                displayProperty="name"
                placeholder="Select a Supplier Name"
                onAddNew={openSupplierForm}
                addNewLabel="Add New Supplier"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Number of Invoices */}
      <FormField
        control={control}
        name="supplierDetails.clearance.noOfInvoices"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Supplier Invoices</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of invoices"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (isNaN(value) || value < 0) return;
                  field.onChange(value);
                  if (value > invoiceFields.length) {
                    appendInvoice(
                      Array(value - invoiceFields.length).fill({
                        supplierGSTN: "",
                        supplierInvoiceNumber: "",
                        supplierInvoiceDate: undefined,
                        supplierInvoiceValueWithGST: undefined,
                        supplierInvoiceValueWithOutGST: undefined,
                        clearanceSupplierInvoiceUrl: "",
                      })
                    );
                  } else if (value < invoiceFields.length) {
                    for (let i = invoiceFields.length - 1; i >= value; i--) {
                      removeInvoice(i);
                    }
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Invoices Table */}
      {invoiceFields.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Supplier GSTN</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Value With GST</TableHead>
                <TableHead>Value Without GST</TableHead>
                <TableHead>Upload Invoice</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceFields.map((invoice, index) => (
                <TableRow key={invoice.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`supplierDetails.clearance.invoices.${index}.supplierGSTN`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="eg. 27AABCU9603R1ZM"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="eg. INV123"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value &&
                                  !isNaN(new Date(field.value).getTime())
                                    ? format(new Date(field.value), "PPPP")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  field.value &&
                                  !isNaN(new Date(field.value).getTime())
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(date?.toISOString())
                                }
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
                      name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceValueWithGST`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="eg. 5000"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceValueWithOutGST`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="eg. 4500"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`supplierDetails.clearance.invoices.${index}.clearanceSupplierInvoiceUrl`}
                      render={({ field }) => (
                        <FormControl>
                          <div className="flex items-center gap-2">
                            {field.value ? (
                              <div className="flex flex-col gap-2">
                                <a
                                  href={field.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  Uploaded File
                                </a>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setValue(
                                      `supplierDetails.clearance.invoices.${index}.clearanceSupplierInvoiceUrl`,
                                      "",
                                      { shouldDirty: true }
                                    )
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Input
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleFileUpload(
                                        file,
                                        `supplierDetails.clearance.invoices.${index}.clearanceSupplierInvoiceUrl`
                                      );
                                    }
                                  }}
                                  disabled={uploading}
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="text-white bg-blue-500 hover:bg-blue-600"
                                  disabled={uploading}
                                >
                                  <UploadCloud className="w-5 h-5 mr-2" />
                                  {uploading ? "Uploading..." : "Upload"}
                                </Button>
                              </>
                            )}
                          </div>
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => removeInvoice(index)}
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

      <Separator className="my-4 col-span-4" />

      {/* Actual Supplier Details */}
      <FormField
        control={control}
        name="supplierDetails.actual.actualSupplierName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actual Supplier Name</FormLabel>
            <FormControl>
              <Input
                placeholder="eg. Actual Supplier Inc."
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supplierDetails.actual.actualSupplierInvoiceValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actual Supplier Invoice Value</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="eg. 6000"
                {...field}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supplierDetails.actual.actualSupplierInvoiceUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Actual Supplier Invoice</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                {field.value ? (
                  <div className="flex flex-col gap-2">
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Uploaded File
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setValue(
                          "supplierDetails.actual.actualSupplierInvoiceUrl",
                          "",
                          { shouldDirty: true }
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(
                            file,
                            "supplierDetails.actual.actualSupplierInvoiceUrl"
                          );
                        }
                      }}
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                      disabled={uploading}
                    >
                      <UploadCloud className="w-5 h-5 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                  </>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supplierDetails.actual.shippingBillUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shipping Bill URL</FormLabel>
            <FormControl>
              <Input
                placeholder="eg. http://example.com/shipping-bill.pdf"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Review */}
      <FormField
        control={control}
        name="supplierDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Submit Button */}
      <div className="col-span-4 flex justify-end mt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-8"
        >
          Save and Next
          {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
