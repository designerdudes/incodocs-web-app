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
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { postData, putData } from "@/axiosUtility/api";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";

// Define the Zod schema
const formSchema = z.object({
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
  noOfBlocks: z
    .number()
    .min(1, { message: "Number of blocks must be greater than zero" }),
  blocks: z
    .array(
      z.object({
        dimensions: z.object({
          // weight: z.object({
          //   value: z
          //     .number()
          //     .min(0.1, { message: "Weight must be greater than zero" }),
          //   units: z.string().default("tons"),
          // }),
          length: z.object({
            value: z
              .number({ required_error: "Length is required" })
              .min(0.1, { message: "Length must be greater than zero" }),
            units: z.string().default("inch"),
          }),
          breadth: z.object({
            value: z
              .number({ required_error: "Breadth is required" })
              .min(0.1, { message: "Breadth must be greater than zero" }),
            units: z.string().default("inch"),
          }),
          height: z.object({
            value: z
              .number({ required_error: "Height is required" })
              .min(0.1, { message: "Height must be greater than zero" }),
            units: z.string().default("inch"),
          }),
        }),
      })
    )
    .min(1, { message: "At least one block is required" }),
});

interface Props {
  params: {
    factoryid: string;
  };
}

type FormData = z.infer<typeof formSchema>;

interface AddBlockFormProps {
  LotData: {
    _id: string;
    lotName: string;
    materialType: string;
    blocksId: string[];
    transportCost: number;
    materialCost: number;
    markerCost: number;
    markerOperatorName: string;
    createdAt: string;
    updatedAt: string;
    blocks: FormData["blocks"];
  };
}

function saveProgressSilently(data: FormData) {
  try {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
}

export function AddBlockForm(
  { LotData }: AddBlockFormProps,
  { params }: Props
) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalWeight, setGlobalWeight] = useState<string>("");
  const [globalLength, setGlobalLength] = useState<string>("");
  const [globalBreadth, setGlobalBreadth] = useState<string>("");
  const [globalHeight, setGlobalHeight] = useState<string>("");
  const [applyWeightToAll, setApplyWeightToAll] = useState<boolean>(false);
  const [applyLengthToAll, setApplyLengthToAll] = useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] = useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [blockCountToBeDeleted, setBlockCountToBeDeleted] = useState<
    number | null
  >(null);

  // console.log(params, "params");
  const factoryId = useParams().factoryid;
  const organizationId = useParams().organizationId;
  // console.log(organizationId, "organizationId");
  // console.log(factoryId, "factoryId");
  // const organizationId = "674b0a687d4f4b21c6c980ba";
  const lotId = LotData?._id;

  // const blocks = watch("blocks") || [];
  const prevMarkerCost = LotData?.markerCost || 0;
  const prevTransportCost = LotData?.transportCost || 0;
  const prevMaterialCost = LotData?.materialCost || 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      markerCost: 0 || undefined,
      transportCost: 0 || undefined,
      materialCost: 0 || undefined,
      noOfBlocks: 1,
      blocks: [
        {
          dimensions: {
            // weight: { value: 0, units: "tons" },
            length: { value: 0, units: "inch" },
            breadth: { value: 0, units: "inch" },
            height: { value: 0, units: "inch" },
          },
        },
      ],
    },
  });

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

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    const submissionData = {
      ...values,
      lotId,
      blocks,
      factoryId,
      organizationId,
      status: "active",
    };
    try {
      await putData(
        `/factory-management/inventory/updatelotaddblocks/${lotId}`,
        submissionData
      );
      toast.success("Block updated successfully");
      router.push("../");
    } catch (error) {
      console.error("Error updating Block:", error);
      toast.error("Error updating Block");
    } finally {
      setIsLoading(false);
    }
    router.refresh();
  }

  function calculateTotalVolume() {
    const totalVolumeInM = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume = (length.value * breadth.value * height.value) / 1_000_000;
      return total + (volume || 0);
    }, 0);
    return {
      inM: totalVolumeInM,
    };
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={control.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="materialCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter material cost"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  {field.value && (
                    <span className="text-gray-500 text-sm">
                      Total Material cost: {prevMaterialCost} + {field.value} ={" "}
                      {prevMaterialCost + field.value}
                    </span>
                  )}
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
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  {field.value && (
                    <span className="text-gray-500 text-sm">
                      Total Marker cost: {prevMarkerCost} + {field.value} ={" "}
                      {prevMarkerCost + field.value}
                    </span>
                  )}
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
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  {field.value && (
                    <span className="text-gray-500 text-sm">
                      Total Transport cost: {prevTransportCost} + {field.value}{" "}
                      = {prevTransportCost + field.value}
                    </span>
                  )}
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
                placeholder="Length (inches)"
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
                    if (e.target.checked && globalLength) {
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
                placeholder="Breadth (inches)"
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
                    if (e.target.checked && globalBreadth) {
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
                    if (e.target.checked && globalHeight) {
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
                Apply height to all rows
              </label>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Length (inch)</TableHead>
                <TableHead>Breadth (inch)</TableHead>
                <TableHead>Height (inch)</TableHead>
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
                      1_000_000
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
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
