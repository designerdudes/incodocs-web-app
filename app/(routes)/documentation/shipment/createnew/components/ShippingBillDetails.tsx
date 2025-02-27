"use client";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Added for review field
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
import { SaveDetailsProps } from "./BookingDetails";

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function ShippingBillDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const shippingBillsFromForm = watch("shippingBillDetails.ShippingBills") || [];
  const [shippingBills, setShippingBills] = useState(shippingBillsFromForm);
  const [uploading, setUploading] = useState(false);

  const handleShippingBillCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const currentBills = watch("shippingBillDetails.ShippingBills") || [];
      const newShippingBills = Array.from({ length: count }, (_, i) =>
        currentBills[i] || {
          shippingBillUrl: "",
          shippingBillNumber: "",
          shippingBillDate: "",
          drawbackValue: "",
          rodtepValue: "",
        }
      );
      setShippingBills(newShippingBills);
      setValue("shippingBillDetails.ShippingBills", newShippingBills);
      saveProgressSilently(getValues());
    } else {
      setShippingBills([]);
      setValue("shippingBillDetails.ShippingBills", []);
      saveProgressSilently(getValues());
    }
  };

  const handleDeleteBill = (index: number) => {
    const updatedShippingBills = shippingBills.filter((_: any, i: number) => i !== index);
    setShippingBills(updatedShippingBills);
    setValue("shippingBillDetails.ShippingBills", updatedShippingBills);
    saveProgressSilently(getValues());
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
     
      {/* Port Code */}
      <FormField
        control={control}
        name="shippingBillDetails.portCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port Code</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., SB101"
                className="uppercase"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
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
                placeholder="e.g., xyz"
                className="uppercase"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* CD Code */}
      <FormField
        control={control}
        name="shippingBillDetails.cdCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CD Code</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., randomcode"
                className="uppercase"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Number of Shipping Bills */}
      <FormField
        control={control}
        name="numberOFShippingBill"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Shipping Bills</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number"
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (isNaN(value) || value < 0) return;
                  field.onChange(value);
                  handleShippingBillCountChange(e.target.value);
                }}
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
              {shippingBills.map((_: any, index: number) => (
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
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file)
                                    handleFileUpload(
                                      file,
                                      `shippingBillDetails.ShippingBills[${index}].shippingBillUrl`
                                    );
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
                            <Input
                              placeholder="e.g., 34583"
                              className="uppercase"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
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
                      name={`shippingBillDetails.ShippingBills[${index}].shippingBillDate`}
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value
                                    ? format(new Date(field.value), "PPPP")
                                    : "Pick a date"}
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
                      name={`shippingBillDetails.ShippingBills[${index}].drawbackValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 2394"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
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
                      name={`shippingBillDetails.ShippingBills[${index}].rodtepValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 8934"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
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
   {/* Review */}
   <FormField
        control={control}
        name="shippingBillDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Review</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
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