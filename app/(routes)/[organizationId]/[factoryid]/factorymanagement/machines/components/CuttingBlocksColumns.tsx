"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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
  };
  component?: {
    _id: string;
    ID: string;
    Name: string;
  };
  
};

export const CuttingBlocksColumns: ColumnDef<Block>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "blockId.blockNumber",
    header: "Block Number",
    cell: ({ row }) => <div>{row.original.blockId?.blockNumber}</div>,
  },
  {
    header: "Block Dimensions",
    cell: ({ row }) => {
      const dimensions = row.original.blockId?.dimensions;

      const length = dimensions?.length?.value ?? 0;
      const breadth = dimensions?.breadth?.value ?? 0;
      const height = dimensions?.height?.value ?? 0;
      const units = dimensions?.length?.units ?? "cm";

      return (
        <div>
          {length} × {breadth} × {height} {units}
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
    header: "Block SQFT",
    cell: ({ row }) => {
      const dimensions = row.original.blockId?.dimensions;

      const length = dimensions?.length?.value ?? 0;
      const breadth = dimensions?.breadth?.value ?? 0;

      const sqft = length * breadth / 929.0304;

      return <div> {sqft.toFixed(2)} ft²</div>;
    },
  },
];
