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
import { putData } from "@/axiosUtility/api";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";

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
          weight: z.object({
            value: z
              .number({ required_error: "Weight is required" })
              .min(0.1, { message: "Weight must be greater than zero" }),
            units: z.string().default("tons"),
          }),
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

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => (
  <div className={isOpen ? "block" : "hidden"}>
    <div className="fixed inset-0 bg-black bg-opacity-50" />
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
      <h2 className="text-lg font-bold">{title}</h2>
      <p>{description}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  </div>
);

export function AddBlockForm({ LotData }: AddBlockFormProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [globalWeight, setGlobalWeight] = React.useState<string>("");
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalBreadth, setGlobalBreadth] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyWeightToAll, setApplyWeightToAll] = React.useState<boolean>(false);
  const [applyLengthToAll, setApplyLengthToAll] = React.useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] = React.useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] = React.useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingItemsToRemove, setPendingItemsToRemove] = React.useState<FormData["blocks"]>([]);

  const factoryId = useParams().factoryid;
  const organizationId = "674b0a687d4f4b21c6c980ba";
  const lotId = LotData._id;
  console.log("LotData", LotData);
  console.log("LotData", LotData);

  const blocks = watch("blocks") || [];
  const prevMarkerCost = LotData?.markerCost || 0;
  const prevTransportCost = LotData?.transportCost || 0;
  const prevMaterialCost = LotData?.materialCost || 0;

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


  function handleBlocksInputChange(value: string) {
    handleDynamicArrayCountChange<FormData, FormData["blocks"][number]>({
      value,
      watch,
      setValue,
      getValues,
      fieldName: "blocks",
      createNewItem: () => ({
        dimensions: {
          weight: { value: 0.1, units: "tons" },
          length: { value: 0.1, units: "inch" },
          breadth: { value: 0.1, units: "inch" },
          height: { value: 0.1, units: "inch" },
        },
      }),
      customFieldSetters: {
        blocks: (items, setValue) => {
          setValue("noOfBlocks", items.length);
        },
      },
      saveCallback: saveProgressSilently,
      isDataFilled: (item) =>
        item.dimensions.weight.value > 0.1 ||
        item.dimensions.length.value > 0.1 ||
        item.dimensions.breadth.value > 0.1 ||
        item.dimensions.height.value > 0.1,
      onRequireConfirmation: (items, confirmedCallback) => {
        setPendingItemsToRemove(items);
        setShowConfirmation(true);
      },
    });
  }

  const handleConfirmChange = () => {
    if (pendingItemsToRemove.length > 0) {
      const count = parseInt(watch("noOfBlocks")?.toString() || "1", 10);
      const updatedBlocks = blocks.slice(0, count);
      setValue("blocks", updatedBlocks);
      setValue("noOfBlocks", updatedBlocks.length);
      saveProgressSilently(getValues());
      setPendingItemsToRemove([]);
    }
    setShowConfirmation(false);
  };

  const handleDeleteBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
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
      await putData(`/factory-management/inventory/updatelotaddblocks/${lotId}`, submissionData);
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
                  {field.value && (
                    <span className="text-gray-500 text-sm">
                      Total Transport cost: {prevTransportCost} + {field.value} ={" "}
                      {prevTransportCost + field.value}
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
                          handleBlocksInputChange("1");
                          return;
                        }
                        field.onChange(Number(value));
                        handleBlocksInputChange(value);
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
                    if (e.target.checked && globalWeight) {
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
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Weight to all rows
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
                              placeholder="Enter weight"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0.1);
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
                              placeholder="Enter length"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0.1);
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
                              placeholder="Enter breadth"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0.1);
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
                              placeholder="Enter height"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0.1);
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
                    <Input
                      type="text"
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
            {isLoading ? "Submitting..." : "Update Blocks"}
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