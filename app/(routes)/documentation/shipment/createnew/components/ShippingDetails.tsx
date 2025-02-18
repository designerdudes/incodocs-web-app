"use client";

import { useFormContext } from "react-hook-form";
import { Key, useState } from "react";
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
import { format } from "date-fns";
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
import { SaveDetailsProps } from "./BookingDetails";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const ShippingName = [
  { id: "1", name: "Ahmed" },
  { id: "2", name: "Arshad" },
];

const ForwarderName = [
  { id: "1", name: "Amair" },
  { id: "2", name: "Syed" },
];
const TransporterName = [
  { id: "1", name: "Adnan" },
  { id: "2", name: "Aameer" },
];

export function ShippingDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue } = useFormContext();
  const [invoices, setInvoices] = useState<any[]>([]);
  const { handleSubmit } = useFormContext();

  // const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);

  const handleDelete = (index: number) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    setValue("ShippingLineDetails.invoice", updatedInvoices);
  };

  const handleInvoiceNumberCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newInvoiceData = Array.from({ length: count }, () => ({
        InvoiceNumber: "",
        UploadShippingLineInvoice: "",
        Date: "",
        ValueWithGST: "",
        ValueWithOutGST: "",
      }));

      setInvoices(newInvoiceData);
      setValue("saleInvoiceDetails.invoice", newInvoiceData);
    } else {
      setInvoices([]);
      setValue("saleInvoiceDetails.invoice", []);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {/* Select Shipping Name */}
        <FormField
          control={control}
          name="saleInvoiceDetailss.ShippingDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Shipping Name</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    {field.value ? (
                      <span>
                        {ShippingName.find((item) => item.id === field.value)
                          ?.name || "Select a Name"}
                      </span>
                    ) : (
                      <span>Select a Shipping Name</span>
                    )}
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

        <FormField
          control={control}
          name="NumberOfShippingLineInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Shipping Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Shipping Line Invoices"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInvoiceNumberCountChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {invoices.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].InvoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Eg: 123456898" {...field} />
                          </FormControl>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].UploadShippingLineInvoice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center justify-between gap-2">
                                {/* File Input */}
                                <Input
                                  type="file"
                                  className="flex-1" // Ensures input takes available space
                                  onChange={(e) =>
                                    field.onChange(e.target.files?.[0])
                                  }
                                />

                                {/* Upload Button */}
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
                        name={`shippingDetails.invoice[${index}].shippingDate`}
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
                        name={`shippingDetails.invoice[${index}].ValueWithGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].ValueWithOutGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(index)}
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
          name="ShippingDetails.ForwarderDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Forwarder Name</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    {field.value ? (
                      <span>
                        {ForwarderName.find((item) => item.id === field.value)
                          ?.name || "Select a Name"}
                      </span>
                    ) : (
                      <span>Select a Forwarder Name</span>
                    )}
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
        <FormField
          control={control}
          name="NumberOfShippingLineInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Forwarder Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Shipping Line Invoices"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInvoiceNumberCountChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {invoices.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].InvoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Eg: 123456898" {...field} />
                          </FormControl>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].UploadShippingLineInvoice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center justify-between gap-2">
                                {/* File Input */}
                                <Input
                                  type="file"
                                  className="flex-1" // Ensures input takes available space
                                  onChange={(e) =>
                                    field.onChange(e.target.files?.[0])
                                  }
                                />

                                {/* Upload Button */}
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
                        name={`shippingDetails.invoice[${index}].shippingDate`}
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
                        name={`shippingDetails.invoice[${index}].ValueWithGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`Transporter.invoice[${index}].ValueWithOutGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(index)}
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
      <Separator className="mt-3 " />
      <div className="text-xl font-bold my-2">
        <h2>Transporter Details</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Select Transporter Name */}
        <FormField
          control={control}
          name="shippingDetails.TransporterDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Transporter Name</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    {field.value ? (
                      <span>
                        {TransporterName.find((item) => item.id === field.value)
                          ?.name || "Select a Name"}
                      </span>
                    ) : (
                      <span>Select a Transporter Name</span>
                    )}
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

        <FormField
          control={control}
          name="NumberOfShippingLineInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Transporter Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Shipping Line Invoices"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInvoiceNumberCountChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {invoices.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].InvoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Eg: 123456898" {...field} />
                          </FormControl>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].UploadShippingLineInvoice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center justify-between gap-2">
                                {/* File Input */}
                                <Input
                                  type="file"
                                  className="flex-1" // Ensures input takes available space
                                  onChange={(e) =>
                                    field.onChange(e.target.files?.[0])
                                  }
                                />

                                {/* Upload Button */}
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
                        name={`shippingDetails.invoice[${index}].shippingDate`}
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
                        name={`shippingDetails.invoice[${index}].ValueWithGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.invoice[${index}].ValueWithOutGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(index)}
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
        <Button type="button" onClick={handleSubmit(saveProgress)}>
          Save Progress
        </Button>
      </div>
    </div>
  );
}
