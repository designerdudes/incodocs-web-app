"use client";
import { useFormContext } from "react-hook-form";
import React, { useEffect, useState } from "react";
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

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

interface ShippingDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
}

export function ShippingDetails({ saveProgress, onSectionSubmit }: ShippingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();

  const forwarderInvoicesFromForm = watch("shippingDetails.forwarderInvoices") || [];
  const transporterInvoicesFromForm = watch("shippingDetails.transporterInvoices") || [];

  const [forwarderInvoices, setForwarderInvoices] = useState(forwarderInvoicesFromForm);
  const [transporterInvoices, setTransporterInvoices] = useState(transporterInvoicesFromForm);
  const [uploading, setUploading] = useState(false);

  const [forwarders, setForwarders] = useState([]);
  const [transporters, setTransporters] = useState([]);

  const [selectedForwarderFiles, setSelectedForwarderFiles] = useState<(File | null)[]>([]);
  const [selectedTransporterFiles, setSelectedTransporterFiles] = useState<(File | null)[]>([]);
  const GlobalModal = useGlobalModal();

  // Sync selected files arrays with invoice arrays
  useEffect(() => {
    setSelectedForwarderFiles(Array(forwarderInvoices.length).fill(null));
    setSelectedTransporterFiles(Array(transporterInvoices.length).fill(null));
  }, [forwarderInvoices.length, transporterInvoices.length]);

  // Fetch data on component mount
  useEffect(() => {
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

  const handleForwarderDelete = (index: number) => {
    const updatedInvoices = forwarderInvoices.filter((_: any, i: number) => i !== index);
    setForwarderInvoices(updatedInvoices);
    setValue("shippingDetails.forwarderInvoices", updatedInvoices);
    setValue("shippingDetails.noOfForwarderinvoices", updatedInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleForwarderCountChange = (value: string) => {
    const count = Number.parseInt(value, 10) || 0;
    const currentInvoices = watch("shippingDetails.forwarderInvoices") || [];
    const newInvoices = Array.from(
      { length: count },
      (_, i) =>
        currentInvoices[i] || {
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: null,
          valueWithGst: "",
          valueWithoutGst: "",
        }
    );
    setForwarderInvoices(newInvoices);
    setValue("shippingDetails.forwarderInvoices", newInvoices);
    setValue("shippingDetails.noOfForwarderinvoices", newInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleTransporterDelete = (index: number) => {
    const updatedInvoices = transporterInvoices.filter((_: any, i: number) => i !== index);
    setTransporterInvoices(updatedInvoices);
    setValue("shippingDetails.transporterInvoices", updatedInvoices);
    setValue("shippingDetails.noOftransportinvoices", updatedInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleTransporterCountChange = (value: string) => {
    const count = Number.parseInt(value, 10) || 0;
    const currentInvoices = watch("shippingDetails.transporterInvoices") || [];
    const newInvoices = Array.from(
      { length: count },
      (_, i) =>
        currentInvoices[i] || {
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: null,
          valueWithGst: "",
          valueWithoutGst: "",
        }
    );
    setTransporterInvoices(newInvoices);
    setValue("shippingDetails.transporterInvoices", newInvoices);
    setValue("shippingDetails.noOftransportinvoices", newInvoices.length);
    saveProgressSilently(getValues());
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
      const storageUrl = data.storageLink;
      setValue(fieldName, storageUrl);
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
          name="shippingDetails.forwarder"
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
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0) {
                      field.onChange(value);
                      handleForwarderCountChange(e.target.value);
                    }
                  }}
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
                {forwarderInvoices.map((_: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].invoiceNumber`}
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
                        name={`shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl`}
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
                                    `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl`
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
                        name={`shippingDetails.forwarderInvoices[${index}].date`}
                        render={({ field }) => (
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
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithGst`}
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
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithoutGst`}
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
          name="shippingDetails.transporter"
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
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0) {
                      field.onChange(value);
                      handleTransporterCountChange(e.target.value);
                    }
                  }}
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
                {transporterInvoices.map((_: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].invoiceNumber`}
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
                        name={`shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl`}
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
                                    `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl`
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
                        name={`shippingDetails.transporterInvoices[${index}].date`}
                        render={({ field }) => (
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
                        name={`shippingDetails.transporterInvoices[${index}].valueWithGst`}
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
                        name={`shippingDetails.transporterInvoices[${index}].valueWithoutGst`}
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
      {/* Review */}
      <FormField
        control={control}
        name="shippingDetails.review"
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
    </div>
  );
}