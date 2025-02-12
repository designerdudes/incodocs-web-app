"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function BookingDetails() {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-4 gap-3">
            {/* Container Number */}
            <FormField
                control={control}
                name="bookingDetails.containerNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Container Number</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. MRKU6998040" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Port of Loading */}
            <FormField
                control={control}
                name="bookingDetails.portOfLoading"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Port Of Loading</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. CHENNAI" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Destination Port */}
            <FormField
                control={control}
                name="bookingDetails.destinationPort"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Destination Port</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. UMM QASAR" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Vessel Sailing Date */}
            <FormField
                control={control}
                name="bookingDetails.vesselSailingDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                        <FormLabel>Vessel Sailing Date</FormLabel>
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

            {/* Truck Number */}
            <FormField
                control={control}
                name="bookingDetails.truckNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Truck Number</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. TN01BQ2509" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Truck Driver Number */}
            <FormField
                control={control}
                name="bookingDetails.truckDriverNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Truck Driver Number</FormLabel>
                        <FormControl>
                            <Input type="tel" placeholder="eg. 9876543210" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
