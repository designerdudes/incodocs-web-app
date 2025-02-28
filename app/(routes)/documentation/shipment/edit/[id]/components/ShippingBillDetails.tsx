"use client";
import React from "react";
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
import { CalendarIcon, Trash } from "lucide-react";
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
        uploadShippingBill: "",
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
      toast.error(`Failed to update shipping bill details`);

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
                  {...field}
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
                        name={`shippingBillDetails.bills[${index}].uploadShippingBill`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) => field.onChange(e.target.files?.[0])}
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
        Update Shipping Bill Details
      </Button>
    </form>
  );
}