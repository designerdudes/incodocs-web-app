"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cell-actions";
import { FinishedMaterial } from "../page";

function calculateAdjustedDimensions(length: number, height: number, trimLength: number, trimHeight: number) {
    const adjustedLengthWithAllowance = length - trimLength + 6; // Length adjustment
    const adjustedHeightWithAllowance = height - trimHeight + 2; // Height adjustment
    const adjustedLength = adjustedLengthWithAllowance - 4
    const adjustedHeight = adjustedHeightWithAllowance - 2
    const lengthInCm = (adjustedLength * 2.54).toFixed(2); // Convert to cm
    const heightInCm = (adjustedHeight * 2.54).toFixed(2); // Convert to cm
    const squareFt = ((adjustedLength * adjustedHeight) / 144).toFixed(2); // Calculate square feet
    const amount = ((adjustedLength * adjustedHeight) / 144 * 11).toFixed(2); // Calculate amount

    return {
        adjustedLength: adjustedLength.toFixed(2),
        adjustedHeight: adjustedHeight.toFixed(2),
        lengthInCm,
        heightInCm,
        squareFt,
        amount,
    };
}


export const polishingInchesWithAllowanceColumns: ColumnDef<FinishedMaterial>[] = [
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
        accessorKey: "trimLength",
        header: "Trim Length (inch)",
        cell: ({ row }) => <div>{row.original?.trim?.length?.value}</div>,
    },
    {
        accessorKey: "trimHeight",
        header: "Trim Height (inch)",
        cell: ({ row }) => <div>{row.original?.trim?.height?.value}</div>,
    },
    {
        accessorKey: "length",
        header: "Length (inch)",
        cell: ({ row }) => {
            const { adjustedLength } = calculateAdjustedDimensions(
                row.original?.dimensions?.length?.value,
                row.original?.dimensions?.height?.value,
                row.original?.trim?.length?.value,
                row.original?.trim?.height?.value
            );
            return <div>{adjustedLength}</div>;
        },
    },
    {
        accessorKey: "height",
        header: "Height (inch)",
        cell: ({ row }) => {
            const { adjustedHeight } = calculateAdjustedDimensions(
                row.original?.dimensions?.length?.value,
                row.original?.dimensions.height?.value,
                row.original?.trim?.length?.value,
                row.original?.trim?.height?.value
            );
            return <div>{adjustedHeight}</div>;
        },
    },
    {
        accessorKey: "lengthCm",
        header: "Length (cm)",
        cell: ({ row }) => {
            const { lengthInCm } = calculateAdjustedDimensions(
                row.original?.dimensions?.length?.value,
                row.original?.dimensions?.height?.value,
                row.original?.trim?.length?.value,
                row.original?.trim?.height?.value
            );
            return <div>{lengthInCm}</div>;
        },
    },
    {
        accessorKey: "heightCm",
        header: "Height (cm)",
        cell: ({ row }) => {
            const { heightInCm } = calculateAdjustedDimensions(
                row.original?.dimensions?.length?.value,
                row.original?.dimensions?.height?.value,
                row.original?.trim?.length?.value,
                row.original?.trim?.height?.value
            );
            return <div>{heightInCm}</div>;
        },
    },
    {
        accessorKey: "squareFt",
        header: "Total SQF",
        cell: ({ row }) => {
            const { squareFt } = calculateAdjustedDimensions(
                row.original?.dimensions?.length?.value,
                row.original?.dimensions?.height?.value,
                row.original?.trim?.length?.value,
                row.original?.trim?.height?.value
            );
            return <div>{squareFt}</div>;
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const { amount } = calculateAdjustedDimensions(
                row.original?.dimensions?.length?.value,
                row.original?.dimensions?.height?.value,
                row.original?.trim?.length?.value,
                row.original?.trim?.height?.value
            );
            return <div>{amount}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
