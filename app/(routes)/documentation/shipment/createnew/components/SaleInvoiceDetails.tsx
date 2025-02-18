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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash } from "lucide-react"; // Removed Table from here
import { format } from "date-fns";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddConsigneeButton from "./AddConsigneebutton";
import { SaveDetailsProps } from "./BookingDetails";

const consignee = [
  { id: "1", name: "consigneeNo23" },
  { id: "2", name: "consigneeNo24" },
];

export function SaleInvoiceDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue } = useFormContext();
  const { handleSubmit } = useFormContext();

  // Renamed state variable for clarity
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);

  const handleDelete = (index: number) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    setValue("saleInvoiceDetails.invoice", updatedInvoices); // Update form value
  };

  // Function to handle change in number of Commercial Invoices
  const handleInvoiceNumberCountChange = (value: string) => {
    const count = parseInt(value, 10);

    if (!isNaN(count) && count > 0) {
      const newInvoiceData = Array.from({ length: count }, () => ({
        CommercialInvoiceNumber: "",
        ClearanceCommercialInvoice: "",
        ActualCommercialInvoice: "",
        SABERInvoice: "",
        addProductDetails: "",
      }));

      setInvoices(newInvoiceData);
      setValue("saleInvoiceDetails.invoice", newInvoiceData); // Set invoice data in the form
    } else {
      setInvoices([]);
      setValue("saleInvoiceDetails.invoice", []); // Clear invoice data if the value is invalid
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Select Consignee */}
      <FormField
        control={control}
        name="saleInvoiceDetails.consigneeDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Consignee</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  {field.value ? (
                    <span>
                      {consignee.find((item) => item.id === field.value)
                        ?.name || "Select a Consignee"}
                    </span>
                  ) : (
                    <span>Select a Consignee</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {consignee.map((Details) => (
                    <SelectItem key={Details.id} value={Details.id}>
                      {Details.name}
                    </SelectItem>
                  ))}
                  <div>
                    <AddConsigneeButton />
                  </div>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Actual Buyer */}
      <FormField
        control={control}
        name="saleInvoiceDetails.actualBuyer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actual Buyer</FormLabel>
            <FormControl>
              <Input placeholder="Enter buyer name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Number of Commercial Invoices */}
      <FormField
        control={control}
        name="NumberOfCommercialInvoices"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Commercial Invoices</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of Commercial Invoices"
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
                <TableHead>Commercial Invoice Number</TableHead>
                <TableHead>Clearance Commercial Invoice</TableHead>
                <TableHead>Actual Commercial Invoice</TableHead>
                <TableHead>SABER Invoice</TableHead>
                <TableHead>Add Invoice Details</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((_, index) => (
                <TableRow key={index}>
                  {/* Commercial Invoice Number */}
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].CommercialInvoiceNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input placeholder="Eg:123456898" {...field} />
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* Clearance Commercial Invoice */}
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].ClearanceCommercialInvoice`}
                      render={({ field }) => (
                        <FormControl>
                          <Input placeholder="Eg:123456898" {...field} />
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* Actual Commercial Invoice */}
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].ActualCommercialInvoice`}
                      render={({ field }) => (
                        <FormControl>
                          <Input placeholder="Eg:123456898" {...field} />
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* SABER Invoice */}
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].SABERInvoice`}
                      render={({ field }) => (
                        <FormControl>
                          <Input placeholder="Eg:123456898" {...field} />
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* Add Invoice */}
                  <TableCell>
                    {showInvoiceForm ? (
                      <FormField
                        control={control}
                        name={`saleInvoiceDetails.invoice[${index}].addProductDetails`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Add Invoice"
                              {...field}
                              onBlur={() => setShowInvoiceForm(false)}
                            />
                          </FormControl>
                        )}
                      />
                    ) : (
                      <Button
                        variant="default"
                        size="lg"
                        type="button"
                        onClick={() => setShowInvoiceForm(true)}
                      >
                        Add Invoice
                      </Button>
                    )}
                  </TableCell>

                  {/* Delete Action */}
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
      <div className="">
        <Button type="button" onClick={handleSubmit(saveProgress)}>
          Save Progress
        </Button>
      </div>
    </div>
  );
}
