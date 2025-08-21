"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchData, postData } from "@/axiosUtility/api";
import EntityCombobox from "../ui/EntityCombobox";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

type SubBlock = {
  dimensions: {
    length: { value: number; units: string };
    breadth: { value: number; units: string };
    height: { value: number; units: string };
  };
  volume: number;
  weight: number;
};

interface SplitBlockFormProps {
  parentBlockId: string;
  blockNumber: string;
  originalBlockVolume: number;
  factoryId: string;
  onSubmit: (subBlocks: SubBlock[]) => void;
}

export default function SplitBlockForm({
  parentBlockId,
  blockNumber,
  originalBlockVolume,
  factoryId,
  onSubmit,
}: SplitBlockFormProps) {
  const [count, setCount] = useState(0);
  const [subBlocks, setSubBlocks] = useState<SubBlock[]>([]);
  const [volumeError, setVolumeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const { organizationId } = useParams();

  const [originalBlock, setOriginalBlock] = useState<{
    length: number;
    breadth: number;
    height: number;
    weight: number;
  } | null>(null);

  const density =
    3.5;

  // 📌 Fetch parent block once
 useEffect(() => {
  const fetchBlockData = async () => {
    try {
      const res = await fetchData(
        `/factory-management/inventory/raw/get/${parentBlockId}`
      );

      const length = res.dimensions?.length?.value || 0;
      const breadth = res.dimensions?.breadth?.value || 0;
      const height = res.dimensions?.height?.value || 0;

      // cm³ → m³
      const volume = (length * breadth * height) / 1_000_000;

      // recalc weight
      const weight = density * volume;

      setOriginalBlock({
        length,
        breadth,
        height,
        weight, // use calculated
      });
    } catch (error) {
      console.error("Error fetching block data:", error);
    }
  };

  if (parentBlockId) fetchBlockData();
}, [parentBlockId]);


  // 📌 Fetch machines
  useEffect(() => {
    const fetchmachine = async () => {
      const res = await fetchData(`/machine/getbyfactory/${factoryId}`);
      const allowedTypes = ["Multi Cutter", "Single Cutter", "Rope Cutter"];

      const response = res
        .filter((e: any) => allowedTypes.includes(e.typeCutting))
        .map((e: any) => ({
          label: `${e.machineName} - ${e.typeCutting}`,
          value: e._id,
          typeCutting: e.typeCutting,
        }));

      setMachines(response);
    };

    fetchmachine();
  }, [factoryId]);

  // 📌 Initialize sub-blocks
  const handleCountChange = (value: number) => {
    setCount(value);
    const newBlocks: SubBlock[] = Array.from({ length: value }, () => ({
      dimensions: {
        length: { value: 0, units: "cm" },
        breadth: { value: 0, units: "cm" },
        height: { value: 0, units: "cm" },
      },
      volume: 0,
      weight: 0,
    }));
    setSubBlocks(newBlocks);
  };

  // 📌 Update one block’s dimension + recalc
  const handleDimensionChange = (
    index: number,
    dimension: "length" | "breadth" | "height",
    value: number
  ) => {
    if (!originalBlock) return;
    const updated = [...subBlocks];

    const maxVal = originalBlock[dimension];
    if (value > maxVal) {
      toast.error(`${dimension} cannot exceed parent block ${maxVal} cm`);
      value = maxVal;
    }

    updated[index].dimensions[dimension].value = value;

    // 👉 recalc volume + weight
    const { length, breadth, height } = updated[index].dimensions;
    const volume = (length.value * breadth.value * height.value) / 1_000_000; // cm³ → m³
    const weight = density * volume;

    updated[index].volume = volume;
    updated[index].weight = weight;

    setSubBlocks(updated);
  };

  // 📌 Recalculate totals & validate
  useEffect(() => {
    const totalVol = subBlocks.reduce((sum, b) => sum + (b.volume || 0), 0);
    const totalWgt = subBlocks.reduce((sum, b) => sum + (b.weight || 0), 0);
    setTotalVolume(totalVol);
    setTotalWeight(totalWgt);

    // volume check
    if (totalVol > originalBlockVolume) {
      setVolumeError(
        `Total volume (${totalVol.toFixed(
          2
        )}) exceeds parent block volume (${originalBlockVolume.toFixed(2)}).`
      );
    } else {
      setVolumeError(null);
    }

    // weight check
    if (originalBlock && totalWgt > originalBlock.weight) {
  setWeightError(
    `Total weight (${totalWgt.toFixed(
      2
    )} kg) exceeds parent block weight (${originalBlock.weight.toFixed(
      2
    )} kg).`
  );
} else {
  setWeightError(null);
}

  }, [subBlocks, originalBlock, originalBlockVolume]);

  // 📌 Submit
  const handleSubmit = async () => {
    if (volumeError || weightError || !selectedMachineId) return;

    try {
      const body = {
        newBlocks: subBlocks,
        cuttingMachineId: selectedMachineId,
      };

      await postData(
        `/factory-management/inventory/raw/splitblock/${parentBlockId}`,
        body
      );
      toast.success("Block split successfully");
      onSubmit(subBlocks);
    } catch (error: any) {
      console.error("Error while splitting block:", error);
      toast.error(error?.response?.data?.message || "Failed to split block");
    }
  };

  return (
    <div className="space-y-4">
      {/* Parent Block Info */}
      {originalBlock && (
        <div className="grid grid-cols-5 gap-4 border p-3 rounded-lg bg-gray-50">
          <div>
            <Label>Length (cm)</Label>
            <Input type="number" value={originalBlock.length} disabled />
          </div>
          <div>
            <Label>Breadth (cm)</Label>
            <Input type="number" value={originalBlock.breadth} disabled />
          </div>
          <div>
            <Label>Height (cm)</Label>
            <Input type="number" value={originalBlock.height} disabled />
          </div>
          <div>
            <Label>Volume (m³)</Label>
            <Input
              value={originalBlockVolume.toFixed(2)}
              type="number"
              disabled
            />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input
              value={originalBlock.weight.toFixed(2)}
              type="number"
              disabled
            />
          </div>
        </div>
      )}

      {/* Count */}
      <div>
        <Label>Number of Sub-Blocks</Label>
        <Input
          min={2}
          value={count}
          onChange={(e) => handleCountChange(Number(e.target.value))}
        />
      </div>

      {/* Machine Selector */}
      <EntityCombobox
        entities={machines}
        multiple={false}
        value={selectedMachineId}
        onChange={(value) => setSelectedMachineId(value as string)}
        displayProperty="label"
        valueProperty="value"
        placeholder="Select Machine"
        onAddNew={() =>
          window.open(
            `/${organizationId}/${factoryId}/factorymanagement/machines/createnew`
          )
        }
        addNewLabel="Add New"
      />

      {/* Sub-block rows */}
      {subBlocks.map((block, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 border p-3 rounded-lg">
          <div>
            <Label>Length (cm)</Label>
            <Input
              type="number"
              value={block.dimensions.length.value}
              onChange={(e) =>
                handleDimensionChange(i, "length", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Breadth (cm)</Label>
            <Input
              type="number"
              value={block.dimensions.breadth.value}
              onChange={(e) =>
                handleDimensionChange(i, "breadth", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Height (cm)</Label>
            <Input
              type="number"
              value={block.dimensions.height.value}
              onChange={(e) =>
                handleDimensionChange(i, "height", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Volume (m³)</Label>
            <Input
              type="number"
              value={block.volume.toFixed(2)}
              disabled
            />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              value={block.weight.toFixed(2)}
              disabled
            />
          </div>
        </div>
      ))}

      {/* Totals */}
      <div className="text-sm mt-2">
        <p>
          Total Volume: <b>{totalVolume.toFixed(2)} m³</b> / Max:{" "}
          {originalBlockVolume.toFixed(2)} m³
        </p>
        <p>
          Total Weight: <b>{totalWeight.toFixed(2)} kg</b> / Max:{" "}
          {originalBlock?.weight.toFixed(2)} kg
        </p>
      </div>

      {(volumeError || weightError) && (
        <Alert variant="destructive">
          <AlertDescription>{volumeError || weightError}</AlertDescription>
        </Alert>
      )}

      <Button
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={!!volumeError || !!weightError || !selectedMachineId}
      >
        Split Block
      </Button>
    </div>
  );
}
