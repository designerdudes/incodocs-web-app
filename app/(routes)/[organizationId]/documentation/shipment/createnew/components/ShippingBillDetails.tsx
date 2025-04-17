
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useFormContext, Path } from "react-hook-form";
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/ui/icons";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { toast } from "react-hot-toast";

// Form data types
interface ShippingBillDetails {
  portCode: string;
  cbName: string;
  cdCode: string;
  numberOFShippingBill: number;
  ShippingBills: ShippingBill[];
  review?: string;
}

interface ShippingBill {
  shippingBillUrl: string;
  shippingBillNumber: string;
  shippingBillDate: string;
  drawbackValue: string;
  rodtepValue: string;
}

interface FormData {
  shipmentId?: string;
  shippingBillDetails: ShippingBillDetails;
}

interface ShippingBillDetailsProps {
  onSectionSubmit: () => void;
}

export function ShippingBillDetails({ onSectionSubmit }: ShippingBillDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const shippingBillsFromForm = watch("shippingBillDetails.ShippingBills") || [];
  const initialCount = 1;
  const [shippingBills, setShippingBills] = useState<ShippingBill[]>(
    shippingBillsFromForm.length > 0
      ? shippingBillsFromForm
      : Array.from({ length: initialCount }, () => ({
          shippingBillUrl: "",
          shippingBillNumber: "",
          shippingBillDate: "",
          drawbackValue: "",
          rodtepValue: "",
        }))
  );
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(
    Array(shippingBillsFromForm.length > 0 ? shippingBillsFromForm.length : initialCount).fill(null)
  );
  const [uploading, setUploading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [shippingBillCountToBeDeleted, setShippingBillCountToBeDeleted] = useState<number | null>(null);

  // Initialize form with default shippingBillDetails if missing
  useEffect(() => {
    const formData = getValues();
    if (!formData.shippingBillDetails) {
      setValue(
        "shippingBillDetails",
        {
          portCode: "",
          cbName: "",
          cdCode: "",
          numberOFShippingBill: initialCount,
          ShippingBills: shippingBills,
          review: "",
        },
        { shouldDirty: false }
      );
    } else if (!formData.shippingBillDetails.numberOFShippingBill) {
      setValue("shippingBillDetails.numberOFShippingBill", initialCount, { shouldDirty: false });
      setValue("shippingBillDetails.ShippingBills", shippingBills, { shouldDirty: false });
    }
  }, [setValue, getValues, watch, shippingBills]);

  const handleShippingBillCountChange = useCallback(
    (value: string) => {
      const newCount = Number(value) || initialCount;
      if (newCount < shippingBills.length) {
        setShowConfirmation(true);
        setShippingBillCountToBeDeleted(newCount);
      } else {
        handleDynamicArrayCountChange<FormData>({
          value,
          watch,
          setValue,
          getValues,
          fieldName: "shippingBillDetails.ShippingBills",
          countFieldName: "shippingBillDetails.numberOFShippingBill",
          createNewItem: () => ({
            shippingBillUrl: "",
            shippingBillNumber: "",
            shippingBillDate: "",
            drawbackValue: "",
            rodtepValue: "",
          }),
          customFieldSetters: {
            "shippingBillDetails.ShippingBills": (items: ShippingBill[], setValue) => {
              setValue("shippingBillDetails.numberOFShippingBill", items.length, { shouldDirty: false });
              setShippingBills(items);
              setSelectedFiles(Array(items.length).fill(null));
            },
          },
        });
      }
    },
    [watch, setValue, getValues, shippingBills]
  );

  const handleConfirmChange = useCallback(() => {
    if (shippingBillCountToBeDeleted !== null) {
      const updatedShippingBills = shippingBills.slice(0, shippingBillCountToBeDeleted);
      setShippingBills(updatedShippingBills);
      setSelectedFiles(Array(updatedShippingBills.length).fill(null));
      setValue("shippingBillDetails.ShippingBills", updatedShippingBills, { shouldDirty: false });
      setValue("shippingBillDetails.numberOFShippingBill", updatedShippingBills.length, { shouldDirty: false });
      setShippingBillCountToBeDeleted(null);
      setShowConfirmation(false);
    }
  }, [shippingBills, shippingBillCountToBeDeleted, setValue]);

  const handleDeleteBill = useCallback(
    (index: number) => {
      const updatedShippingBills = shippingBills.filter((_, i) => i !== index);
      setShippingBills(updatedShippingBills);
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setValue("shippingBillDetails.ShippingBills", updatedShippingBills, { shouldDirty: false });
      setValue("shippingBillDetails.numberOFShippingBill", updatedShippingBills.length, { shouldDirty: false });
    },
    [shippingBills, setValue]
  );

  const handleFileUpload = async (file: File, fieldName: Path<FormData>, index: number) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:4080/shipmentdocsfile/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      const storageUrl = data.storageLink;
      setValue(fieldName, storageUrl, { shouldDirty: false });
      setSelectedFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = null;
        return newFiles;
      });
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      <FormField
        control={control}
        name="shippingBillDetails.portCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g., SB101" className="uppercase" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shippingBillDetails.cbName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CB Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., xyz" className="uppercase" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shippingBillDetails.cdCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CB Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g., randomcode" className="uppercase" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shippingBillDetails.numberOFShippingBill"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Shipping Bills</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number"
                value={field.value || initialCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(initialCount);
                    handleShippingBillCountChange(initialCount.toString());
                    return;
                  }
                  const numericValue = Number(value);
                  if (!isNaN(numericValue) && numericValue >= 1) {
                    field.onChange(numericValue);
                    handleShippingBillCountChange(numericValue.toString());
                  }
                }}
                min={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {shippingBills.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Upload Shipping Bill</TableHead>
                <TableHead>Shipping Bill Number</TableHead>
                <TableHead>Shipping Bill Date</TableHead>
                <TableHead>Drawback Value</TableHead>
                <TableHead>RODTEP Value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingBills.map((_: ShippingBill, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.ShippingBills[${index}].shippingBillUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.png,.jpeg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setSelectedFiles((prev) => {
                                      const newFiles = [...prev];
                                      newFiles[index] = file;
                                      return newFiles;
                                    });
                                  }
                                }}
                                disabled={uploading}
                              />
                              <Button
                                variant="secondary"
                                className="bg-blue-500 text-white"
                                disabled={uploading || !selectedFiles[index]}
                                onClick={() => {
                                  if (selectedFiles[index]) {
                                    handleFileUpload(
                                      selectedFiles[index]!,
                                      `shippingBillDetails.ShippingBills[${index}].shippingBillUrl`,
                                      index
                                    );
                                  }
                                }}
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
                      name={`shippingBillDetails.ShippingBills[${index}].shippingBillNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="e.g., 34583" className="uppercase" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.ShippingBills[${index}].shippingBillDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value ? format(new Date(field.value), "PPPP") : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => {
                                  field.onChange(date?.toISOString());
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
                      name={`shippingBillDetails.ShippingBills[${index}].drawbackValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="e.g., 2394" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.ShippingBills[${index}].rodtepValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="e.g., 8934" {...field} />
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
                      onClick={() => handleDeleteBill(index)}
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
      <FormField
        control={control}
        name="shippingBillDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4 mt-4">
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., this is some random comment" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-end mt-4 col-span-4">
        <Button
          type="button"
          onClick={onSectionSubmit}
          className="h-8"
          disabled={uploading}
        >
          Submit
          {uploading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
        </Button>
      </div>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setShippingBillCountToBeDeleted(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of shipping bills. This action cannot be undone."
      />
    </div>
  );
}