import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SubBlock = {
  length: number;
  width: number;
  height: number;
  suffix: string;
};

interface SplitBlockFormProps {
  parentBlockId: string;
  blockNumber: string;
  originalBlockVolume: number; 
  onSubmit: (subBlocks: SubBlock[]) => void;
}

export default function SplitBlockForm({
  parentBlockId,
  blockNumber,
  originalBlockVolume,
  onSubmit,
}: SplitBlockFormProps) {
  const [count, setCount] = useState(2);
  const [subBlocks, setSubBlocks] = useState<SubBlock[]>([]);
  const [volumeError, setVolumeError] = useState<string | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    const calculatedVolume = subBlocks.reduce(
      (sum, b) => sum + b.length * b.width * b.height,
      0
    );
    setTotalVolume(calculatedVolume);

    if (calculatedVolume > originalBlockVolume) {
      setVolumeError(
        `Total volume (${calculatedVolume}) exceeds original block volume (${originalBlockVolume}).`
      );
    } else {
      setVolumeError(null);
    }
  }, [subBlocks, originalBlockVolume]);

  const handleCountChange = (value: number) => {
    setCount(value);
    const newBlocks: SubBlock[] = Array.from({ length: value }, (_, i) => ({
      length: 0,
      width: 0,
      height: 0,
      suffix: `${blockNumber}-${String.fromCharCode(65 + i)}`,
    }));
    setSubBlocks(newBlocks);
  };

 const handleChange = (i: number, key: keyof SubBlock, value: any) => {
  const updated = [...subBlocks];
  updated[i] = {
    ...updated[i],
    [key]: value,
  };
  setSubBlocks(updated);
};

  const handleSubmit = () => {
    if (volumeError) return;
    onSubmit(subBlocks);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>No. of Sub-Blocks</Label>
        <Input
          type="number"
          min={2}
          value={count}
          onChange={(e) => handleCountChange(Number(e.target.value))}
        />
      </div>

      {subBlocks.map((block, i) => (
        <div key={i} className="grid grid-cols-3 gap-4">
          <div>
            <Label>Length(cm)</Label>
            <Input
              type="number"
              value={block.length}
              onChange={(e) =>
                handleChange(i, "length", Number(e.target.value))
              }
              required
            />
          </div>
          <div>
            <Label>Width(cm)</Label>
            <Input
              type="number"
              value={block.width}
              onChange={(e) =>
                handleChange(i, "width", Number(e.target.value))
              }
              required
            />
          </div>
          <div>
            <Label>Height(cm)</Label>
            <Input
              type="number"
              value={block.height}
              onChange={(e) =>
                handleChange(i, "height", Number(e.target.value))
              }
              required
            />
          </div>
        </div>
      ))}

      <div className="text-sm text-muted-foreground">
  Total Volume (m³): <b>{totalVolume.toFixed(2)}</b> / Max: <b>{originalBlockVolume.toFixed(2)}</b>
</div>


      {volumeError && (
        <Alert variant="destructive">
          <AlertDescription>{volumeError}</AlertDescription>
        </Alert>
      )}

      <Button
        className="mt-4"
        onClick={handleSubmit}
        disabled={!!volumeError}
      >
        Split Block
      </Button>
    </div>
  );
}
