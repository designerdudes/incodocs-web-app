"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
<<<<<<< HEAD
import CellAction from "../components/cell-actions"
import moment from "moment"

export type RawMaterial = {
    _id: string
    lotName: string
    materialName: string
    materialType: string
=======
import CellAction from "./cell-actions"
import moment from "moment"

export type Block = {
    _id: string
    blockNumber: string
    blockLotName: string
    materialType: string
    numberofSlabs: string
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
    isActive: boolean
    createdAt: string
    updatedAt: string
    weight: string
    height: string
    breadth: string
    length: string
    volume: string
<<<<<<< HEAD
    quantity: string
}

export type LotManagement = {
    _id: string
    lotname: string
    materialType: string
    numberofBlocks: string
    instock: string
    createdAt: string
    height: string
    breadth: string
    intrimming: string
    incutting: string
    length: string
    completed: string
    isActive: boolean
}


export const columns: ColumnDef<LotManagement>[] = [
=======
    status: string
}

export const columns: ColumnDef<Block>[] = [
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
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
<<<<<<< HEAD
        accessorKey: "lotname",
=======
        accessorKey: "blockLotName",
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
<<<<<<< HEAD
                Lot Name
=======
                Block&apos;s Lot Name
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
<<<<<<< HEAD
                {row.original.lotname}
=======
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
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
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
<<<<<<< HEAD
        accessorKey: "numberofBlocks",
=======
        accessorKey: "numberofSlabs",
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
<<<<<<< HEAD
                Total Blocks
=======
                Total Slabs
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
<<<<<<< HEAD
                {row.original.numberofBlocks}
=======
                {row.original.numberofSlabs}
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
            </div>
        ),
    },
    {
<<<<<<< HEAD
        accessorKey: "instock",
=======
        accessorKey: "status",
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
<<<<<<< HEAD
                Blocks In Stock
=======
                Blocks Status
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
<<<<<<< HEAD
                {row.original.instock}
            </div>
        ),
    },
    {
        accessorKey: "incutting",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Blocks in Cutting Phase
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.incutting}
            </div>
        ),
    },
    {
        accessorKey: "intrimming",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Blocks in Trimming Phase
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.intrimming}
            </div>
        ),
    },


    {
        accessorKey: "completed",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Completed
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.completed}
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
                Lot Created Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                {moment(row.original.createdAt).format("DD MMM YYYY")}
            </div>
        ),
    },
=======
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
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71

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
