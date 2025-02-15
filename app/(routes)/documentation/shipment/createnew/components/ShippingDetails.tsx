"use client";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileInput, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShippingDetails() {
  const { control } = useFormContext();

  function setFile(file: File | null) {
    throw new Error("Function not implemented.");
  }

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

      {/* Forwarder Name */}
      <FormField
        control={control}
        name="shippingDetails.forwarder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Forwarder Name</FormLabel>
            <FormControl>
              <Input placeholder="eg. DHL" className="uppercase" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/*  Upload Forwarder Invoice */}
      <FormField
        control={control}
        name="shippingDetails.Upload Forwarder Invoice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Forwarder Invoice</FormLabel>
            <div className="flex items-center gap-2">
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
        name="shippingDetails.Transporter Invoice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transporter Invoice</FormLabel>
            <div className="flex items-center gap-2">
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
