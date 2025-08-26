"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchData, postData } from "@/axiosUtility/api";
import EntityCombobox from "../ui/EntityCombobox";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface dressingBlockFormProps {
  parentBlockId: string;
  blockNumber: string;
  originalBlockVolume: number;
  factoryId: string;
  onSubmit: () => void;
}

export default function DressingBlockForm({
  parentBlockId,
  blockNumber,
  originalBlockVolume,
  factoryId,
  onSubmit,
}: dressingBlockFormProps) {
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const { organizationId } = useParams();

  // original block (readonly)
  const [originalBlock, setOriginalBlock] = useState<{
    length: number;
    breadth: number;
    height: number;
    volume: number;
    weight: number;
  } | null>(null);

  // dressed block (editable)
  const [dressedBlock, setDressedBlock] = useState<{
    length: number;
    breadth: number;
    height: number;
    volume: number;
    weight: number;
  }>({ length: 0, breadth: 0, height: 0, volume: 0, weight: 0 });

  const density = 3.5;

  // 📌 Fetch parent block
  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const res = await fetchData(
          `/factory-management/inventory/raw/get/${parentBlockId}`
        );

        const length = res.dimensions?.length?.value || 0;
        const breadth = res.dimensions?.breadth?.value || 0;
        const height = res.dimensions?.height?.value || 0;

        const volume = (length * breadth * height) / 1_000_000; // cm³ → m³
        const weight = density * volume ; // tons → kg

        setOriginalBlock({ length, breadth, height, volume, weight });
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

  // 📌 Handle dressed block dimension changes
  const handleDressedChange = (
    dimension: "length" | "breadth" | "height",
    value: number
  ) => {
    const updated = { ...dressedBlock, [dimension]: value };

    const volume = (updated.length * updated.breadth * updated.height) / 1_000_000;
    const weight = density * volume ;

    updated.volume = volume;
    updated.weight = weight;

    setDressedBlock(updated);
  };

  // 📌 Submit
  const handleSubmit = async () => {
    if (!dressedBlock || !selectedMachineId) return;

    try {
      const body = {
        dressedBlock,
        cuttingMachineId: selectedMachineId,
      };

      await postData(
        `/factory-management/inventory/raw/splitblock/${parentBlockId}`,
        body
      );
      toast.success("Block dressed successfully");
      onSubmit();
    } catch (error: any) {
      console.error("Error while splitting block:", error);
      toast.error(error?.response?.data?.message || "Failed to dress block");
    }
  };

  return (
    <div className="space-y-6">
      {/* Original Block (Read Only) */}
      {originalBlock && (
        <div className="border p-3 rounded-lg bg-gray-100">
          <h3 className="font-semibold mb-2">Original Block</h3>
          <div className="grid grid-cols-5 gap-4">
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
              <Label>Weight (kg)</Label>
              <Input type="number" value={originalBlock.weight.toFixed(2)} disabled />
            </div>
          </div>
        </div>
      )}

      {/* Dressed Block (Editable) */}
      <div className="border p-3 rounded-lg bg-white">
        <h3 className="font-semibold mb-2">Dressed Block</h3>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <Label>Length (cm)</Label>
            <Input
              type="number"
              value={dressedBlock.length}
              onChange={(e) => handleDressedChange("length", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Breadth (cm)</Label>
            <Input
              type="number"
              value={dressedBlock.breadth}
              onChange={(e) => handleDressedChange("breadth", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Height (cm)</Label>
            <Input
              type="number"
              value={dressedBlock.height}
              onChange={(e) => handleDressedChange("height", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Volume (m³)</Label>
            <Input type="number" value={dressedBlock.volume.toFixed(2)} disabled />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input type="number" value={dressedBlock.weight.toFixed(2)} disabled />
          </div>
        </div>
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

      <Button
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={!selectedMachineId}
      >
        Dress Block
      </Button>
    </div>
  );
}
