"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Blocks } from "../../../../blocks/components/columns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type slabData = {
  dimensions: {
    length: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };
  trim: {
    length: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };
  _id: string;
  BlockId: string;
  slabNumber: number;
  blockNumber: number;
};
function calculateSqft(length?: number, height?: number): string {
  const lengthInFeet = (length || 0) / 12;
  const heightInFeet = (height || 0) / 12;
  const area = lengthInFeet * heightInFeet;
  return area > 0 ? area.toFixed(2) : "0.00";
}

export const columns: ColumnDef<slabData>[] = [
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
    accessorKey: "slabNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slab Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {(row.original.slabNumber)}
      </div>
    ),
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "Lenght",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lenght
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.dimensions?.length?.value}</div>
    ),
  },
  {
    accessorKey: "numberofslabs",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Height
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.dimensions?.height?.value}</div>
    ),
  },
  {
    accessorKey: "squareft",
    header: "Total SQF",
    cell: ({ row }) => {
      const squareFt = (
        (row.original?.dimensions?.length?.value *
          row.original?.dimensions?.height?.value) /
        144
      ).toFixed(2);
      return <div>{squareFt}</div>;
    },
];
