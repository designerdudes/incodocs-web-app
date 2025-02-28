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
import { Button } from "./button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Slab } from "@/app/(routes)/[factoryid]/factorymanagement/inventory/raw/processing/components/inpolishingcolumns";

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
    height: z.object({
      value: z.preprocess(
        (val) => (val ? parseFloat(val as string) : undefined),
        z.number().min(0.1, { message: "Height must be greater than zero" })
      ),
      units: z.literal("inch"),
    }),
    length: z.object({
      value: z.preprocess(
        (val) => (val ? parseFloat(val as string) : undefined),
        z.number().min(0.1, { message: "Length must be greater than zero" })
      ),
      units: z.literal("inch"),
    }),
  }),
  status: z.literal("polished"),
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
        height: { value: 0, units: "inch" },
        length: { value: 0, units: "inch" },
      },
      status: "polished",
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [slabsData, setSlabsData] = React.useState<Slab[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const modal = useGlobalModal();

  // Update selectedIds whenever table selection changes
  React.useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row: any) => row.original[bulkPolishIdName as string]);
    setSelectedIds(ids);
  }, [table, bulkPolishIdName]); // Added 'table' as a dependency

  // Fetch slabs data when selectedIds changes
  React.useEffect(() => {
    const fetchSlabsData = async () => {
      try {
        if (selectedIds.length === 0) {
          setSlabsData([]); // Clear slabs data if no IDs are selected
          return;
        }

        const promises = selectedIds.map((id) =>
          fetchData(`/factory-management/inventory/finished/get/${id}`)
        );
        const results = await Promise.all(promises);
        setSlabsData(results);
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
                <li key={index}>
                  Slab Number: {slab.slabNumber}
                </li>
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
                await putData(updateRoute as string, {
                  ids: selectedIds,
                  ...values,
                });
                toast.success(
                  bulkPolisToastMessage ?? "Selected slabs marked as polished!"
                );
                table.resetRowSelection();
                modal.onClose();
                window.location.reload();
              } catch (error) {
                toast.error("Error updating trim values");
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
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default MarkMultipleSlabsPolishForm;