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

export function BillOfLadingDetails() {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* BL Number */}
      <FormField
        control={control}
        name="blDetails.blNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>BL Number</FormLabel>
            <FormControl>
              <Input
                placeholder="eg. BL123456"
                className="uppercase"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* BL Date */}
      <FormField
        control={control}
        name="blDetails.blDate"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>BL Date</FormLabel>
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

      {/* Telex Date */}
      <FormField
        control={control}
        name="blDetails.telexDate"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Telex Date</FormLabel>
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

      {/* Upload BL */}
      <FormField
        control={control}
        name="blDetails.uploadBL"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload BL</FormLabel>
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
    </div>
  );
}
