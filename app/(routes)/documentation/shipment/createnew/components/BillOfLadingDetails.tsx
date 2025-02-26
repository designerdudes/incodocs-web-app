"use client";
import { useFormContext } from "react-hook-form";
import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Added for review
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { SaveDetailsProps } from "./BookingDetails";

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function BillOfLadingDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue, getValues } = useFormContext();
  const [uploading, setUploading] = useState(false);

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
      const storageUrl = data.storageLink; // Adjust based on actual API response key
      setValue(fieldName, storageUrl);
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
      {/* Review Field */}
      <FormField
        control={control}
        name="blDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4 mb-4">
            <FormLabel>Review</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment for BL details"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
                    {field.value ? format(new Date(field.value), "PPPP") : <span>Pick a date</span>}
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
                    {field.value ? format(new Date(field.value), "PPPP") : <span>Pick a date</span>}
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
      <div className="mt-2">
        <Button type="button" onClick={() => saveProgress(getValues())}>
          Save Progress
        </Button>
      </div>
    </div>
  );
}