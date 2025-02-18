"use client";
import React, { useState } from "react";
import { useFormContext} from "react-hook-form";
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

export function ShippingBillDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue } = useFormContext();
  const [shippingBills, setShippingBills] = useState<
    {
      uploadShippingBill: string;
      shippingBillNumber: string;
      shippingBillDate: string;
      drawbackValue: string;
      rodtepValue: string;
    }[]
  >([]);
  const { handleSubmit } = useFormContext();

  const handleShippingBillCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newShippingBills = Array.from({ length: count }, () => ({
        uploadShippingBill: "",
        shippingBillNumber: "",
        shippingBillDate: "",
        drawbackValue: "",
        rodtepValue: "",
      }));
      setShippingBills(newShippingBills);
      setValue("shippingBillDetails.Bills", newShippingBills);
    } else {
      setShippingBills([]);
      setValue("shippingBillDetails.Bills", []);
    }
  };

  const handleDeleteBill = (index: number) => {
    // Remove the selected index from shippingBills
    const updatedShippingBills = shippingBills.filter((_, i) => i !== index);

    // Update local state
    setShippingBills(updatedShippingBills);

    // Reset form value for the updated shipping bill list
    setValue("shippingBillDetails.bills", updatedShippingBills);
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
                placeholder="eg. 123456"
                className="uppercase"
                {...field}
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
                placeholder="eg. 123456"
                className="uppercase"
                {...field}
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
                placeholder="eg. 123456"
                className="uppercase"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="noOfShippingBills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Shipping Bills</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
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
                <TableHead>Upload Shipping</TableHead>
                <TableHead>Shipping Bill Number</TableHead>
                <TableHead>Shipping Bill Date</TableHead>
                <TableHead>Drawback Value</TableHead>
                <TableHead>Rodtep Value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingBills.map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.bills[${index}].uploadShippingBill`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
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
                      name={`shippingBillDetails.bills[${index}].shippingBillNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Bill Number"
                              className="uppercase"
                              {...field}
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
                                  {field.value
                                    ? format(field.value, "PPPP")
                                    : "Pick a date"}
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
                            <Input placeholder="525121" {...field} />
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
                            <Input placeholder="446656  " {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  {/* Delete Button */}
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
      <div className="m-2">
        <Button type="button" onClick={handleSubmit(saveProgress)}>
          Save Progress
        </Button>
      </div>
    </div>
  );
}
