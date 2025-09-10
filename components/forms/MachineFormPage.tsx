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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import EntityCombobox from "../ui/EntityCombobox";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "../CalendarComponent";

// Zod Schemas
export const machineSchema = z.object({
  factoryId: z.string().optional(),
  machineName: z.string().min(1, "Machine Name is required"),
  typeCutting: z.string().optional(),
  typePolish: z.string().optional(),
  machinePhoto: z.string().optional(),
  machineOwnership:z.string().optional(),
  ownership: z.string().optional(),
  isActive: z.boolean(),
  lastMaintenance: z.string().optional(),
  installedDate: z.string().optional(),
  machineCost: z.number().optional(),
  review: z.string().optional(),
});

type MachineFormValues = z.infer<typeof machineSchema>;

interface MachineFormProps {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default function MachineFormPage({ params }: MachineFormProps) {
  const orgId = params.organizationId;
  const factoryId = params.factoryid;
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      factoryId: factoryId,
      machineName: "",
      typeCutting: "",
      typePolish: "",
      machineOwnership:"",
      machinePhoto: "",
      ownership: "",
      isActive: true,
      lastMaintenance: new Date().toISOString(),
      installedDate: new Date().toISOString(),
      machineCost: 0,
      review: "",
    },
  });

  const handleSubmit = async (values: MachineFormValues) => {
    setIsLoading(true);
    try {
      await postData("/machine/add", {
        ...values,
        params,
      });

      toast.success("Machine Added Successfully");
      router.push("./");
    } catch (error) {
      toast.error("Error creating/updating Machine ");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className=" grid space-y-6 w-1/2"
        >
          <FormField
            control={form.control}
            name="machineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Machine Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Alfah"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeCutting"
            render={() => (
              <FormItem>
                <FormLabel>Machine Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const [type, option] = value.split(":");
                    if (type === "cutting") {
                      form.setValue("typeCutting", option);
                      form.setValue("typePolish", undefined); // clear other
                    } else if (type === "polish") {
                      form.setValue("typePolish", option);
                      form.setValue("typeCutting", undefined); // clear other
                    }
                  }}
                  value={
                    form.watch("typeCutting")
                      ? `cutting:${form.watch("typeCutting")}`
                      : form.watch("typePolish")
                      ? `polish:${form.watch("typePolish")}`
                      : ""
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Machine Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Cutting Types */}
                    <SelectItem value="cutting:Single Cutter">
                      Cutting - Single Slab Cutter
                    </SelectItem>
                    <SelectItem value="cutting:Multi Cutter">
                      Cutting - Multi Slab Cutter
                    </SelectItem>
                    <SelectItem value="cutting:Rope Cutter">
                      Cutting - Rope Slab Cutter
                    </SelectItem>

                    {/* Polishing Types */}
                    <SelectItem value="polish:Auto Polishing">
                      Polish - Auto Polishing
                    </SelectItem>
                    <SelectItem value="polish:Line Polishing">
                      Polish - Line Polishing
                    </SelectItem>
                    <SelectItem value="polish:Hand Polishing">
                      Polish - Hand Polishing
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="machineOwnership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Machine Ownership</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ownership Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="machinePhoto"
            render={() => (
              <FormItem>
                <FormLabel>Machine Photo</FormLabel>
                <FormControl>
                  <FileUploadField
                    name="machinePhoto"
                    storageKey="machinePhoto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="installedDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Installed Date</FormLabel>
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
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="machineCost"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Machine Cost</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Machine Cost"
                    min={0}
                    disabled={isLoading}
                    className="w-[40%]" // Limit width to 40%
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review / Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description or review of the machine..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Add Machine"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
