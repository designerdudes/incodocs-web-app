"use client";
import { useFormContext, Path } from "react-hook-form";
import React, { useState, useCallback } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, UploadCloud, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { SaveDetailsProps } from "./BookingDetails";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ForwarderForm from "@/components/forms/Forwarderdetailsform";
import TransporterForm from "@/components/forms/Addtransporterform";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { Icons } from "@/components/ui/icons";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";

// Form data types
interface Invoice {
  invoiceNumber: string;
  uploadInvoiceUrl: string;
  date: string | null;
  valueWithGst: string;
  valueWithoutGst: string;
}

interface ShippingDetails {
  forwarderName?: string;
  transporterName?: string;
  noOfForwarderinvoices: number;
  noOftransportinvoices: number;
  forwarderInvoices: Invoice[];
  transporterInvoices: Invoice[];
  review?: string;
}

interface FormData {
  shipmentId?: string;
  shippingDetails: ShippingDetails;
}

function saveProgressSilently(data: FormData) {
  try {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
}

interface ShippingDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
}

export function ShippingDetails({ saveProgress, onSectionSubmit }: ShippingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();

  const initialCount = 1;
  const [forwarderInvoices, setForwarderInvoices] = useState<Invoice[]>(
    Array.from({ length: initialCount }, () => ({
      invoiceNumber: "",
      uploadInvoiceUrl: "",
      date: null,
      valueWithGst: "",
      valueWithoutGst: "",
    }))
  );
  const [transporterInvoices, setTransporterInvoices] = useState<Invoice[]>(
    Array.from({ length: initialCount }, () => ({
      invoiceNumber: "",
      uploadInvoiceUrl: "",
      date: null,
      valueWithGst: "",
      valueWithoutGst: "",
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [forwarders, setForwarders] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [selectedForwarderFiles, setSelectedForwarderFiles] = useState<(File | null)[]>(Array(initialCount).fill(null));
  const [selectedTransporterFiles, setSelectedTransporterFiles] = useState<(File | null)[]>(Array(initialCount).fill(null));
  const [showForwarderConfirmation, setShowForwarderConfirmation] = useState(false);
  const [showTransporterConfirmation, setShowTransporterConfirmation] = useState(false);
  const [forwarderCountToBeDeleted, setForwarderCountToBeDeleted] = useState<number | null>(null);
  const [transporterCountToBeDeleted, setTransporterCountToBeDeleted] = useState<number | null>(null);

  const GlobalModal = useGlobalModal();

  // Fetch data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const forwarderResponse = await fetch(
          "https://incodocs-server.onrender.com/shipment/forwarder/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const forwarderData = await forwarderResponse.json();
        setForwarders(forwarderData);

        const transporterResponse = await fetch(
          "https://incodocs-server.onrender.com/shipment/transporter/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const transporterData = await transporterResponse.json();
        setTransporters(transporterData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleForwarderDelete = useCallback((index: number) => {
    const updatedInvoices = forwarderInvoices.filter((_, i) => i !== index);
    setForwarderInvoices(updatedInvoices);
    setSelectedForwarderFiles(prev => prev.filter((_, i) => i !== index));
    setValue("shippingDetails.forwarderInvoices", updatedInvoices, { shouldDirty: false });
    setValue("shippingDetails.noOfForwarderinvoices", updatedInvoices.length, { shouldDirty: false });
    saveProgressSilently(getValues());
  }, [forwarderInvoices, setValue, getValues]);

  const handleForwarderCountChange = useCallback((value: string) => {
    const newCount = Number(value) || 1;
    if (newCount < forwarderInvoices.length) {
      setShowForwarderConfirmation(true);
      setForwarderCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange<FormData, Invoice>({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "shippingDetails.forwarderInvoices",
        countFieldName: "shippingDetails.noOfForwarderinvoices",
        createNewItem: () => ({
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: null,
          valueWithGst: "",
          valueWithoutGst: "",
        }),
        customFieldSetters: {
          "shippingDetails.forwarderInvoices": (items: Invoice[], setValue) => {
            setValue("shippingDetails.noOfForwarderinvoices", items.length);
            setForwarderInvoices(items);
            setSelectedForwarderFiles(Array(items.length).fill(null));
          },
        },
        saveCallback: saveProgressSilently,
      });
    }
  }, [watch, setValue, getValues, forwarderInvoices]);

  const handleForwarderConfirmChange = useCallback(() => {
    if (forwarderCountToBeDeleted !== null) {
      const updatedInvoices = forwarderInvoices.slice(0, forwarderCountToBeDeleted);
      setForwarderInvoices(updatedInvoices);
      setSelectedForwarderFiles(Array(updatedInvoices.length).fill(null));
      setValue("shippingDetails.forwarderInvoices", updatedInvoices, { shouldDirty: false });
      setValue("shippingDetails.noOfForwarderinvoices", updatedInvoices.length, { shouldDirty: false });
      saveProgressSilently(getValues());
      setForwarderCountToBeDeleted(null);
      setShowForwarderConfirmation(false);
    }
  }, [forwarderInvoices, forwarderCountToBeDeleted, setValue, getValues]);

  const handleTransporterDelete = useCallback((index: number) => {
    const updatedInvoices = transporterInvoices.filter((_, i) => i !== index);
    setTransporterInvoices(updatedInvoices);
    setSelectedTransporterFiles(prev => prev.filter((_, i) => i !== index));
    setValue("shippingDetails.transporterInvoices", updatedInvoices, { shouldDirty: false });
    setValue("shippingDetails.noOftransportinvoices", updatedInvoices.length, { shouldDirty: false });
    saveProgressSilently(getValues());
  }, [transporterInvoices, setValue, getValues]);

  const handleTransporterCountChange = useCallback((value: string) => {
    const newCount = Number(value) || 1;
    if (newCount < transporterInvoices.length) {
      setShowTransporterConfirmation(true);
      setTransporterCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange<FormData, Invoice>({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "shippingDetails.transporterInvoices",
        countFieldName: "shippingDetails.noOftransportinvoices",
        createNewItem: () => ({
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: null,
          valueWithGst: "",
          valueWithoutGst: "",
        }),
        customFieldSetters: {
          "shippingDetails.transporterInvoices": (items: Invoice[], setValue) => {
            setValue("shippingDetails.noOftransportinvoices", items.length);
            setTransporterInvoices(items);
            setSelectedTransporterFiles(Array(items.length).fill(null));
          },
        },
        saveCallback: saveProgressSilently,
      });
    }
  }, [watch, setValue, getValues, transporterInvoices]);

  const handleTransporterConfirmChange = useCallback(() => {
    if (transporterCountToBeDeleted !== null) {
      const updatedInvoices = transporterInvoices.slice(0, transporterCountToBeDeleted);
      setTransporterInvoices(updatedInvoices);
      setSelectedTransporterFiles(Array(updatedInvoices.length).fill(null));
      setValue("shippingDetails.transporterInvoices", updatedInvoices, { shouldDirty: false });
      setValue("shippingDetails.noOftransportinvoices", updatedInvoices.length, { shouldDirty: false });
      saveProgressSilently(getValues());
      setTransporterCountToBeDeleted(null);
      setShowTransporterConfirmation(false);
    }
  }, [transporterInvoices, transporterCountToBeDeleted, setValue, getValues]);

  const handleFileUpload = async (file: File, fieldName: Path<FormData>) => {
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
      const storageUrl = data.storageLink;
      setValue(fieldName, storageUrl as any, { shouldDirty: false }); // TODO: Fix type
      saveProgressSilently(getValues());
    } catch (error) {
      alert("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const openForwarderForm = () => {
    GlobalModal.title = "Add New Forwarder";
    GlobalModal.children = (
      <ForwarderForm
        onSuccess={() => {
          fetch(
            "https://incodocs-server.onrender.com/shipment/forwarder/getbyorg/674b0a687d4f4b21c6c980ba"
          )
            .then((res) => res.json())
            .then((data) => setForwarders(data));
        }}
      />
    );
    GlobalModal.onOpen();
  };

  const openTransporterForm = () => {
    GlobalModal.title = "Add New Transporter";
    GlobalModal.children = (
      <TransporterForm
        onSuccess={() => {
          fetch(
            "https://incodocs-server.onrender.com/shipment/transporter/getbyorg/674b0a687d4f4b21c6c980ba"
          )
            .then((res) => res.json())
            .then((data) => setTransporters(data));
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div>
      <h2 className="text-xl font-bold my-3">Forwarder Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <FormField
          control={control}
          name="shippingDetails.forwarderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Forwarder Name</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={forwarders}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="forwarderName"
                  placeholder="Select a Forwarder"
                  onAddNew={openForwarderForm}
                  addNewLabel="Add New Forwarder"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shippingDetails.noOfForwarderinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Forwarder Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of invoices"
                  value={field.value || 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(1);
                      handleForwarderCountChange("1");
                      return;
                    }
                    const numericValue = Number(value);
                    field.onChange(numericValue);
                    handleForwarderCountChange(numericValue.toString());
                  }}
                  onBlur={() => saveProgressSilently(getValues())}
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {forwarderInvoices.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
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
                {forwarderInvoices.map((_: Invoice, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].invoiceNumber` as any}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="e.g., 123456898"
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
                        name={`shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl` as any}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.png,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedForwarderFiles((prev) => {
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
                              disabled={uploading || !selectedForwarderFiles[index]}
                              onClick={() => {
                                if (selectedForwarderFiles[index]) {
                                  handleFileUpload(
                                    selectedForwarderFiles[index]!,
                                    `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl` as any
                                  ).then(() => {
                                    setSelectedForwarderFiles((prev) => {
                                      const newFiles = [...prev];
                                      newFiles[index] = null;
                                      return newFiles;
                                    });
                                  });
                                }
                              }}
                            >
                              <UploadCloud className="w-5 h-5 mr-2" />
                              {uploading ? "Uploading..." : "Upload"}
                            </Button>
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].date` as any}
                        render={({ field }) => (
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
                            <PopoverContent align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value as any) : undefined}
                                onSelect={(date) => {
                                  field.onChange(date?.toISOString());
                                  saveProgressSilently(getValues());
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithGst` as any}
                        render={({ field }) => (
                          <Input
                            placeholder="e.g., 11800"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithoutGst` as any}
                        render={({ field }) => (
                          <Input
                            placeholder="e.g., 11800"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleForwarderDelete(index)}
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
      <h2 className="text-xl font-bold my-3">Transporter Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <FormField
          control={control}
          name={"shippingDetails.transporter" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Transporter Name</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={transporters}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="transporterName"
                  placeholder="Select a Transporter"
                  onAddNew={openTransporterForm}
                  addNewLabel="Add New Transporter"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shippingDetails.noOftransportinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Transporter Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of invoices"
                  value={field.value || 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(1);
                      handleTransporterCountChange("1");
                      return;
                    }
                    const numericValue = Number(value);
                    field.onChange(numericValue);
                    handleTransporterCountChange(numericValue.toString());
                  }}
                  onBlur={() => saveProgressSilently(getValues())}
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {transporterInvoices.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
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
                {transporterInvoices.map((_: Invoice, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].invoiceNumber` as any}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="e.g., 123456898"
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
                        name={`shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl` as any}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.png,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedTransporterFiles((prev) => {
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
                              disabled={uploading || !selectedTransporterFiles[index]}
                              onClick={() => {
                                if (selectedTransporterFiles[index]) {
                                  handleFileUpload(
                                    selectedTransporterFiles[index]!,
                                    `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl` as any
                                  ).then(() => {
                                    setSelectedTransporterFiles((prev) => {
                                      const newFiles = [...prev];
                                      newFiles[index] = null;
                                      return newFiles;
                                    });
                                  });
                                }
                              }}
                            >
                              <UploadCloud className="w-5 h-5 mr-2" />
                              {uploading ? "Uploading..." : "Upload"}
                            </Button>
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].date` as any}
                        render={({ field }:any) => (
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
                                  saveProgressSilently(getValues());
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].valueWithGst` as any}
                        render={({ field }) => (
                          <Input
                            placeholder="e.g., 11800"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].valueWithoutGst` as any}
                        render={({ field }) => (
                          <Input
                            placeholder="e.g., 11800"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleTransporterDelete(index)}
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
      <FormField
        control={control}
        name="shippingDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4 mt-4">
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
        isOpen={showForwarderConfirmation}
        onClose={() => {
          setShowForwarderConfirmation(false);
          setForwarderCountToBeDeleted(null);
        }}
        onConfirm={handleForwarderConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of forwarder invoices. This action cannot be undone."
      />
      <ConfirmationDialog
        isOpen={showTransporterConfirmation}
        onClose={() => {
          setShowTransporterConfirmation(false);
          setTransporterCountToBeDeleted(null);
        }}
        onConfirm={handleTransporterConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of transporter invoices. This action cannot be undone."
      />
    </div>
  );
}