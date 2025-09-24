"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { fetchData, putData } from "@/axiosUtility/api";
import { Input } from "@/components/ui/input";
import { Icons } from "./icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "./button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Slab } from "@/app/(routes)/[organizationId]/[factoryid]/factorymanagement/inventory/raw/processing/components/inpolishingcolumns";

interface MarkMultipleSlabsPolishFormProps {
  table: any;
  bulkPolishTitle?: string;
  bulkPOlishDescription?: string;
  bulkPolishIdName?: string;
  updateRoute?: string;
  bulkPolisToastMessage?: string;
}

export const formSchema = z.object({
  trim: z.object({
    length: z.object({
      value: z.preprocess(
        (val) => (val ? parseFloat(val as string) : undefined),
        z.number().min(0.1, { message: "Length must be greater than zero" })
      ),
      units: z.literal("inch"),
    }),
    height: z.object({
      value: z.preprocess(
        (val) => (val ? parseFloat(val as string) : undefined),
        z.number().min(0.1, { message: "Height must be greater than zero" })
      ),
      units: z.literal("inch"),
    }),
  }),
  outTime: z.string().nonempty("Out Time is required"),
  status: z.literal("polished"),
  slabNumbers: z.string().optional(), // ✅ added field for slab numbers
});

function MarkMultipleSlabsPolishForm({
  table,
  bulkPolishIdName,
  updateRoute,
  bulkPolisToastMessage,
}: MarkMultipleSlabsPolishFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trim: {
        length: { value: 0, units: "inch" },
        height: { value: 0, units: "inch" },
      },
      outTime: "",
      status: "polished",
      slabNumbers: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [slabsData, setSlabsData] = React.useState<Slab[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [inTime, setInTime] = React.useState<string>("");
  const [assignedMachine, setAssignedMachine] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  const modal = useGlobalModal();

  // Update selectedIds whenever table selection changes
  React.useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map(
      (row: any) => row.original[bulkPolishIdName as string]
    );
    setSelectedIds(ids);
  }, [table, bulkPolishIdName]);

  // Fetch slabs data when selectedIds changes
  React.useEffect(() => {
    const fetchSlabsData = async () => {
      try {
        if (selectedIds.length === 0) {
          setSlabsData([]);
          setAssignedMachine(null);
          setInTime("");
          form.setValue("slabNumbers", "");
          return;
        }

        const promises = selectedIds.map((id) =>
          fetchData(`/factory-management/inventory/finished/get/${id}`)
        );
        const results = await Promise.all(promises);

        setSlabsData(results);

        // ✅ Store slab numbers in form state
        const slabNumbers = results
          .map((slab) => slab.slabNumber)
          .filter(Boolean)
          .join(", ");
        form.setValue("slabNumbers", slabNumbers);

        // Use first slab’s machine & inTime if available
        const first = results[0];
        if (first?.polishing) {
          if (first.polishing.machineId) {
            setAssignedMachine({
              id: first.polishing.machineId._id,
              name: first.polishing.machineId.machineName,
            });
          }
          if (first.polishing.in) {
            setInTime(new Date(first.polishing.in).toISOString().slice(0, 16));
          }
        }
      } catch (error) {
        console.error("Error fetching slabs data:", error);
        toast.error("Failed to fetch slabs data");
      }
    };

    fetchSlabsData();
  }, [selectedIds]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedIds.length === 0) {
      toast.error("No slabs selected to polish.");
      return;
    }

    modal.title = "Confirm Details";
    modal.description = "Please review the entered details:";
    modal.children = (
      <div className="space-y-4">
        {slabsData.length > 0 && (
          <div>
            <strong>Selected Slabs:</strong>
            <ul className="mt-1 space-y-1">
              {slabsData.map((slab, index) => (
                <li key={index}>Slab Number: {slab.slabNumber}</li>
              ))}
            </ul>
          </div>
        )}
        <p>
          <strong>Height (inches):</strong> {values.trim.height.value}
        </p>
        <p>
          <strong>Length (inches):</strong> {values.trim.length.value}
        </p>
        <p>
          <strong>Out Time:</strong> {values.outTime}
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              modal.onClose();
              setIsLoading(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                setIsLoading(true);
                const payload = {
                  slabs: selectedIds.map((id) => ({
                    slabId: id,
                    polishedValues: {
                      length: values.trim.length,
                      height: values.trim.height,
                    },
                  })),
                  outTime: values.outTime,
                };

                await putData(
                  "/factory-management/inventory/finished/markmultipleslabspolished",
                  payload
                );

                toast.success(
                  bulkPolisToastMessage || "Selected slabs marked as polished!"
                );
                table.resetRowSelection();
                modal.onClose();
                window.location.reload();
              } catch (error) {
                toast.error("Failed to mark slabs polished");
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Confirm
          </Button>
        </div>
      </div>
    );
    modal.onOpen();
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <div className="min-w-[100px] font-semibold text-sm">
            Slab Number {form.watch("slabNumbers") || "N/A"}
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Assigned Machine</AccordionTrigger>
              <AccordionContent>
                <div className="border p-3 rounded-lg bg-gray-100 space-y-3">
                  <div>
                    <Label>Machine Used</Label>
                    <Input
                      type="text"
                      value={assignedMachine?.name || "Not Assigned"}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>In Time (Date & Time)</Label>
                    <Input type="datetime-local" value={inTime || ""} disabled />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trim.length.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (inches)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: 120"
                      type="number"
                      step="any"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trim.height.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (inches)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: 54"
                      type="number"
                      step="any"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="outTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Out Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default MarkMultipleSlabsPolishForm;
