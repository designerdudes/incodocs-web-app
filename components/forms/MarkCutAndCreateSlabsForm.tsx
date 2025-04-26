"use client";
import * as React from "react";
import * as z from "zod";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { putData } from "@/axiosUtility/api";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";

interface MarkCutAndCreateSlabsFormProps {
  gap: number;
  BlockData: any;
}

const formSchema = z.object({
  _id: z.string().optional(),
  numberofSlabs: z
    .number()
    .min(1, { message: "Number of slabs must be greater than zero" }),
  slabs: z
    .array(
      z.object({
        dimensions: z.object({
          length: z.object({
            value: z
              .number({ required_error: "Length is required" })
              .min(0.1, { message: "Length must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          height: z.object({
            value: z
              .number({ required_error: "Height is required" })
              .min(0.1, { message: "Height must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          status: z.literal("readyForPolish").default("readyForPolish"),
        }),
      })
    )
    .min(1, { message: "You must define at least one slab" }),
});

export function MarkCutAndCreateSlabsForm({
  BlockData,
  gap,
}: MarkCutAndCreateSlabsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [slabs, setSlabs] = React.useState<any[]>([]);
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] = React.useState(false);
  const [applyHeightToAll, setApplyHeightToAll] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [slabCountToBeDeleted, setSlabCountToBeDeleted] = React.useState<
    number | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: BlockData?._id || "",
      numberofSlabs: BlockData?.numberofSlabs || 1,
      slabs: BlockData?.slabs || [
        {
          dimensions: {
            length: { value: 0, units: "inch" },
            height: { value: 0, units: "inch" },
            status: "readyForPolish",
          },
        },
      ],
    },
  });

  

  const { control, setValue, watch, getValues } = form;

  // Sync slabs state with form on mount
  React.useEffect(() => {
    const formSlabs = watch("slabs") || [];
    if (formSlabs.length > 0) {
      setSlabs(formSlabs);
    }
  }, [watch]);

  // Save progress to localStorage
  const saveProgressSilently = (data: any) => {
    try {
      localStorage.setItem("slabsFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };

  // Handle slab count changes
  const handleSlabCountChange = (value: string) => {
    const newCount = Number(value);

    if (newCount < slabs.length) {
      setShowConfirmation(true);
      setSlabCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "slabs",
        createNewItem: () => ({
          dimensions: {
            length: { value: 0, units: "inch" },
            height: { value: 0, units: "inch" },
            status: "readyForPolish",
          },
        }),
        customFieldSetters: {
          slabs: (items, setValue) => {
            setValue("numberofSlabs", items.length);
            setSlabs(items);
          },
        },
        saveCallback: saveProgressSilently,
      });
    }
  };

  // Handle confirmation for reducing slab count
  const handleConfirmChange = () => {
    if (slabCountToBeDeleted !== null) {
      const updatedSlabs = slabs.slice(0, slabCountToBeDeleted);
      setSlabs(updatedSlabs);
      setValue("slabs", updatedSlabs);
      setValue("numberofSlabs", updatedSlabs.length);
      saveProgressSilently(getValues());
      setSlabCountToBeDeleted(null);
    }
    setShowConfirmation(false);
  };

  // Handle slab deletion
  const handleDeleteRow = (index: number) => {
    const updatedSlabs = slabs.filter((_, i) => i !== index);
    setSlabs(updatedSlabs);
    setValue("slabs", updatedSlabs);
    setValue("numberofSlabs", updatedSlabs.length);
    saveProgressSilently(getValues());
  };

  // Apply global dimensions
  React.useEffect(() => {
    if (applyLengthToAll || applyHeightToAll) {
      const updatedSlabs = slabs.map((slab) => ({
        dimensions: {
          ...slab.dimensions,
          length: applyLengthToAll
            ? { value: parseFloat(globalLength) || 0.1, units: "inch" }
            : slab.dimensions.length,
          height: applyHeightToAll
            ? { value: parseFloat(globalHeight) || 0.1, units: "inch" }
            : slab.dimensions.height,
          status: slab.dimensions.status,
        },
      }));
      setSlabs(updatedSlabs);
      setValue("slabs", updatedSlabs, { shouldValidate: true });
      saveProgressSilently(getValues());
    }
  }, [globalLength, globalHeight, applyLengthToAll, applyHeightToAll, setValue]);

  // Calculate square footage
  function calculateSqft(length?: number, height?: number): string {
    const lengthInFeet = (length || 0) / 12;
    const heightInFeet = (height || 0) / 12;
    const area = lengthInFeet * heightInFeet;
    return area > 0 ? area.toFixed(2) : "0.00";
  }

  // Calculate total square footage
  function calculateTotalSqft(): string {
    const totalSqft = slabs.reduce((sum, slab) => {
      const lengthInFeet = (slab.dimensions.length.value || 0) / 12;
      const heightInFeet = (slab.dimensions.height.value || 0) / 12;
      return sum + lengthInFeet * heightInFeet;
    }, 0);
    return totalSqft.toFixed(2);
  }

  // Form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await putData(
        `/factory-management/inventory/updateblockaddslab/${BlockData._id}`,
        {
          ...values,
          status: "cut",
        }
      );
      toast.success("Block data updated successfully");
      router.back();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("An error occurred while updating data");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`grid grid-cols-${gap} gap-3`}>
            <FormField
              name="numberofSlabs"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Slabs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of slabs"
                      min="1"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) < 1) {
                          field.onChange(1);
                          handleSlabCountChange("1");
                          return;
                        }
                        field.onChange(Number(value));
                        handleSlabCountChange(value);
                      }}
                      value={field.value ?? 1}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Length (inches)"
                type="number"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={globalLength}
                onChange={(e) => setGlobalLength(e.target.value)}
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
              />
              <label className="text-sm font-medium flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={applyLengthToAll}
                  onChange={(e) => setApplyLengthToAll(e.target.checked)}
                />{" "}
                Apply Length (inches) to all rows
              </label>
            </div>
            <div>
              <Input
                placeholder="Height (inches)"
                type="number"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={globalHeight}
                onChange={(e) => setGlobalHeight(e.target.value)}
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
              />
              <label className="text-sm font-medium flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={applyHeightToAll}
                  onChange={(e) => setApplyHeightToAll(e.target.checked)}
                />{" "}
                Apply Height (inches) to all rows
              </label>
            </div>
          </div>
          {slabs.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Length (inches)</TableHead>
                  <TableHead>Height (inches)</TableHead>
                  <TableHead>Area (sqft)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slabs.map((slab, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        name={`slabs.${index}.dimensions.length.value`}
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0.1"
                                step="0.1"
                                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                placeholder="Enter length"
                                value={slab.dimensions.length.value}
                                onChange={(e) => {
                                  const updatedSlabs = [...slabs];
                                  updatedSlabs[index].dimensions.length.value =
                                    parseFloat(e.target.value) || 0.1;
                                  setSlabs(updatedSlabs);
                                  setValue("slabs", updatedSlabs, {
                                    shouldValidate: true,
                                  });
                                  saveProgressSilently(getValues());
                                }}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        name={`slabs.${index}.dimensions.height.value`}
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0.1"
                                step="0.1"
                                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                placeholder="Enter height"
                                value={slab.dimensions.height.value}
                                onChange={(e) => {
                                  const updatedSlabs = [...slabs];
                                  updatedSlabs[index].dimensions.height.value =
                                    parseFloat(e.target.value) || 0.1;
                                  setSlabs(updatedSlabs);
                                  setValue("slabs", updatedSlabs, {
                                    shouldValidate: true,
                                  });
                                  saveProgressSilently(getValues());
                                }}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      {calculateSqft(
                        slab.dimensions.length.value,
                        slab.dimensions.height.value
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    Total Area (sqft): {calculateTotalSqft()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Update Slabs"}
          </Button>

          <ConfirmationDialog
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmChange}
            title="Are you sure?"
            description="You are reducing the number of slabs. This action cannot be undone."
          />
        </form>
      </Form>
    </div>
  );
}