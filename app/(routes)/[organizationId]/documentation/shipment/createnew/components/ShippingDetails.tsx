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
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import toast from "react-hot-toast";
import { FileUploadField } from "./FileUploadField";
import CalendarComponent from "@/components/CalendarComponent";
import { fetchData } from "@/axiosUtility/api";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

// Form data types
interface Invoice {
  invoiceNumber: string;
  uploadInvoiceUrl: string;
  date: string | null;
  valueWithGst: number;
  valueWithoutGst: number;
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

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

interface ShippingDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
  params: string | string[];
  currentUser: string;
}

export function ShippingDetails({
  saveProgress,
  onSectionSubmit,
  params,
  currentUser,
}: ShippingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const organizationId = Array.isArray(params) ? params[0] : params;

  const initialCount = 1;
  const [forwarderInvoices, setForwarderInvoices] = useState<Invoice[]>(
    Array.from({ length: initialCount }, () => ({
      invoiceNumber: "",
      uploadInvoiceUrl: "",
      date: null,
      valueWithGst: 0,
      valueWithoutGst: 0,
    }))
  );
  const [transporterInvoices, setTransporterInvoices] = useState<Invoice[]>(
    Array.from({ length: initialCount }, () => ({
      invoiceNumber: "",
      uploadInvoiceUrl: "",
      date: null,
      valueWithGst: 0,
      valueWithoutGst: 0,
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [forwarders, setForwarders] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [selectedForwarderFiles, setSelectedForwarderFiles] = useState<
    (File | null)[]
  >(Array(initialCount).fill(null));
  const [selectedTransporterFiles, setSelectedTransporterFiles] = useState<
    (File | null)[]
  >(Array(initialCount).fill(null));
  const [showForwarderConfirmation, setShowForwarderConfirmation] =
    useState(false);
  const [showTransporterConfirmation, setShowTransporterConfirmation] =
    useState(false);
  const [forwarderCountToBeDeleted, setForwarderCountToBeDeleted] = useState<
    number | null
  >(null);
  const [transporterCountToBeDeleted, setTransporterCountToBeDeleted] =
    useState<number | null>(null);

  const GlobalModal = useGlobalModal();

  const handleForwarderDelete = useCallback(
    (index: number) => {
      const updatedInvoices = forwarderInvoices.filter((_, i) => i !== index);
      setForwarderInvoices(updatedInvoices);
      setSelectedForwarderFiles((prev) => prev.filter((_, i) => i !== index));
      setValue("shippingDetails.forwarderInvoices", updatedInvoices, {
        shouldDirty: false,
      });
      setValue(
        "shippingDetails.noOfForwarderinvoices",
        updatedInvoices.length,
        { shouldDirty: false }
      );
      saveProgressSilently(getValues());
    },
    [forwarderInvoices, setValue, getValues]
  );

  const handleForwarderCountChange = useCallback(
    (value: string) => {
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
            valueWithGst: 0,
            valueWithoutGst: 0,
          }),
          customFieldSetters: {
            "shippingDetails.forwarderInvoices": (
              items: Invoice[],
              setValue
            ) => {
              setValue("shippingDetails.noOfForwarderinvoices", items.length);
              setForwarderInvoices(items);
              setSelectedForwarderFiles(Array(items.length).fill(null));
            },
          },
          saveCallback: saveProgressSilently,
        });
      }
    },
    [watch, setValue, getValues, forwarderInvoices]
  );

  const handleForwarderConfirmChange = useCallback(() => {
    if (forwarderCountToBeDeleted !== null) {
      const updatedInvoices = forwarderInvoices.slice(
        0,
        forwarderCountToBeDeleted
      );
      setForwarderInvoices(updatedInvoices);
      setSelectedForwarderFiles(Array(updatedInvoices.length).fill(null));
      setValue("shippingDetails.forwarderInvoices", updatedInvoices, {
        shouldDirty: false,
      });
      setValue(
        "shippingDetails.noOfForwarderinvoices",
        updatedInvoices.length,
        { shouldDirty: false }
      );
      saveProgressSilently(getValues());
      setForwarderCountToBeDeleted(null);
      setShowForwarderConfirmation(false);
    }
  }, [forwarderInvoices, forwarderCountToBeDeleted, setValue, getValues]);

  const handleTransporterDelete = useCallback(
    (index: number) => {
      const updatedInvoices = transporterInvoices.filter((_, i) => i !== index);
      setTransporterInvoices(updatedInvoices);
      setSelectedTransporterFiles((prev) => prev.filter((_, i) => i !== index));
      setValue("shippingDetails.transporterInvoices", updatedInvoices, {
        shouldDirty: false,
      });
      setValue(
        "shippingDetails.noOftransportinvoices",
        updatedInvoices.length,
        { shouldDirty: false }
      );
      saveProgressSilently(getValues());
    },
    [transporterInvoices, setValue, getValues]
  );

  const handleTransporterCountChange = useCallback(
    (value: string) => {
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
            valueWithGst: 0,
            valueWithoutGst: 0,
          }),
          customFieldSetters: {
            "shippingDetails.transporterInvoices": (
              items: Invoice[],
              setValue
            ) => {
              setValue("shippingDetails.noOftransportinvoices", items.length);
              setTransporterInvoices(items);
              setSelectedTransporterFiles(Array(items.length).fill(null));
            },
          },
          saveCallback: saveProgressSilently,
        });
      }
    },
    [watch, setValue, getValues, transporterInvoices]
  );

  const handleTransporterConfirmChange = useCallback(() => {
    if (transporterCountToBeDeleted !== null) {
      const updatedInvoices = transporterInvoices.slice(
        0,
        transporterCountToBeDeleted
      );
      setTransporterInvoices(updatedInvoices);
      setSelectedTransporterFiles(Array(updatedInvoices.length).fill(null));
      setValue("shippingDetails.transporterInvoices", updatedInvoices, {
        shouldDirty: false,
      });
      setValue(
        "shippingDetails.noOftransportinvoices",
        updatedInvoices.length,
        { shouldDirty: false }
      );
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
      const response = await fetchData("/shipmentdocsfile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response;
      const storageUrl = data.url;
      console.log("File uploaded successfully:", storageUrl);
      setValue(fieldName, storageUrl as any, { shouldDirty: false }); // TODO: Fix type
      saveProgressSilently(getValues());
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    const fetchingData = async () => {
      try {
        const forwarderResponse = await fetchData(
          `/shipment/forwarder/getbyorg/${organizationId}`
        );
        const forwarderData = await forwarderResponse;
        setForwarders(forwarderData);

        const transporterResponse = await fetchData(
          `/shipment/transporter/getbyorg/${organizationId}`
        );
        const transporterData = await transporterResponse;
        setTransporters(transporterData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchingData();
  }, [forwarders, organizationId, transporters]);

  const openForwarderForm = () => {
    GlobalModal.title = "Add New Forwarder";
    GlobalModal.children = (
      <ForwarderForm
        currentUser={currentUser}
        orgId={organizationId}
        onSuccess={() => {
          fetchWithAuth<any>(`/shipment/forwarder/getbyorg/${organizationId}`);
        }}
      />
    );
    GlobalModal.onOpen();
  };

  const openTransporterForm = () => {
    GlobalModal.title = "Add New Transporter";
    GlobalModal.children = (
      <TransporterForm
        currentUser={currentUser}
        orgId={organizationId}
        onSuccess={() => {
          fetchWithAuth<any>(
            "/shipment/transporter/getbyorg/${organizationId}"
          ).then((data) => setTransporters(data));
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
              <FormLabel>Select Forwarder</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={forwarders}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="forwarderName"
                  valueProperty="_id"
                  placeholder="Select a Forwarder"
                  onAddNew={() => {
                    window.open(
                      `/${organizationId}/documentation/parties/add-parties/forwarder`,
                      "_blank"
                    );
                  }}
                  multiple={true}
                  // onAddNew={openForwarderForm}
                  addNewLabel="Add New Forwarder"
                  className="truncate w-full"
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
                        name={
                          `shippingDetails.forwarderInvoices[${index}].invoiceNumber` as any
                        }
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
                        name={
                          `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl` as any
                        }
                        render={({ field }) => (
                          <FileUploadField
                            name={
                              `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl` as any
                            }
                            storageKey={`shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl`}
                            module="Shipment/Forwarder/Invoices"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={
                          `shippingDetails.forwarderInvoices[${index}].date` as any
                        }
                        render={({ field }) => (
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
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={
                          `shippingDetails.forwarderInvoices[${index}].valueWithGst` as any
                        }
                        render={({ field }) => (
                          <Input
                            type="number"
                            min={0}
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
                        name={
                          `shippingDetails.forwarderInvoices[${index}].valueWithoutGst` as any
                        }
                        render={({ field }) => (
                          <Input
                            type="number"
                            min={0}
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
          name="shippingDetails.transporterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Transporter</FormLabel>
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
                  valueProperty="_id"
                   onAddNew={() => {
                    window.open(
                      `/${organizationId}/documentation/parties/add-parties/transporter`,
                      "_blank"
                    );
                  }}
                  multiple={true}
                  // onAddNew={openTransporterForm}
                  addNewLabel="Add New Transporter"
                  className="truncate w-full" // Added truncate to prevent overflow
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
                        name={
                          `shippingDetails.transporterInvoices[${index}].invoiceNumber` as any
                        }
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
                        name={
                          `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl` as any
                        }
                        render={({ field }) => (
                          <FileUploadField
                            name={
                              `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl` as any
                            }
                            storageKey={`shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl`}
                            module="Shipment/Transporter/Invoices"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={
                          `shippingDetails.transporterInvoices[${index}].date` as any
                        }
                        render={({ field }: any) => (
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <CalendarComponent
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
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={
                          `shippingDetails.transporterInvoices[${index}].valueWithGst` as any
                        }
                        render={({ field }) => (
                          <Input
                            type="number"
                            min={0}
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
                        name={
                          `shippingDetails.transporterInvoices[${index}].valueWithoutGst` as any
                        }
                        render={({ field }) => (
                          <Input
                            type="number"
                            min={0}
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