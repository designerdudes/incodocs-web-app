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
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

// Define the Zod schema
const formSchema = z.object({
  blockNumber: z.number().optional(),
  materialType: z
    .string()
    .min(3, { message: "Material type must be at least 3 characters long" })
    .optional(),
  markerCost: z
    .number()
    .min(1, { message: "Marker cost must be greater than or equal to zero" })
    .optional(),
  blockLoadingCost: z
    .number()
    .min(1, { message: "Transport cost must be greater than or equal to zero" })
    .optional(),
  quarryCost: z
    .number()
    .min(0, { message: "Quarry cost must be greater than or equal to zero" })
    .optional(),
  commissionCost: z
    .number()
    .min(0, {
      message: "Commission cost must be greater than or equal to zero",
    })
    .optional(),
  permitCost: z
    .number()
    .min(0, { message: "Permit Cost must be greater than or equal to zero" })
    .optional(),
  materialCost: z
    .number()
    .min(1, { message: "Material cost must be greater than or equal to zero" })
    .optional(),
  blockphoto: z.string().optional(),
  noOfBlocks: z
    .number()
    .min(1, { message: "Number of blocks must be greater than zero" }),
  blocks: z
    .array(
      z.object({
        blockphoto: z.string().optional(),
        vehicleNumber: z.string().optional(),
        dimensions: z.object({
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
    blockNumber: number;
    materialType: string;
    blocksId: string[];
    blockLoadingCost: number;
    materialCost: number;
    permitCost: number;
    markerCost: number;
    markerOperatorName: string;
    quarryCost: number;
    commissionCost: number;
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

export function AddBlockForm({ LotData }: AddBlockFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalLength, setGlobalLength] = useState<string>("");
  const [globalBreadth, setGlobalBreadth] = useState<string>("");
  const [globalHeight, setGlobalHeight] = useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] = useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] = useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [blockCountToBeDeleted, setBlockCountToBeDeleted] = useState<
    number | null
  >(null);
  const [blockCountInput, setBlockCountInput] = useState("1");

  const factoryId = useParams().factoryid;
  const organizationId = useParams().organizationId;
  const lotId = LotData?._id;

  const prevMarkerCost = LotData?.markerCost || 0;
  const prevblockLoadingCost = LotData?.blockLoadingCost || 0;
  const prevMaterialCost = LotData?.materialCost || 0;
  const prevquarryCost = LotData?.quarryCost || 0;
  const prevcommissionCost = LotData?.commissionCost || 0;
  const prevpermitCost = LotData?.permitCost || 0;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockNumber: 0,
      materialType: "",
      markerCost: 0 || undefined,
      blockLoadingCost: 0 || undefined,
      materialCost: 0 || undefined,
      permitCost: 0 || undefined,
      quarryCost: 0 || undefined,
      commissionCost: 0 || undefined,
      noOfBlocks: 1,
      blocks: [
        {
          blockphoto: "",
          vehicleNumber: "",
          dimensions: {
            length: { value: 0, units: "inch" },
            breadth: { value: 0, units: "inch" },
            height: { value: 0, units: "inch" },
          },
        },
      ],
    },
  });

  const { control, setValue, watch, getValues, trigger } = form;

  // Sync blocks state with form on mount
  useEffect(() => {
    const formBlocks = watch("blocks") || [];
    if (formBlocks.length > 0) {
      setBlocks(formBlocks);
    }
  }, [watch]);

  // Handle block count changes
  const handleBlockCountChange = async (value: string) => {
    const newCount = Number(value) || 1;
    if (newCount < blocks.length) {
      setShowConfirmation(true);
      setBlockCountToBeDeleted(newCount);
    } else {
      const currentBlocks = getValues("blocks") || [];
      const newBlocks = Array.from({ length: newCount }, (_, index) =>
        index < currentBlocks.length
          ? currentBlocks[index]
          : {
              blockphoto: "",
              vehicleNumber: "",
              dimensions: {
                length: { value: 0, units: "inch" },
                breadth: { value: 0, units: "inch" },
                height: { value: 0, units: "inch" },
              },
            }
      );
      setBlocks(newBlocks);
      setValue("blocks", newBlocks);
      setValue("noOfBlocks", newBlocks.length);
      saveProgressSilently(getValues());
      const isValid = await trigger("blocks");
      if (!isValid) {
        console.error("Block validation failed:", form.formState.errors);
      }
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
    const isValid = await trigger();
    if (!isValid) {
      console.error("Form validation failed:", form.formState.errors);
      toast.error("Please fill all required fields correctly");
      setIsLoading(false);
      return;
    }
    const submissionData = {
      ...values,
      lotId,
      factoryId,
      organizationId,
      blocks: values.blocks.map((block) => ({
        blockphoto: block.blockphoto || "",
        vehicleNumber: block.vehicleNumber || "",
        dimensions: {
          length: { value: block.dimensions.length.value, units: "inch" },
          breadth: { value: block.dimensions.breadth.value, units: "inch" },
          height: { value: block.dimensions.height.value, units: "inch" },
        },
      })),
    };
    try {
      await putData(
        `/factory-management/inventory/updatelotaddblocks/${lotId}`,
        submissionData
      );
      toast.success("Block updated successfully");
      router.push("../");
      setTimeout(() => localStorage.removeItem("shipmentFormData"), 3000);
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
  function calculateTotalWeight() {
    const totalWeightInTons = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume = (length.value * breadth.value * height.value) / 1000000; // m³
      const density = 3.5; // Example density in tons/m³
      //   length.value * breadth.value * height.value * (length.units === "inch" ? 0.000016387064 : 0.000001);
      // const density = 3.5;
      const weight = volume * density;
      return total + weight;
    }, 0);
    return {
      inTons: totalWeightInTons,
    };
  }

  function calculateWeight(length: number, breadth: number, height: number) {
    const volumeInM3 = (length * breadth * height) / 1_000_000;
    const density = 3.5; // tons per m³
    return (volumeInM3 * density).toFixed(2);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {/* <FormField
              name="blockNumber"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Block Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2341"
                      disabled={isLoading}
                      {...field}
                      value={field.value ?? ""}
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
                      disabled={isLoading}
                      {...field}
                      value={field.value ?? ""}
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
                      min={0}
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
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
                      type="number"
                      min={0}
                      placeholder="Enter marker cost"
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
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
              name="blockLoadingCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Block Loading Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Enter Block Loading Cost"
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
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
                      Total Transport cost: {prevblockLoadingCost} +{" "}
                      {field.value} = {prevblockLoadingCost + field.value}
                    </span>
                  )}
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
                      type="number"
                      min={0}
                      placeholder="Enter Quarry Transport Cost"
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  {field.value && (
                    <span className="text-gray-500 text-sm">
                      Total Quarry Transport cost: {prevquarryCost} +{" "}
                      {field.value} = {prevquarryCost + field.value}
                    </span>
                  )}
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
                      type="number"
                      min={0}
                      placeholder="Enter Commission Cost"
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  {field.value && (
                    <span className="text-gray-500 text-sm">
                      Total Transport cost: {prevcommissionCost} + {field.value}{" "}
                      = {prevcommissionCost + field.value}
                    </span>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="permitCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permit Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Enter Permit Cost"
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  {field.value && (
                    <span className="text-gray-500 text-sm">
                      Total Permit cost: {prevpermitCost} + {field.value} ={" "}
                      {prevpermitCost + field.value}
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
                      // disabled={isLoading}
                      // onWheel={(e) =>
                      //   e.target instanceof HTMLElement && e.target.blur()
                      // }
                      onChange={async (e) => {
                        let val = e.target.value.slice(0, 2);
                        field.onChange(val);
                        if (val.length > 2) {
                          val = val.slice(0, 2);
                        }

                        setBlockCountInput(val);

                        const n = Math.max(1, parseInt(val || "1", 10));
                        field.onChange(n); // keep RHF in sync
                        await handleBlockCountChange(String(n)); // update rows
                      }}
                      value={blockCountInput}
                      // onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Input
                value={globalLength}
                type="number"
                min="0"
                onWheel={(e) =>
                  e.target instanceof HTMLElement && e.target.blur()
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setGlobalLength(val);
                  }
                }}
                placeholder="Length (cm)"
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
                            value: Math.max(0, parseFloat(globalLength) || 0),
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

            {/* Breadth */}
            <div>
              <Input
                value={globalBreadth}
                type="number"
                min="0"
                onWheel={(e) =>
                  e.target instanceof HTMLElement && e.target.blur()
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setGlobalBreadth(val);
                  }
                }}
                placeholder="Breadth (cm)"
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
                            value: Math.max(0, parseFloat(globalBreadth) || 0),
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

            {/* Height */}
            <div>
              <Input
                value={globalHeight}
                type="number"
                min="0"
                onWheel={(e) =>
                  e.target instanceof HTMLElement && e.target.blur()
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setGlobalHeight(val);
                  }
                }}
                placeholder="Height (cm)"
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
                            value: Math.max(0, parseFloat(globalHeight) || 0),
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
                <TableHead>S.No</TableHead>
                <TableHead>Length (cm)</TableHead>
                <TableHead>Breadth (cm)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Weight (tons)</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Block Photo</TableHead>
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
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
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
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
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
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.height.value =
                                  parseFloat(e.target.value) || 0;
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
                      1_000_000
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {calculateWeight(
                      block.dimensions.length.value,
                      block.dimensions.breadth.value,
                      block.dimensions.height.value
                    )}
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`blocks.${index}.vehicleNumber`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Vehicle Number"
                              value={block.vehicleNumber || ""}
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].vehicleNumber =
                                  e.target.value;
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
                      name={`blocks.${index}.blockphoto`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={field.name}
                              value={field.value || ""}
                              onChange={(value) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].blockphoto = value || "";
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
                                saveProgressSilently(getValues());
                              }}
                              storageKey="blockphoto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                <TableCell className="font-bold">
                  Total Weight (tons):{" "}
                  {calculateTotalWeight().inTons.toFixed(2)}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
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
