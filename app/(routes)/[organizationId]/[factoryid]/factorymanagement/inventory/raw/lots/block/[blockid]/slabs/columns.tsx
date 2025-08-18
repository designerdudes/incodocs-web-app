"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import CellAction from "./cell-action";

export interface SlabInterface {
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
      value?: number; // Optional due to potential absence of trim data
      units: string;
    };
    height: {
      value?: number; // Optional due to potential absence of trim data
      units: string;
    };
  };
  _id: string;
  blockId: string;
  factoryId: string;
  slabNumber: number;
  slabphoto: string;
  blockNumber: number;
  status: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export const columns: ColumnDef<SlabInterface>[] = [
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
        Slab Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.slabNumber}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "length",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slab Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.slabNumber}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "length",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Length (inch)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original?.dimensions?.length?.value || ""}
      </div>
    ),
  },
  {
    accessorKey: "height",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Height (inch)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original?.dimensions?.height?.value || ""}
      </div>
    ),
  },
  {
    accessorKey: "slabphoto", // ✅ Correct key
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slab Photo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const photo = row.original.slabphoto;
      return (
        <div className="capitalize flex items-center justify-center gap-2">
          {photo ? (
            <Button
              size="icon"
              variant="outline"
              onClick={() => window.open(photo, "_blank")}
            >
              <Eye className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slab Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.status}
      </div>
    ),
  },
  {
    accessorKey: "squareft",
    header: "Total SQF",
    cell: ({ row }) => {
      const lengthInInches = row.original?.dimensions?.length?.value || 0;
      const heightInInches = row.original?.dimensions?.height?.value || 0;
      // Convert square inches to square feet
      const totalSqFt = (lengthInInches * heightInInches) / 144;
      return <div>{totalSqFt.toFixed(2)}</div>;
    },
  },
     {
    
            header: ({ column }) => (
                <Button
                    variant="ghost"
                >
                    Action
                </Button>
            ),
    
            id: "actions",
            cell: ({ row }) => <CellAction data={row.original} />
        },
];
