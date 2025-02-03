"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import CellAction from "./cell-actions"
import moment from "moment"


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
    blockNumber: number;
    materialType: string;
    SlabsId:  { _id: string; slabNumber: number }[]
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export const columns: ColumnDef<Blocks>[] = [
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
            <div className="capitalize">
                {row.original.SlabsId.length}
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
                Block Status
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
            <div>
                {moment(row.original.createdAt).format("DD MMM YYYY")}
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
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
