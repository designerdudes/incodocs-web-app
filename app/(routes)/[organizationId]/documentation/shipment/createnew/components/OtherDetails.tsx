"use client";
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
import { useState, useEffect } from "react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { FileUploadField } from "./FileUploadField";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Path } from "react-hook-form";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import CalendarComponent from "@/components/CalendarComponent";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

// Define interfaces for TypeScript
interface OtherDetail {
  review: string;
  certificateName: string;
  certificateNumber: string;
  date: string | null;
  issuerOfCertificate: string;
  uploadCopyOfCertificate: string;
}

interface FormData {
  otherDetailsCount: number;
  otherDetails: OtherDetail[];
}

interface SaveDetailsProps {
  saveProgress: (data: any) => void;
}

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

// Helper function to generate type-safe field names
const getFieldName = <T extends FormData>(
  index: number,
  field: keyof OtherDetail
): Path<T> => `otherDetails[${index}].${field}` as Path<T>;

export function OtherDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const [uploading, setUploading] = useState(false);
  const otherDetailsFromForm = watch("otherDetails") || [];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [certificateCountToBeDeleted, setCertificateCountToBeDeleted] = useState<number | null>(null);

  // Initialize form fields
  useEffect(() => {
    if (!otherDetailsFromForm.length) {
      setValue("otherDetails", [
        {
          review: "",
          certificateName: "",
          certificateNumber: "",
          date: null,
          issuerOfCertificate: "",
          uploadCopyOfCertificate: "",
        },
      ]);
    }
    setValue("otherDetailsCount", otherDetailsFromForm.length || 1);
  }, [setValue, otherDetailsFromForm.length]);

  const handleCertificateCountChange = (value: string) => {
    const newCount = Number(value) || 1;

    if (newCount < otherDetailsFromForm.length) {
      setShowConfirmation(true);
      setCertificateCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "otherDetails",
        createNewItem: () => ({
          review: "",
          certificateName: "",
          certificateNumber: "",
          date: null,
          issuerOfCertificate: "",
          uploadCopyOfCertificate: "",
        }),
        customFieldSetters: {
          otherDetails: (items: OtherDetail[], setValue) => {
            setValue("otherDetailsCount", items.length);
          },
        },
        saveCallback: saveProgressSilently,
      });
    }
  };

  const handleConfirmChange = () => {
    if (certificateCountToBeDeleted !== null) {
      const updatedDetails = otherDetailsFromForm.slice(0, certificateCountToBeDeleted);
      setValue("otherDetails", updatedDetails);
      setValue("otherDetailsCount", updatedDetails.length);
      saveProgressSilently(getValues());
      setCertificateCountToBeDeleted(null);
    }
    setShowConfirmation(false);
  };

  const handleDeleteDetail = (index: number) => {
    const updatedDetails = otherDetailsFromForm.filter((_: any, i: number) => i !== index);
    setValue("otherDetails", updatedDetails);
    setValue("otherDetailsCount", updatedDetails.length);
    saveProgressSilently(getValues());
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetchWithAuth<any>(
        "/shipmentdocsfile/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = response;
      const storageUrl = data.url;
      setValue(fieldName as any, storageUrl);
      saveProgressSilently(getValues());
    } catch (error) {
      alert("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Number of Certificates */}
      <FormField
        control={control}
        name="otherDetailsCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Documents</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of documents"
                value={field.value || 1}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(1);
                    handleCertificateCountChange("1");
                    return;
                  }
                  const numericValue = Number(value);
                  field.onChange(numericValue);
                  handleCertificateCountChange(numericValue.toString());
                }}
                min={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {otherDetailsFromForm.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Document Name</TableHead>
                <TableHead>Document Number</TableHead>
                <TableHead>Upload Document</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherDetailsFromForm.map((_: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={getFieldName<FormData>(index, "certificateName")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., coo"
                              value={field.value as any || ""}
                              onChange={field.onChange}
                              onBlur={() => {
                                field.onBlur();
                                saveProgressSilently(getValues());
                              }}
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
                      name={getFieldName<FormData>(index, "certificateNumber")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., hfsd89"
                              className="uppercase"
                              value={field.value as any || ""}
                              onChange={field.onChange}
                              onBlur={() => {
                                field.onBlur();
                                saveProgressSilently(getValues());
                              }}
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
                      name={getFieldName<FormData>(index, "uploadCopyOfCertificate")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={getFieldName<FormData>(index, "uploadCopyOfCertificate")}
                              storageKey={`uploadCopyOfCertificate}`}
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
                      name={getFieldName<FormData>(index, "date")}
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
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                selected={field.value ? new Date(field.value as any) : undefined}
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
                      name={getFieldName<FormData>(index, "issuerOfCertificate")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., don't know"
                              value={field.value as any || ""}
                              onChange={field.onChange}
                              onBlur={() => {
                                field.onBlur();
                                saveProgressSilently(getValues());
                              }}
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
                      name={getFieldName<FormData>(index, "review")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., this is some random comment"
                              value={field.value as any || ""}
                              onChange={field.onChange}
                              onBlur={() => {
                                field.onBlur();
                                saveProgressSilently(getValues());
                              }}
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
                      onClick={() => handleDeleteDetail(index)}
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

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setCertificateCountToBeDeleted(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of certificates. This action cannot be undone."
      />
    </div>
  );
}