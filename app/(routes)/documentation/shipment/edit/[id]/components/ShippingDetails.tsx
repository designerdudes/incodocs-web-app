"use client";
import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, UploadCloud, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const ShippingName = [
  { id: "1", name: "Ahmed" },
  { id: "2", name: "Arshad" },
];

const ForwarderName = [
  { id: "67b3389cae0701f457cce215", name: "name02" }, // Match API _id
  { id: "2", name: "Syed" },
];

const TransporterName = [
  { id: "67b33170e70496525d88f081", name: "name1" }, // Match API _id
  { id: "2", name: "Aameer" },
];

interface ShippingDetailsProps {
  shipmentId: string;
}

export function ShippingDetails({ shipmentId }: ShippingDetailsProps) {
  const { control, setValue, handleSubmit, watch } = useFormContext();

  const { fields: shippingLineFields, append: appendShippingLine, remove: removeShippingLine } = useFieldArray({
    control,
    name: "shippingDetails.shippingLineInvoices",
  });

  const { fields: forwarderFields, append: appendForwarder, remove: removeForwarder } = useFieldArray({
    control,
    name: "shippingDetails.forwarderInvoices",
  });

  const { fields: transporterFields, append: appendTransporter, remove: removeTransporter } = useFieldArray({
    control,
    name: "shippingDetails.transporterInvoices",
  });

  // Watch form values for debugging
  const formValues = watch("shippingDetails");
  console.log("Current Shipping Details Values:", formValues);

  // Handle Count Changes
  const handleShippingCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("shippingDetails.numberOfShippingLineInvoices", value, { shouldDirty: true });
    const currentInvoices = formValues.shippingLineInvoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length).fill(null).map(() => ({
        invoiceNumber: "",
        uploadShippingLineInvoice: "",
        date: undefined,
        valueWithGST: "",
        valueWithoutGST: "",
      }));
      appendShippingLine(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        removeShippingLine(i);
      }
    }
  };

  const handleForwarderCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("shippingDetails.numberOfForwarderInvoices", value, { shouldDirty: true });
    const currentInvoices = formValues.forwarderInvoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length).fill(null).map(() => ({
        invoiceNumber: "",
        uploadForwarderInvoice: "",
        date: undefined,
        valueWithGST: "",
        valueWithoutGST: "",
      }));
      appendForwarder(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        removeForwarder(i);
      }
    }
  };

  const handleTransporterCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("shippingDetails.numberOfTransporterInvoices", value, { shouldDirty: true });
    const currentInvoices = formValues.transporterInvoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length).fill(null).map(() => ({
        invoiceNumber: "",
        uploadTransporterInvoice: "",
        date: undefined,
        valueWithGST: "",
        valueWithoutGST: "",
      }));
      appendTransporter(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        removeTransporter(i);
      }
    }
  };

  // Update API Call
  const onSubmit = async (data: any) => {
    console.log("Submitting Shipping Details:", data.shippingDetails);
    try {
      const response = await fetch("http://localhost:4080/shipment/shipping-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipmentId, shippingDetails: data.shippingDetails }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update shipping details: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      toast.success("Shipping details updated successfully!");
    } catch (error) {
      console.error("Error updating shipping details:", error);
      toast.error(`Failed to update shipping details`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="grid grid-cols-4 gap-3">
          {/* Select Shipping Name */}
          <FormField
            control={control}
            name="shippingDetails.shippingLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Shipping Name</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Shipping Line" />
                    </SelectTrigger>
                    <SelectContent>
                      {ShippingName.map((Details) => (
                        <SelectItem key={Details.id} value={Details.id}>
                          {Details.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Shipping Line Invoices */}
          <FormField
            control={control}
            name="shippingDetails.numberOfShippingLineInvoices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Shipping Invoices</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(value);
                      handleShippingCountChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Shipping Invoices Table */}
          {shippingLineFields.length > 0 && (
            <div className="col-span-4 overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Upload Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Value With GST</TableHead>
                    <TableHead>Value Without GST</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shippingLineFields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.shippingLineInvoices.${index}.invoiceNumber`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                placeholder="Eg: 123456898"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.shippingLineInvoices.${index}.uploadShippingLineInvoice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center justify-between gap-2">
                                  <Input
                                    type="file"
                                    className="flex-1"
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                  />
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                                  >
                                    <UploadCloud className="w-5 h-5 mr-2" />
                                    Upload
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
                          name={`shippingDetails.shippingLineInvoices.${index}.date`}
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
                          name={`shippingDetails.shippingLineInvoices.${index}.valueWithGST`}
                          render={({ field }) => (
                            <Input
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.shippingLineInvoices.${index}.valueWithoutGST`}
                          render={({ field }) => (
                            <Input
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => removeShippingLine(index)}
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

        <Separator className="mt-2" />
        <div className="text-xl font-bold my-3">
          <h2>Forwarder Details</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {/* Select Forwarder Name */}
          <FormField
            control={control}
            name="shippingDetails.forwarderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Forwarder Name</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Forwarder Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {ForwarderName.map((Details) => (
                        <SelectItem key={Details.id} value={Details.id}>
                          {Details.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Forwarder Invoices */}
          <FormField
            control={control}
            name="shippingDetails.numberOfForwarderInvoices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Forwarder Invoices</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(value);
                      handleForwarderCountChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forwarder Invoices Table */}
          {forwarderFields.length > 0 && (
            <div className="col-span-4 overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Upload Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Value With GST</TableHead>
                    <TableHead>Value Without GST</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forwarderFields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.forwarderInvoices.${index}.invoiceNumber`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                placeholder="Eg: 123456898"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.forwarderInvoices.${index}.uploadForwarderInvoice`}
                          render={({ field }) => (
                            <div className="flex items-center justify-between gap-2">
                              <Input
                                type="file"
                                className="flex-1"
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                className="text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                              >
                                <UploadCloud className="w-5 h-5 mr-2" />
                                Upload
                              </Button>
                            </div>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.forwarderInvoices.${index}.date`}
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
                          name={`shippingDetails.forwarderInvoices.${index}.valueWithGST`}
                          render={({ field }) => (
                            <Input
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.forwarderInvoices.${index}.valueWithoutGST`}
                          render={({ field }) => (
                            <Input
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => removeForwarder(index)}
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

        <Separator className="mt-3" />
        <div className="text-xl font-bold my-2">
          <h2>Transporter Details</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {/* Select Transporter Name */}
          <FormField
            control={control}
            name="shippingDetails.transporterName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Transporter Name</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Transporter Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {TransporterName.map((Details) => (
                        <SelectItem key={Details.id} value={Details.id}>
                          {Details.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Transporter Invoices */}
          <FormField
            control={control}
            name="shippingDetails.numberOfTransporterInvoices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Transporter Invoices</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      field.onChange(value);
                      handleTransporterCountChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Transporter Invoices Table */}
          {transporterFields.length > 0 && (
            <div className="col-span-4 overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Upload Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Value With GST</TableHead>
                    <TableHead>Value Without GST</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transporterFields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.transporterInvoices.${index}.invoiceNumber`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                placeholder="Eg: 123456898"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.transporterInvoices.${index}.uploadTransporterInvoice`}
                          render={({ field }) => (
                            <div className="flex items-center justify-between gap-2">
                              <Input
                                type="file"
                                className="flex-1"
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                className="text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                              >
                                <UploadCloud className="w-5 h-5 mr-2" />
                                Upload
                              </Button>
                            </div>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.transporterInvoices.${index}.date`}
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
                          name={`shippingDetails.transporterInvoices.${index}.valueWithGST`}
                          render={({ field }) => (
                            <Input
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`shippingDetails.transporterInvoices.${index}.valueWithoutGST`}
                          render={({ field }) => (
                            <Input
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => removeTransporter(index)}
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

        <div className="mt-4">
          <Button type="submit">Update</Button>
        </div>
      </div>
    </form>
  );
}