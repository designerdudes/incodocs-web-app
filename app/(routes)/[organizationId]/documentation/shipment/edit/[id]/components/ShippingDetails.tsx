"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, UploadCloud, Trash, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import EntityCombobox from "@/components/ui/EntityCombobox";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ForwarderForm from "@/components/forms/Forwarderdetailsform";
import TransporterForm from "@/components/forms/Addtransporterform";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/ui/icons";

interface ShippingDetailsProps {
  shipmentId: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
}

export function ShippingDetails({
  shipmentId,
  saveProgress,
  onSectionSubmit,
}: ShippingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [forwarders, setForwarders] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();

  const {
    fields: forwarderFields,
    append: appendForwarder,
    remove: removeForwarder,
  } = useFieldArray({
    control,
    name: "shippingDetails.forwarderInvoices",
  });

  const {
    fields: transporterFields,
    append: appendTransporter,
    remove: removeTransporter,
  } = useFieldArray({
    control,
    name: "shippingDetails.transporterInvoices",
  });

  // Watch form values
  const formValues = watch("shippingDetails");

  // Autosave form data when shippingDetails changes
  useEffect(() => {
    saveProgress({ shippingDetails: formValues });
  }, [formValues, saveProgress]);

  // Handle Count Changes
  const handleForwarderCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("shippingDetails.noOfForwarderinvoices", value, {
      shouldDirty: true,
    });
    const currentInvoices = formValues.forwarderInvoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length)
        .fill(null)
        .map(() => ({
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: undefined,
          valueWithGst: undefined,
          valueWithoutGst: undefined,
        }));
      appendForwarder(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        removeForwarder(i);
      }
    }
  };

  const handleTransporterCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("shippingDetails.noOftransportinvoices", value, {
      shouldDirty: true,
    });
    const currentInvoices = formValues.transporterInvoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length)
        .fill(null)
        .map(() => ({
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: undefined,
          valueWithGst: undefined,
          valueWithoutGst: undefined,
        }));
      appendTransporter(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        removeTransporter(i);
      }
    }
  };

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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const forwarderResponse = await fetch(
          "https://incodocs-server.onrender.com/shipment/forwarder/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const forwarderData = await forwarderResponse.json();
        setForwarders(Array.isArray(forwarderData) ? forwarderData : []);

        const transporterResponse = await fetch(
          "https://incodocs-server.onrender.com/shipment/transporter/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const transporterData = await transporterResponse.json();
        setTransporters(Array.isArray(transporterData) ? transporterData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch forwarders or transporters");
      }
    };
    fetchData();
  }, []);

  const openForwarderForm = () => {
    GlobalModal.title = "Add New Forwarder";
    GlobalModal.children = (
      <ForwarderForm
        onSuccess={() => {
          fetch(
            "https://incodocs-server.onrender.com/shipment/forwarder/getbyorg/674b0a687d4f4b21c6c980ba"
          )
            .then((res) => res.json())
            .then((data) => setForwarders(Array.isArray(data) ? data : []));
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
            .then((data) => setTransporters(Array.isArray(data) ? data : []));
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
      console.error("Error submitting Shipping Details:", error);
      toast.error("Failed to submit Shipping Details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-xl font-bold my-3">
        <h2>Forwarder Details</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Select Forwarder Name */}
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
                  onChange={(value) => field.onChange(value)}
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

        {/* Number of Forwarder Invoices */}
        <FormField
          control={control}
          name="shippingDetails.noOfForwarderinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Forwarder Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                    handleForwarderCountChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Forwarder Invoices Table */}
        {forwarderFields.length > 0 && (
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
                {forwarderFields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].invoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Eg: 123456898"
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
                        name={`shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl`}
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-2">
                            {field.value ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setValue(
                                        `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl`,
                                        "",
                                        { shouldDirty: true }
                                      )
                                    }
                                  >
                                    Remove
                                  </Button>
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={field.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Input
                                  type="file"
                                  className="flex-1"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleFileUpload(
                                        file,
                                        `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl`
                                      );
                                    }
                                  }}
                                  disabled={uploading}
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                                  disabled={uploading}
                                >
                                  <UploadCloud className="w-5 h-5 mr-2" />
                                  {uploading ? "Uploading..." : "Upload"}
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].date`}
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
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date?.toISOString())
                                  }
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
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
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
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithoutGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
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
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => removeForwarder(index)}
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

      <Separator className="mt-3" />
      <div className="text-xl font-bold my-2">
        <h2>Transporter Details</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Select Transporter Name */}
        <FormField
          control={control}
          name="shippingDetails.transporterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Transporter Name</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={transporters}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
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

        {/* Number of Transporter Invoices */}
        <FormField
          control={control}
          name="shippingDetails.noOftransportinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Transporter Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                    handleTransporterCountChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transporter Invoices Table */}
        {transporterFields.length > 0 && (
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
                {transporterFields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].invoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Eg: 123456898"
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
                        name={`shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl`}
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-2">
                            {field.value ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setValue(
                                        `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl`,
                                        "",
                                        { shouldDirty: true }
                                      )
                                    }
                                  >
                                    Remove
                                  </Button>
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={field.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Input
                                  type="file"
                                  className="flex-1"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleFileUpload(
                                        file,
                                        `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl`
                                      );
                                    }
                                  }}
                                  disabled={uploading}
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                                  disabled={uploading}
                                >
                                  <UploadCloud className="w-5 h-5 mr-2" />
                                  {uploading ? "Uploading..." : "Upload"}
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].date`}
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
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date?.toISOString())
                                  }
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
                        name={`shippingDetails.transporterInvoices[${index}].valueWithGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
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
                        name={`shippingDetails.transporterInvoices[${index}].valueWithoutGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
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
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => removeTransporter(index)}
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
                value={field.value ?? ""}
                onBlur={() => getValues()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Save and Next Button */}
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-8"
        >
          Save and Next
          {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
