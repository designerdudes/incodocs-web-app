"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import InPolishingCellAction from "./inpolishingcell-actions"

export type Slab = {
    _id: string;
    slabNumber: number;
    blockId: {
        lotId: any
        id: string;
        materialType: string;
    }
    blockNumber: number;
    blockLotName?: string;
    factoryId: string;
    productName: string;
    quantity: number;
    dimensions: {
        thickness: {
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
    trim: {
        length: {
            units: string;
        };
        height: {
            units: string;
        };
    };
    isActive?: boolean;
    weight?: string;
    height?: string;
    breadth?: string;
    length?: string;
    volume?: string;
    status: string;
    inStock: boolean;
    createdAt: string;
    updatedAt: string;
};

export const inPolishingolumns: ColumnDef<Slab>[] = [
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
        accessorKey: "slabNumber",
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
                {row.original.slabNumber}
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
    },
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
                {row.original?.blockId?.lotId?.materialType}

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
        cell: ({ row }) => <InPolishingCellAction data={row.original} />
    },
]
