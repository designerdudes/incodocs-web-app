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
import { CalendarIcon, Trash, UploadCloud } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { SaveDetailsProps } from "./BookingDetails";
import EntityCombobox from "@/components/ui/EntityCombobox";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import { FileUploadField } from "./FileUploadField";
import { Path } from "react-hook-form";
import CalendarComponent from "@/components/CalendarComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fetchData } from "@/axiosUtility/api";

interface CommercialInvoice {
  clearanceCommercialInvoiceNumber: string;
  clearancecommercialInvoiceDate: string;
  clearanceCommercialInvoiceUrl: string;
  clearanceCommercialInvoiceValue: number;
  actualCommercialInvoiceUrl: string;
  actualCommercialInvoiceValue: number;
  saberInvoiceUrl: string;
  saberInvoiceValue: number;
  packingListUrl: string;
}

interface FormData {
  saleInvoiceDetails: {
    consignee: string;
    actualBuyer: string;
    numberOfSalesInvoices: number;
    commercialInvoices: CommercialInvoice[];
    review: string;
  };
}

interface CommercialInvoiceDetailsProps extends SaveDetailsProps {
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
  index: number,
  field: keyof CommercialInvoice
): Path<T> =>
  `saleInvoiceDetails.commercialInvoices[${index}].${field}` as Path<T>;

