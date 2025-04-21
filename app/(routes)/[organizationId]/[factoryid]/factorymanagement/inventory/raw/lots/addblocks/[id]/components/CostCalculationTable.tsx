// components/CostCalculationTable.tsx
"use client";

interface CostProps {
  prevMarkerCost: number;
  prevTransportCost: number;
  prevMaterialCost: number;
  newMarkerCost: number;
  newTransportCost: number;
  newMaterialCost: number;
  totalUpdatedCost: number;
}

export default function CostCalculationTable({
 
  prevMarkerCost,
  prevTransportCost,
  prevMaterialCost,
  newMarkerCost,
  newTransportCost,
  newMaterialCost,
  totalUpdatedCost,
}: CostProps) {
  return (
    <div className="border p-4 rounded-md mt-4 bg-muted">
      <h2 className="text-lg font-semibold mb-2">Cost Calculation</h2>
      <div className="space-y-1 text-sm">
        <p>Previous Material Cost: ₹{prevMaterialCost}</p>
        <p>New Material Cost: ₹{newMaterialCost}</p>
        <p>Previous Marker Cost: ₹{prevMarkerCost}</p>
        <p>New Marker Cost: ₹{newMarkerCost}</p>
        <p>Previous Transport Cost: ₹{prevTransportCost}</p>
        <p>New Transport Cost: ₹{newTransportCost}</p>
        <p className="font-bold">Total Updated Cost: ₹{totalUpdatedCost}</p>
      </div>
    </div>
  );
}

