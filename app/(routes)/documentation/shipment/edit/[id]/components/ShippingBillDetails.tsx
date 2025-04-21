"use client";
import React, { useState } from "react";
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
import { CalendarIcon, Trash, UploadCloud } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";

interface ShippingBillDetailsProps {
  shipmentId: string;
}

export function ShippingBillDetails({ shipmentId }: ShippingBillDetailsProps) {
  const { control, setValue, handleSubmit, watch } = useFormContext();
  const [uploading, setUploading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shippingBillDetails.bills",
  });

  // Watch form values for debugging
  const formValues = watch("shippingBillDetails");
  console.log("Current Shipping Bill Details Values:", formValues);

  // Handle Number of Shipping Bills Change
  const handleShippingBillCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;

    setValue("shippingBillDetails.numberOFShippingBill", value, { shouldDirty: true });

    const currentBills = formValues.bills || [];
    if (value > currentBills.length) {
      const newBills = Array(value - currentBills.length).fill(null).map(() => ({
        shippingBillUrl: "", // Changed to match UI field
        shippingBillNumber: "",
        shippingBillDate: undefined,
        drawbackValue: "",
        rodtepValue: "",
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
      const response = await fetch("http://localhost:4080/shipmentdocsfile/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("File upload failed");
      const data = await response.json();
      const storageUrl = data.storageLink; // Adjust based on actual API response key
      setValue(fieldName, storageUrl, { shouldDirty: true });
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Update API Call
  const onSubmit = async (data: any) => {
    console.log("Submitting Shipping Bill Details:", data.shippingBillDetails);
    try {
      const response = await fetch("http://localhost:4080/shipment/shipping-bill-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipmentId, shippingBillDetails: data.shippingBillDetails }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update shipping bill details: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      toast.success("Shipping bill details updated successfully!");
    } catch (error) {
      console.error("Error updating shipping bill details:", error);
      toast.error("Failed to update shipping bill details");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

        {/* CB Name */}
        <FormField
          control={control}
          name="shippingBillDetails.cbName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CB Name</FormLabel>
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

        {/* CB Code */}
        <FormField
          control={control}
          name="shippingBillDetails.cbCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CB Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. CB123"
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
                        name={`shippingBillDetails.bills[${index}].shippingBillUrl`}
                        render={({ field }) => (
                          <FormItem>
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
                                      onClick={() => setValue(`shippingBillDetails.bills[${index}].shippingBillUrl`, "", { shouldDirty: true })}
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
                                          handleFileUpload(file, `shippingBillDetails.bills[${index}].shippingBillUrl`);
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
                                placeholder="Bill Number"
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
                                    {field.value ? format(field.value, "PPPP") : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align="start">
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
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingBillDetails.bills[${index}].drawbackValue`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="525121"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
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
                                placeholder="446656"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
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
        )}
      </div>
      <Button type="submit" className="mt-4">
        Update
      </Button>
    </form>
  );
}