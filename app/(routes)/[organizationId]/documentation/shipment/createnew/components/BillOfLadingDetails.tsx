"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
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
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import ShippinglineForm from "@/components/forms/Addshippinglineform";
import { useGlobalModal } from "@/hooks/GlobalModal";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import toast from "react-hot-toast";
import { FileUploadField } from "./FileUploadField";
import CalendarComponent from "@/components/CalendarComponent";

interface BillOfLadingDetailsProps {
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

export function BillOfLadingDetails({
  saveProgress,
  onSectionSubmit,
  params,
}: BillOfLadingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const organizationId = Array.isArray(params) ? params[0] : params;
  const blFromForm = watch("blDetails.Bl") || [];
  const [uploading, setUploading] = useState(false);
  const [shippingLines, setShippingLines] = useState<{ _id: string; name: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingBlCount, setPendingBlCount] = useState<number | null>(null);
  const GlobalModal = useGlobalModal();

  // Fetch shipping lines
  useEffect(() => {
    const fetchShippingLines = async () => {
      try {
        const response = await fetch(
          `https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/${organizationId}`
        );
        const data = await response.json();
        const mappedShippingLines = data.map((shippingLine: any) => ({
          _id: shippingLine._id,
          name: shippingLine.name || shippingLine.shippingLineName,
        }));
        setShippingLines(mappedShippingLines);
      } catch (error) {
        console.error("Error fetching shipping lines:", error);
        // toast.error("Failed to load shipping lines");
      }
    };
    fetchShippingLines();
  }, [organizationId]);

  const handleBlCountChange = (value: string) => {
    handleDynamicArrayCountChange({
      value,
      watch,
      setValue,
      getValues,
      fieldName: "blDetails.Bl",
      createNewItem: () => ({
        blNumber: "",
        blDate: "",
        telexDate: "",
        uploadBLUrl: "",
      }),
      customFieldSetters: {
        "blDetails.Bl": (items, setValue) => {
          setValue("blDetails.noOfBl", items.length);
        },
      },
      saveCallback: saveProgressSilently,
      isDataFilled: (item) =>
        !!item.blNumber ||
        !!item.blDate ||
        !!item.telexDate ||
        !!item.uploadBLUrl,
      onRequireConfirmation: (pendingItems, confirmedCallback) => {
        setShowConfirmation(true);
        setPendingBlCount(pendingItems.length);
      },
    });
  };

  const handleBlDelete = (index: number) => {
    const updatedBlEntries = blFromForm.filter((_: any, i: number) => i !== index);
    setValue("blDetails.Bl", updatedBlEntries);
    setValue("blDetails.noOfBl", updatedBlEntries.length);
    saveProgressSilently(getValues());
  };

  const handleConfirmChange = () => {
    if (pendingBlCount !== null) {
      const updatedBlEntries = blFromForm.slice(0, pendingBlCount);
      setValue("blDetails.Bl", updatedBlEntries);
      setValue("blDetails.noOfBl", updatedBlEntries.length);
      saveProgressSilently(getValues());
      setPendingBlCount(null);
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

  const openShippingLineForm = () => {
    GlobalModal.title = "Add New Shipping Line";
    GlobalModal.children = (
      <ShippinglineForm
        onSuccess={async () => {
          try {
            const res = await fetch(
              `https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/${organizationId}`
            );
            const data = await res.json();
            const mappedShippingLines = data.map((shippingLine: any) => ({
              _id: shippingLine._id,
              name: shippingLine.name || shippingLine.shippingLineName,
            }));
            setShippingLines(mappedShippingLines);
            saveProgressSilently(getValues());
          } catch (error) {
            console.error("Error refreshing shipping lines:", error);
            toast.error("Failed to refresh shipping lines");
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
          name="blDetails.shippingLineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Line</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={shippingLines}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="name"
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
          name="blDetails.noOfBl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bills of Lading</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of BLs"
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value, 10) < 0) return;
                    field.onChange(parseInt(value, 10));
                    handleBlCountChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {blFromForm.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>BL Number</TableHead>
                <TableHead>Upload BL</TableHead>
                <TableHead>BL Date</TableHead>
                <TableHead>Telex Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blFromForm.map((_: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`blDetails.Bl[${index}].blNumber`}
                      render={({ field }) => (
                        <FormItem>
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
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`blDetails.Bl[${index}].uploadBLUrl`}
                      render={({ field }) => (
                        <FileUploadField
                          name={`blDetails.Bl[${index}].uploadBLUrl`}
                          storageKey={`blDetails_Bl${index}`}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`blDetails.Bl[${index}].blDate`}
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
                              <CalendarComponent
                                selected={
                                  field.value ? new Date(field.value) : undefined
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
                      name={`blDetails.Bl[${index}].telexDate`}
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
                              <CalendarComponent
                                selected={
                                  field.value ? new Date(field.value) : undefined
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
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => handleBlDelete(index)}
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

      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-3">
        <FormField
          control={control}
          name="blDetails.review"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., this is some random comment for bill of lading details"
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
          setPendingBlCount(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of bills of lading. This action cannot be undone."
      />
    </div>
  );
}