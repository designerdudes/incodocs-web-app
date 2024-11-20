"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import CellAction from "./cell-actions"
import moment from "moment"

export type Block = {
    _id: string
    blockNumber: string
    blockLotName: string
    materialType: string
    numberofSlabs: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    weight: string
    height: string
    breadth: string
    length: string
    volume: string
    status: string
}

export const columns: ColumnDef<Block>[] = [
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
        accessorKey: "blockLotName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Block&apos;s Lot Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.blockLotName}
            </div>
        ),
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
                {row.original.materialType}
            </div>
        ),
    },
    {
        accessorKey: "numberofSlabs",
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
                {row.original.numberofSlabs}
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
                {row.original.status}
            </div>
        ),
    },
    // {
    //     accessorKey: "createdAt",
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         >
    //             Block Created Date
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => (
    //         <div>
    //             {moment(row.original.createdAt).format("DD MMM YYYY")}
    //         </div>
    //     ),
    // },

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
