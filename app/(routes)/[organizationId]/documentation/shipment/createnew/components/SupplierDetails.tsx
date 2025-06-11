"use client";
import { useState, useEffect } from "react";
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
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import Addsupplierform from "@/components/forms/Addsupplierform";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import toast from "react-hot-toast";
import { FileUploadField } from "./FileUploadField";
import { Path } from "react-hook-form";

interface Invoice {
  supplierInvoiceNumber: string;
  supplierInvoiceDate: string;
  supplierInvoiceValueWithGST: number;
  supplierInvoiceValueWithOutGST: number;
  clearanceSupplierInvoiceUrl: string;
}

interface Supplier {
  supplierName?: string;
  noOfInvoices: number;
  invoices: Invoice[];
}

interface FormData {
  supplierDetails: {
    clearance: {
      noOfSuppliers: number;
      suppliers: Supplier[];
    };
    actual: {
      actualSupplierName: string;
      actualSupplierInvoiceUrl: string;
      actualSupplierInvoiceValue: number;
      shippingBillUrl: string;
    };
    review: string;
  };
}
import CalendarComponent from "@/components/CalendarComponent";
import { fetchData } from "@/axiosUtility/api";

interface SupplierDetailsProps {
  saveProgress: (data: any) => void;
  onSectionSubmit: () => void;
  params: string | string[];
  currentUser?: string;
}

