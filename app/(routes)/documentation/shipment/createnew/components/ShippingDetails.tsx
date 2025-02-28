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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveDetailsProps } from "./BookingDetails";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ShippinglineForm from "@/components/forms/Addshippinglineform";
import ForwarderForm from "@/components/forms/Forwarderdetailsform";
import TransporterForm from "@/components/forms/Addtransporterform";

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function ShippingDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const shippingInvoicesFromForm = watch("shippingDetails.shippingLineInvoices") || [];
  const forwarderInvoicesFromForm = watch("shippingDetails.forwarderInvoices") || [];
  const transporterInvoicesFromForm = watch("shippingDetails.transporterInvoices") || [];
  const [shippingInvoices, setShippingInvoices] = useState(shippingInvoicesFromForm);
  const [forwarderInvoices, setForwarderInvoices] = useState(forwarderInvoicesFromForm);
  const [transporterInvoices, setTransporterInvoices] = useState(transporterInvoicesFromForm);
  const [uploading, setUploading] = useState(false);
  const [shippingLines, setShippingLines] = useState([]);
  const [forwarders, setForwarders] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [selectedShippingFiles, setSelectedShippingFiles] = useState<(File | null)[]>([]);
  const [selectedForwarderFiles, setSelectedForwarderFiles] = useState<(File | null)[]>([]);
  const [selectedTransporterFiles, setSelectedTransporterFiles] = useState<(File | null)[]>([]);
  const GlobalModal = useGlobalModal();

  // Sync selected files arrays with invoice arrays
  useEffect(() => {
    setSelectedShippingFiles(Array(shippingInvoices.length).fill(null));
    setSelectedForwarderFiles(Array(forwarderInvoices.length).fill(null));
    setSelectedTransporterFiles(Array(transporterInvoices.length).fill(null));
  }, [shippingInvoices.length, forwarderInvoices.length, transporterInvoices.length]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const shippingResponse = await fetch("http://localhost:4080/shipment/shippingline/getall");
        const shippingData = await shippingResponse.json();
        setShippingLines(shippingData);

        const forwarderResponse = await fetch("http://localhost:4080/shipment/forwarder/getall");
        const forwarderData = await forwarderResponse.json();
        setForwarders(forwarderData);

        const transporterResponse = await fetch("http://localhost:4080/shipment/transporter/getall");
        const transporterData = await transporterResponse.json();
        setTransporters(transporterData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleShippingDelete = (index: number) => {
    const updatedInvoices = shippingInvoices.filter((_: any, i: number) => i !== index);
    setShippingInvoices(updatedInvoices);
    setValue("shippingDetails.shippingLineInvoices", updatedInvoices);
    setValue("shippingDetails.noOfShipmentinvoices", updatedInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleShippingCountChange = (value: string) => {
    const count = parseInt(value, 10) || 0;
    const currentInvoices = watch("shippingDetails.shippingLineInvoices") || [];
    const newInvoices = Array.from({ length: count }, (_, i) =>
      currentInvoices[i] || {
        invoiceNumber: "",
        uploadInvoiceUrl: "",
        date: null,
        valueWithGst: "",
        valueWithoutGst: "",
      }
    );
    setShippingInvoices(newInvoices);
    setValue("shippingDetails.shippingLineInvoices", newInvoices);
    setValue("shippingDetails.noOfShipmentinvoices", newInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleForwarderDelete = (index: number) => {
    const updatedInvoices = forwarderInvoices.filter((_: any, i: number) => i !== index);
    setForwarderInvoices(updatedInvoices);
    setValue("shippingDetails.forwarderInvoices", updatedInvoices);
    setValue("shippingDetails.noOfForwarderinvoices", updatedInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleForwarderCountChange = (value: string) => {
    const count = parseInt(value, 10) || 0;
    const currentInvoices = watch("shippingDetails.forwarderInvoices") || [];
    const newInvoices = Array.from({ length: count }, (_, i) =>
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
    const count = parseInt(value, 10) || 0;
    const currentInvoices = watch("shippingDetails.transporterInvoices") || [];
    const newInvoices = Array.from({ length: count }, (_, i) =>
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
      const response = await fetch("http://localhost:4080/shipmentdocsfile/upload", {
        method: "POST",
        body: formData,
      });
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

  const openShippingLineForm = () => {
    GlobalModal.title = "Add New Shipping Line";
    GlobalModal.children = (
      <ShippinglineForm
        onSuccess={() => {
          fetch("http://localhost:4080/shipment/shippingline/getall")
            .then((res) => res.json())
            .then((data) => setShippingLines(data));
        }}
      />
    );
    GlobalModal.onOpen();
  };

  const openForwarderForm = () => {
    GlobalModal.title = "Add New Forwarder";
    GlobalModal.children = (
      <ForwarderForm
        onSuccess={() => {
          fetch("http://localhost:4080/shipment/forwarder/getall")
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
          fetch("http://localhost:4080/shipment/transporter/getall")
            .then((res) => res.json())
            .then((data) => setTransporters(data));
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
          name="shippingDetails.shippingLineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Shipping Line</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Shipping Line" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingLines.map((details: any) => (
                      <SelectItem key={details._id} value={details._id}>
                        {details.shippingLineName}
                      </SelectItem>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full text-blue-500"
                      onClick={openShippingLineForm}
                    >
                      + Add New Shipping Line
                    </Button>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shippingDetails.noOfShipmentinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Shipping Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of invoices"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0) {
                      field.onChange(value);
                      handleShippingCountChange(e.target.value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {shippingInvoices.length > 0 && (
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
                {shippingInvoices.map((_: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.shippingLineInvoices[${index}].invoiceNumber`}
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
                        name={`shippingDetails.shippingLineInvoices[${index}].uploadInvoiceUrl`}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.png,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedShippingFiles((prev) => {
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
                              disabled={uploading || !selectedShippingFiles[index]}
                              onClick={() => {
                                if (selectedShippingFiles[index]) {
                                  handleFileUpload(
                                    selectedShippingFiles[index]!,
                                    `shippingDetails.shippingLineInvoices[${index}].uploadInvoiceUrl`
                                  ).then(() => {
                                    setSelectedShippingFiles((prev) => {
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
                        name={`shippingDetails.shippingLineInvoices[${index}].date`}
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
                        name={`shippingDetails.shippingLineInvoices[${index}].valueWithGst`}
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
                        name={`shippingDetails.shippingLineInvoices[${index}].valueWithoutGst`}
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
                        onClick={() => handleShippingDelete(index)}
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
      <h2 className="text-xl font-bold my-3">Forwarder Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <FormField
          control={control}
          name="shippingDetails.forwarderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Forwarder Name</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Forwarder" />
                  </SelectTrigger>
                  <SelectContent>
                    {forwarders.map((details: any) => (
                      <SelectItem key={details._id} value={details._id}>
                        {details.forwarderName || details.responsiblePerson}
                      </SelectItem>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full text-blue-500"
                      onClick={openForwarderForm}
                    >
                      + Add New Forwarder
                    </Button>
                  </SelectContent>
                </Select>
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
                    const value = parseInt(e.target.value, 10);
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
          name="shippingDetails.transporterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Transporter Name</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Transporter" />
                  </SelectTrigger>
                  <SelectContent>
                    {transporters.map((details: any) => (
                      <SelectItem key={details._id} value={details._id}>
                        {details.transporterName || details.responsiblePerson}
                      </SelectItem>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full text-blue-500"
                      onClick={openTransporterForm}
                    >
                      + Add New Transporter
                    </Button>
                  </SelectContent>
                </Select>
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
                    const value = parseInt(e.target.value, 10);
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
            <FormLabel>Review</FormLabel>
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
  );
}