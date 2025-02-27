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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface OtherDetailsProps {
  shipmentId: string;
}

export function OtherDetails({ shipmentId }: OtherDetailsProps) {
  const { control, handleSubmit, watch } = useFormContext();
  const [file, setFile] = useState<File | null>(null);

  // Watch form values for debugging
  const formValues = watch("otherDetails");
  console.log("Current Other Details Values:", formValues);

  // Specific watch for shippingBillNumber
  const shippingBillNumberValue = watch("otherDetails[0].certificateNumber");
  console.log("Shipping Bill Number Value:", shippingBillNumberValue);

  // Update API Call
  const onSubmit = async (data: any) => {
    console.log("Submitting Other Details:", data.otherDetails);
    try {
      const formData = new FormData();
      formData.append("shipmentId", shipmentId);
      // Map UI fields back to API fields
      formData.append("certificateNumber", data.otherDetails[0].certificateNumber || "");
      formData.append("date", data.otherDetails[0].date ? data.otherDetails[0].date.toISOString() : "");
      formData.append("issuerOfCertificate", data.otherDetails[0].issuerOfCertificate || "");
      if (data.otherDetails[0].uploadCopyOfCertificate) {
        formData.append("uploadCopyOfCertificate", data.otherDetails[0].uploadCopyOfCertificate);
      }
      // Include additional fields if needed
      formData.append("review", data.otherDetails[0].review || "");
      formData.append("certificateName", data.otherDetails[0].certificateName || "");

      const response = await fetch("http://localhost:4080/shipment/other-details", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update other details: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      alert("Other details updated successfully!");
    } catch (error) {
      console.error("Error updating other details:", error);
      alert(`Failed to update other details: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 gap-3">
        {/* Shipping Bill Number */}
        <FormField
          control={control}
          name="otherDetails[0].certificateNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Bill Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. 123456"
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

        {/* Certificate Date */}
        <FormField
          control={control}
          name="otherDetails[0].date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Certificate Date</FormLabel>
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

        {/* Issuer Name */}
        <FormField
          control={control}
          name="otherDetails[0].issuerOfCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issuer Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. John Doe"
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

        {/* Upload Copy Of Fumigation */}
        <FormField
          control={control}
          name="otherDetails[0].uploadCopyOfCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Copy Of Fumigation</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFile(file);
                      field.onChange(file);
                    }}
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
        Update Other Details
      </Button>
    </form>
  );
}