function saveProgressSilently(data: any) {
  try {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
}

// Helper function to generate type-safe field names
const getFieldName = <T extends FormData>(
  supplierIndex: number,
  field: keyof Supplier | `invoices[${number}].${keyof Invoice}`
): Path<T> => `supplierDetails.clearance.suppliers[${supplierIndex}].${field}` as Path<T>;

export function SupplierDetails({
  saveProgress,
  onSectionSubmit,
  params,
  currentUser
}: SupplierDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const organizationId = Array.isArray(params) ? params[0] : params;
  const suppliersFromForm = watch("supplierDetails.clearance.suppliers") || [];
  const [uploading, setUploading] = useState(false);
  const [supplierNames, setSupplierNames] = useState<{ _id: string; name: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSupplierCount, setPendingSupplierCount] = useState<number | null>(null);
  const [pendingInvoiceIndex, setPendingInvoiceIndex] = useState<{
    supplierIndex: number;
    count: number;
  } | null>(null);
  const GlobalModal = useGlobalModal();

  // Debug confirmation state changes
  useEffect(() => {
    console.log("Confirmation state:", {
      showConfirmation,
      pendingSupplierCount,
      pendingInvoiceIndex,
      suppliersFromForm,
    });
  }, [showConfirmation, pendingSupplierCount, pendingInvoiceIndex, suppliersFromForm]);

  // Fetch supplier names
  useEffect(() => {
    const fetchingData = async () => {
      try {
        const supplierResponse = await fetchData(
          `/shipment/supplier/getbyorg/${organizationId}`
        );
        const supplierData = await supplierResponse
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    fetchingData();
  }, [organizationId]);

  const handleSupplierCountChange = (value: string) => {
    console.log("handleSupplierCountChange called with value:", value);
    const newCount = value === "" ? 1 : Number(value) || 1;
    if (newCount < 1) return;

    if (newCount < suppliersFromForm.length) {
      console.log("Reducing supplier count from", suppliersFromForm.length, "to", newCount);
      setShowConfirmation(true);
      setPendingSupplierCount(newCount);
      setPendingInvoiceIndex(null);
      return;
    }

    handleDynamicArrayCountChange({
      value: newCount.toString(),
      watch,
      setValue,
      getValues,
      fieldName: "supplierDetails.clearance.suppliers",
      createNewItem: () => ({
        noOfInvoices: 1,
        invoices: [
          {
            supplierInvoiceNumber: "",
            supplierInvoiceDate: "",
            supplierInvoiceValueWithGST: "",
            supplierInvoiceValueWithOutGST: "",
            clearanceSupplierInvoiceUrl: "",
          },
        ],
      }),
      customFieldSetters: {
        "supplierDetails.clearance.suppliers": (items, setValue) => {
          setValue("supplierDetails.clearance.noOfSuppliers", items.length);
        },
      },
      saveCallback: saveProgressSilently,
    });
  };

  const handleInvoiceCountChange = (supplierIndex: number, value: string) => {
    console.log("handleInvoiceCountChange called with value:", value, "for supplierIndex:", supplierIndex);
    const newCount = value === "" ? 1 : Number(value) || 1;
    if (newCount < 1) return;

    const currentInvoices = suppliersFromForm[supplierIndex]?.invoices || [];
    if (newCount < currentInvoices.length) {
      console.log("Reducing invoice count from", currentInvoices.length, "to", newCount);
      setShowConfirmation(true);
      setPendingInvoiceIndex({ supplierIndex, count: newCount });
      setPendingSupplierCount(null);
      return;
    }

    handleDynamicArrayCountChange({
      value: newCount.toString(),
      watch,
      setValue,
      getValues,
      fieldName: `supplierDetails.clearance.suppliers[${supplierIndex}].invoices`,
      createNewItem: () => ({
        supplierInvoiceNumber: "",
        supplierInvoiceDate: "",
        supplierInvoiceValueWithGST: "",
        supplierInvoiceValueWithOutGST: "",
        clearanceSupplierInvoiceUrl: "",
      }),
      customFieldSetters: {
        [`supplierDetails.clearance.suppliers[${supplierIndex}].invoices`]: (
          items,
          setValue
        ) => {
          setValue(
            `supplierDetails.clearance.suppliers[${supplierIndex}].noOfInvoices`,
            items.length
          );
        },
      },
      saveCallback: saveProgressSilently,
    });
  };

  const handleConfirmChange = () => {
    console.log("handleConfirmChange called with:", { pendingSupplierCount, pendingInvoiceIndex });
    if (pendingSupplierCount !== null) {
      const updatedSuppliers = suppliersFromForm.slice(0, pendingSupplierCount);
      setValue("supplierDetails.clearance.suppliers", updatedSuppliers);
      setValue("supplierDetails.clearance.noOfSuppliers", updatedSuppliers.length);
      saveProgressSilently(getValues());
      setPendingSupplierCount(null);
    } else if (pendingInvoiceIndex !== null) {
      const { supplierIndex, count } = pendingInvoiceIndex;
      const updatedSuppliers = [...suppliersFromForm];
      updatedSuppliers[supplierIndex].invoices = updatedSuppliers[supplierIndex].invoices.slice(
        0,
        count
      );
      setValue("supplierDetails.clearance.suppliers", updatedSuppliers);
      setValue(
        `supplierDetails.clearance.suppliers[${supplierIndex}].noOfInvoices` as any,
        count
      );
      saveProgressSilently(getValues());
      setPendingInvoiceIndex(null);
    }
    setShowConfirmation(false);
  };

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
      const data = await response.json();
      const storageUrl = data.url;
      setValue(fieldName as any, storageUrl);
      saveProgressSilently(getValues());
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const openSupplierForm = () => {
    GlobalModal.title = "Add New Supplier";
    GlobalModal.children = (
      <Addsupplierform
        orgId={organizationId}
        currentUser={currentUser}
        onSuccess={async () => {
          try {
            const res = await fetch(
              `https://incodocs-server.onrender.com/shipment/supplier/getbyorg/${organizationId}`
            );
            const data = await res.json();
            const mappedSuppliers = data.map((supplier: any) => ({
              _id: supplier._id,
              name: supplier.supplierName,
            }));
            setSupplierNames(mappedSuppliers);
            saveProgressSilently(getValues());
          } catch (error) {
            console.error("Error refreshing suppliers:", error);
            toast.error("Failed to refresh supplier list");
          }
          GlobalModal.onClose();
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        <FormField
          control={control}
          name="supplierDetails.clearance.noOfSuppliers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Suppliers</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of suppliers"
                  value={field.value ?? 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(1);
                      handleSupplierCountChange("1");
                      return;
                    }
                    const numericValue = Number(value);
                    field.onChange(numericValue);
                    handleSupplierCountChange(value);
                  }}
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {suppliersFromForm.length > 0 && (
        <div className="col-span-4 mt-4">
          {suppliersFromForm.map((supplier: any, supplierIndex: number) => (
            <div key={supplierIndex} className="mb-8">
              <div className="text-lg font-semibold mb-2">
                Supplier {supplierIndex + 1}
              </div>
              <div className="grid grid-cols-4 gap-3">
                <FormField
                  control={control}
                  name={getFieldName(supplierIndex, "supplierName")}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        <EntityCombobox
                          entities={supplierNames}
                          value={field.value as any || ""}
                          onChange={(value) => {
                            field.onChange(value);
                            saveProgressSilently(getValues());
                          }}
                          displayProperty="name"
                          placeholder="Select a Supplier"
                          onAddNew={openSupplierForm}
                          addNewLabel="Add New Supplier"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={getFieldName(supplierIndex, "noOfInvoices")}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Invoices</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of invoices"
                          value={field.value as any ?? 1}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(1);
                              handleInvoiceCountChange(supplierIndex, "1");
                              return;
                            }
                            const numericValue = Number(value);
                            field.onChange(numericValue);
                            handleInvoiceCountChange(supplierIndex, value);
                          }}
                          min={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {supplier.invoices?.length > 0 && (
                <div className="overflow-x-auto mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Upload Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Value With GST</TableHead>
                        <TableHead>Value Without GST</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplier.invoices.map((_: any, invoiceIndex: number) => (
                        <TableRow key={invoiceIndex}>
                          <TableCell>{invoiceIndex + 1}</TableCell>
                          <TableCell>
                            <FormField
                              control={control}
                              name={getFieldName(
                                supplierIndex,
                                `invoices[${invoiceIndex}].supplierInvoiceNumber`
                              )}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., INV789"
                                      value={field.value as any || ""}
                                      onChange={field.onChange}
                                      onBlur={() => saveProgressSilently(getValues())}
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
                              name={getFieldName(
                                supplierIndex,
                                `invoices[${invoiceIndex}].clearanceSupplierInvoiceUrl`
                              )}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <FileUploadField
                                      name={getFieldName(
                                        supplierIndex,
                                        `invoices[${invoiceIndex}].clearanceSupplierInvoiceUrl`
                                      )}
                                      storageKey={`invoices[${invoiceIndex}].clearanceSupplierInvoiceUrl`}
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
                              name={getFieldName(
                                supplierIndex,
                                `invoices[${invoiceIndex}].supplierInvoiceDate`
                              )}
                              render={({ field }) => (
                                <FormItem>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button variant="outline">
                                          {field.value
                                            ? format(new Date(field.value as any), "PPPP")
                                            : "Pick a date"}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <CalendarComponent
                                        selected={
                                          field.value ? new Date(field.value as any) : undefined
                                        }
                                        onSelect={(date) => {
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
                              name={getFieldName(
                                supplierIndex,
                                `invoices[${invoiceIndex}].supplierInvoiceValueWithGST`
                              )}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 1000"
                                      value={field.value as any || ""}
                                      onChange={field.onChange}
                                      onBlur={() => saveProgressSilently(getValues())}
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
                              name={getFieldName(
                                supplierIndex,
                                `invoices[${invoiceIndex}].supplierInvoiceValueWithOutGST`
                              )}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 900"
                                      value={field.value as any || ""}
                                      onChange={field.onChange}
                                      onBlur={() => saveProgressSilently(getValues())}
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
                                const updatedSuppliers = [...suppliersFromForm];
                                updatedSuppliers[supplierIndex].invoices = updatedSuppliers[
                                  supplierIndex
                                ].invoices.filter((_: any, i: number) => i !== invoiceIndex);
                                setValue("supplierDetails.clearance.suppliers", updatedSuppliers);
                                setValue(
                                  `supplierDetails.clearance.suppliers[${supplierIndex}].noOfInvoices` as any,
                                  updatedSuppliers[supplierIndex].invoices.length
                                );
                                saveProgressSilently(getValues());
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
            </div>
          ))}
        </div>
      )}

      <Separator className="my-4" />
      <div className="text-xl font-bold my-3">
        <h2>Actual</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., ASI101"
                  className="uppercase"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={() => saveProgressSilently(getValues())}
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
                  storageKey="supplierDetails_actualSupplierInvoice"
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
                  placeholder="e.g., 1100"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={() => saveProgressSilently(getValues())}
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
                  storageKey="supplierDetails.actual.shippingBillUrl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="supplierDetails.review"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., this is some random comment"
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={() => saveProgressSilently(getValues())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingSupplierCount(null);
          setPendingInvoiceIndex(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description={
          pendingSupplierCount !== null
            ? "You are reducing the number of suppliers. This action cannot be undone."
            : "You are reducing the number of invoices. This action cannot be undone."
        }
      />
    </div>
  );
}