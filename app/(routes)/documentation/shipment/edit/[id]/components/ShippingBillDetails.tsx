"use client";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";



export function ShippingBillDetails() {
    const { control } = useFormContext();
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="grid grid-cols-4 gap-3">
            {/* Shipping Bill Number */}
            <FormField
                control={control}
                name="shippingBillDetails.shippingBillNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Shipping Bill Number</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. 123456" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Shipping Bill Date */}
            <FormField
                control={control}
                name="shippingBillDetails.shippingBillDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                        <FormLabel>Shipping Bill Date</FormLabel>
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

            {/* Upload Shipping Bill */}
            <FormField
                control={control}
                name="shippingBillDetails.uploadShippingBill"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Upload Shipping Bill</FormLabel>
                        <FormControl>
                            <Input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setFile(file);
                                    field.onChange(file);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}