"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchData, putData } from "@/axiosUtility/api";
import EntityCombobox from "../ui/EntityCombobox";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CuttingBlockFormProps {
  parentBlockId: string;
  blockNumber: string;
  originalBlockVolume: number;
  netDimensions: {
    length?: { value: number; units: string };
    breadth?: { value: number; units: string };
    height?: { value: number; units: string };
    weight?: { value?: number; units: string };
  };
  factoryId: string;
  onSubmit: () => void;
}

export default function CuttingBlockForm({
  parentBlockId,
  blockNumber,
  originalBlockVolume,
  factoryId,
  netDimensions,
  onSubmit,
}: CuttingBlockFormProps) {
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

  const [inTime, setInTime] = useState<string>("");
  const [sendForCutting, setSendForCutting] = useState<boolean>(false);

  const density = 3.5; // tons/m³

  // 📌 Fetch parent block details
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
        const weight = density * volume; // tons

        setOriginalBlock({ length, breadth, height, volume, weight });
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    if (parentBlockId) fetchBlockData();
  }, [parentBlockId]);

  // 📌 Fetch machines
  useEffect(() => {
    const fetchMachine = async () => {
      const res = await fetchData(`/machine/getbyfactory/${factoryId}`, {
        data: {
          status: "idle",
        },
      });
      const allowedTypes = ["Multi Cutter", "Single Cutter", "Rope Cutter"];
      const response = res
        .filter((e: any) => allowedTypes.includes(e.typeCutting))
        .map((e: any) => ({
          label: `${e.machineName} - ${e.typeCutting} - ${e.status}`,
          value: e._id,
          typeCutting: e.typeCutting,
        }));

      setMachines(response);
    };
    fetchMachine();
  }, [factoryId]);

  // 📌 Submit handler
  const handleSubmit = async () => {
    try {
      const body = {
        machineId: selectedMachineId,
        sendForCutting,
        inTime,
      };

      await putData(
        `/factory-management/inventory/raw/sendblockforcutting/${parentBlockId}`,
        body
      );
      toast.success("Block cutting successfully");
      onSubmit();
    } catch (error: any) {
      console.error("Error while cutting block:", error);
      toast.error(error?.response?.data?.msg || "Failed to cutting");
    }
  };

  // 📌 Derived values for Net Dimensions
  const netLength = netDimensions?.length?.value ?? 0;
  const netBreadth = netDimensions?.breadth?.value ?? 0;
  const netHeight = netDimensions?.height?.value ?? 0;
  const netVolume = (netLength * netBreadth * netHeight) / 1_000_000; // m³
  const netWeight = netVolume * density; // tons

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible>
        {/* Original Block */}
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
                  <Input type="number" value={netVolume.toFixed(2)} disabled />
                </div>
                <div>
                  <Label>Weight (tons)</Label>
                  <Input type="number" value={netWeight.toFixed(2)} disabled />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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

      {/* Extra Fields */}
      <div className="border p-3 rounded-lg bg-white space-y-3">
        <div>
          <Label>In Time (Date & Time)</Label>
          <Input
            type="datetime-local"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="sendForCutting"
            type="checkbox"
            checked={sendForCutting}
            onChange={(e) => setSendForCutting(e.target.checked)}
          />
          <Label htmlFor="sendForCutting">Send this block for Cutting</Label>
        </div>
      </div>

      <Button
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={!selectedMachineId || !sendForCutting}
      >
        Cut Block
      </Button>
    </div>
  );
}
