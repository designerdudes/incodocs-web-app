"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import InPolishingCellAction from "./inpolishingcell-actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import moment from "moment";

export type Slab = {
  _id: string;
  slabNumber: string;
  blockId: {
    lotId: any;
    id: string;
    materialType: string;
    blockNumber: string;
  };
  blockLotName?: string;
  factoryId: string;
  productName: string;
  quantity: number;
  dimensions: {
    thickness: {
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
  polishedValues: {
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
      units: string;
    };
    height: {
      units: string;
    };
  };
  isActive?: boolean;
  slabId: string;
  weight?: string;
  height?: string;
  breadth?: string;
  length?: string;
  volume?: string;
  status: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
};

export const inPolishingcolumns: ColumnDef<Slab>[] = [
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
    cell: ({ row }) => <div className="capitalize">{row.original.slabId}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "slabNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block-Slab Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.slabNumber}</div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "Length",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Length
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original?.dimensions?.length?.value}{" "}
        {row.original?.dimensions?.length?.units}
      </div>
    ),
  },
  {
    accessorKey: "Height",
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
      <div className="capitalize">
        {row.original?.dimensions?.height?.value}{" "}
        {row.original?.dimensions?.height?.units}
      </div>
    ),
  },
  {
    accessorKey: "materialType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Material Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original?.blockId?.lotId?.materialType}
      </div>
    ),
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
    cell: ({ row }) => {
      const currentStatus = row.original?.status || "N/A";
      return (
        <Badge
          className={cn(
            currentStatus === "inPolishing" &&
              "bg-orange-100 text-orange-800 hover:bg-orange-200/80"
          )}
        >
          {currentStatus === "inPolishing" ? " In Polishing" : currentStatus}
        </Badge>
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.updatedAt).format("DD MMM YYYY")}</div>
    ),
  },

  {
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <InPolishingCellAction data={row.original} />,
  },
];
