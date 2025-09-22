"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import CellAction from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  productName: number;
  slabId:String;
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
    accessorKey: "slabId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slab Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original?.slabId}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slab Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.productName}</div>,
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
        Block Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const currentStatus = row.original?.status || "N/A";
      return (
        <Badge
          className={cn(
            currentStatus === "readyForPolish" &&
              "bg-blue-100 text-blue-800 hover:bg-blue-200/80",
            currentStatus === "inPolishing" &&
              "bg-orange-100 text-orange-800 hover:bg-orange-200/80",
              currentStatus === "polished" &&
              "bg-purple-100 text-purple-900 hover:bg-purple-200/80",
            currentStatus === "sold" &&
              "bg-green-100 text-green-800 hover:bg-green-200/80",
            currentStatus === "cracked" &&
              "bg-yellow-100 text-yellow-700 hover:bg-gray-200/60"
          )}
        >
          {currentStatus === "readyForPolish"
            ? " Ready For Polish"
            : currentStatus === "inPolishing"
            ? " In Polishing"
            : currentStatus === "polished"
            ? " Polished"
            : currentStatus === "sold"
            ? " Sold"
            : currentStatus === "cracked"
            ? " Cracked"
            : currentStatus}
        </Badge>
      );
    },
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
