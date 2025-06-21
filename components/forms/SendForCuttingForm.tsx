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
  machineId: z
    .string()
    .min(3, { message: "Lot name must be at least 3 characters long" })
    .optional(),
  typeOfMachine: z
    .string()
    .min(3, { message: "Material type must be at least 3 characters long" })
    .optional(),
  date: z.string().datetime({ message: "Invalid date format" }).optional(),
  getInTime: z.string().optional(), // <-- Added field
});

interface Props {
  params: {
    _id: string; // Lot ID
  };
}

export default function EditLotForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineId: "",
      typeOfMachine: "",
      date: "",
      getInTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    },
  });

  const lotId = params._id;

  useEffect(() => {
    async function fetchLotData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `/factory-management/inventory/lot/getbyid/${lotId}`
        );

        const data = response;

        // Reset form with fetched values if needed
      } catch (error) {
        console.error("Error fetching lot data:", error);
        toast.error("Failed to fetch lot data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchLotData();
  }, [lotId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Lot Update";
    GlobalModal.description = "Are you sure you want to update this lot?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>machine Id: {values.machineId}</p>
        <p>type Of Machine: {values.typeOfMachine}</p>
        <p>date: {values.date}</p>
        <p>get In Time: {values.getInTime}</p>
        <div className="flex justify-end space-x-2">
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
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Lot updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error updating lot:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating lot");
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

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Icons.spinner className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading lot details...</p>
      </div>
    );
  }

  function saveProgressSilently(data: any) {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="typeOfMachine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Machine</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Machine Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tiles">Single Slab Cutter</SelectItem>
                    <SelectItem value="Slabs">Multi Slab Cutter</SelectItem>
                    <SelectItem value="Slabs">Rope Slab Cutter</SelectItem>
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
                          ? format(new Date(field.value as any), "PPPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      selected={
                        field.value ? new Date(field.value as any) : undefined
                      }
                      onSelect={(date: Date | undefined) => {
                        field.onChange(date?.toISOString());
                        saveProgressSilently(form.getValues());
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Get In Time Field */}
          <FormField
            control={form.control}
            name="getInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Get In Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
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
