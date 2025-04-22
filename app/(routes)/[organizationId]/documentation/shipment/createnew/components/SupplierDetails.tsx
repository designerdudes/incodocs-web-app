"use client";
import { useState, useEffect, useCallback } from "react";
import { useFormContext, Path } from "react-hook-form";
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
import { SaveDetailsProps } from "./BookingDetails";
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
import { Icons } from "@/components/ui/icons";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { toast } from "react-hot-toast";

<<<<<<< HEAD
// Form data types
interface SupplierInvoice {
  supplierGSTN: string;
  supplierInvoiceNumber: string;
  supplierInvoiceDate: string;
  supplierInvoiceValueWithGST: string;
  supplierInvoiceValueWithOutGST: string;
  clearanceSupplierInvoiceUrl: string;
}

interface SupplierDetails {
  clearance: {
    supplierName: string;
    noOfInvoices: number;
    invoices: SupplierInvoice[];
  };
  actual: {
    actualSupplierName: string;
    actualSupplierInvoiceUrl: string;
    actualSupplierInvoiceValue: string;
    shippingBillUrl: string;
  };
  review?: string;
}

interface FormData {
  shipmentId?: string;
  shippingBillDetails?: any; // Allow shippingBillDetails for shared form
  supplierDetails: SupplierDetails;
}

// Type guard to ensure data is FormData
function isFormData(data: any): data is FormData {
  return data && typeof data === "object" && "supplierDetails" in data;
}

function saveProgressSilently(data: FormData) {
  try {
    console.log("saveProgressSilently data:", JSON.stringify(data, null, 2));
    if (!isFormData(data)) {
      console.error("Error: Invalid FormData, missing supplierDetails");
      toast.error("Invalid form data: missing supplierDetails");
      return;
    }
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
    toast.error("Failed to save form data");
  }
}

=======
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
interface SupplierDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
}

