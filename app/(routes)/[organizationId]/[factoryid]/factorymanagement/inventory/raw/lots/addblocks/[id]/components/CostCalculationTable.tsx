"use client";

import React from "react";

interface CostCalculationTableProps {
  LotData: {
    materialCost: number;
    materialType: string;
    transportCost: number;
    markerCost: number;
    newMaterialCost?: number;
    newTransportCost?: number;
    newMarkerCost?: number;
  };
}

const CostCalculationTable: React.FC<CostCalculationTableProps> = ({ LotData }) => {
  if (!LotData) return null;

  const previousMaterialCost = LotData.materialCost || 0;
  const previousTransportCost = LotData.transportCost || 0;
  const previousMarkerCost = LotData.markerCost || 0;

  const currentMaterialCost = LotData.newMaterialCost || 0;
  const currentTransportCost = LotData.newTransportCost || 0;
  const currentMarkerCost = LotData.newMarkerCost || 0;

  const totalMaterialCost = previousMaterialCost + currentMaterialCost;
  const totalTransportCost = previousTransportCost + currentTransportCost;
  const totalMarkerCost = previousMarkerCost + currentMarkerCost;

  const finalTotalCost =
    totalMaterialCost + totalTransportCost + totalMarkerCost;

  return (
    <div className="mt-4 p-4 border rounded bg-muted/40">
      <h3 className="text-lg font-semibold mb-2">Cost Calculations</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Cost Type</th>
            <th className="p-2">Previous Cost</th>
            <th className="p-2">Current Cost</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Material Cost</td>
            <td className="p-2">{previousMaterialCost}</td>
            <td className="p-2">{currentMaterialCost}</td>
            <td className="p-2">{totalMaterialCost}</td>
          </tr>
          <tr>
            <td className="p-2">Transport Cost</td>
            <td className="p-2">{previousTransportCost}</td>
            <td className="p-2">{currentTransportCost}</td>
            <td className="p-2">{totalTransportCost}</td>
          </tr>
          <tr>
            <td className="p-2">Marker Cost</td>
            <td className="p-2">{previousMarkerCost}</td>
            <td className="p-2">{currentMarkerCost}</td>
            <td className="p-2">{totalMarkerCost}</td>
          </tr>
          <tr className="font-semibold border-t">
            <td className="p-2" colSpan={3}>
              Final Total Cost
            </td>
            <td className="p-2">{finalTotalCost}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CostCalculationTable;
