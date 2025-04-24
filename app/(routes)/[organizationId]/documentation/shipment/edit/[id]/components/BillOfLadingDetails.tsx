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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import EntityCombobox from "@/components/ui/EntityCombobox";
import ShippinglineForm from "@/components/forms/Addshippinglineform";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Icons } from "@/components/ui/icons";

interface BillOfLadingDetailsProps {
  shipmentId: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
}

export function BillOfLadingDetails({
  shipmentId,
  saveProgress,
  onSectionSubmit,
}: BillOfLadingDetailsProps) {
  const { control, setValue, watch } = useFormContext();
  const [shippingLines, setShippingLines] = useState<
    { _id: string; shippingLineName: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();

  // Watch form values
  const formValues = watch("blDetails");

  // Autosave form data when blDetails changes
  useEffect(() => {
    saveProgress({ blDetails: formValues });
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
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Fetch shipping lines on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const shippingResponse = await fetch(
          "https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const shippingData = await shippingResponse.json();
        setShippingLines(
          Array.isArray(shippingData)
            ? shippingData.map((line: any) => ({
                _id: line._id,
                shippingLineName: line.shippingLineName,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching shipping lines:", error);
        toast.error("Failed to load shipping lines");
      }
    };
    fetchData();
  }, []);

  const openShippingLineForm = () => {
    GlobalModal.title = "Add New Shipping Line";
    GlobalModal.children = (
      <ShippinglineForm
        onSuccess={() => {
          fetch(
            "https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/674b0a687d4f4b21c6c980ba"
          )
            .then((res) => res.json())
            .then((data) => {
              setShippingLines(
                Array.isArray(data)
                  ? data.map((line: any) => ({
                      _id: line._id,
                      shippingLineName: line.shippingLineName,
                    }))
                  : []
              );
            });
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
      console.error("Error submitting Bill of Lading Details:", error);
      toast.error("Failed to submit Bill of Lading Details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Shipping Line */}
      <FormField
        control={control}
        name="blDetails.shippingLine"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Shipping Line</FormLabel>
            <FormControl>
              <EntityCombobox
                entities={shippingLines}
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
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
                    {field.value && !isNaN(new Date(field.value).getTime()) ? (
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
                  selected={
                    field.value && !isNaN(new Date(field.value).getTime())
                      ? new Date(field.value)
                      : undefined
                  }
                  onSelect={(date) => field.onChange(date?.toISOString())}
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
                    {field.value && !isNaN(new Date(field.value).getTime()) ? (
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
                  selected={
                    field.value && !isNaN(new Date(field.value).getTime())
                      ? new Date(field.value)
                      : undefined
                  }
                  onSelect={(date) => field.onChange(date?.toISOString())}
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
            <FormControl>
              <div className="flex items-center gap-2">
                {field.value ? (
                  <div className="flex flex-col gap-2">
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Uploaded File
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setValue("blDetails.uploadBL", "", {
                          shouldDirty: true,
                        })
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
                          handleFileUpload(file, "blDetails.uploadBL");
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
    </div>
  );
}