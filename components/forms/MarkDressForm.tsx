"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

interface MarkDressFormFormProps {
  parentBlockId: string;
  blockNumber: string;
  originalBlockVolume: number;
  factoryId: string;
  onSubmit: () => void;
}

export default function MarkDressForm({
  parentBlockId,
  blockNumber,
  originalBlockVolume,
  factoryId,
  onSubmit,
}: MarkDressFormFormProps) {
  const [assignedMachine, setAssignedMachine] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [originalBlock, setOriginalBlock] = useState<any>(null);

  const [dressDimensions, setDressDimensions] = useState({
    length: 0,
    breadth: 0,
    height: 0,
    volume: 0,
    weight: 0,
  });

  const [inTime, setInTime] = useState<string>(""); // ⬅️ NEW
  const [outTime, setOutTime] = useState<string>("");

  const density = 3.5;

  // 📌 fetch block + assigned machine
  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const res = await fetchData(
          `/factory-management/inventory/raw/get/${parentBlockId}`
        );

        // original dimensions
        const length = res.dimensions?.length?.value || 0;
        const breadth = res.dimensions?.breadth?.value || 0;
        const height = res.dimensions?.height?.value || 0;

        const volume = (length * breadth * height) / 1_000_000;
        const weight = density * volume;

        setOriginalBlock({ length, breadth, height, volume, weight });

        // assigned machine & in/out time from backend
        if (res?.dressing?.machineId) {
          setAssignedMachine({
            id: res.dressing.machineId._id,
            name: res.dressing.machineId.machineName,
          });
        }

        if (res?.dressing?.in) {
          setInTime(res.dressing.in.substring(0, 16)); // format for datetime-local
        }

        if (res?.dressing?.out) {
          setOutTime(res.dressing.out.substring(0, 16));
        }
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    if (parentBlockId) fetchBlockData();
  }, [parentBlockId]);

  const handleDressedChange = (
    dimension: "length" | "breadth" | "height",
    value: number
  ) => {
    const updated = { ...dressDimensions, [dimension]: value };
    const volume =
      (updated.length * updated.breadth * updated.height) / 1_000_000;
    const weight = density * volume;

    updated.volume = volume;
    updated.weight = weight;

    setDressDimensions(updated);
  };

  const handleSubmit = async () => {
    if (!assignedMachine) return;

    try {
      const body = {
        dressDimensions,
        machineId: assignedMachine.id,
        outTime,
      };

      await putData(
        `/factory-management/inventory/raw/markblockdressed/${parentBlockId}`,
        body
      );
      toast.success("Block  dressed successfully");
      onSubmit();
    } catch (error: any) {
      console.error("Error while marking dressed:", error);
      toast.error(error?.response?.data?.message || "Failed to mark dressed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Original Block (Read Only) */}
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
              <Input
                type="number"
                value={originalBlock.volume.toFixed(2)}
                disabled
              />
            </div>
            <div>
              <Label>Weight (t)</Label>
              <Input
                type="number"
                value={originalBlock.weight.toFixed(2)}
                disabled
              />
            </div>
          </div>
        </div>
      )}

      {/* Dressed Block (Editable) */}
      <div className="border p-3 rounded-lg bg-white">
        <h3 className="font-semibold mb-2">Dressed Block Dimension</h3>
        <div className="grid grid-cols-5 gap-5">
          <div>
            <Label>Length (cm)</Label>
            <Input
              type="number"
              value={dressDimensions.length}
              onChange={(e) =>
                handleDressedChange("length", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Breadth (cm)</Label>
            <Input
              type="number"
              value={dressDimensions.breadth}
              onChange={(e) =>
                handleDressedChange("breadth", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Height (cm)</Label>
            <Input
              type="number"
              value={dressDimensions.height}
              onChange={(e) =>
                handleDressedChange("height", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Volume (m³)</Label>
            <Input
              type="number"
              value={dressDimensions.volume.toFixed(2)}
              disabled
            />
          </div>
          <div>
            <Label>Weight (t)</Label>
            <Input
              type="number"
              value={dressDimensions.weight.toFixed(2)}
              disabled
            />
          </div>
        </div>
      </div>

      {/* Machine & In Time */}
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

      {/* Out Time */}
      <div className="border p-3 rounded-lg bg-white space-y-3">
        <div>
          <Label>Out Time (Date & Time)</Label>
          <Input
            type="datetime-local"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
          />
        </div>
      </div>

      <Button
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={!assignedMachine}
      >
        Mark Dressed
      </Button>
    </div>
  );
}
