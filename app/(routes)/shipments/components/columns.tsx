"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { horse } from "../data/schema"
import { ColumnHeader } from "./column-header"
import { DataTableRowActions } from "./row-actions"
import moment from "moment"

export const columns: ColumnDef<horse>[] = [
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
        accessorKey: "id",
        header: ({ column }) => (
            <ColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.original._id} </div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className="max-w-[500px] truncate font-medium">
                        {row.original.name}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "breed",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Breed" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className="max-w-[500px] truncate font-medium">
                        {row.original.breed}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "addedDate",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Added Date" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className="max-w-[200px] truncate font-medium">
                        {moment(row.original.addedDate).format("MMMM Do YYYY")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "amountInvested",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Amount Invested" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex space-x-2">

                    <span className="max-w-[200px] truncate font-medium">
                        ${row.original.amountInvested}
                    </span>
                </div>
            )
        },
    },
    // {
    //     accessorKey: "profitMargin",
    //     header: ({ column }) => (
    //         <ColumnHeader column={column} title="Profit Margin" />
    //     ),
    //     cell: ({ row }) => {


    //         return (
    //             <div className="flex space-x-2">

    //                 <span className="max-w-[200px] truncate font-medium">
    //                     {row.original.profitMargin}%
    //                 </span>
    //             </div>
    //         )
    //     },
    // },

    // {
    //     accessorKey: "rateGrowth",
    //     header: ({ column }) => (
    //         <ColumnHeader column={column} title="Growth Rate" />
    //     ),
    //     cell: ({ row }) => {


    //         return (
    //             <div className="flex items-center">

    //                 <span>{row.original.rateGrowth}%</span>
    //             </div>
    //         )
    //     },
    //     filterFn: (row, id, value) => {
    //         return value.includes(row.getValue(id))
    //     },
    // },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <ColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {


            return (
                <div className="flex w-[100px] items-center">
                    <Badge className={
                        row.original.status === "active"
                            ? "bg-green-500 hover:bg-green-400"
                            : row.original.status === "inactive"
                                ? "bg-blue-500 Avatarhover:bg-blue-200"
                                : row.original.status === "warning"
                                    ? "bg-yellow-500 hover:bg-yellow-400"
                                    : row.original.status === "error" ?
                                        "bg-red-500 hover:bg-red-400" :
                                        "bg-gray-500 hover:bg-gray-400"

                    }  >{row.original.status}</Badge>


                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]