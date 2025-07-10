"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import CellAction from "./rawPurchaseCell-actions"
import moment from "moment"
import { RawPurchased } from "../page"

export const rawPurchaseColumns: ColumnDef<RawPurchased>[] = [
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
        accessorKey: "supplierName", // Corrected key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Supplier Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original?.supplierId?.supplierName}
            </div>
        ),
    },
    {
        accessorKey: "ratePerCubicVolume",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Rate per Cubic Meter
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.ratePerCubicVolume}
            </div>
        ),
    },
    {
        accessorKey: "numberofBlocks",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Number of Blocks
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.noOfBlocks}
            </div>
        ),
    },
    {
        accessorKey: "purchaseDate",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Purchase Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                {moment(row.original.purchaseDate).format("DD MMM YYYY")}
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
