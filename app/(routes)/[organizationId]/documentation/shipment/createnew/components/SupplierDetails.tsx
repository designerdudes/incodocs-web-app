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
import { CalendarIcon, Trash, UploadCloud } from "lucide-react";
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
import SupplierForm from "@/components/forms/Addsupplierform";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import toast from "react-hot-toast";
import { FileUploadField } from "./FileUploadField";

interface SupplierDetailsProps {
  saveProgress: (data: any) => void;
  onSectionSubmit: () => void;
  params: string | string[];
}

function saveProgressSilently(data: any) {
  try {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
}

export function SupplierDetails({
  saveProgress,
  onSectionSubmit,
  params,
}: SupplierDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const organizationId = Array.isArray(params) ? params[0] : params;

  const suppliersFromForm = watch("supplierDetails.clearance.suppliers") || [];
  const [suppliers, setSuppliers] = useState<any[]>(suppliersFromForm);
  const [uploading, setUploading] = useState(false);
  const [supplierNames, setSupplierNames] = useState<{ _id: string; name: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSupplierIndex, setPendingSupplierIndex] = useState<number | null>(null);
  const [pendingInvoiceIndex, setPendingInvoiceIndex] = useState<{
    supplierIndex: number;
    count: number;
  } | null>(null);
  const GlobalModal = useGlobalModal();

  // Sync local suppliers state with form state
  useEffect(() => {
    setSuppliers(suppliersFromForm);
  }, [suppliersFromForm]);


  const handleSupplierCountChange = (value: string) => {
    handleDynamicArrayCountChange({
      value,
      watch,
      setValue,
      getValues,
      fieldName: "supplierDetails.clearance.suppliers",
      createNewItem: () => ({
        supplierName: "",
        noOfInvoices: 0,
        invoices: [],
      }),
      customFieldSetters: {
        "supplierDetails.clearance.suppliers": (items, setValue) => {
          setValue("supplierDetails.clearance.noOfSuppliers", items.length);
          setSuppliers(items);
        },
      },
      saveCallback: saveProgressSilently,
      isDataFilled: (item) =>
        !!item.supplierName || item.invoices?.length > 0,
      onRequireConfirmation: (pendingItems, confirmedCallback) => {
        setShowConfirmation(true);
        setPendingSupplierIndex(suppliers.length - pendingItems.length);
        setPendingInvoiceIndex(null);
      },
    });
  };

  const handleInvoiceCountChange = (supplierIndex: number, value: string) => {
    const supplier = suppliers[supplierIndex];
    const currentInvoices = supplier?.invoices || [];
    const newCount = Math.max(0, parseInt(value, 10) || 0);

    if (newCount < currentInvoices.length) {
      setShowConfirmation(true);
      setPendingInvoiceIndex({ supplierIndex, count: newCount });
      setPendingSupplierIndex(null);
      return;
    }

    handleDynamicArrayCountChange({
      value,
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
          const updatedSuppliers = [...suppliers];
          updatedSuppliers[supplierIndex].invoices = items;
          setSuppliers(updatedSuppliers);
          setValue("supplierDetails.clearance.suppliers", updatedSuppliers);
        },
      },
      saveCallback: saveProgressSilently,
      isDataFilled: (item) =>
        !!item.supplierInvoiceNumber ||
        !!item.supplierInvoiceDate ||
        !!item.supplierInvoiceValueWithGST ||
        !!item.supplierInvoiceValueWithOutGST ||
        !!item.clearanceSupplierInvoiceUrl,
    });
  };

  const handleConfirmChange = () => {
    if (pendingSupplierIndex !== null) {
      const updatedSuppliers = suppliers.slice(0, pendingSupplierIndex);
      setSuppliers(updatedSuppliers);
      setValue("supplierDetails.clearance.suppliers", updatedSuppliers);
      setValue("supplierDetails.clearance.noOfSuppliers", updatedSuppliers.length);
      saveProgressSilently(getValues());
      setPendingSupplierIndex(null);
    } else if (pendingInvoiceIndex !== null) {
      const { supplierIndex, count } = pendingInvoiceIndex;
      const updatedSuppliers = [...suppliers];
      updatedSuppliers[supplierIndex].invoices = updatedSuppliers[
        supplierIndex
      ].invoices.slice(0, count);
      setSuppliers(updatedSuppliers);
      setValue("supplierDetails.clearance.suppliers", updatedSuppliers);
      setValue(
        `supplierDetails.clearance.suppliers[${supplierIndex}].noOfInvoices`,
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
      setValue(fieldName, storageUrl);
      saveProgressSilently(getValues());
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Fetch supplier names
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierResponse = await fetch(
          `https://incodocs-server.onrender.com/shipment/supplier/getbyorg/${organizationId}`
        );
        const supplierData = await supplierResponse.json();
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    fetchData();
  }, [organizationId]);


  const openSupplierForm = () => {
    GlobalModal.title = "Add New Supplier";
    GlobalModal.children = (
      <SupplierForm
        orgId={organizationId}
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
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value, 10) < 0) return;
                    field.onChange(parseInt(value, 10));
                    handleSupplierCountChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {suppliers.length > 0 && (
        <div className="col-span-4 mt-4">
          {suppliers.map((supplier: any, supplierIndex: number) => (
            <div key={supplierIndex} className="mb-8">
              <div className="text-lg font-semibold mb-2">
                Supplier {supplierIndex + 1}
              </div>
              <div className="grid grid-cols-4 gap-3">
                <FormField
                  control={control}
                  name={`supplierDetails.clearance.suppliers[${supplierIndex}].supplierName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <EntityCombobox
                          entities={supplierNames}
                          value={field.value || ""}
                          onChange={(value) => {
                            field.onChange(value);
                            saveProgressSilently(getValues());
                          }}
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
                <FormField
                  control={control}
                  name={`supplierDetails.clearance.suppliers[${supplierIndex}].noOfInvoices`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Invoices</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of invoices"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || parseInt(value, 10) < 0) return;
                            field.onChange(parseInt(value, 10));
                            handleInvoiceCountChange(supplierIndex, value);
                          }}
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
                              name={`supplierDetails.clearance.suppliers[${supplierIndex}].invoices[${invoiceIndex}].supplierInvoiceNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., INV789"
                                      {...field}
                                      onBlur={() =>
                                        saveProgressSilently(getValues())
                                      }
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
                              name={`supplierDetails.clearance.suppliers[${supplierIndex}].invoices[${invoiceIndex}].clearanceSupplierInvoiceUrl`}
                              render={({ field }) => (
                                <FileUploadField
                                  name={`supplierDetails.clearance.suppliers[${supplierIndex}].invoices[${invoiceIndex}].clearanceSupplierInvoiceUrl` as any}
                                  storageKey={`supplierDetails_clearance_suppliers${supplierIndex}`}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={control}
                              name={`supplierDetails.clearance.suppliers[${supplierIndex}].invoices[${invoiceIndex}].supplierInvoiceDate`}
                              render={({ field }) => (
                                <FormItem>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button variant="outline">
                                          {field.value
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
                                      <Calendar
                                        mode="single"
                                        selected={
                                          field.value
                                            ? new Date(field.value)
                                            : undefined
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
                              name={`supplierDetails.clearance.suppliers[${supplierIndex}].invoices[${invoiceIndex}].supplierInvoiceValueWithGST`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., 1000"
                                      {...field}
                                      onBlur={() =>
                                        saveProgressSilently(getValues())
                                      }
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
                              name={`supplierDetails.clearance.suppliers[${supplierIndex}].invoices[${invoiceIndex}].supplierInvoiceValueWithOutGST`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., 900"
                                      {...field}
                                      onBlur={() =>
                                        saveProgressSilently(getValues())
                                      }
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
                                const updatedSuppliers = [...suppliers];
                                updatedSuppliers[supplierIndex].invoices =
                                  updatedSuppliers[
                                    supplierIndex
                                  ].invoices.filter(
                                    (_: any, i: number) => i !== invoiceIndex
                                  );
                                setSuppliers(updatedSuppliers);
                                setValue(
                                  "supplierDetails.clearance.suppliers",
                                  updatedSuppliers
                                );
                                setValue(
                                  `supplierDetails.clearance.suppliers[${supplierIndex}].noOfInvoices`,
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
              <FormLabel>Actual Supplier Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., ASI101"
                  className="uppercase"
                  {...field}
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
              <FileUploadField
                name={`supplierDetails.actual.actualSupplierInvoiceUrl` as any}
                storageKey={`supplierDetails_actualSupplierInvoice`}
              />
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
                  {...field}
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
              <FileUploadField
                name={`supplierDetails.actual.shippingBillUrl` as any}
                storageKey={`supplierDetails_shippingBillUrl`}
              />
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
                  {...field}
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
          setPendingSupplierIndex(null);
          setPendingInvoiceIndex(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description={
          pendingSupplierIndex !== null
            ? "You are reducing the number of suppliers. This action cannot be undone."
            : "You are reducing the number of invoices. This action cannot be undone."
        }
      />
    </div>
  );
}