import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchData, postData } from "@/axiosUtility/api";
import EntityCombobox from "../ui/EntityCombobox";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SubBlock = {
  dimensions: {
    length: {
      value: number;
      units: string;
    };
    breadth: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };
  // suffix: string;
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
  const [totalVolume, setTotalVolume] = useState(0);
  const [machines, setMachines] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const calculatedVolume = subBlocks.reduce((sum, b) => {
      const { length, breadth, height } = b.dimensions;
      return sum + (length.value * breadth.value * height.value)/1000000;
    }, 0);
    setTotalVolume(calculatedVolume);

    if (calculatedVolume > originalBlockVolume) {
      setVolumeError(
        `Total volume (${calculatedVolume}) exceeds original block volume (${originalBlockVolume}).`
      );
    } else {
      setVolumeError(null);
    }
  }, [subBlocks, originalBlockVolume]);

  useEffect(() => {
    const fetchmachine = async () => {
      const res = await fetchData(`/machine/getbyfactory/${factoryId}`);
      const response = res
        .filter((e: any) => e.typeCutting === "Rope Cutter")
        .map((e: any) => ({
          label: e.machineName,
          value: e._id,
        }));
      setMachines(response);
    };
    fetchmachine();
  }, []);

  const handleCountChange = (value: number) => {
    setCount(value);
    const newBlocks: SubBlock[] = Array.from({ length: value }, (_, i) => ({
      dimensions: {
        length: {
          value: 0,
          units: "cm",
        },
        breadth: {
          value: 0,
          units: "cm",
        },
        height: {
          value: 0,
          units: "cm",
        },
      },

      // suffix: `${blockNumber}-${String.fromCharCode(65 + i)}`,
    }));
    setSubBlocks(newBlocks);
  };

  const handleDimensionChange = (
    index: number,
    dimension: "length" | "breadth" | "height",
    value: number
  ) => {
    const updated = [...subBlocks];
    updated[index].dimensions[dimension].value = value;
    setSubBlocks(updated);
  };

  const handleSubmit = async () => {
    if (volumeError || !selectedMachineId) return;

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
      // console.log("Split block successful:", response);
      onSubmit(subBlocks);
    } catch (error: any) {
      console.error("Error while splitting block:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>No. of Sub-Blocks</Label>
        <Input
          min={2}
          value={count}
          onChange={(e) => handleCountChange(Number(e.target.value))}
        />
      </div>

      <EntityCombobox
        entities={machines}
        multiple={false}
        value={selectedMachineId}
        onChange={(value) => setSelectedMachineId(value as string)}
        displayProperty="label"
        valueProperty="value"
        placeholder="Select Machine"
        onAddNew={() => router.push("/factorymanagement/machines/createnew")}
        addNewLabel="Add New"
      />

      {subBlocks.map((block, i) => (
        <div key={i} className="grid grid-cols-3 gap-4">
          <div>
            <Label>Length (cm)</Label>
            <Input
              type="number"
              value={block.dimensions.length.value}
              onChange={(e) =>
                handleDimensionChange(i, "length", Number(e.target.value))
              }
              required
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
              required
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
              required
            />
          </div>
        </div>
      ))}

      <div className="text-sm text-muted-foreground">
        Total Volume (m³): <b>{totalVolume.toFixed(2)}</b> / Max:{" "}
        <b>{originalBlockVolume.toFixed(2)}</b>
      </div>

      {volumeError && (
        <Alert variant="destructive">
          <AlertDescription>{volumeError}</AlertDescription>
        </Alert>
      )}

      <Button className="mt-4" onClick={handleSubmit} disabled={!!volumeError}>
        Split Block
      </Button>
    </div>
  );
}
