"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cell-actions";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Blocks = {
  dimensions: {
    weight: {
      value: number;
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

  _id: string;
  lotId: string;
  blockId: string;
  blockNumber: number;
  blockphoto: string;
  materialType: string;
  SlabsId: { _id: string; slabNumber: number }[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const columns: ColumnDef<Blocks>[] = [
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
    accessorKey: "blockId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.blockId}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "blockNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.blockNumber}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },

  {
    accessorKey: "SlabsId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Slabs
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original?.SlabsId?.length}</div>
    ),
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
            currentStatus === "inStock" &&
              "bg-blue-100 text-blue-800 hover:bg-blue-200/80",
            currentStatus === "inDressing" &&
              "bg-purple-100 text-purple-900 hover:bg-purple-200/80",
            currentStatus === "dressed" &&
              "bg-indigo-100 text-indigo-800 hover:bg-indigo-200/80",
            currentStatus === "inSplitting" &&
              "bg-red-100 text-red-800 hover:bg-red-200/80",
            currentStatus === "split" &&
              "bg-pink-100 text-pink-800 hover:bg-pink-200/80",
            currentStatus === "inCutting" &&
              "bg-orange-100 text-orange-800 hover:bg-orange-200/80",
            currentStatus === "cut" &&
              "bg-green-100 text-green-800 hover:bg-green-200/80",
            currentStatus === "N/A" &&
              "bg-gray-100 text-gray-600 hover:bg-gray-200/60"
          )}
        >
          {currentStatus === "cut"
            ? "Block Cut"
            : currentStatus === "split"
            ? "Block Split"
            : currentStatus === "dressed"
            ? "Block Dressed"
            : currentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "blockphoto", // ✅ Correct key
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block Photo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const photo = row.original.blockphoto;
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.createdAt).format("DD MMM YYYY")}</div>
    ),
  },

  {
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
