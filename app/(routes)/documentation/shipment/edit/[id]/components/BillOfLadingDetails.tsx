"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
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
import { CalendarIcon, UploadCloud } from "lucide-react";
import { format } from "date-fns";

interface BillOfLadingDetailsProps {
  shipmentId: string;
}

export function BillOfLadingDetails({ shipmentId }: BillOfLadingDetailsProps) {
  const { control, handleSubmit, watch } = useFormContext();

  // Watch form values for debugging
  const formValues = watch("blDetails");
  console.log("Current Bill of Lading Details Values:", formValues);

  // Update API Call
  const onSubmit = async (data: any) => {
    console.log("Submitting Bill of Lading Details:", data.blDetails);
    try {
      const formData = new FormData();
      formData.append("shipmentId", shipmentId);
      formData.append("blNumber", data.blDetails.blNumber || "");
      formData.append("blDate", data.blDetails.blDate ? data.blDetails.blDate.toISOString() : "");
      formData.append("telexDate", data.blDetails.telexDate ? data.blDetails.telexDate.toISOString() : "");
      if (data.blDetails.uploadBL) {
        formData.append("uploadBL", data.blDetails.uploadBL);
      }

      const response = await fetch("http://localhost:4080/shipment/bl-details", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update bill of lading details: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      alert("Bill of lading details updated successfully!");
    } catch (error) {
      console.error("Error updating bill of lading details:", error);
      alert(`Failed to update bill of lading details: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                  placeholder="eg. BL123456"
                  className="uppercase"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
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
                      {field.value ? format(field.value, "PPPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
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
                      {field.value ? format(field.value, "PPPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
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
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-white bg-blue-500 hover:bg-blue-600"
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  Upload
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button type="submit" className="mt-4">
        Update Bill of Lading Details
      </Button>
    </form>
  );
}