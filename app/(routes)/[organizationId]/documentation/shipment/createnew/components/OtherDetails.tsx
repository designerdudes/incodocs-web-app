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
import { CalendarIcon, Trash, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { SaveDetailsProps } from "./BookingDetails";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

export function OtherDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const otherDetailsFromForm = watch("otherDetails") || [];
  const [otherDetails, setOtherDetails] = useState(otherDetailsFromForm);

  const handleCertificateCountChange = (value: string) => {
    const count = parseInt(value, 10) || 0;
    const currentDetails = watch("otherDetails") || [];
    const newDetails = Array.from(
      { length: count },
      (_, i) =>
        currentDetails[i] || {
          review: "",
          certificateName: "",
          certificateNumber: "",
          date: null,
          issuerOfCertificate: "",
          uploadCopyOfCertificate: "",
        }
    );
    setOtherDetails(newDetails);
    setValue("otherDetails", newDetails);
    saveProgress(getValues());
  };

  const handleDeleteDetail = (index: number) => {
    const updatedDetails = otherDetails.filter((_: any, i: number) => i !== index);
    setOtherDetails(updatedDetails);
    setValue("otherDetails", updatedDetails);
    saveProgress(getValues());
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
      saveProgress(getValues());
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
        name="otherDetails.length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Certificates</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of certificates"
                value={field.value || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value >= 0) {
                    field.onChange(value);
                    handleCertificateCountChange(e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {otherDetails.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Certificate Name</TableHead>
                <TableHead>Certificate Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Upload Certificate</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherDetails.map((_: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`otherDetails[${index}].certificateName`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="e.g., coo"
                            {...field}
                            onBlur={() => saveProgress(getValues())}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`otherDetails[${index}].certificateNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="e.g., hfsd89"
                            className="uppercase"
                            {...field}
                            onBlur={() => saveProgress(getValues())}
                            required // Enforce required field
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`otherDetails[${index}].date`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className="w-full">
                                  {field.value
                                    ? format(new Date(field.value), "PPPP")
                                    : "Pick a date"}
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
                                  saveProgress(getValues());
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
                      name={`otherDetails[${index}].issuerOfCertificate`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="e.g., don't know"
                            {...field}
                            onBlur={() => saveProgress(getValues())}
                          />
                        </FormControl>
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
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.png,.jpeg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, `otherDetails[${index}].uploadCopyOfCertificate`);
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
                        <FormControl>
                          <Textarea
                            placeholder="e.g., this is some random comment"
                            {...field}
                            onBlur={() => saveProgress(getValues())}
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
    </div>
  );
}