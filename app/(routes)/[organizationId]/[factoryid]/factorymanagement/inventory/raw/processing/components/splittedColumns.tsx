"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import SplittedCellAction from "./splittedCellActions"
import moment from "moment"
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
  lotId: {
       lotName:string;
   };
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
export const splittedcolumns: ColumnDef<Blocks>[] = [
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
        Block Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.blockNumber || "N/A"}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "lotName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lot Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.lotId?.lotName || "N/A"}</div>,
    filterFn: "includesString",
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
                {row.original?.materialType|| "N/A"}
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
       cell: ({ row }) => {
const currentStatus = row.original?.status || "N/A";
return(
    <Badge
        className={cn(
              currentStatus === "split" &&
              "bg-pink-100 text-pink-800 hover:bg-pink-200/80",
              )}
        >
            {
              currentStatus === "split"? " Split":  currentStatus  
            }
    </Badge>
)}
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

        header: ({ column }) => (
            <Button
                variant="ghost"
            >
                Action
            </Button>
        ),

        id: "actions",
        cell: ({ row }) => <SplittedCellAction data={row.original} />

    },
]
