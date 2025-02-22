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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export function OtherDetails() {
  const { control } = useFormContext();
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* CertificateOfOrigin Number */}
      <FormField
        control={control}
        name="CertificateOfOrigin.shippingBillNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certificate Of Origin Number</FormLabel>
            <FormControl>
              <Input
                placeholder="eg. 123456"
                className="uppercase"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CertificateOfOrigin Date */}
      <FormField
        control={control}
        name="CertificateOfOrigin.Certifecate Date"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel> Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className="w-full">
                    {field.value ? (
                      format(field.value, "PPPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
      {/* CertificateOfOrigin Issuer */}
      <FormField
        control={control}
        name="CertificateOfOrigin.IssuerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issuer Of Certificate Of Origin</FormLabel>
            <FormControl>
              <Input
                placeholder="eg. 123456"
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
        name="CertificateOfOrigin.Upload Copy Of Formagation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Copy Of Fumigation</FormLabel>
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
    </div>
  );
}