export function CommercialInvoiceDetails({
  saveProgress,
  onSectionSubmit,
  currentUser,
  params,
}: CommercialInvoiceDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const organizationId = Array.isArray(params) ? params[0] : params;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const invoicesFromForm = watch("saleInvoiceDetails.commercialInvoices") || [];
  const [uploading, setUploading] = useState(false);
  const [consignees, setConsignees] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingInvoiceCount, setPendingInvoiceCount] = useState<number | null>(
    null
  );
  const GlobalModal = useGlobalModal();

  // Fetch consignees on mount
  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const consigneeResponse = await fetchData(
          `/shipment/consignee/getbyorg/${organizationId}`
        );
        const consigneeData = await consigneeResponse;
        setConsignees(consigneeData);
      } catch (error) {
        console.error("Error fetching consignees:", error);
      }
    };
    fetchConsignees();
  }, [consignees, organizationId]);

  // Debug confirmation state changes
  useEffect(() => {
    console.log("Confirmation state:", {
      showConfirmation,
      pendingInvoiceCount,
      invoicesFromForm,
    });
  }, [showConfirmation, pendingInvoiceCount, invoicesFromForm]);

  const handleDelete = (index: number) => {
    const updatedInvoices = invoicesFromForm.filter((_, i) => i !== index);
    setValue("saleInvoiceDetails.commercialInvoices", updatedInvoices);
    setValue(
      "saleInvoiceDetails.numberOfSalesInvoices",
      updatedInvoices.length
    );
    saveProgressSilently(getValues());
  };

  const handleInvoiceNumberCountChange = (value: string) => {
    console.log("handleInvoiceNumberCountChange called with value:", value);
    const newCount = value === "" ? 1 : Number(value) || 1;
    if (newCount < 1) return;

    if (newCount < invoicesFromForm.length) {
      console.log(
        "Reducing invoice count from",
        invoicesFromForm.length,
        "to",
        newCount
      );
      setShowConfirmation(true);
      setPendingInvoiceCount(newCount);
      return;
    }

    const currentInvoices = invoicesFromForm;
    const newInvoices = Array.from(
      { length: newCount },
      (_, i) =>
        currentInvoices[i] || {
          clearanceCommercialInvoiceNumber: "",
          packingListUrl: "",
          clearanceCommercialInvoiceUrl: "",
          actualCommercialInvoiceUrl: "",
          saberInvoiceUrl: "",
        }
    );
    setValue("saleInvoiceDetails.commercialInvoices", newInvoices);
    setValue("saleInvoiceDetails.numberOfSalesInvoices", newInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleConfirmChange = () => {
    console.log(
      "handleConfirmChange called with pendingInvoiceCount:",
      pendingInvoiceCount
    );
    if (pendingInvoiceCount !== null) {
      const updatedInvoices = invoicesFromForm.slice(0, pendingInvoiceCount);
      setValue("saleInvoiceDetails.commercialInvoices", updatedInvoices);
      setValue(
        "saleInvoiceDetails.numberOfSalesInvoices",
        updatedInvoices.length
      );
      saveProgressSilently(getValues());
      setPendingInvoiceCount(null);
    }
    setShowConfirmation(false);
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetchData(
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
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const openConsigneeForm = () => {
    GlobalModal.title = "Add New Consignee";
    GlobalModal.children = (
      <AddConsigneeForm
        orgId={organizationId}
        currentUser={currentUser}
        onSuccess={() => {
          fetchData(`/shipment/consignee/getbyorg/${organizationId}`)
            .then((res) => res.json())
            .then((data) => {
              setConsignees(data);
              saveProgressSilently(getValues());
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
                valueProperty="_id"
                   onAddNew={() => {
                    window.open(
                      `/${organizationId}/documentation/parties/add-parties/consignee`,
                      "_blank"
                    );
                  }}
                  multiple={true}
                displayProperty="name"
                placeholder="Select a Consignee"
                // onAddNew={openConsigneeForm}
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
                value={field.value || ""}
                onChange={field.onChange}
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
                value={field.value ?? 1}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(1);
                    handleInvoiceNumberCountChange("1");
                    return;
                  }
                  const numericValue = Number(value);
                  field.onChange(numericValue);
                  handleInvoiceNumberCountChange(value);
                }}
                min={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {invoicesFromForm.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Clearance Commercial Invoice Number</TableHead>
                <TableHead>Clearance Commercial Invoice Date</TableHead>
                <TableHead>Clearance Commercial Invoice Url</TableHead>
                <TableHead>Clearance Commercial Invoice Value</TableHead>
                <TableHead>Actual Commercial Invoice Url</TableHead>
                <TableHead>Actual Commercial Value</TableHead>
                <TableHead>SABER Invoice Url</TableHead>
                <TableHead>SABER Invoice Value</TableHead>
                <TableHead>Packing List</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoicesFromForm.map((_: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={getFieldName<FormData>(
                        index,
                        "clearanceCommercialInvoiceNumber"
                      )}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 3458H4"
                              value={(field.value as any) || ""}
                              onChange={field.onChange}
                              onBlur={() => saveProgressSilently(getValues())}
                              required
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
                      name={getFieldName<FormData>(
                        index,
                        "clearancecommercialInvoiceDate"
                      )}
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value
                                    ? format(
                                        new Date(field.value as any),
                                        "PPPP"
                                      )
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
                                selected={
                                  field.value
                                    ? new Date(field.value as any)
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
                      name={getFieldName<FormData>(
                        index,
                        "clearanceCommercialInvoiceUrl"
                      )}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={getFieldName<FormData>(
                                index,
                                "clearanceCommercialInvoiceUrl"
                              )}
                              storageKey={`clearanceCommercialInvoiceUrl`}
                              module="Shipment/Clearance Commercial Invoice/Invoices"
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
                      name={getFieldName<FormData>(
                        index,
                        "clearanceCommercialInvoiceValue"
                      )}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            value={(field.value as any) || ""}
                            onChange={field.onChange}
                            placeholder="e.g., 1000"
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={getFieldName<FormData>(
                        index,
                        "actualCommercialInvoiceUrl"
                      )}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={getFieldName<FormData>(
                                index,
                                "actualCommercialInvoiceUrl"
                              )}
                              storageKey={`actualCommercialInvoiceUrl`}
                              module="Shipment/Actual Commercial Invoice/Invoices"
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
                      name={getFieldName<FormData>(
                        index,
                        "actualCommercialInvoiceValue"
                      )}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            value={(field.value as any) || ""}
                            onChange={field.onChange}
                            placeholder="e.g., 1000"
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={getFieldName<FormData>(index, "saberInvoiceUrl")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={getFieldName<FormData>(
                                index,
                                "saberInvoiceUrl"
                              )}
                              storageKey={`saberInvoiceUrl`}
                              module="Shipment/SABER Invoice/Invoices"
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
                      name={getFieldName<FormData>(index, "saberInvoiceValue")}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            value={(field.value as any) || ""}
                            onChange={field.onChange}
                            placeholder="e.g., 1000"
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={getFieldName<FormData>(index, "packingListUrl")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={getFieldName<FormData>(
                                index,
                                "packingListUrl"
                              )}
                              storageKey={`packingListUr`}
                              module="Shipment/Packing List"
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
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingInvoiceCount(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of commercial invoices. This action cannot be undone."
      />
    </div>
  );
}
