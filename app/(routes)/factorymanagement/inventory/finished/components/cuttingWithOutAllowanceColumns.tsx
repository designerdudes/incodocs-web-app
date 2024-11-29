"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cell-actions";
import { FinishedMaterial } from "../page";

export default function calculateDimensions(
    length: number,
    height: number,
    lengthAllowance: number = 6, // Default allowance for length
    heightAllowance: number = 2 // Default allowance for height
) {
    const adjustedLength = length + lengthAllowance;
    const adjustedHeight = height + heightAllowance;
    const lengthInCm = (adjustedLength * 2.54).toFixed(2);
    const heightInCm = (adjustedHeight * 2.54).toFixed(2);

    return {
        adjustedLength: adjustedLength.toFixed(2),
        lengthInCm,
        adjustedHeight: adjustedHeight.toFixed(2),
        heightInCm,
    };
}

export const CuttingInchesWithOutAllowanceColumns: ColumnDef<FinishedMaterial>[] = [

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
                Block. No
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize">{row.original?.blockNumber}</div>,
    },
    {
        accessorKey: "slabNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Slab. No
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize">{row.original?.slabNumber}</div>,
    },
    {
        accessorKey: "length",
        header: "Length (inch)",
        cell: ({ row }) => {
            const { adjustedLength } = calculateDimensions(row.original?.dimensions?.length?.value, row.original?.dimensions?.height?.value);
            return <div>{adjustedLength}</div>;
        },
    },
    {
        accessorKey: "height",
        header: "Height (inch)",
        cell: ({ row }) => {
            const { adjustedHeight } = calculateDimensions(row.original?.dimensions?.length?.value, row.original?.dimensions?.height?.value);
            return <div>{adjustedHeight}</div>;
        },
    },
    {
        accessorKey: "lengthincm",
        header: "Length (cm)",
        cell: ({ row }) => {
            const { lengthInCm } = calculateDimensions(row.original?.dimensions?.length?.value, row.original?.dimensions?.height?.value);
            return <div>{lengthInCm}</div>;
        },
    },
    {
        accessorKey: "heightincm",
        header: "Height (cm)",
        cell: ({ row }) => {
            const { heightInCm } = calculateDimensions(row.original?.dimensions?.length?.value, row.original?.dimensions?.height?.value);
            return <div>{heightInCm}</div>;
        },
    },
    {
        accessorKey: "squareft",
        header: "Total SQF",
        cell: ({ row }) => {
            const { adjustedLength, adjustedHeight } = calculateDimensions(
                row.original?.dimensions?.length?.value,
                row.original?.dimensions?.height?.value
            );
            const squareFt = (
                (parseFloat(adjustedLength) * parseFloat(adjustedHeight)) / 144
            ).toFixed(2);
            return <div>{squareFt}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
