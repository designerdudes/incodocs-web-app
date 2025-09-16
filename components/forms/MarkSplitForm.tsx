"use client";
import { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash } from "lucide-react";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

interface MarkSplitFormProps {
  parentBlockId: string;
  blockNumber: string;
  factoryId: string;
  netDimensions: {
    length?: { value: number; units: string };
    breadth?: { value: number; units: string };
    height?: { value: number; units: string };
    weight?: { value?: number; units: string };
  };
  originalBlockVolume: number;
  onSubmit: () => void;
}

export default function MarkSplitForm({
  parentBlockId,
  blockNumber,
  netDimensions,
  factoryId,
  originalBlockVolume,
  onSubmit,
}: MarkSplitFormProps) {
  const form = useForm();

  const [assignedMachine, setAssignedMachine] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [originalBlock, setOriginalBlock] = useState<any>(null);

  const [blocks, setBlocks] = useState<
    {
      length: number;
      breadth: number;
      height: number;
      volume: number;
      weight: number;
      isSplittable: boolean;
      photo?: string;
      splitDirection: "length" | "breadth" | "height" | "";
    }[]
  >([
    {
      length: 0,
      breadth: 0,
      height: 0,
      volume: 0,
      weight: 0,
      isSplittable: false,
      photo: "",
      splitDirection: "",
    },
  ]);

  const [inTime, setInTime] = useState<string>("");
  const [outTime, setOutTime] = useState<string>("");
  const { control } = form;
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [volumeError, setVolumeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);

  const density = 3.5; // tons per m³

  // 📌 Fetch block + machine details
  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const res = await fetchData(
          `/factory-management/inventory/raw/get/${parentBlockId}`
        );

        const length = res.dimensions?.length?.value || 0;
        const breadth = res.dimensions?.breadth?.value || 0;
        const height = res.dimensions?.height?.value || 0;

        const volume = (length * breadth * height) / 1_000_000;
        const weight = density * volume;

        setOriginalBlock({ length, breadth, height, volume, weight });

        if (res?.splitting?.machineId) {
          setAssignedMachine({
            id: res.splitting.machineId._id,
            name: res.splitting.machineId.machineName,
          });
        }

        if (res?.splitting?.in) setInTime(res.splitting.in.substring(0, 16));
        if (res?.splitting?.out) setOutTime(res.splitting.out.substring(0, 16));
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    if (parentBlockId) fetchBlockData();
  }, [parentBlockId]);

  // 📌 Update totals + validation
  useEffect(() => {
    const totalVol = blocks.reduce((sum, b) => sum + (b.volume || 0), 0);
    const totalWgt = blocks.reduce((sum, b) => sum + (b.weight || 0), 0);

    setTotalVolume(totalVol);
    setTotalWeight(totalWgt);

    if (originalBlock && totalVol > originalBlock.volume) {
      setVolumeError(
        `Total volume (${totalVol.toFixed(
          2
        )} m³) exceeds parent block volume (${originalBlock.volume.toFixed(
          2
        )} m³).`
      );
    } else {
      setVolumeError(null);
    }

    if (originalBlock && totalWgt > originalBlock.weight) {
      setWeightError(
        `Total weight (${totalWgt.toFixed(
          2
        )} tons) exceeds parent block weight (${originalBlock.weight.toFixed(
          2
        )} tons).`
      );
    } else {
      setWeightError(null);
    }
  }, [blocks, originalBlock]);

  // 📌 Update sub-block dimensions
  const handleBlockChange = (
    index: number,
    field: string,
    value: number | boolean | string
  ) => {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== index) return block;

        if (field === "isSplittable") {
          return { ...block, isSplittable: value as boolean };
        }
        if (field === "photo") {
          return { ...block, photo: value as string };
        }
        if (field === "splitDirection") {
          return { ...block, splitDirection: value as "length" | "breadth" | "height" | "" };
        }

        // Clamp values to not exceed parent net dimensions
        let newValue = value as number;
        if (field === "length" && newValue > (netDimensions.length?.value ?? Infinity)) {
          newValue = netDimensions.length?.value ?? newValue;
          toast.error("Length cannot exceed parent block length");
        }
        if (field === "breadth" && newValue > (netDimensions.breadth?.value ?? Infinity)) {
          newValue = netDimensions.breadth?.value ?? newValue;
          toast.error("Breadth cannot exceed parent block breadth");
        }
        if (field === "height" && newValue > (netDimensions.height?.value ?? Infinity)) {
          newValue = netDimensions.height?.value ?? newValue;
          toast.error("Height cannot exceed parent block height");
        }

        const updated = { ...block, [field]: newValue as number };
        const volume =
          (updated.length * updated.breadth * updated.height) / 1_000_000;
        const weight = density * volume;
        return { ...updated, volume, weight };
      })
    );
  };

  // 📌 Add/Remove sub-blocks
  const addSubBlock = () =>
    setBlocks((prev) => [
      ...prev,
      {
        length: 0,
        breadth: 0,
        height: 0,
        volume: 0,
        weight: 0,
        isSplittable: false,
        photo: "",
        splitDirection: "",
      },
    ]);

  const removeSubBlock = (index: number) =>
    setBlocks((prev) => prev.filter((_, i) => i !== index));

  // 📌 Submit
  const handleSubmit = async () => {
    if (!assignedMachine) return;

    try {
      const body = {
        blocks: blocks.map((b) => ({
          dimensions: {
            length: { value: b.length, units: "cm" },
            breadth: { value: b.breadth, units: "cm" },
            height: { value: b.height, units: "cm" },
            weight: { value: b.weight, units: "tons" },
          },
          isSplittable: b.isSplittable,
          photo: b.photo,
          splitDirection: b.splitDirection, // ✅ send to backend
        })),
        machineId: assignedMachine.id,
        outTime,
      };

      await putData(
        `/factory-management/inventory/raw/marksplit/${parentBlockId}`,
        body
      );

      toast.success("Block split successfully");
      onSubmit();
    } catch (error: any) {
      console.error("Error while splitting:", error);
      toast.error(error?.response?.data?.message || "Failed to split block");
    }
  };

  const netLength = netDimensions?.length?.value ?? 0;
  const netBreadth = netDimensions?.breadth?.value ?? 0;
  const netHeight = netDimensions?.height?.value ?? 0;
  const netVolume = (netLength * netBreadth * netHeight) / 1_000_000;
  const netWeight = netVolume * density;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Accordions for Original/Net/Machine */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>End to End Measurement</AccordionTrigger>
            <AccordionContent>
              {originalBlock && (
                <div className="border p-3 rounded-lg bg-gray-100">
                  <h3 className="font-semibold mb-2">Original Block</h3>
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <Label>Length (cm)</Label>
                      <Input
                        type="number"
                        value={originalBlock.length}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Breadth (cm)</Label>
                      <Input
                        type="number"
                        value={originalBlock.breadth}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Height (cm)</Label>
                      <Input
                        type="number"
                        value={originalBlock.height}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Volume (m³)</Label>
                      <Input
                        type="number"
                        value={originalBlock.volume.toFixed(2)}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Weight (tons)</Label>
                      <Input
                        type="number"
                        value={originalBlock.weight.toFixed(2)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Net Measurement</AccordionTrigger>
            <AccordionContent>
              <div className="border p-3 rounded-lg bg-gray-100">
                <h3 className="font-semibold mb-2">Net Dimensions Block</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label>Length (cm)</Label>
                    <Input type="number" value={netLength} disabled />
                  </div>
                  <div>
                    <Label>Breadth (cm)</Label>
                    <Input type="number" value={netBreadth} disabled />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input type="number" value={netHeight} disabled />
                  </div>
                  <div>
                    <Label>Volume (m³)</Label>
                    <Input
                      type="number"
                      value={netVolume.toFixed(2)}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Weight (tons)</Label>
                    <Input
                      type="number"
                      value={netWeight.toFixed(2)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
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

        {/* Split blocks */}
        <div className="space-y-4">
          <h3 className="font-semibold">Split blocks</h3>
          {blocks.map((block, index) => (
            <div key={index} className="border p-3 rounded-lg space-y-3 relative">
              {/* Splitting Direction */}
              <div>
                <Label>Split From</Label>
                <div className="flex gap-4 mt-1">
                  {["length", "breadth", "height"].map((dir) => (
                    <label key={dir} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`splitDirection-${index}`}
                        checked={block.splitDirection === dir}
                        onChange={() => {
                          handleBlockChange(index, "splitDirection", dir);

                          // Auto-fill logic
                          if (dir === "length") {
                            handleBlockChange(index, "breadth", netBreadth);
                            handleBlockChange(index, "height", netHeight);
                          }
                          if (dir === "breadth") {
                            handleBlockChange(index, "length", netLength);
                            handleBlockChange(index, "height", netHeight);
                          }
                          if (dir === "height") {
                            handleBlockChange(index, "length", netLength);
                            handleBlockChange(index, "breadth", netBreadth);
                          }
                        }}
                      />
                      {dir.charAt(0).toUpperCase() + dir.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Length (cm)</Label>
                  <Input
                    type="number"
                    value={block.length}
                    disabled={block.splitDirection !== "length"}
                    onChange={(e) =>
                      handleBlockChange(index, "length", +e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Breadth (cm)</Label>
                  <Input
                    type="number"
                    value={block.breadth}
                    disabled={block.splitDirection !== "breadth"}
                    onChange={(e) =>
                      handleBlockChange(index, "breadth", +e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={block.height}
                    disabled={block.splitDirection !== "height"}
                    onChange={(e) =>
                      handleBlockChange(index, "height", +e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <p>Volume: {block.volume.toFixed(2)} m³</p>
                <p>Weight: {block.weight.toFixed(2)} tons</p>
              </div>

              {/* ✅ Block Photo Upload */}
              <div>
                <Label>Block Photo</Label>
                <Controller
                  name="blockPhoto"
                  control={control}
                  render={({ field }) => (
                    <FileUploadField
                      storageKey="blockPhoto"
                      value={block.photo}
                      onChange={field.onChange}
                      name="blockPhoto"
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`splittable-${index}`}
                    checked={block.isSplittable}
                    onCheckedChange={(val) =>
                      handleBlockChange(index, "isSplittable", !!val)
                    }
                  />
                  <Label htmlFor={`splittable-${index}`}>Is Splittable?</Label>
                </div>

                {blocks.length > 1 && (
                  <Trash
                    type="button"
                    className="mr-2 h-4 w-4 cursor-pointer hover:fill-red-500 transition-colors duration-200"
                    onClick={() => removeSubBlock(index)}
                  />
                )}
              </div>
            </div>
          ))}

          <Button type="button" onClick={addSubBlock} className="w-full">
            + Add Another Sub Block
          </Button>
        </div>

        {/* Totals + Error Messages */}
        <div className="text-sm mt-2">
          <p>
            Total Volume: <b>{totalVolume.toFixed(2)} m³</b> / Max:{" "}
            {originalBlock?.volume?.toFixed(2)} m³
          </p>
          <p>
            Total Weight: <b>{totalWeight.toFixed(2)} tons</b> / Max:{" "}
            {originalBlock?.weight.toFixed(2)} tons
          </p>
        </div>
        {(volumeError || weightError) && (
          <Alert variant="destructive">
            <AlertDescription>{volumeError || weightError}</AlertDescription>
          </Alert>
        )}

        {/* Out Time */}
        <div className="border p-3 rounded-lg bg-white space-y-3">
          <Controller
            name="outTime"
            control={control}
            render={({ field }) => (
              <>
                <Label>Out Time (Date & Time)</Label>
                <Input type="datetime-local" {...field} />
              </>
            )}
          />
        </div>
        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={!!volumeError || !!weightError || !assignedMachine}
        >
          Mark Split
        </Button>
      </form>
    </FormProvider>
  );
}
