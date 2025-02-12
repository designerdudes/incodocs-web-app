"use client";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileInput } from "lucide-react";



export function ShippingDetails() {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-4 gap-3">
            {/* Shipping Line */}
            <FormField
                control={control}
                name="shippingDetails.shippingLine"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Shipping Line</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. MAERSK" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Forwarder */}
            <FormField
                control={control}
                name="shippingDetails.forwarder"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Forwarder</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. DHL" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Forwarder Invoice */}
            <FormField
                control={control}
                name="shippingDetails.forwarderInvoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Forwarder Invoice</FormLabel>
                        <FormControl>
                            <FileInput {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Value of Forwarder Invoice */}
            <FormField
                control={control}
                name="shippingDetails.valueOfForwarderInvoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Value of Forwarder Invoice</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Transporter */}
            <FormField
                control={control}
                name="shippingDetails.transporter"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Transporter</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. FedEx" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Transporter Invoice */}
            <FormField
                control={control}
                name="shippingDetails.transporterInvoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Transporter Invoice</FormLabel>
                        <FormControl>
                            <FileInput {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Value of Transporter Invoice */}
            <FormField
                control={control}
                name="shippingDetails.valueOfTransporterInvoice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Value of Transporter Invoice</FormLabel>
                        <FormControl>
                            <Input placeholder="eg. 1500" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}