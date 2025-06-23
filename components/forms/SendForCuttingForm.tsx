"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import CalendarComponent from "../CalendarComponent";

const formSchema = z.object({
  machineType: z.string().min(1, { message: "Machine type is required" }),
  date: z
    .string({ required_error: "Date is required" })
    .min(1, { message: "Date is required" }),
  getInTime: z
    .string({ required_error: "Time is required" })
    .min(1, { message: "Time is required" }),
});

interface Props {
  params: {
    _id: string; // Lot ID
  };
}

export default function SendForCuttingForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineType: "",
      date: "",
      getInTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    },
  });

  const lotId = params._id;

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const { machineType, date, getInTime } = values;

    const scheduledAt = new Date(`${date}T${getInTime}:00`).toISOString();

    const payload = {
      machineType,
      scheduledAt,
    };

    GlobalModal.title = "Confirm Send for Cutting";
    GlobalModal.description =
      "Are you sure you want to send this lot for cutting?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Machine Type: {payload.machineType}</p>
        <p>Scheduled At: {payload.scheduledAt}</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              GlobalModal.onClose();
              setIsLoading(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await putData(
                  `/factory-management/inventory/lot/update/${lotId}`,
                  payload
                );
                toast.success("Lot sent for cutting");
                window.location.reload();
              } catch (error) {
                console.error(error);
                toast.error("Failed to send lot");
              } finally {
                setIsLoading(false);
                GlobalModal.onClose();
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    );

    GlobalModal.onOpen();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="machineType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Machine</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Machine Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Slab Cutter">
                      Single Slab Cutter
                    </SelectItem>
                    <SelectItem value="Multi Slab Cutter">
                      Multi Slab Cutter
                    </SelectItem>
                    <SelectItem value="Rope Slab Cutter">
                      Rope Slab Cutter
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full">
                        {field.value
                          ? format(new Date(field.value), "PPPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date: Date | undefined) => {
                        field.onChange(date?.toISOString().split("T")[0]); 
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="getInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Get In Time</FormLabel>
                <FormControl>
                  <Input type="time" step="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