export function SupplierDetails({ saveProgress, onSectionSubmit }: SupplierDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const invoicesFromForm = watch("supplierDetails.clearance.invoices") || [];
  const [invoices, setInvoices] = useState<SupplierInvoice[]>(invoicesFromForm);
  const [selectedInvoiceFiles, setSelectedInvoiceFiles] = useState<(File | null)[]>(Array(invoicesFromForm.length).fill(null));
  const [selectedActualFile, setSelectedActualFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [supplierNames, setSupplierNames] = useState<{ _id: string; name: string }[]>([]);
<<<<<<< HEAD
  const [shippingBills, setShippingBills] = useState<{ _id: string; name: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [invoiceCountToBeDeleted, setInvoiceCountToBeDeleted] = useState<number | null>(null);
=======
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
  const GlobalModal = useGlobalModal();

  // Fetch supplier names
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierResponse = await fetch(
          "https://incodocs-server.onrender.com/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        if (!supplierResponse.ok) throw new Error("Failed to fetch suppliers");
        const supplierData = await supplierResponse.json();
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        toast.error("Failed to fetch supplier data");
      }
    };
    fetchData();
<<<<<<< HEAD
    // Placeholder for shipping bills
    setShippingBills([
      { _id: "1", name: "Bill 1" },
      { _id: "2", name: "Bill 2" },
    ]);
  }, []);

  const handleDelete = useCallback(
    (index: number) => {
      const updatedInvoices = invoices.filter((_, i) => i !== index);
      setInvoices(updatedInvoices);
      setSelectedInvoiceFiles((prev) => prev.filter((_, i) => i !== index));
      setValue("supplierDetails.clearance.invoices", updatedInvoices, { shouldDirty: false });
      setValue("supplierDetails.clearance.noOfInvoices", updatedInvoices.length, { shouldDirty: false });
      const formData = getValues();
      if (isFormData(formData)) {
        saveProgressSilently(formData);
      } else {
        console.error("Invalid formData in handleDelete:", formData);
        toast.error("Invalid form data");
      }
    },
    [invoices, setValue, getValues]
  );

  const handleInvoiceNumberCountChange = useCallback(
    (value: string) => {
      const newCount = Number(value) || 1;
      if (newCount < invoices.length) {
        setShowConfirmation(true);
        setInvoiceCountToBeDeleted(newCount);
      } else {
        handleDynamicArrayCountChange<FormData>({
          value,
          watch,
          setValue,
          getValues,
          fieldName: "supplierDetails.clearance.invoices",
          countFieldName: "supplierDetails.clearance.noOfInvoices",
          createNewItem: () => ({
            supplierGSTN: "",
            supplierInvoiceNumber: "",
            supplierInvoiceDate: "",
            supplierInvoiceValueWithGST: "",
            supplierInvoiceValueWithOutGST: "",
            clearanceSupplierInvoiceUrl: "",
          }),
          customFieldSetters: {
            "supplierDetails.clearance.invoices": (items: SupplierInvoice[], setValue) => {
              setValue("supplierDetails.clearance.noOfInvoices", items.length, { shouldDirty: false });
              setInvoices(items);
              setSelectedInvoiceFiles(Array(items.length).fill(null));
            },
          },
          saveCallback: (data) => {
            if (isFormData(data)) {
              saveProgressSilently(data);
            } else {
              console.error("Invalid data passed to saveCallback:", data);
              toast.error("Invalid form data");
            }
          },
        });
      }
    },
    [watch, setValue, getValues, invoices]
  );

  const handleConfirmChange = useCallback(() => {
    if (invoiceCountToBeDeleted !== null) {
      const updatedInvoices = invoices.slice(0, invoiceCountToBeDeleted);
      setInvoices(updatedInvoices);
      setSelectedInvoiceFiles(Array(updatedInvoices.length).fill(null));
      setValue("supplierDetails.clearance.invoices", updatedInvoices, { shouldDirty: false });
      setValue("supplierDetails.clearance.noOfInvoices", updatedInvoices.length, { shouldDirty: false });
      const formData = getValues();
      if (isFormData(formData)) {
        saveProgressSilently(formData);
      } else {
        console.error("Invalid formData in handleConfirmChange:", formData);
        toast.error("Invalid form data");
      }
      setInvoiceCountToBeDeleted(null);
      setShowConfirmation(false);
=======
  }, []);

  const handleDelete = (index: number) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    setValue("supplierDetails.clearance.invoices", updatedInvoices);
    setValue("supplierDetails.clearance.noOfInvoices", updatedInvoices.length);
    saveProgress(getValues());
  };

  const handleInvoiceNumberCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const currentInvoices = watch("supplierDetails.clearance.invoices") || [];
      const newInvoices = Array.from({ length: count }, (_, i) =>
        currentInvoices[i] || {
          supplierGSTN: "",
          supplierInvoiceNumber: "",
          supplierInvoiceDate: "",
          supplierInvoiceValueWithGST: "",
          supplierInvoiceValueWithOutGST: "",
          clearanceSupplierInvoiceUrl: "",
        }
      );
      setInvoices(newInvoices);
      setValue("supplierDetails.clearance.invoices", newInvoices);
      setValue("supplierDetails.clearance.noOfInvoices", newInvoices.length);
      saveProgress(getValues());
    } else {
      setInvoices([]);
      setValue("supplierDetails.clearance.invoices", []);
      setValue("supplierDetails.clearance.noOfInvoices", 0);
      saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
    }
  }, [invoices, invoiceCountToBeDeleted, setValue, getValues]);

  const handleFileUpload = async (file: File, fieldName: Path<FormData>, index?: number) => {
    if (!file) return;
    setUploading(true);
    try {
      // const formData = new FormData();
      // formData.append("file", file);
      const response = await fetch("https://incodocs-server.onrender.com/shipmentdocsfile/upload", {
        method: "POST",
        // body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      const storageUrl = data.storageLink;
<<<<<<< HEAD
      setValue(fieldName, storageUrl, { shouldDirty: false });
      if (index !== undefined) {
        setSelectedInvoiceFiles((prev) => {
          const newFiles = [...prev];
          newFiles[index] = null;
          return newFiles;
        });
      } else {
        setSelectedActualFile(null);
      }
      const formData = getValues();
      if (isFormData(formData)) {
        saveProgressSilently(formData);
      } else {
        console.error("Invalid formData in handleFileUpload:", formData);
        toast.error("Invalid form data");
      }
      toast.success("File uploaded successfully");
=======
      setValue(fieldName, storageUrl);
      saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const openSupplierForm = () => {
    GlobalModal.title = "Add New Supplier";
    GlobalModal.children = (
      <SupplierForm
        onSuccess={() => {
          fetch("https://incodocs-server.onrender.com/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba")
            .then((res) => res.json())
            .then((data) => {
              const mappedSuppliers = data.map((supplier: any) => ({
                _id: supplier._id,
                name: supplier.supplierName,
              }));
              setSupplierNames(mappedSuppliers);
<<<<<<< HEAD
            })
            .catch((error) => {
              console.error("Error refreshing suppliers:", error);
              toast.error("Failed to refresh supplier list");
=======
              saveProgress(getValues()); // Save after updating suppliers
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div>
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
                  onChange={(value) => {
                    field.onChange(value);
<<<<<<< HEAD
                    const formData = getValues();
                    if (isFormData(formData)) {
                      saveProgressSilently(formData);
                    } else {
                      console.error("Invalid formData in supplierName onChange:", formData);
                      toast.error("Invalid form data");
                    }
=======
                    saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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

        {/* Number of Supplier Invoices */}
        <FormField
          control={control}
          name="supplierDetails.clearance.noOfInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Supplier Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={field.value || 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(1);
                      handleInvoiceNumberCountChange("1");
                      return;
                    }
                    const numericValue = Number(value);
                    if (!isNaN(numericValue) && numericValue >= 1) {
                      field.onChange(numericValue);
                      handleInvoiceNumberCountChange(numericValue.toString());
                    }
                  }}
                  onBlur={() => {
                    const formData = getValues();
                    if (isFormData(formData)) {
                      saveProgressSilently(formData);
                    } else {
                      console.error("Invalid formData in noOfInvoices onBlur:", formData);
                      toast.error("Invalid form data");
                    }
                  }}
                  min={1}
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
                  <TableHead>Supplier GSTIN</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((_: SupplierInvoice, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].supplierGSTN`}
                        render={({ field }) => (
<<<<<<< HEAD
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g., hsdfjkghog89r"
                                {...field}
                                onBlur={() => {
                                  const formData = getValues();
                                  if (isFormData(formData)) {
                                    saveProgressSilently(formData);
                                  } else {
                                    console.error("Invalid formData in supplierGSTN onBlur:", formData);
                                    toast.error("Invalid form data");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
=======
                          <FormControl>
                            <Input
                              placeholder="e.g., hsdfjkghog89r"
                              {...field}
                              onBlur={() => saveProgress(getValues())}
                            />
                          </FormControl>
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceNumber`}
                        render={({ field }) => (
<<<<<<< HEAD
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g., INV789"
                                {...field}
                                onBlur={() => {
                                  const formData = getValues();
                                  if (isFormData(formData)) {
                                    saveProgressSilently(formData);
                                  } else {
                                    console.error("Invalid formData in supplierInvoiceNumber onBlur:", formData);
                                    toast.error("Invalid form data");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
=======
                          <FormControl>
                            <Input
                              placeholder="e.g., INV789"
                              {...field}
                              onBlur={() => saveProgress(getValues())}
                              required // Enforce required field
                            />
                          </FormControl>
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].clearanceSupplierInvoiceUrl`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.png,.jpeg"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setSelectedInvoiceFiles((prev) => {
                                        const newFiles = [...prev];
                                        newFiles[index] = file;
                                        return newFiles;
                                      });
                                    }
                                  }}
                                  disabled={uploading}
                                />
                                <Button
                                  variant="secondary"
                                  className="bg-blue-500 text-white"
                                  disabled={uploading || !selectedInvoiceFiles[index]}
                                  onClick={() => {
                                    if (selectedInvoiceFiles[index]) {
                                      handleFileUpload(
                                        selectedInvoiceFiles[index]!,
                                        `supplierDetails.clearance.invoices[${index}].clearanceSupplierInvoiceUrl`,
                                        index
                                      );
                                    }
                                  }}
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
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceDate`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline">
                                    {field.value
                                      ? format(new Date(field.value), "PPPP")
                                      : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    field.onChange(date?.toISOString());
<<<<<<< HEAD
                                    const formData = getValues();
                                    if (isFormData(formData)) {
                                      saveProgressSilently(formData);
                                    } else {
                                      console.error("Invalid formData in supplierInvoiceDate onSelect:", formData);
                                      toast.error("Invalid form data");
                                    }
=======
                                    saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceValueWithGST`}
                        render={({ field }) => (
<<<<<<< HEAD
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g., 1000"
                                {...field}
                                onBlur={() => {
                                  const formData = getValues();
                                  if (isFormData(formData)) {
                                    saveProgressSilently(formData);
                                  } else {
                                    console.error("Invalid formData in supplierInvoiceValueWithGST onBlur:", formData);
                                    toast.error("Invalid form data");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
=======
                          <Input
                            placeholder="e.g., 1000"
                            {...field}
                            onBlur={() => saveProgress(getValues())}
                          />
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceValueWithOutGST`}
                        render={({ field }) => (
<<<<<<< HEAD
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g., 900"
                                {...field}
                                onBlur={() => {
                                  const formData = getValues();
                                  if (isFormData(formData)) {
                                    saveProgressSilently(formData);
                                  } else {
                                    console.error("Invalid formData in supplierInvoiceValueWithOutGST onBlur:", formData);
                                    toast.error("Invalid form data");
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
=======
                          <Input
                            placeholder="e.g., 900"
                            {...field}
                            onBlur={() => saveProgress(getValues())}
                          />
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
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
      </div>
      <Separator className="my-4" />
      <div className="text-xl font-bold my-3">
        <h2>Actual</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Actual Supplier Name */}
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
<<<<<<< HEAD
                  onBlur={() => {
                    const formData = getValues();
                    if (isFormData(formData)) {
                      saveProgressSilently(formData);
                    } else {
                      console.error("Invalid formData in actualSupplierName onBlur:", formData);
                      toast.error("Invalid form data");
                    }
                  }}
=======
                  onBlur={() => saveProgress(getValues())}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Actual Supplier Invoice */}
        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierInvoiceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Invoice</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedActualFile(file);
                      }
                    }}
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-blue-500 text-white"
                    disabled={uploading || !selectedActualFile}
                    onClick={() => {
                      if (selectedActualFile) {
                        handleFileUpload(
                          selectedActualFile,
                          "supplierDetails.actual.actualSupplierInvoiceUrl"
                        );
                      }
                    }}
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
        {/* Actual Supplier Invoice Value */}
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
<<<<<<< HEAD
                  onBlur={() => {
                    const formData = getValues();
                    if (isFormData(formData)) {
                      saveProgressSilently(formData);
                    } else {
                      console.error("Invalid formData in actualSupplierInvoiceValue onBlur:", formData);
                      toast.error("Invalid form data");
                    }
                  }}
=======
                  onBlur={() => saveProgress(getValues())}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Select Shipping Bill */}
        <FormField
          control={control}
          name="supplierDetails.actual.shippingBillUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Shipping Bill</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={[]}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
<<<<<<< HEAD
                    const formData = getValues();
                    if (isFormData(formData)) {
                      saveProgressSilently(formData);
                    } else {
                      console.error("Invalid formData in shippingBillUrl onChange:", formData);
                      toast.error("Invalid form data");
                    }
=======
                    saveProgress(getValues());
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
                  }}
                  displayProperty="name"
                  placeholder="Select a Shipping Bill"
                  onAddNew={() => {}}
                  addNewLabel="Add New Shipping Bill"
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
<<<<<<< HEAD
                  onBlur={() => {
                    const formData = getValues();
                    if (isFormData(formData)) {
                      saveProgressSilently(formData);
                    } else {
                      console.error("Invalid formData in review onBlur:", formData);
                      toast.error("Invalid form data");
                    }
                  }}
=======
                  onBlur={() => saveProgress(getValues())}
>>>>>>> 12512eba0ec332ae6cbf6d3a3c7353961882f809
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Submit Button */}
      <div className="flex justify-end mt-4">
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
        onClose={() => {
          setShowConfirmation(false);
          setInvoiceCountToBeDeleted(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of supplier invoices. This action cannot be undone."
      />
    </div>
  );
}