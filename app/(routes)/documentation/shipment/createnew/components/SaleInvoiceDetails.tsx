"use client";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";



export function SaleInvoiceDetails() {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-4 gap-3">
            {/* Commercial Invoice Number */}
            <FormField
                control={control}
                name="saleInvoiceDetails.commercialInvoiceNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Commercial Invoice Number</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. INV123456" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Commercial Invoice Date */}
            <FormField
                control={control}
                name="saleInvoiceDetails.commercialInvoiceDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                        <FormLabel>Commercial Invoice Date</FormLabel>
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

            {/* Consignee Details */}
            <FormField
                control={control}
                name="saleInvoiceDetails.consigneeDetails"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Consignee Details</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter consignee details" {...field} />
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

            {/* Commercial Invoice */}
            <FormField
                control={control}
                name="saleInvoiceDetails.commercialInvoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Commercial Invoice</FormLabel>
                        <FormControl>
                            <Input type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}