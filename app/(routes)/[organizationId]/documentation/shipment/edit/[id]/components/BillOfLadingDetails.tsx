"use client";
import React, { useEffect, useState } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
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
import { CalendarIcon, Eye, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import EntityCombobox from "@/components/ui/EntityCombobox";
import ShippinglineForm from "@/components/forms/Addshippinglineform";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Icons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import CalendarComponent from "@/components/CalendarComponent";
import { fetchData } from "@/axiosUtility/api";

interface BillOfLadingDetailsProps {
  shipmentId: string;
  orgId?: string;
  params: string | string[];
 currentUser : string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
}

export function BillOfLadingDetails({
  shipmentId,
  orgId,
  params,
  currentUser,
  saveProgress,
  onSectionSubmit,
}: BillOfLadingDetailsProps) {
  const organizationId = Array.isArray(params) ? params[0] : params;
  const { control, setValue, getValues, watch } = useFormContext();
  const [shippingLines, setShippingLines] = useState<
    { _id: string; shippingLineName: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();

  // Watch form values
  const formValues = watch("blDetails");

  // Log form values for debugging
  useEffect(() => {
    console.log("BillOfLadingDetails formValues:", formValues);
    console.log("BillOfLadingDetails shippingLines:", shippingLines);
  }, [formValues, shippingLines]);

  // Autosave form data when blDetails changes
  useEffect(() => {
    if (formValues) {
      saveProgress({ blDetails: formValues });
    }
  }, [formValues, saveProgress]);

  // Ensure Bl array has at least one entry
  useEffect(() => {
    if (!formValues?.Bl || formValues.Bl.length === 0) {
      setValue(
        "blDetails.Bl",
        [
          {
            blNumber: "",
            blDate: undefined,
            telexDate: undefined,
            uploadBLUrl: undefined,
          },
        ],
        { shouldDirty: false }
      );
    }
  }, [formValues, setValue]);

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
    const fetchShippingLines = async () => {
      try {
        const orgIdToUse = orgId || "674b0a687d4f4b21c6c980ba"; // Fallback to hardcoded ID
        const shippingData = await fetchData(`/shipment/shippingline/getbyorg/${orgIdToUse}`);
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
    fetchShippingLines();
  }, [orgId]);

  const openShippingLineForm = () => {
    GlobalModal.title = "Add New Shipping Line";
    GlobalModal.children = (
      <ShippinglineForm
      currentUser = {currentUser}
        orgId={orgId}
        onSuccess={async () => {
          try {
            const orgIdToUse = orgId || "674b0a687d4f4b21c6c980ba";
            const data = await fetchData(`/shipment/shippingline/getbyorg/${orgIdToUse}`);
            setShippingLines(
              Array.isArray(data)
                ? data.map((line: any) => ({
                    _id: line._id,
                    shippingLineName: line.shippingLineName,
                  }))
                : []
            );
          } catch (error) {
            console.error("Error refreshing shipping lines:", error);
            toast.error("Failed to refresh shipping lines");
          }
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

  function saveProgressSilently(arg0: FieldValues): void {
    saveProgress({ BillOfLadingDetails: getValues().BillOfLadingDetails });
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Shipping Line */}
      <FormField
        control={control}
        name="blDetails.shippingLineName"
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
        name="blDetails.Bl[0].blNumber"
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
        name="blDetails.Bl[0].blDate"
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
                <CalendarComponent
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date: any) => {
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
        name="blDetails.Bl[0].telexDate"
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
                <CalendarComponent
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date: any) => {
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
        name="blDetails.Bl[0].uploadBLUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload BL</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                {field.value ? (
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
                        setValue("blDetails.Bl[0].uploadBLUrl", "", {
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
                          handleFileUpload(file, "blDetails.Bl[0].uploadBLUrl");
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

      {/* Review */}
      <FormField
        control={control}
        name="blDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}