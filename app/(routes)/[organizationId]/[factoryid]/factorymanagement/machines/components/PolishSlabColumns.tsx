"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Slab = {
  _id: string;
  slabId: {
    slabNumber: string;

    dimensions: {
      length: { value: number; units: string };
      height: { value: number; units: string };
    };
    polishingScheduledAt: {
      date: string;
    };
  };
  component: {
    _id: string;
    ID: string;
    Name: string;
  };
};

export const PolishSlabColumns: ColumnDef<Slab>[] = [
  {
    accessorKey: "slabNumber",
    header: "Slab Number",
    cell: ({ row }) => <div>{row.original.slabId?.slabNumber}</div>,
  },
  {
    header: "Slab Dimensions",
    cell: ({ row }) => {
      const dimensions = row.original.slabId?.dimensions;
      const length = dimensions?.length?.value ?? 0;
      const height = dimensions?.height?.value ?? 0;
      const units = dimensions?.length?.units ?? "cm";
      return (
        <div>
          {length} × {height} {units}
        </div>
      );
    },
  },
  {
    header: "Component ID / Name",
    cell: ({ row }) => {
      const component = row.original.component;
      if (!component) return <div className="text-gray-500 italic">N/A</div>;

      return (
        <div className="text-blue-600 underline cursor-pointer">
          {component.ID} / {component.Name}
        </div>
      );
    },
  },
  {
    header: "Polishing Date",
    cell: ({ row }) =>
      row.original.slabId.polishingScheduledAt?.date ? (
        <div>
          {format(
            new Date(row.original.slabId.polishingScheduledAt?.date),
            "dd MMM yyyy"
          )}
        </div>
      ) : (
        <div className="text-gray-500 italic">N/A</div>
      ),
  },
  {
    header: "Slab SQFT",
    cell: ({ row }) => {
      const dimensions = row.original.slabId?.dimensions;
      const length = dimensions?.length?.value ?? 0;
      const height = dimensions?.height?.value ?? 0;
      const sqft = length * height/144;
      return <div> {sqft.toFixed(2)} ft²</div>;
    },
  },
];
