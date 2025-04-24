"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
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
import { CalendarIcon, Eye, Trash, UploadCloud } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { Icons } from "@/components/ui/icons";

interface ShippingBillDetailsProps {
  shipmentId: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
}

export function ShippingBillDetails({
  shipmentId,
  saveProgress,
  onSectionSubmit,
}: ShippingBillDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shippingBillDetails.bills",
  });

  // Watch form values
  const formValues = watch("shippingBillDetails");

  // Autosave form data when shippingBillDetails changes
  useEffect(() => {
    saveProgress({ shippingBillDetails: formValues });
  }, [formValues, saveProgress]);

  // Handle Number of Shipping Bills Change
  const handleShippingBillCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;

    setValue("shippingBillDetails.numberOFShippingBill", value, {
      shouldDirty: true,
    });

    const currentBills = formValues.bills || [];
    if (value > currentBills.length) {
      const newBills = Array(value - currentBills.length)
        .fill(null)
        .map(() => ({
          uploadShippingBill: "",
          shippingBillNumber: "",
          shippingBillDate: undefined,
          drawbackValue: undefined,
          rodtepValue: undefined,
        }));
      append(newBills);
    } else if (value < currentBills.length) {
      for (let i = currentBills.length - 1; i >= value; i--) {
        remove(i);
      }
    }
  };

  // Handle File Upload
  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        "http://localhost:4080/shipmentdocsfile/upload",
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

  // Handle section submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSectionSubmit();
    } catch (error) {
      console.error("Error submitting Shipping Bill Details:", error);
      toast.error("Failed to submit Shipping Bill Details");
    } finally {
      setIsLoading(false);
    }
  };

  // Format cbName if it's a date
  const formatCbName = (cbName: string | undefined) => {
    if (!cbName) return "";
    try {
      const date = new Date(cbName);
      if (!isNaN(date.getTime())) {
        return format(date, "yyyy-MM-dd");
      }
      return cbName;
    } catch {
      return cbName;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Port Code */}
      <FormField
        control={control}
        name="shippingBillDetails.portCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port Code</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. SB101"
                className="uppercase"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CB Name */}
      <FormField
        control={control}
        name="shippingBillDetails.cbName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CB Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. John Doe"
                className="uppercase"
                {...field}
                value={formatCbName(field.value)}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CB Code */}
      <FormField
        control={control}
        name="shippingBillDetails.cbCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CB Code</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. CB123"
                className="uppercase"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Number of Shipping Bills */}
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
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  field.onChange(value);
                  handleShippingBillCountChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Shipping Bills Table */}
      {fields.length > 0 && (
        <>
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Upload Shipping Bill</TableHead>
                  <TableHead>Shipping Bill Number</TableHead>
                  <TableHead>Shipping Bill Date</TableHead>
                  <TableHead>Drawback Value</TableHead>
                  <TableHead>Rodtep Value</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingBillDetails.bills[${index}].uploadShippingBill`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                {field.value ? (
                                  <div className="flex flex-col gap-2">
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
                                          `shippingBillDetails.bills[${index}].uploadShippingBill`,
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
                                            `shippingBillDetails.bills[${index}].uploadShippingBill`
                                          );
                                        }
                                      }}
                                      disabled={uploading}
                                    />
                                    <Button
                                      variant="secondary"
                                      className="bg-blue-500 text-white"
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
                        name={`shippingBillDetails.bills[${index}].shippingBillNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="e.g. 34583"
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
                        name={`shippingBillDetails.bills[${index}].shippingBillDate`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline">
                                    {field.value && !isNaN(new Date(field.value).getTime())
                                      ? format(new Date(field.value), "PPPP")
                                      : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align="start">
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value && !isNaN(new Date(field.value).getTime())
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date?.toISOString())
                                  }
                                  initialFocus
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
                        name={`shippingBillDetails.bills[${index}].drawbackValue`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 2394"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined
                                  )
                                }
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
                        name={`shippingBillDetails.bills[${index}].rodtepValue`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 446656"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined
                                  )
                                }
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
        </>
      )}
    </div>
  );
}