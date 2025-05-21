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
import { CalendarIcon, Trash } from "lucide-react";
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
import { Path } from "react-hook-form";
import CalendarComponent from "@/components/CalendarComponent";


// Define interfaces for TypeScript
interface BillOfLading {
  blNumber: string;
  blDate: string;
  telexDate: string;
  uploadBLUrl: string;
}

interface FormData {
  blDetails: {
    noOfBl: number;
    shippingLineName: string;
    review: string;
    Bl: BillOfLading[];
  };
}


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

// Helper function to generate type-safe field names
const getFieldName = <T extends FormData>(
  index: number,
  field: keyof BillOfLading
): Path<T> => `blDetails.Bl[${index}].${field}` as Path<T>;

export function BillOfLadingDetails({
  saveProgress,
  onSectionSubmit,
  params,
}: BillOfLadingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
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
        toast.error("Failed to load shipping lines");
      }
    };
    fetchShippingLines();
  }, [organizationId]);

  // Debug confirmation state changes
  useEffect(() => {
    console.log("Confirmation state:", { showConfirmation, pendingBlCount, blFromForm });
  }, [showConfirmation, pendingBlCount, blFromForm]);

  const handleBlCountChange = (value: string) => {
    console.log("handleBlCountChange called with value:", value);
    const newCount = value === "" ? 1 : Number(value) || 1;
    if (newCount < 1) return;

    if (newCount < blFromForm.length) {
      console.log("Reducing BL count from", blFromForm.length, "to", newCount);
      setShowConfirmation(true);
      setPendingBlCount(newCount);
      return;
    }

    handleDynamicArrayCountChange({
      value: newCount.toString(),
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
    });
  };

  const handleBlDelete = (index: number) => {
    const updatedBlEntries = blFromForm.filter((_: any, i: number) => i !== index);
    setValue("blDetails.Bl", updatedBlEntries);
    setValue("blDetails.noOfBl", updatedBlEntries.length);
    saveProgressSilently(getValues());
  };

  const handleConfirmChange = () => {
    console.log("handleConfirmChange called with pendingBlCount:", pendingBlCount);
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
      setValue(fieldName as any, storageUrl);
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
                  value={field.value ?? 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(1);
                      handleBlCountChange("1");
                      return;
                    }
                    const numericValue = Number(value);
                    field.onChange(numericValue);
                    handleBlCountChange(value);
                  }}
                  min={1}
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
                      name={getFieldName<FormData>(index, "blNumber")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., BL456"
                              className="uppercase"
                              value={field.value as any || ""}
                              onChange={field.onChange}
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
                      name={getFieldName<FormData>(index, "uploadBLUrl")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={getFieldName<FormData>(index, "uploadBLUrl")}
                              storageKey={`blDetails_Bl${index}`}
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
                      name={getFieldName<FormData>(index, "blDate")}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className="w-full">
                                  {field.value
                                    ? format(new Date(field.value as any), "PPPP")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <CalendarComponent
                                selected={
                                  field.value ? new Date(field.value as any) : undefined
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
                      name={getFieldName<FormData>(index, "telexDate")}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className="w-full">
                                  {field.value
                                    ? format(new Date(field.value as any), "PPPP")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <CalendarComponent
                                selected={
                                  field.value ? new Date(field.value as any) : undefined
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
                  value={field.value || ""}
                  onChange={field.onChange}
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