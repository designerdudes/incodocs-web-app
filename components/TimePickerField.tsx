"use client";

import { Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  control: any;
  name: string;
  label: string;
};

export function TimePickerField({ control, name, label }: Props) {
  // Build hours (1-12) & minutes (00–59)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const meridiem = ["AM", "PM"];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const [h, m, ampm] = field.value ? field.value.split(":") : ["", "", "AM"];

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <div className="flex gap-2">
              {/* Hours */}
              <Select
                value={h}
                onValueChange={(val) => {
                  field.onChange(`${val}:${m || "00"}:${ampm}`);
                }}
              >
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hr) => (
                    <SelectItem key={hr} value={hr.toString().padStart(2, "0")}>
                      {hr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Minutes */}
              <Select
                value={m}
                onValueChange={(val) => {
                  field.onChange(`${h || "12"}:${val}:${ampm}`);
                }}
              >
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((min) => (
                    <SelectItem key={min} value={min}>
                      {min}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* AM/PM */}
              <Select
                value={ampm}
                onValueChange={(val) => {
                  field.onChange(`${h || "12"}:${m || "00"}:${val}`);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  {meridiem.map((mer) => (
                    <SelectItem key={mer} value={mer}>
                      {mer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
