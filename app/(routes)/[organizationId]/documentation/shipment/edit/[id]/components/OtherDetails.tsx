"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadCloud, Trash, Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

interface OtherDetailsProps {
  shipmentId: string;
  saveProgress: (data: any) => void;
}

export function OtherDetails({ shipmentId, saveProgress }: OtherDetailsProps) {
  const { control, setValue, watch } = useFormContext();
  const [uploading, setUploading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherDetails",
  });

  // Watch form values
  const formValues = watch("otherDetails");

  // Autosave form data when otherDetails changes
  useEffect(() => {
    saveProgress({ otherDetails: formValues });
  }, [formValues, saveProgress]);

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
      console.log("Updated otherDetails:", watch("otherDetails"));
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Add new certificate
  const handleAddCertificate = () => {
    append({
      review: "",
      certificateName: "",
      certificateNumber: "",
      date: undefined,
      issuerOfCertificate: "",
      uploadCopyOfCertificate: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Documents</h2>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCertificate}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      {fields.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Certificate Name</TableHead>
                <TableHead>Certificate Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Upload Certificate</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`otherDetails[${index}].certificateName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="eg. Fumigation Certificate"
                              {...field}
                              value={field.value ?? ""}
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
                      name={`otherDetails[${index}].certificateNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="eg. CERT123456"
                              className="uppercase"
                              {...field}
                              value={field.value ?? ""}
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
                      name={`otherDetails[${index}].date`}
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value &&
                                  !isNaN(new Date(field.value).getTime()) ? (
                                    format(new Date(field.value), "PPPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value &&
                                  !isNaN(new Date(field.value).getTime())
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
                      name={`otherDetails[${index}].issuerOfCertificate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="eg. Certification Authority"
                              {...field}
                              value={field.value ?? ""}
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
                      name={`otherDetails[${index}].uploadCopyOfCertificate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              {field.value && field.value.startsWith("http") ? (
                                <div className="flex gap-2 mt-2">
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
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setValue(
                                        `otherDetails[${index}].uploadCopyOfCertificate`,
                                        "",
                                        { shouldDirty: true }
                                      )
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Input
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleFileUpload(
                                          file,
                                          `otherDetails[${index}].uploadCopyOfCertificate`
                                        );
                                      }
                                    }}
                                    disabled={uploading}
                                  />
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="text-white bg-blue-500 hover:bg-blue-600"
                                    disabled={uploading}
                                  >
                                    <UploadCloud className="w-5 h-5 mr-2" />
                                    {uploading ? "Uploading..." : "Upload"}
                                  </Button>
                                </>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`otherDetails[${index}].review`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="eg. Additional comments"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
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
  );
}
