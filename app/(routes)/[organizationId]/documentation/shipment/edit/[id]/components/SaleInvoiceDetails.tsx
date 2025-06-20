"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CalendarIcon, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalModal } from "@/hooks/GlobalModal";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { Icons } from "@/components/ui/icons";
import { fetchData } from "@/axiosUtility/api";
import Cookies from "js-cookie";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { FileUploadField } from "../../../createnew/components/FileUploadField";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CalendarComponent from "@/components/CalendarComponent";
import { format } from "date-fns";



interface CommercialInvoices {
  clearanceCommercialInvoiceNumber: string;
  clearancecommercialInvoiceDate: string;
  clearanceCommercialInvoiceUrl: string;
  clearanceCommercialInvoiceValue: string;
  actualCommercialInvoiceUrl: string;
  actualCommercialInvoiceValue: string;
  saberInvoiceUrl: string;
  saberInvoiceValue: string;
  packingListUrl: string;
}
interface SaleInvoiceDetailsProps {
  shipmentId: string;
  orgId?: string;
  currentUser: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<any>;
}
function saveProgressSilently(data: any) {
  try {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
}

export function   SaleInvoiceDetails({
  shipmentId,
  orgId,
  currentUser,
  saveProgress,
  onSectionSubmit,
}: SaleInvoiceDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [consignees, setConsignees] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();
  const invoicesFromForm = watch("saleInvoiceDetails.commercialInvoices") || [];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingInvoiceCount, setPendingInvoiceCount] = useState<number | null>(null);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "saleInvoiceDetails.commercialInvoices",
  });

  // Watch form values
  const formValues = watch("saleInvoiceDetails");

  // Autosave form data when saleInvoiceDetails changes
  useEffect(() => {
    saveProgress({ saleInvoiceDetails: formValues });
  }, [formValues, saveProgress]);

  // Fetch consignees using fetchData
  const fetchConsignees = async () => {
    if (!orgId) {
      console.warn("fetchConsignees: No orgId provided");
      setConsignees([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchData(`/shipment/consignee/getbyorg/${orgId}?t=${Date.now()}`);
      console.log("API Response (Consignees):", data);
      const mappedConsignees = Array.isArray(data)
        ? data.map((consignee: any) => ({
          _id: consignee._id,
          name: consignee.name || consignee.consigneeName || "Unknown Consignee",
        }))
        : [];
      console.log("Mapped Consignees:", mappedConsignees);
      setConsignees(mappedConsignees);
    } catch (error: any) {
      console.error("Error fetching consignees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch consignees on mount or orgId change
  useEffect(() => {
    fetchConsignees();
  }, [orgId]);

  // Reset consignee field if selected ID is invalid
  useEffect(() => {
    const currentConsigneeId = watch("saleInvoiceDetails.consignee");
    console.log("Current Consignee ID:", currentConsigneeId);
    console.log("Available Consignees:", consignees);
    if (
      currentConsigneeId &&
      consignees.length > 0 &&
      !consignees.find((c) => c._id === currentConsigneeId)
    ) {
      console.warn("Consignee ID not found, resetting field");
      setValue("saleInvoiceDetails.consignee", "", { shouldDirty: true });
    }
  }, [consignees, watch, setValue]);

  // Sync invoice fields with numberOfSalesInvoices and API data
  useEffect(() => {
    if (!formValues) {
      console.warn("SaleInvoiceDetails: formValues is undefined");
      return;
    }
    console.log("SaleInvoiceDetails formValues:", formValues);
    console.log("SaleInvoiceDetails fields:", fields);

    const numberOfInvoices = formValues.numberOfSalesInvoices ?? 0;
    const currentInvoices = formValues.commercialInvoices ?? [];

    if (
      currentInvoices.length > 0 &&
      fields.length !== currentInvoices.length
    ) {
      console.log("Replacing fields with API invoices:", currentInvoices);
      replace(currentInvoices);
    } else if (numberOfInvoices !== fields.length) {
      console.log(
        "Syncing fields with numberOfSalesInvoices:",
        numberOfInvoices
      );
      if (numberOfInvoices > fields.length) {
        const newInvoices = Array(numberOfInvoices - fields.length)
          .fill(null)
          .map(() => ({
            clearanceCommercialInvoiceNumber: "",
            clearancecommercialInvoiceDate: "",
            clearanceCommercialInvoiceUrl: "",
            clearanceCommercialInvoiceValue: "",
            actualCommercialInvoiceUrl: "",
            actualCommercialInvoiceValue: "",
            saberInvoiceUrl: "",
            saberInvoiceValue: "",
            packingListUrl: "",         
          }));
        append(newInvoices, { shouldFocus: false });
      } else if (numberOfInvoices < fields.length) {
        for (let i = fields.length - 1; i >= numberOfInvoices; i--) {
          remove(i);
        }
      }
    }
  }, [formValues, fields.length, append, remove, replace]);

  // Handle Number of Invoices Change
  const handleInvoiceNumberCountChange = (value: string) => {
    console.log("handleInvoiceNumberCountChange called with value:", value);
    const newCount = value === "" ? 1 : Number(value) || 1;
    if (newCount < 1) return;

    if (newCount < invoicesFromForm.length) {
      console.log("Reducing invoice count from", invoicesFromForm.length, "to", newCount);
      setShowConfirmation(true);
      setPendingInvoiceCount(newCount);
      return;
    }

    const currentInvoices = invoicesFromForm;
    const newInvoices = Array.from({ length: newCount }, (_, i) =>
      currentInvoices[i] || {
       clearanceCommercialInvoiceNumber: "",
       clearancecommercialInvoiceDate: "",
       clearanceCommercialInvoiceUrl: "",
       clearanceCommercialInvoiceValue: "",
       actualCommercialInvoiceUrl: "",
       actualCommercialInvoiceValue: "",
       saberInvoiceUrl: "",
       saberInvoiceValue: "",
       packingListUrl: "",   
      }
    );
    setValue("saleInvoiceDetails.commercialInvoices", newInvoices);
    setValue("saleInvoiceDetails.numberOfSalesInvoices", newInvoices.length);
    saveProgressSilently(getValues());
  };
  const openConsigneeForm = () => {
    if (!orgId) {
      toast.error("Cannot add consignee: Organization ID is missing");
      return;
    }
    console.log("Opening AddConsigneeForm with orgId:", orgId);
    GlobalModal.title = "Add New Consignee";
    GlobalModal.children = (
      <AddConsigneeForm
        currentUser={currentUser}
        orgId={orgId}
        onSuccess={() => {
          fetchConsignees();
        }}
      />
    );
    GlobalModal.onOpen();
  };

  const getFieldName = <T extends FormData>(
    index: number,
    field: keyof CommercialInvoices
  ): Path<T> => `saleInvoiceDetails.commercialInvoices[${index}].${field}` as Path<T>;

  const handleConfirmChange = () => {
    console.log("handleConfirmChange called with pendingInvoiceCount:", pendingInvoiceCount);
    if (pendingInvoiceCount !== null) {
      const updatedInvoices = invoicesFromForm.slice(0, pendingInvoiceCount);
      setValue("saleInvoiceDetails.commercialInvoices", updatedInvoices);
      setValue("saleInvoiceDetails.numberOfSalesInvoices", updatedInvoices.length);
      saveProgressSilently(getValues());
      setPendingInvoiceCount(null);
    }
    setShowConfirmation(false);
  };
  const handleDelete = (index: number) => {
    const updatedInvoices = invoicesFromForm.filter((_: any, i: number) => i !== index);
    setValue("saleInvoiceDetails.commercialInvoices", updatedInvoices);
    setValue("saleInvoiceDetails.numberOfSalesInvoices", updatedInvoices.length);
    saveProgressSilently(getValues());
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
                              storageKey={`saleInvoiceDetails_clearanceCommercialInvoiceUrl${index}`}
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
                              storageKey={`saleInvoiceDetails_actualCommercialInvoiceUrl${index}`}
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
                              storageKey={`saleInvoiceDetails_saberInvoiceUrl${index}`}
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
                              storageKey={`saleInvoiceDetails_packingListUrl${index}`}
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