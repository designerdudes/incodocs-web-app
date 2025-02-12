"use client";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";



export function SupplierDetails() {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-4 gap-3">
            {/* Supplier Name */}
            <FormField
                control={control}
                name="supplierDetails.supplierName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplier Name</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. ABC Suppliers" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Actual Supplier Name */}
            <FormField
                control={control}
                name="supplierDetails.actualSupplierName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Actual Supplier Name</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. XYZ Suppliers" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Supplier GSTIN */}
            <FormField
                control={control}
                name="supplierDetails.supplierGSTIN"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplier GSTIN</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. 22AAAAA0000A1Z5" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Supplier Invoice Number */}
            <FormField
                control={control}
                name="supplierDetails.supplierInvoiceNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplier Invoice Number</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. INV1234567890" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Supplier Invoice Date */}
            <FormField
                control={control}
                name="supplierDetails.supplierInvoiceDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                        <FormLabel>Supplier Invoice Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className="w-full">
                                        {field.value ? format(field.value, "PPPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Supplier Invoice Value Without GST */}
            <FormField
                control={control}
                name="supplierDetails.supplierInvoiceValueWithOutGST"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplier Invoice Value Without GST</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. 10000" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Supplier Invoice Value With GST */}
            <FormField
                control={control}
                name="supplierDetails.supplierInvoiceValueWithGST"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplier Invoice Value With GST</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. 11800" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Upload Supplier Invoice */}
            <FormField
                control={control}
                name="supplierDetails.uploadSupplierInvoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Upload Supplier Invoice</FormLabel>
                        <FormControl>
                            <Input type="file" {...field} />
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
                        <FormControl>
                            <Input type="file" {...field} />
                        </FormControl>
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
                            <Input placeholder="eg. 11800" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}