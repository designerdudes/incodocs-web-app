"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export interface Dimension {
  value: number;
  units: "inch";
}

export interface Slab {
  _id: string;
  slabNumber: string;
  blockId: string;
  blockNumber: string;
  factoryId: string;
  status: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;

  dimensions: {
    length: Dimension;
    height: Dimension;
  };

  trim: {
    length: Dimension;
    height: Dimension;
  };

  cuttingPaymentStatus: {
    status: string;
    modeOfPayment?: string;
  };

  polishingPaymentStatus: {
    status: string;
    modeOfPayment?: string;
  };
}

export type Block = {
  _id: string;
  blockId: {
    _id: string;
    blockNumber: string;
    dimensions: {
      weight?: {
        value?: number;
        units: string;
      };
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
    cuttingScheduledAt:{
      date: string;
    };
    SlabsId: Slab[];
  };
  component?: {
    _id: string;
    ID: string;
    Name: string;
  };
};

export const CuttingBlocksColumns: ColumnDef<Block>[] = [
  {
    accessorKey: "blockId.blockNumber",
    header: "Block Number",
    cell: ({ row }) => <div>{row.original.blockId?.blockNumber}</div>,
  },
  {
    accessorKey: "slabId",
    header: "Total Slabs",
    cell: ({ row }) => (
      <div className="capitalize">{row.original?.blockId?.SlabsId?.length}</div>
    ),
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
    header: "Cutting Date",
    cell: ({ row }) =>
      row.original.blockId?.cuttingScheduledAt?.date ? (
        <div>
          {format(new Date(row.original.blockId?.cuttingScheduledAt?.date), "dd MMM yyyy")}
        </div>
      ) : (
        <div className="text-gray-500 italic">N/A</div>
      ),
  },
  {
    header: "Total Slabs SQFT",
    cell: ({ row }) => {
      const slabs: Slab[] = row.original.blockId?.SlabsId ?? [];

      const totalSlabSqft = slabs.reduce((total, slab) => {
        const length = slab.dimensions?.length?.value ?? 0;
        const height = slab.dimensions?.height?.value ?? 0;
        const sqft = (length * height) / 144; // Convert in² to ft²
        return total + sqft;
      }, 0);

      return <div>{totalSlabSqft.toFixed(2)} ft²</div>;
    },
  },
];
