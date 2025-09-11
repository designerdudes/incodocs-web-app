"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import IncuttingCellAction from "./incuttingcell-actions"

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
  lotName:string;
  blockphoto: string;
  materialType: string;
  SlabsId: { _id: string; slabNumber: number }[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export const incuttingcolumns: ColumnDef<Blocks>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
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
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original?.blockId}
            </div>
        ),
        filterFn: 'includesString',

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
                {row.original?.materialType}
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
                Blocks Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original?.status}
            </div>
        ),
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
        cell: ({ row }) => <IncuttingCellAction data={row.original} />
    },
]

