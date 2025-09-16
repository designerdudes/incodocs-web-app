"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ReadyforpolishCellAction } from "./readyforpolishcell-actions"

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
  blockId: string;
  blockNumber: number;
   lotId: {
       lotName:string;
   };
  blockphoto: string;
  materialType: string;
  SlabsId: { _id: string; slabNumber: number }[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const Readyforpolishcolumns: ColumnDef<Blocks>[] = [
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
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.blockNumber}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "lotName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Block Number
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original. lotId?.lotName}
            </div>
        ),
        filterFn: 'includesString', // ensures it filters by includes method (you can define custom filter functions)
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
  accessorKey: "SlabsId",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
       Number Of Slabs
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => (
    <div className="capitalize">
      {row.original.SlabsId?.length ?? 0}
    </div>
  ),
},

    // {
    //     accessorKey: "readyForPolishCount",
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         >
    //             Ready for Polish Slabs
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => (
    //         <div className="capitalize">
    //             {row.original.readyForPolishCount}
    //         </div>
    //     ),
    // },
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
                {row.original?.status === "cut" ? "Ready for Polish" : row.original?.status || "N/A"}
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
        cell: ({ row }) => <ReadyforpolishCellAction data={row.original} />
    },
]

