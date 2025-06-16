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
import { useEffect, useState } from "react";

// Save progress to localStorage
const saveProgressSilently = (data: any) => {
  try {
    localStorage.setItem("rawMaterialFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
};

// Define the form schema
const formSchema = z.object({
  lotName: z
    .string()
    .min(3, { message: "Lot name must be at least 3 characters long" })
    .optional(),
  materialType: z
    .string()
    .min(3, { message: "Material type must be at least 3 characters long" })
    .optional(),
  markerCost: z
    .number()
    .min(0, { message: "Marker cost must be greater than or equal to zero" })
    .optional(),
  transportCost: z
    .number()
    .min(1, { message: "Transport cost must be greater than or equal to zero" })
    .optional(),
  materialCost: z
    .number()
    .min(1, { message: "Material cost must be greater than or equal to zero" })
    .optional(),
  quarryName: z
    .string()
    .min(3, { message: "Quarry name must be at least 3 characters long" })
    .optional(),
  quarryCost: z
    .number()
    .min(1, { message: "Quarry cost must be greater than or equal to zero" })
    .optional(),
  commissionCost: z
    .number()
    .min(1, {
      message: "Commission cost must be greater than or equal to zero",
    })
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
          // weight: z.object({
          //   value: z
          //     .number()
          //     .min(0.1, { message: "Weight must be greater than zero" }),
          //   units: z.literal("tons").default("tons"),
          // }),
          length: z.object({
            value: z
              .number()
              .min(0, { message: "Length must be greater than zero" }),
            units: z.literal("cm").default("cm"),
          }),
          breadth: z.object({
            value: z
              .number()
              .min(0, { message: "Breadth must be greater than zero" }),
            units: z.literal("cm").default("cm"),
          }),
          height: z.object({
            value: z
              .number()
              .min(0, { message: "Height must be greater than zero" }),
            units: z.literal("cm").default("cm"),
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  // const [globalWeight, setGlobalWeight] = useState<string>("");
  const [globalLength, setGlobalLength] = useState<string>("");
  const [globalBreadth, setGlobalBreadth] = useState<string>("");
  const [globalHeight, setGlobalHeight] = useState<string>("");
  // const [applyWeightToAll, setApplyWeightToAll] = useState<boolean>(false);
  const [applyLengthToAll, setApplyLengthToAll] = useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] = useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [blockCountToBeDeleted, setBlockCountToBeDeleted] = useState<
    number | null
  >(null);

  const factoryId = useParams().factoryid;
  const organizationId = useParams().organizationId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noOfBlocks: 1,
      blocks: [
        {
          dimensions: {
            // weight: { value: 0, units: "tons" },
            length: { value: 0, units: "cm" },
            breadth: { value: 0, units: "cm" },
            height: { value: 0, units: "cm" },
          },
        },
      ],
    },
  });

  const { control, setValue, watch, getValues } = form;

  // Sync blocks state with form on mount
  useEffect(() => {
    const formBlocks = watch("blocks") || [];
    if (formBlocks.length > 0) {
      setBlocks(formBlocks);
    }
  }, [watch]);

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
            // weight: { value: 0, units: "tons" },
            length: { value: 0, units: "cm" },
            breadth: { value: 0, units: "cm" },
            height: { value: 0, units: "cm" },
          },
        }),
        customFieldSetters: {
          blocks: (items, setValue) => {
            setValue("noOfBlocks", items.length);
            setBlocks(items);
          },
        },
        saveCallback: saveProgressSilently,
      }) as any;
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
    console.log("Form values:", values, factoryId, organizationId);
    try {
      await postData("/factory-management/inventory/addlotandblocks", {
        ...values,
        materialCost: values.materialCost || 0,
        markerCost: values.markerCost || 0,
        transportCost: values.transportCost || 0,
        factoryId,
        organizationId,
        status: "active",
      });
      toast.success("Lot created/updated successfully");
      router.push("./");
      setTimeout(() => localStorage.removeItem("rawMaterialFormData"), 3000);
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

  // function calculateTotalWeight() {
  //   const totalWeightInTons = blocks.reduce((total, block) => {
  //     const { weight } = block.dimensions;
  //     return total + (weight.value || 0);
  //   }, 0);
  //   return {
  //     inTons: totalWeightInTons,
  //   };
  // }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {/* <FormField
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
            /> */}
            <FormField
              name="materialType"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Granite"
                      // disabled={isLoading}
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
                      // className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      // type="number"
                      placeholder="Enter material cost"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : 0);
                      }}
                      value={field.value ?? 0}
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
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : 0);
                      }}
                      value={field.value ?? 0}
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
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : 0);
                      }}
                      value={field.value ?? 0}
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
              name="quarryName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quarry Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Quarry Name"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value);
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
              name="quarryCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quarry Transport Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Quarry Transport Cost"
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
              name="commissionCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Commission Cost"
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
                        if (value === "") {
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
          </div>
          <div className="grid grid-cols-4 gap-3">
            {/* <div>
              <Input
                value={globalWeight}
                onChange={(e) => setGlobalWeight(e.target.value)}
                placeholder="Weight (tons)"
                // type="number"
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
            </div> */}
            <div>
              <Input
                value={globalLength}
                onChange={(e) => setGlobalLength(e.target.value)}
                placeholder="Length (cm)"
                // type="number"
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
                placeholder="Breadth (cm)"
                // type="number"
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
                placeholder="Height (cm)"
                // type="number"
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
                <TableHead>Length (cm)</TableHead>
                <TableHead>Breadth (cm)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Weight (tons)</TableHead>
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
                      name={`blocks.${index}.dimensions.length.value`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              // type="number"
                              min="0"
                              step="1"
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
                              // type="number"
                              min="0"
                              step="1"
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
                              // type="number"
                              min="0"
                              step="1"
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
                    {/* <FormField
                      name={`blocks.${index}.dimensions.weight.value`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              // type="number"
                              min="0"
                              step="1"
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
                    /> */}
                    {(
                      (((block.dimensions.length.value *
                        block.dimensions.breadth.value *
                        block.dimensions.height.value) /
                        1000000) *
                        350 *
                        10) /
                      1000
                    ).toFixed(2)}
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
                      placeholder="Vehicle Number"
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
