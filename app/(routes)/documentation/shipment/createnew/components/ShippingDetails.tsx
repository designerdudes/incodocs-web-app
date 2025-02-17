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
        <FormField
          control={control}
          name="shippingDetails.shippingName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. MAERSK"
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
          name="NumberOfShippingLineInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of ShippingLine Invoices</FormLabel>
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
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0])
                                }
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="secondary"
                              className="text-white bg-blue-500 hover:bg-blue-600"
                            >
                              <UploadCloud className="w-5 h-10 mr-2" />
                              Upload
                            </Button>
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
      <div className="mt-4"><Button type="button" onClick={handleSubmit(saveProgress)}>Save Progress</Button></div>
    </div>
  );
}
