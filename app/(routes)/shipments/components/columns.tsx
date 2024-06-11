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

                    <span className="truncate font-medium">
                        {row.original.bookingDetails?.containerNumber}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "Truck Number",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Truck Number" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className="truncate font-medium">
                        {row.original.bookingDetails?.truckNumber}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "Truck Driver Number",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Truck Driver Number" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className="truncate font-medium">
                        {row.original.bookingDetails?.truckDriverNumber}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "bookingDetailsSchema.destinationPort",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Port Of Loading" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className=" truncate font-medium">
                        {row.original.bookingDetails?.destinationPort}
                    </span>
                </div>
            )
        },
    },

    {
        accessorKey: "bookingDetailsSchema.portOfLoading",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Port Of Loading" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className=" truncate font-medium">
                        {row.original.bookingDetails?.portOfLoading}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "Vessel Sailing Date",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Vessel Sailing Date" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className=" truncate font-medium">
                        {/* {new Date(row.original?.bookingDetails?.vesselSailingDate).toDateString()} */}
                        {moment(row.original?.bookingDetails?.vesselSailingDate).format('ll')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "vessel Arriving Date",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Vessel Arriving Date" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className=" truncate font-medium">
                        {/* {new Date(row.original?.bookingDetails?.vesselSailingDate).toDateString()} */}
                        {moment(row.original?.bookingDetails?.vesselArrivingDate).format('ll')}
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