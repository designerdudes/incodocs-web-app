"use client";
import { useFormContext } from "react-hook-form";
import React, { useEffect, useState } from "react";
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
import EntityCombobox from "@/components/ui/EntityCombobox";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import ShippinglineForm from "@/components/forms/Addshippinglineform";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Icons } from "@/components/ui/icons";

interface BillOfLadingDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
  params: string | string[];
}

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function BillOfLadingDetails({ saveProgress, onSectionSubmit, params }: BillOfLadingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const organizationId = Array.isArray(params) ? params[0] : params;
  const [uploading, setUploading] = useState(false);
  const GlobalModal = useGlobalModal();
  const shippingInvoicesFromForm = watch("blDetails.shippingDetails.shippingLineInvoices") || [];
  const [shippingInvoices, setShippingInvoices] = useState(shippingInvoicesFromForm);
  const [shippingLines, setShippingLines] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchShippingLines = async () => {
      try {
        const response = await fetch(
          `https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/${organizationId}`
        );
        const data = await response.json();
        const mappedConsignees = data.map((consignee: any) => ({
          _id: consignee._id,
          name: consignee.name || consignee.consigneeName,
        }));
        setShippingLines(mappedConsignees);
      } catch (error) {
        console.error("Error fetching consignees:", error);
      }
    };
    fetchShippingLines();
  }, []);

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
      alert("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleShippingCountChange = (value: string) => {
    const count = Number.parseInt(value, 10) || 0;
    const currentInvoices = watch("blDetails.shippingDetails.shippingLineInvoices") || [];
    const newInvoices = Array.from(
      { length: count },
      (_, i) =>
        currentInvoices[i] || {
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: null,
          valueWithGst: "",
          valueWithoutGst: "",
        },
    );
    setShippingInvoices(newInvoices);
    setValue("blDetails.shippingDetails.shippingLineInvoices", newInvoices);
    setValue("blDetails.shippingDetails.noOfShipmentinvoices", newInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleShippingDelete = (index: number) => {
    const updatedInvoices = shippingInvoices.filter((_: any, i: number) => i !== index);
    setShippingInvoices(updatedInvoices);
    setValue("blDetails.shippingDetails.shippingLineInvoices", updatedInvoices);
    setValue("blDetails.shippingDetails.noOfShipmentinvoices", updatedInvoices.length);
    saveProgressSilently(getValues());
  };

  const openShippingLineForm = () => {
    GlobalModal.title = "Add New Shipping Line";
    GlobalModal.children = (
      <ShippinglineForm
        onSuccess={() => {
          fetch(`https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/${organizationId}`)
            .then((res) => res.json())
            .then((data) => {
              setShippingLines(data);
              saveProgressSilently(getValues()); // Save after updating shipping lines
            });
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
          name="blDetails.shippingDetails.shippingLineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Shipping Line</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={shippingLines}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="shippingLineName"
                  placeholder="Select a Shipping Line"
                  onAddNew={openShippingLineForm}
                  addNewLabel="Add New Shipping Line"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="blDetails.shippingDetails.noOfShipmentinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Shipping Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of invoices"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value, 10);
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
                        name={`blDetails.shippingDetails.shippingLineInvoices[${index}].invoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="e.g., 123456898"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
                              required // Enforce required field
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`blDetails.shippingDetails.shippingLineInvoices[${index}].uploadInvoiceUrl`}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.png,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, `blDetails.shippingDetails.shippingLineInvoices[${index}].uploadInvoiceUrl`);
                              }}
                              disabled={uploading}
                            />
                            <Button
                              variant="secondary"
                              className="bg-blue-500 text-white"
                              disabled={uploading}
                              onClick={() => { /* Upload handled in onChange */ }}
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
                        name={`blDetails.shippingDetails.shippingLineInvoices[${index}].date`}
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
                        name={`blDetails.shippingDetails.shippingLineInvoices[${index}].valueWithGst`}
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
                        name={`blDetails.shippingDetails.shippingLineInvoices[${index}].valueWithoutGst`}
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
      <div className="grid grid-cols-4 gap-3">
        {/* BL Number */}
        <FormField
          control={control}
          name="blDetails.blNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BL Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., BL456"
                  className="uppercase"
                  {...field}
                  onBlur={() => saveProgressSilently(getValues())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* BL Date */}
        <FormField
          control={control}
          name="blDetails.blDate"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>BL Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full">
                      {field.value ? (
                        format(new Date(field.value), "PPPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Telex Date */}
        <FormField
          control={control}
          name="blDetails.telexDate"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Telex Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full">
                      {field.value ? (
                        format(new Date(field.value), "PPPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Upload BL */}
        <FormField
          control={control}
          name="blDetails.uploadBL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload BL</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "blDetails.uploadBL");
                    }}
                    disabled={uploading}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-blue-500 text-white"
                  disabled={uploading}
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Review Field */}
        <FormField
          control={control}
          name="blDetails.review"
          render={({ field }) => (
            <FormItem className="col-span-4 mb-4">
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., this is some random comment for sale invoice details"
                  {...field}
                  onBlur={() => saveProgressSilently(getValues())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}