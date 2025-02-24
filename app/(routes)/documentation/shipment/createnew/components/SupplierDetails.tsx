"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
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
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SaveDetailsProps } from "./BookingDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const SupplierName = [
  { id: "1", name: "Ahmed" },
  { id: "2", name: "Arshad" },
];

const shippingbill = [
  { id: "1", name: "Ahmed" },
  { id: "2", name: "Arshad" },
];

export function SupplierDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue } = useFormContext();
  const [invoices, setInvoices] = useState<any[]>([]);
  const { handleSubmit } = useFormContext();

  // const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);

  const handleDelete = (index: number) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    setValue("SupplierDetails.invoice", updatedInvoices);

    setValue("NumberOfSupplierInvoices", updatedInvoices.length);
  };

  const handleInvoiceNumberCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const newInvoiceData = Array.from({ length: count }, () => ({
        InvoiceNumber: "",
        UploadSupplierDetailsInvoice: "",
        Date: "",
        ValueWithGST: "",
        ValueWithOutGST: "",
      }));

      setInvoices(newInvoiceData);
      setValue("SupplierDetails.invoice", newInvoiceData);
    } else {
      setInvoices([]);
      setValue("SupplierDetails.invoice", []);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {/* Select Supplier Name */}
        <FormField
          control={control}
          name="SupplierDetails.SupplierDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Supplier Name</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    {field.value ? (
                      <span>
                        {SupplierName.find((item) => item.id === field.value)
                          ?.name || "Select a Name"}
                      </span>
                    ) : (
                      <span>Select a Supplier Name</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {SupplierName.map((Details) => (
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
          name="NumberOfSupplierInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Supplier Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Supplier Invoices"
                  value={field.value === 0 ? "" : field.value} // Display empty string if value is 0
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);

                    if (isNaN(value) || value < 0) return; // Prevents negative values

                    field.onChange(value);
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
                  <TableHead>#</TableHead> {/* New Index Column */}
                  <TableHead>Supplier GSTIN</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Clearence Supplier Invoice</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>{" "}
                    {/* Display 1-based Index */}
                    <TableCell>
                      <FormField
                        control={control}
                        name={`SupplierDetails.SupplierGSTIN[${index}].SupplierGSTIN`}
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Eg: GST123456898" {...field} />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`SupplierDetails.invoice[${index}].UploadSupplierInvoice`}
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
                        name={`SupplierDetails.invoice[${index}].supplierDate`}
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
                        name={`SupplierDetails.invoice[${index}].ValueWithGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`SupplierDetails.invoice[${index}].ValueWithOutGST`}
                        render={({ field }) => (
                          <Input placeholder="eg. 11800" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`SupplierDetails.ClearenceSupplierInvoice[${index}].ClearenceSupplierInvoice`}
                        render={({ field }) => (
                          <FormControl>
                            <Input placeholder="Eg: C123456898" {...field} />
                          </FormControl>
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
        <h2>Actual</h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {/* Actual Supplier Name */}
        <FormField
          control={control}
          name="supplierDetails.actualSupplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. XYZ Suppliers"
                  className="uppercase"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Actual Supplier Invoice */}
        <FormField
          control={control}
          name="supplierDetails.actualSupplierInvoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Invoice</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-white bg-blue-500 hover:bg-blue-600"
                >
                  <UploadCloud className="w-5 h-10 mr-2" />
                  Upload
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actual Supplier Invoice Value */}
        <FormField
          control={control}
          name="supplierDetails.actualSupplierInvoiceValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Invoice Value</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. 11800"
                  className="uppercase"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* select shipping bill */}
        <FormField
          control={control}
          name="supplierDetails.shippingbill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select shipping bill</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a shipping bill" />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingbill.map((bill) => (
                      <SelectItem key={bill.id} value={bill.id}>
                        {bill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2">
          <Button type="button" onClick={handleSubmit(saveProgress)}>
            Save Progress
          </Button>
        </div>
      </div>
    </div>
  );
}
