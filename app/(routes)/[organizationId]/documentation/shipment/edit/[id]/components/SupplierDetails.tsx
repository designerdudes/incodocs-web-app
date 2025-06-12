"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
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
import { CalendarIcon, Eye, Trash, UploadCloud } from "lucide-react";
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
import CalendarComponent from "@/components/CalendarComponent";
import { fetchData } from "@/axiosUtility/api"; // Import fetchData
import { FileUploadField } from "../../../createnew/components/FileUploadField";

interface SupplierDetailsProps {
  shipmentId: string;
  orgId?: string;
  currentUser: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
}

interface Invoice {
  supplierInvoiceNumber: string;
  supplierInvoiceDate?: string;
  supplierInvoiceValueWithGST?: number;
  supplierInvoiceValueWithOutGST?: number;
  clearanceSupplierInvoiceUrl: string;
  _id?: string;
}

export function SupplierDetails({
  shipmentId,
  orgId,
  currentUser,
  saveProgress,
  onSectionSubmit,
}: SupplierDetailsProps) {
  const { control, setValue, watch, getValues, trigger } = useFormContext();
  const [supplierNames, setSupplierNames] = useState<
    { _id: string; name: string }[]
  >([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();

  // Watch form values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formValues = watch("supplierDetails") || {};

  // Manage suppliers with useFieldArray
  const {
    fields: supplierFields,
    append: appendSupplier,
    remove: removeSupplier,
  } = useFieldArray({
    control,
    name: "supplierDetails.clearance.suppliers",
  });

  // Fetch supplier names
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoadingSuppliers(true);
        setFetchError(null);
        const orgIdToUse = orgId;
        const supplierData = await fetchData(
          `/shipment/supplier/getbyorg/${orgIdToUse}`
        );
        const suppliers = Array.isArray(supplierData)
          ? supplierData.map((supplier: any) => ({
              _id: supplier._id,
              name: supplier.supplierName,
            }))
          : [];

        setSupplierNames(suppliers);
      } catch (error: any) {
        console.error("Error fetching supplier data:", error);
        setSupplierNames([]);
      } finally {
        setIsLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, [orgId]);

  // Autosave form data when supplierDetails changes
  useEffect(() => {
    if (formValues) {
      saveProgress({ supplierDetails: formValues });
      console.log("Form values saved:", JSON.stringify(formValues, null, 2));
    }
  }, [formValues, saveProgress]);

  // Log form state for debugging
  useEffect(() => {
    console.log(
      "Current supplier fields:",
      JSON.stringify(supplierFields, null, 2)
    );
    console.log(
      "Current form values:",
      JSON.stringify(watch("supplierDetails"), null, 2)
    );
  }, [supplierFields, watch]);

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
        currentUser={currentUser}
        orgId={orgId}
        onSuccess={async () => {
          try {
            const orgIdToUse = orgId || "674b0a687d4f4b21c6c980ba";
            const data = await fetchData(
              `/shipment/supplier/getbyorg/${orgIdToUse}`
            );
            const suppliers = Array.isArray(data)
              ? data.map((supplier: any) => ({
                  _id: supplier._id,
                  name: supplier.supplierName,
                }))
              : [];
            setSupplierNames(suppliers);
            console.log(
              "Updated supplier names after adding new:",
              JSON.stringify(suppliers, null, 2)
            );
            GlobalModal.onClose();
          } catch (error) {
            console.error("Error refreshing suppliers:", error);
            toast.error("Failed to refresh suppliers");
          }
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

  // Updated saveProgressSilently to match previous components
  function saveProgressSilently(data: FieldValues): void {
    try {
      localStorage.setItem("shipmentFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
      saveProgress({ supplierDetails: getValues().supplierDetails });
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Number of Suppliers */}
      <FormField
        control={control}
        name="supplierDetails.clearance.noOfSuppliers"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Number of Suppliers</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of suppliers"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (isNaN(value) || value < 0) return;
                  field.onChange(value);
                  if (value > supplierFields.length) {
                    appendSupplier(
                      Array(value - supplierFields.length).fill({
                        supplierName: { _id: "", supplierName: "" },
                        noOfInvoices: 0,
                        invoices: [],
                        _id: "",
                      })
                    );
                  } else if (value < supplierFields.length) {
                    for (let i = supplierFields.length - 1; i >= value; i--) {
                      removeSupplier(i);
                    }
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Render fields for each supplier */}
      {supplierFields.map((supplier, supplierIndex) => (
        <React.Fragment key={supplier.id}>
          <div className="col-span-4">
            <h3 className="text-lg font-semibold mb-2">
              Supplier {supplierIndex + 1}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {/* Supplier Name */}
              <FormField
                control={control}
                name={`supplierDetails.clearance.suppliers.${supplierIndex}.supplierName`}
                render={({ field }) => {
                  const selectedSupplier = supplierNames.find(
                    (s) => s._id === field.value?._id
                  );
                  console.log(
                    `Supplier ${supplierIndex + 1} - Field value:`,
                    JSON.stringify(field.value, null, 2),
                    "Selected supplier name:",
                    selectedSupplier?.name,
                    "Available suppliers:",
                    JSON.stringify(supplierNames, null, 2)
                  );
                  console.log(
                    "Passing entities to EntityCombobox:",
                    JSON.stringify(supplierNames, null, 2)
                  );
                  return (
                    <FormItem>
                      <FormLabel>Select Supplier</FormLabel>
                      <FormControl>
                        {fetchError ? (
                          <p className="text-sm text-red-500">
                            Error loading suppliers: {fetchError}
                          </p>
                        ) : (
                          <EntityCombobox
                            entities={supplierNames}
                            value={field.value?._id || ""}
                            onChange={(value) => {
                              const selected = supplierNames.find(
                                (s) => s._id === value
                              );
                              console.log(
                                `Supplier ${supplierIndex + 1} selected:`,
                                value,
                                "Selected supplier object:",
                                JSON.stringify(selected, null, 2)
                              );
                              field.onChange(
                                selected
                                  ? {
                                      _id: selected._id,
                                      supplierName: selected.name,
                                    }
                                  : { _id: "", supplierName: "" }
                              );
                              trigger(
                                `supplierDetails.clearance.suppliers.${supplierIndex}.supplierName`
                              );
                              console.log(
                                "Form state after selection:",
                                JSON.stringify(
                                  watch(
                                    `supplierDetails.clearance.suppliers.${supplierIndex}`
                                  ),
                                  null,
                                  2
                                )
                              );
                            }}
                            displayProperty="name"
                            placeholder="Select a Supplier"
                            onAddNew={openSupplierForm}
                            addNewLabel="Add New Supplier"
                            disabled={isLoadingSuppliers || !!fetchError}
                          />
                        )}
                      </FormControl>
                      {field.value?._id &&
                        !selectedSupplier &&
                        !isLoadingSuppliers}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Number of Invoices */}
              <FormField
                control={control}
                name={`supplierDetails.clearance.suppliers.${supplierIndex}.noOfInvoices`}
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
                          const invoices =
                            watch(
                              `supplierDetails.clearance.suppliers.${supplierIndex}.invoices`
                            ) || [];
                          if (value > invoices.length) {
                            setValue(
                              `supplierDetails.clearance.suppliers.${supplierIndex}.invoices`,
                              [
                                ...invoices,
                                ...Array(value - invoices.length).fill({
                                  supplierInvoiceNumber: "",
                                  supplierInvoiceDate: undefined,
                                  supplierInvoiceValueWithGST: undefined,
                                  supplierInvoiceValueWithOutGST: undefined,
                                  clearanceSupplierInvoiceUrl: "",
                                  _id: "",
                                }),
                              ],
                              { shouldDirty: true }
                            );
                          } else if (value < invoices.length) {
                            setValue(
                              `supplierDetails.clearance.suppliers.${supplierIndex}.invoices`,
                              invoices.slice(0, value),
                              { shouldDirty: true }
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Invoices Table */}
              {watch(
                `supplierDetails.clearance.suppliers.${supplierIndex}.invoices`
              )?.length > 0 && (
                <div className="col-span-4 overflow-x-auto mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Invoice Date</TableHead>
                        <TableHead>Value With GST</TableHead>
                        <TableHead>Value Without GST</TableHead>
                        <TableHead>Upload Invoice</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {watch(
                        `supplierDetails.clearance.suppliers.${supplierIndex}.invoices`
                      )?.map((invoice: Invoice, invoiceIndex: number) => (
                        <TableRow key={invoice._id || invoiceIndex}>
                          <TableCell>{invoiceIndex + 1}</TableCell>
                          <TableCell>
                            <FormField
                              control={control}
                              name={`supplierDetails.clearance.suppliers.${supplierIndex}.invoices.${invoiceIndex}.supplierInvoiceNumber`}
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
                              name={`supplierDetails.clearance.suppliers.${supplierIndex}.invoices.${invoiceIndex}.supplierInvoiceDate`}
                              render={({ field }) => (
                                <FormItem>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button variant="outline">
                                          {field.value &&
                                          !isNaN(
                                            new Date(field.value).getTime()
                                          )
                                            ? format(
                                                new Date(field.value),
                                                "PPPP"
                                              )
                                            : "Pick a date"}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align="start">
                                      <CalendarComponent
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : undefined
                                        }
                                        onSelect={(date: any) => {
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
                              name={`supplierDetails.clearance.suppliers.${supplierIndex}.invoices.${invoiceIndex}.supplierInvoiceValueWithGST`}
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="eg. 5000"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined
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
                              name={`supplierDetails.clearance.suppliers.${supplierIndex}.invoices.${invoiceIndex}.supplierInvoiceValueWithOutGST`}
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="eg. 4500"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined
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
                              name={`supplierDetails.clearance.suppliers.${supplierIndex}.invoices.${invoiceIndex}.clearanceSupplierInvoiceUrl`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <FileUploadField
                                      name={`supplierDetails.clearance.suppliers.${supplierIndex}.invoices.${invoiceIndex}.clearanceSupplierInvoiceUrl`}
                                      storageKey={`supplierDetails.clearance.suppliers.${supplierIndex}.invoices.${invoiceIndex}.clearanceSupplierInvoiceUrl`}
                                    />
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
                              onClick={() => {
                                const invoices = watch(
                                  `supplierDetails.clearance.suppliers.${supplierIndex}.invoices`
                                );
                                setValue(
                                  `supplierDetails.clearance.suppliers.${supplierIndex}.invoices`,
                                  invoices.filter(
                                    (_: Invoice, i: number) =>
                                      i !== invoiceIndex
                                  ),
                                  { shouldDirty: true }
                                );
                                const noOfInvoices = invoices.length - 1;
                                setValue(
                                  `supplierDetails.clearance.suppliers.${supplierIndex}.noOfInvoices`,
                                  noOfInvoices >= 0 ? noOfInvoices : 0,
                                  { shouldDirty: true }
                                );
                              }}
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

              {/* Remove Supplier Button */}
              <div className="col-span-4 flex justify-end mt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={() => {
                    removeSupplier(supplierIndex);
                    const noOfSuppliers = supplierFields.length - 1;
                    setValue(
                      "supplierDetails.clearance.noOfSuppliers",
                      noOfSuppliers >= 0 ? noOfSuppliers : 0,
                      { shouldDirty: true }
                    );
                  }}
                >
                  Remove Supplier
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-4 col-span-4" />
        </React.Fragment>
      ))}

      {/* Actual Supplier Details */}
      <FormField
        control={control}
        name="supplierDetails.actual.actualSupplierName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actual Supplier</FormLabel>
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
              <FileUploadField
                name="supplierDetails.actual.actualSupplierInvoiceUrl"
                storageKey="supplierDetails.actual.actualSupplierInvoiceUrl"
              />
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
              <FileUploadField
                name="supplierDetails.actual.shippingBillUrl"
                storageKey="supplierDetails_shippingBillUrl"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Remarks */}
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
          disabled={isLoading || uploading}
        >
          {isLoading ? (
            <>
              Saving...
              <Icons.spinner className="ml-2 w-4 animate-spin" />
            </>
          ) : (
            "Save Supplier Details"
          )}
        </Button>
      </div>
    </div>
  );
}
