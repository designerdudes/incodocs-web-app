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
import AddshippinglineButton from "./Addshippinglinebutton";
import AddForwarderButton from "./Addforwarderbutton";
import AddtransporterButton from "../Addtransporterbutton";

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
  const [Shippinginvoices, setShippingInvoices] = useState<{ InvoiceNumber: string; UploadShippingLineInvoice: string; Date: string; ValueWithGST: string; ValueWithOutGST: string; }[]>([]);
  const [Forwarderinvoices, setForwarderInvoices] = useState<{ InvoiceNumber: string; UploadForwarderInvoice: string; Date: string; ValueWithGST: string; ValueWithOutGST: string; }[]>([]);
  const [Transporterinvoices, setTransporterInvoices] = useState<{ InvoiceNumber: string; UploadTransporterInvoice: string; Date: string; ValueWithGST: string; ValueWithOutGST: string; }[]>([]);

  const { handleSubmit } = useFormContext();

  // const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);

  const handleShippingDelete = (index: number) => {
    const updatedInvoices = Shippinginvoices.filter((_, i) => i !== index);
    setShippingInvoices(updatedInvoices);
    setValue("shippingDetails.shippingLineInvoices", updatedInvoices);

    // Update the input field for the number of invoices
    setValue("NumberOfShippingLineInvoices", updatedInvoices.length);
  };

  const handleShippingCountChange = (value: string) => {
    let count = parseInt(value, 10);
    if (isNaN(count) || count <= 0) {
      count = 0;
    }

    const newInvoiceData = Array.from({ length: count }, () => ({
      InvoiceNumber: "",
      UploadShippingLineInvoice: "",
      Date: "",
      ValueWithGST: "",
      ValueWithOutGST: "",
    }));

    setShippingInvoices(newInvoiceData);
    setValue("shippingDetails.shippingLineInvoices", newInvoiceData);
  };

  const handleForwarderDelete = (index: number) => {
    const updatedInvoices = Forwarderinvoices.filter((_, i) => i !== index);
    setForwarderInvoices(updatedInvoices);
    setValue("forwarderDetails.forwarderInvoices", updatedInvoices);

    // Update the input field for the number of invoices
    setValue("NumberOfForwarderInvoices", updatedInvoices.length);
  };

  const handleForwarderCountChange = (value: string) => {
    let count = parseInt(value, 10);
    if (isNaN(count) || count <= 0) {
      count = 0;
    }

    const newInvoiceData = Array.from({ length: count }, () => ({
      InvoiceNumber: "",
      UploadForwarderInvoice: "",
      Date: "",
      ValueWithGST: "",
      ValueWithOutGST: "",
    }));

    setForwarderInvoices(newInvoiceData);
    setValue("forwarderDetails.forwarderInvoices", newInvoiceData);
  };

  const handleTransporterDelete = (index: number) => {
    const updatedInvoices = Transporterinvoices.filter((_, i) => i !== index);
    setTransporterInvoices(updatedInvoices);
    setValue("transporterDetails.transporterInvoices", updatedInvoices);

    // Update the input field for the number of invoices
    setValue("NumberOfTransporterInvoices", updatedInvoices.length);
  };

  const handleTransporterCountChange = (value: string) => {
    let count = parseInt(value, 10);
    if (isNaN(count) || count <= 0) {
      count = 0;
    }

    const newInvoiceData = Array.from({ length: count }, () => ({
      InvoiceNumber: "",
      UploadTransporterInvoice: "",
      Date: "",
      ValueWithGST: "",
      ValueWithOutGST: "",
    }));

    setTransporterInvoices(newInvoiceData);
    setValue("transporterDetails.transporterLineInvoices", newInvoiceData);
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
                      <span>Select a Shipping Line</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {ShippingName.map((Details) => (
                      <SelectItem key={Details.id} value={Details.id}>
                        {Details.name}
                      </SelectItem>
                    ))}
                    <div>
                      <AddshippinglineButton />
                    </div>
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
          name="NumberOfShippingLineInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Shipping Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Shipping Line Invoices"
                  value={field.value === 0 ? "" : field.value} // Display empty string if value is 0
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);

                    if (isNaN(value) || value < 0) return; // Prevents negative values

                    field.onChange(value);
                    handleShippingCountChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Shipping Invoices Table */}
        {Shippinginvoices.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead> {/* New Index Column */}
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Shippinginvoices.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>{" "}
                    {/* Display 1-based Index */}
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.shippingLineInvoices.${index}.InvoiceNumber`}
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
                        name={`shippingDetails.shippingLineInvoices.${index}.UploadShippingLineInvoice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center justify-between gap-2">
                                <Input
                                  type="file"
                                  className="flex-1"
                                  onChange={(e) =>
                                    field.onChange(e.target.files?.[0])
                                  }
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
                        name={`shippingDetails.shippingLineInvoices.${index}.Date`}
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
                        name={`shippingDetails.shippingLineInvoices.${index}.ValueWithGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.shippingLineInvoices.${index}.ValueWithOutGST`}
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
                        onClick={() => handleShippingDelete(index)}
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

                    <div>
                      <AddForwarderButton />
                    </div>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Number of Forwarder  Invoices */}
        <FormField
          control={control}
          name="NumberOfForwarderInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Forwarder Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Forwarder Line Invoices"
                  value={field.value === 0 ? "" : field.value} // Display empty string if value is 0
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);

                    if (isNaN(value) || value < 0) return; // Prevents negative values

                    field.onChange(value);
                    handleForwarderCountChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Forwarder Invoices Table */}
        {Forwarderinvoices.length > 0 && (
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
                {Forwarderinvoices.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>{" "}
                    {/* Display 1-based Index */}
                    <TableCell>
                      <FormField
                        control={control}
                        name={`forwarderDetails.forwarderInvoices.${index}.InvoiceNumber`}
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
                        name={`forwarderDetails.forwarderInvoices.${index}.UploadForwarderInvoice`}
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-2">
                            <Input
                              type="file"
                              className="flex-1"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
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
                        name={`forwarderDetails.forwarderInvoices.${index}.Date`}
                        render={({ field }) => <Input type="date" {...field} />}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`forwarderDetails.forwarderInvoices.${index}.ValueWithGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`forwarderDetails.forwarderInvoices.${index}.ValueWithOutGST`}
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
                        onClick={() => handleForwarderDelete(index)}
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
      <Separator className="mt-3 " />
      <div className="text-xl font-bold my-2">
        <h2>Transporter Details</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* // Select Transporter Name */}
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

                    <div>
                      <AddtransporterButton />
                    </div>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* // Input for Number of Transporter Invoices */}
        <FormField
          control={control}
          name="NumberOfTransporterInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Transporter Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Transporter Invoices"
                  value={field.value === 0 ? "" : field.value} // Display empty string if value is 0
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);

                    if (isNaN(value) || value < 0) return; // Prevents negative values

                    field.onChange(value);
                    handleTransporterCountChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* // Transporter Invoices Table */}
        {Transporterinvoices.length > 0 && (
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
                {Transporterinvoices.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`transporterDetails.transporterInvoices.${index}.InvoiceNumber`}
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
                        name={`transporterDetails.transporterInvoices.${index}.UploadTransporterInvoice`}
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-2">
                            <Input
                              type="file"
                              className="flex-1"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
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
                        name={`transporterDetails.transporterInvoices.${index}.Date`}
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
                        name={`transporterDetails.transporterInvoices.${index}.ValueWithGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        control={control}
                        name={`transporterDetails.transporterInvoices.${index}.ValueWithOutGST`}
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
                        onClick={() => handleTransporterDelete(index)}
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
