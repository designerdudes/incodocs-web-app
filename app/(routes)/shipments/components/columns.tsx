"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { shipment } from "../data/schema"
import { ColumnHeader } from "./column-header"
import { DataTableRowActions } from "./row-actions"
import moment from "moment"

export const columns: ColumnDef<shipment>[] = [
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
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "bookingDetailsSchema.containerNumber",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Container Number" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className="max-w-[500px] truncate font-medium">
                        {row.original.bookingDetails?.containerNumber}
                    </span>
                </div>
            )
        },
    },


    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]