"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Block } from "./columns"
import InPolishingCellAction from "./inpolishingcell-actions"

export const inPolishingolumns: ColumnDef<Block>[] = [
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
        accessorKey: "slabId",
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
            <div className="capitalize">
                {row.original._id}
            </div>
        ),
    },
    {
        accessorKey: "name",
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
    // {
    //     accessorKey: "materialType",
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //         >
    //             Material Type
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => (
    //         <div className="capitalize">
    //             {row.original.materialType}
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
        cell: ({ row }) => <InPolishingCellAction data={row.original} />
    },
]
