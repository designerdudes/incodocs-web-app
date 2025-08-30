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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useParams, useRouter } from "next/navigation";
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
import { TimePickerField } from "../TimePickerField";

// ✅ Schema now expects a time string like "hh:mm:AM"
const formSchema = z.object({
  status: z.string(),
  cuttingMachineId: z.string().min(1, "Machine is required"),
  cuttingScheduledAt: z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Select date"),
    time: z.string().min(1, "Select time"), // string: "HH:MM:AM/PM"
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
  const factoryId = params.data.factoryId;
  const BlockId = params.data._id;
  const { organizationId } = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "inCutting",
      cuttingMachineId: "",
      cuttingScheduledAt: {
        date: "",
        time: "", // use "hh:mm:AM"
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

  // ✅ Convert "hh:mm:AM/PM" -> 24h hours + minutes
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 0, minutes: 0 };
    const [hh, mm, ampm] = timeStr.split(":");
    let hours = Number(hh);
    const minutes = Number(mm);

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const { date, time } = values.cuttingScheduledAt;
    const { hours, minutes } = parseTime(time);

    const isoDateTime = new Date(
      `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:00`
    ).toISOString();

    const payload = {
      status: values.status,
      cuttingMachineId: values.cuttingMachineId,
      cuttingScheduledAt: isoDateTime, // backend receives a single ISO datetime
    };

    try {
      await putData(
        `/factory-management/inventory/raw/put/${BlockId}`,
        payload
      );

      const selectedMachine = machines.find(
        (m) => m._id === values.cuttingMachineId
      );

      toast.success(
        `Block sent for cutting${
          selectedMachine
            ? ` on ${selectedMachine.machineName} - ${selectedMachine.typeCutting}`
            : ""
        }`
      );

      GlobalModal.onClose();
      router.refresh(); // ✅ refresh without full reload
    } catch (error) {
      console.error(error);
      toast.error("Failed to send block for cutting");
    } finally {
      setIsLoading(false);
    }
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
              <Select
                onValueChange={(value) => {
                  if (value === "add-new") {
                    window.open(
                      `/${organizationId}/${factoryId}/factorymanagement/machines/createnew`
                    );
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select machine" />
                </SelectTrigger>
                <SelectContent>
                  {machines
                    ?.filter((machine) => machine.typeCutting)
                    .map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {`${machine.machineName} - ${machine.typeCutting}`}
                      </SelectItem>
                    ))}

                  <SelectItem
                    value="add-new"
                    className="text-blue-600 font-semibold"
                  >
                    + Add New Machine
                  </SelectItem>
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
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Picker */}
        <FormField
          control={form.control}
          name="cuttingScheduledAt.time"
          render={({ field }) => (
            <TimePickerField
              control={form.control}
              name={field.name}
              label="Cutting Time"
            />
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
