"use client";

import React, { useEffect, useState } from "react";
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
import { fetchData, putData } from "@/axiosUtility/api";
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
  status: z.string(),
  cuttingMachineId: z.string().min(1, "Machine is required"),
  cuttingScheduledAt: z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Select date"),
    time: z.object({
      hours: z.number().max(23).optional(),
      minutes: z.number().max(59).optional(),
    }),
  }),
});

interface Props {
  params: {
    data: {
      _id: string;
      factoryId: string;
    };
  };
}

interface Machine {
  _id: string;
  machineName: string;
  typeCutting: string;
}

export default function SendForCuttingForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const factoryId = params.data.factoryId;
  const BlockId = params.data._id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "inCutting",
      cuttingMachineId: "",
      cuttingScheduledAt: {
        date: "",
        time: { hours: 0, minutes: 0 },
      },
    },
  });

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const data = await fetchData(`/machine/getbyfactory/${factoryId}`);
        setMachines(data || []);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };
    fetchMachineData();
  }, [factoryId]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { date, time } = values.cuttingScheduledAt;
    const hours = Number(time?.hours ?? 0);
    const minutes = Number(time?.minutes ?? 0);
    const isoDateTime = new Date(
      `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:00`
    ).toISOString();

    const payload = {
      status: values.status,
      cuttingMachineId: values.cuttingMachineId,
      cuttingScheduledAt: {
        date: new Date(date).toISOString(), // backend expects date in ISO format
        time: {
          hours,
          minutes,
        },
      },
    };
    try {
      const res = putData(
        `/factory-management/inventory/raw/put/${BlockId}`,
        payload
      );
      toast.success("Block sent for cutting");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to send Blocks");
    } finally {
      setIsLoading(false);
      GlobalModal.onClose();
    }

    GlobalModal.onOpen();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Machine Select */}
        <FormField
          control={form.control}
          name="cuttingMachineId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machine</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select machine" />
                </SelectTrigger>
                <SelectContent>
                  {machines
                    ?.filter((machine) => machine.typeCutting) // keep only machines with cutting type
                    .map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {`${machine.machineName} - ${machine.typeCutting}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Picker */}
        <FormField
          control={form.control}
          name="cuttingScheduledAt.date"
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
                      field.onChange(date?.toISOString().split("T")[0] || "");
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Input */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="cuttingScheduledAt.time.hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    min={0}
                    max={23}
                    value={field.value ?? ""} // Convert undefined/null to empty string for display
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        field.onChange(null); // Set to null when input is cleared
                      } else {
                        const numValue = Number(value);
                        if (
                          !isNaN(numValue) &&
                          numValue >= 0 &&
                          numValue <= 23
                        ) {
                          field.onChange(numValue); // Set valid number
                        }
                      }
                    }}
                    onBlur={() => {
                      if (field.value == null) {
                        field.onChange(0);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cuttingScheduledAt.time.minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minutes</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    min={0}
                    max={59}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        field.onChange(null);
                      } else {
                        const numValue = Number(value);
                        if (
                          !isNaN(numValue) &&
                          numValue >= 0 &&
                          numValue <= 59
                        ) {
                          field.onChange(numValue);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (field.value == null) {
                        field.onChange(0);
                      }
                    }}
                  />
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
