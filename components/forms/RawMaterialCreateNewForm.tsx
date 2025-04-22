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
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { postData } from "@/axiosUtility/api";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";

// Define the form schema
const formSchema = z.object({
  lotName: z
    .string()
    .min(3, { message: "Lot name must be at least 3 characters long" }),
  materialType: z
    .string()
    .min(3, { message: "Material type must be at least 3 characters long" }),
  markerCost: z
    .number()
    .min(1, { message: "Marker cost must be greater than or equal to zero" })
    .optional(),
  transportCost: z
    .number()
    .min(1, { message: "Transport cost must be greater than or equal to zero" })
    .optional(),
  materialCost: z
    .number()
    .min(1, { message: "Material cost must be greater than or equal to zero" })
    .optional(),
  markerOperatorName: z
    .string()
    .min(1, { message: "Marker name is required" })
    .optional(),
  noOfBlocks: z
    .number()
    .min(1, { message: "Number of blocks must be greater than zero" }),
  blocks: z
    .array(
      z.object({
        materialType: z
          .string()
          .min(1, { message: "Material type is required" })
          .optional(),
        status: z.string().min(1, { message: "Status is required" }).optional(),
        inStock: z.boolean().optional(),
        dimensions: z.object({
          weight: z.object({
            value: z
              .number()
              .min(0.1, { message: "Weight must be greater than zero" }),
            units: z.literal("tons").default("tons"),
          }),
          length: z.object({
            value: z
              .number()
              .min(0.1, { message: "Length must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          breadth: z.object({
            value: z
              .number()
              .min(0.1, { message: "Breadth must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          height: z.object({
            value: z
              .number()
              .min(0.1, { message: "Height must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
        }),
      })
    )
    .min(1, { message: "At least one block is required" }),
});

interface RawMaterialCreateNewFormProps {
  gap: number;
}

export function RawMaterialCreateNewForm({}: RawMaterialCreateNewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [blocks, setBlocks] = React.useState<any[]>([]);
  const [globalWeight, setGlobalWeight] = React.useState<string>("");
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalBreadth, setGlobalBreadth] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyWeightToAll, setApplyWeightToAll] =
    React.useState<boolean>(false);
  const [applyLengthToAll, setApplyLengthToAll] =
    React.useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] =
    React.useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] =
    React.useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [blockCountToBeDeleted, setBlockCountToBeDeleted] = React.useState<
    number | null
  >(null);

  const factoryId = useParams().factoryid;
  const organizationId = "674b0a687d4f4b21c6c980ba";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noOfBlocks: 1,
      blocks: [
        {
          dimensions: {
            weight: { value: 0, units: "tons" },
            length: { value: 0, units: "inch" },
            breadth: { value: 0, units: "inch" },
            height: { value: 0, units: "inch" },
          },
        },
      ],
    },
  });

  const { control, setValue, watch, getValues } = form;

  // Sync blocks state with form on mount
  React.useEffect(() => {
    const formBlocks = watch("blocks") || [];
    if (formBlocks.length > 0) {
      setBlocks(formBlocks);
    }
  }, [watch]);

  // Save progress to localStorage
  const saveProgressSilently = (data: any) => {
    try {
      localStorage.setItem("rawMaterialFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };

  // Handle block count changes
  const handleBlockCountChange = (value: string) => {
    const newCount = Number(value);

    if (newCount < blocks.length) {
      setShowConfirmation(true);
      setBlockCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "blocks",
        createNewItem: () => ({
          dimensions: {
            weight: { value: 0, units: "tons" },
            length: { value: 0, units: "inch" },
            breadth: { value: 0, units: "inch" },
            height: { value: 0, units: "inch" },
          },
        }),
        customFieldSetters: {
          blocks: (items, setValue) => {
            setValue("noOfBlocks", items.length);
            setBlocks(items);
          },
        },
        saveCallback: saveProgressSilently,
      });
    }
  };

  // Handle confirmation for reducing block count
  const handleConfirmChange = () => {
    if (blockCountToBeDeleted !== null) {
      const updatedBlocks = blocks.slice(0, blockCountToBeDeleted);
      setBlocks(updatedBlocks);
      setValue("blocks", updatedBlocks);
      setValue("noOfBlocks", updatedBlocks.length);
      saveProgressSilently(getValues());
      setBlockCountToBeDeleted(null);
    }
    setShowConfirmation(false);
  };

  // Handle block deletion
  const handleDeleteBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
    setValue("blocks", updatedBlocks);
    setValue("noOfBlocks", updatedBlocks.length);
    saveProgressSilently(getValues());
  };

  // Form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await postData("/factory-management/inventory/addlotandblocks", {
        ...values,
        factoryId,
        organizationId,
        status: "active",
      });
      toast.success("Lot created/updated successfully");
      router.push("./");
    } catch (error) {
      console.error("Error creating/updating Lot:", error);
      toast.error("Error creating/updating Lot");
    } finally {
      setIsLoading(false);
    }
    router.refresh();
  }

  // Calculate total volume
  function calculateTotalVolume() {
    const totalVolumeInM = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume = (length.value * breadth.value * height.value) / 1000000;
      return total + (volume || 0);
    }, 0);
    return {
      inM: totalVolumeInM,
    };
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="lotName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Xyz"
                      disabled={isLoading}
                      {...field}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="materialType"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Granite"
                      disabled={isLoading}
                      {...field}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="materialCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter material cost"
                      type="number"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="markerCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marker Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter marker cost"
                      type="number"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="transportCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter transport cost"
                      type="number"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="markerOperatorName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marker Operator</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Operator Name"
                      disabled={isLoading}
                      {...field}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="noOfBlocks"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Blocks</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter number of blocks"
                      type="number"
                      min="1"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) < 1) {
                          field.onChange(1);
                          handleBlockCountChange("1");
                          return;
                        }
                        field.onChange(Number(value));
                        handleBlockCountChange(value);
                      }}
                      value={field.value ?? 1}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<FormField
              name="noOfBlocks"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quarry Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Quarry Cost"
                      type="number"
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(e);
                        handleBlocksInputChange(e.target.value);
                      }}
                      value={field.value === 0 ? "" : field.value} // Check if field.value is 0 and render an empty string instead
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="noOfBlocks"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comission Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Comission Cost"
                      type="number"
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(e);
                        handleBlocksInputChange(e.target.value);
                      }}
                      value={field.value === 0 ? "" : field.value} // Check if field.value is 0 and render an empty string instead
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <Input
                value={globalWeight}
                onChange={(e) => setGlobalWeight(e.target.value)}
                placeholder="Weight (tons)"
                type="number"
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="checkbox"
                  checked={applyWeightToAll}
                  onChange={(e) => {
                    setApplyWeightToAll(e.target.checked);
                    if (e.target.checked) {
                      const updatedBlocks = blocks.map((block) => ({
                        ...block,
                        dimensions: {
                          ...block.dimensions,
                          weight: {
                            ...block.dimensions.weight,
                            value: parseFloat(globalWeight) || 0.1,
                          },
                        },
                      }));
                      setBlocks(updatedBlocks);
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Weight to all rows
              </label>
            </div>
            <div>
              <Input
                value={globalLength}
                onChange={(e) => setGlobalLength(e.target.value)}
                placeholder="Length (inch)"
                type="number"
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="checkbox"
                  checked={applyLengthToAll}
                  onChange={(e) => {
                    setApplyLengthToAll(e.target.checked);
                    if (e.target.checked) {
                      const updatedBlocks = blocks.map((block) => ({
                        ...block,
                        dimensions: {
                          ...block.dimensions,
                          length: {
                            ...block.dimensions.length,
                            value: parseFloat(globalLength) || 0.1,
                          },
                        },
                      }));
                      setBlocks(updatedBlocks);
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Length to all rows
              </label>
            </div>
            <div>
              <Input
                value={globalBreadth}
                onChange={(e) => setGlobalBreadth(e.target.value)}
                placeholder="Breadth (inch)"
                type="number"
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="checkbox"
                  checked={applyBreadthToAll}
                  onChange={(e) => {
                    setApplyBreadthToAll(e.target.checked);
                    if (e.target.checked) {
                      const updatedBlocks = blocks.map((block) => ({
                        ...block,
                        dimensions: {
                          ...block.dimensions,
                          breadth: {
                            ...block.dimensions.breadth,
                            value: parseFloat(globalBreadth) || 0.1,
                          },
                        },
                      }));
                      setBlocks(updatedBlocks);
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Breadth to all rows
              </label>
            </div>
            <div>
              <Input
                value={globalHeight}
                onChange={(e) => setGlobalHeight(e.target.value)}
                placeholder="Height (inch)"
                type="number"
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <input
                  type="checkbox"
                  checked={applyHeightToAll}
                  onChange={(e) => {
                    setApplyHeightToAll(e.target.checked);
                    if (e.target.checked) {
                      const updatedBlocks = blocks.map((block) => ({
                        ...block,
                        dimensions: {
                          ...block.dimensions,
                          height: {
                            ...block.dimensions.height,
                            value: parseFloat(globalHeight) || 0.1,
                          },
                        },
                      }));
                      setBlocks(updatedBlocks);
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Height to all rows
              </label>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Weight (tons)</TableHead>
                <TableHead>Length (inch)</TableHead>
                <TableHead>Breadth (inch)</TableHead>
                <TableHead>Height (inch)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      name={`blocks.${index}.dimensions.weight.value`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={block.dimensions.weight.value}
                              placeholder="Enter weight"
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.weight.value =
                                  parseFloat(e.target.value) || 0.1;
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
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
                      name={`blocks.${index}.dimensions.length.value`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={block.dimensions.length.value}
                              placeholder="Enter length"
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.length.value =
                                  parseFloat(e.target.value) || 0.1;
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
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
                      name={`blocks.${index}.dimensions.breadth.value`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={block.dimensions.breadth.value}
                              placeholder="Enter breadth"
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.breadth.value =
                                  parseFloat(e.target.value) || 0.1;
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
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
                      name={`blocks.${index}.dimensions.height.value`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={block.dimensions.height.value}
                              placeholder="Enter height"
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.height.value =
                                  parseFloat(e.target.value) || 0.1;
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
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
                    {(
                      (block.dimensions.length.value *
                        block.dimensions.breadth.value *
                        block.dimensions.height.value) /
                      1000000
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="string"
                      placeholder="BH 08 BH 0823"
                      disabled={isLoading}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => handleDeleteBlock(index)}
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
                <TableCell colSpan={8} className="text-right font-bold">
                  Total Volume (m³): {calculateTotalVolume().inM.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>

          <ConfirmationDialog
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmChange}
            title="Are you sure?"
            description="You are reducing the number of blocks. This action cannot be undone."
          />
        </form>
      </Form>
    </div>
  );
}