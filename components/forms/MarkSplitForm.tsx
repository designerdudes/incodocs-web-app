"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MarkSplitFormProps {
  parentBlockId: string;
  blockNumber: string;
  factoryId: string;
  originalBlockVolume: number;
  onSubmit: () => void;
}

export default function MarkSplitForm({
  parentBlockId,
  blockNumber,
  factoryId,
  originalBlockVolume,
  onSubmit,
}: MarkSplitFormProps) {
  const [assignedMachine, setAssignedMachine] = useState<{ id: string; name: string } | null>(null);
  const [originalBlock, setOriginalBlock] = useState<any>(null);

  const [blocks, setBlocks] = useState<
    { length: number; breadth: number; height: number; volume: number; weight: number; isSplittable: boolean }[]
  >([{ length: 0, breadth: 0, height: 0, volume: 0, weight: 0, isSplittable: false }]);

  const [inTime, setInTime] = useState<string>("");
  const [outTime, setOutTime] = useState<string>("");

  const [totalVolume, setTotalVolume] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [volumeError, setVolumeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);

  const density = 3.5; // tons per m³

  // 📌 Fetch block + machine details
  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const res = await fetchData(`/factory-management/inventory/raw/get/${parentBlockId}`);

        const length = res.dimensions?.length?.value || 0;
        const breadth = res.dimensions?.breadth?.value || 0;
        const height = res.dimensions?.height?.value || 0;

        // Convert cm³ to m³
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
        `Total volume (${totalVol.toFixed(2)} m³) exceeds parent block volume (${originalBlock.volume.toFixed(2)} m³).`
      );
    } else {
      setVolumeError(null);
    }

    if (originalBlock && totalWgt > originalBlock.weight) {
      setWeightError(
        `Total weight (${totalWgt.toFixed(2)} tons) exceeds parent block weight (${originalBlock.weight.toFixed(2)} tons).`
      );
    } else {
      setWeightError(null);
    }
  }, [blocks, originalBlock]);

  // 📌 Update sub-block dimensions
  const handleBlockChange = (index: number, field: string, value: number | boolean) => {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== index) return block;

        if (field === "isSplittable") return { ...block, isSplittable: value as boolean };

        const updated = { ...block, [field]: value as number };
        const volume = (updated.length * updated.breadth * updated.height) / 1_000_000;
        const weight = density * volume;
        return { ...updated, volume, weight };
      })
    );
  };

  // 📌 Add/Remove sub-blocks
  const addSubBlock = () =>
    setBlocks((prev) => [...prev, { length: 0, breadth: 0, height: 0, volume: 0, weight: 0, isSplittable: false }]);

  const removeSubBlock = (index: number) => setBlocks((prev) => prev.filter((_, i) => i !== index));

  // 📌 Submit
  const handleSubmit = async () => {
    if (!assignedMachine) return;

    try {
      // ✅ Transform payload to match backend schema
      const body = {
        blocks: blocks.map((b) => ({
          dimensions: {
            length: { value: b.length, units: "cm" },
            breadth: { value: b.breadth, units: "cm" },
            height: { value: b.height, units: "cm" },
            weight: { value: b.weight, units: "tons" },
          },
          isSplittable: b.isSplittable,
        })),
        machineId: assignedMachine.id,
        outTime,
      };

      await putData(`/factory-management/inventory/raw/marksplit/${parentBlockId}`, body);

      toast.success("Block split successfully");
      onSubmit();
    } catch (error: any) {
      console.error("Error while splitting:", error);
      toast.error(error?.response?.data?.message || "Failed to split block");
    }
  };

  return (
    <div className="space-y-6">
      {/* Original Block */}
      {originalBlock && (
        <div className="border p-3 rounded-lg bg-gray-100">
          <h3 className="font-semibold mb-2">Original Block</h3>
          <div className="grid grid-cols-5 gap-5">
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
              <Input type="number" value={originalBlock.volume.toFixed(2)} disabled />
            </div>
            <div>
              <Label>Weight (tons)</Label>
              <Input type="number" value={originalBlock.weight.toFixed(2)} disabled />
            </div>
          </div>
        </div>
      )}

      {/* Machine Info */}
      {assignedMachine && (
        <div className="border p-3 rounded-lg bg-gray-100 space-y-3">
          <div>
            <Label>Machine Used</Label>
            <Input type="text" value={assignedMachine.name} disabled />
          </div>
          <div>
            <Label>In Time (Date & Time)</Label>
            <Input type="datetime-local" value={inTime} disabled />
          </div>
        </div>
      )}

      {/* Split blocks */}
      <div className="space-y-4">
        <h3 className="font-semibold">Split blocks</h3>
        {blocks.map((block, index) => (
          <div key={index} className="border p-3 rounded-lg space-y-3 relative">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Length (cm)</Label>
                <Input
                  type="number"
                  value={block.length}
                  onChange={(e) => handleBlockChange(index, "length", +e.target.value)}
                />
              </div>
              <div>
                <Label>Breadth (cm)</Label>
                <Input
                  type="number"
                  value={block.breadth}
                  onChange={(e) => handleBlockChange(index, "breadth", +e.target.value)}
                />
              </div>
              <div>
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  value={block.height}
                  onChange={(e) => handleBlockChange(index, "height", +e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <p>Volume: {block.volume.toFixed(2)} m³</p>
              <p>Weight: {block.weight.toFixed(2)} tons</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`splittable-${index}`}
                checked={block.isSplittable}
                onCheckedChange={(val) => handleBlockChange(index, "isSplittable", !!val)}
              />
              <Label htmlFor={`splittable-${index}`}>Is Splittable?</Label>
            </div>

            {blocks.length > 1 && (
              <Button type="button" variant="destructive" className="mt-2" onClick={() => removeSubBlock(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}

        <Button type="button" onClick={addSubBlock} className="w-full">
          + Add Another Sub Block
        </Button>
      </div>

      {/* Totals + Error Messages */}
      <div className="text-sm mt-2">
        <p>
          Total Volume: <b>{totalVolume.toFixed(2)} m³</b> / Max: {originalBlock?.volume?.toFixed(2)} m³
        </p>
        <p>
          Total Weight: <b>{totalWeight.toFixed(2)} tons</b> / Max: {originalBlock?.weight.toFixed(2)} tons
        </p>
      </div>
      {(volumeError || weightError) && (
        <Alert variant="destructive">
          <AlertDescription>{volumeError || weightError}</AlertDescription>
        </Alert>
      )}

      {/* Out Time */}
      <div>
        <Label>Out Time (Date & Time)</Label>
        <Input type="datetime-local" value={outTime} onChange={(e) => setOutTime(e.target.value)} />
      </div>

      <Button
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={!!volumeError || !!weightError || !assignedMachine}
      >
        Mark Split
      </Button>
    </div>
  );
}
