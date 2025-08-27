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
import { useParams } from "next/navigation";
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

// ✅ Zod schema
const formSchema = z.object({
  status: z.string(),
  cuttingMachineId: z.string().min(1, "Machine is required"),
  cuttingScheduledAt: z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Select date"),
    time: z.string().nonempty("Time is required"), // 👈 will hold "02:30 PM"
  }),
  entryTime: z.string().nonempty("Entry time is required"),
  exitTime: z.string().nonempty("Exit time is required"),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "inCutting",
      cuttingMachineId: "",
      cuttingScheduledAt: { date: "", time: "" },
      entryTime: "",
      exitTime: "",
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

  // helper: convert "hh:mm AM/PM" → { hours, minutes }
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 0, minutes: 0 };
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

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
      cuttingScheduledAt: {
        date: new Date(date).toISOString(),
        time: { hours, minutes }, // backend stays consistent
      },
      entryTime: values.entryTime,
      exitTime: values.exitTime,
    };

    try {
      await putData(
        `/factory-management/inventory/raw/put/${BlockId}`,
        payload
      );

      // ✅ toast with machine info
      const selectedMachine = machines.find(
        (m) => m._id === values.cuttingMachineId
      );

      if (selectedMachine) {
        toast.success(
          `Block sent for cutting on ${selectedMachine.machineName} - ${selectedMachine.typeCutting}`
        );
      } else {
        toast.success("Block sent for cutting");
      }

      window.location.reload();
    } catch (error) {
      toast.error("Failed to send Blocks");
    } finally {
      setIsLoading(false);
      GlobalModal.onClose();
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
        {/* <TimePickerField
          control={form.control}
          name="cuttingScheduledAt.time"
          label="Cutting Time"
        /> */}

        {/* Entry & Exit Time */}
        <div className="flex gap-4">
          <TimePickerField
            control={form.control}
            name="entryTime"
            label="Entry Time"
          />
          {/* <TimePickerField
            control={form.control}
            name="exitTime"
            label="Exit Time"
          /> */}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
