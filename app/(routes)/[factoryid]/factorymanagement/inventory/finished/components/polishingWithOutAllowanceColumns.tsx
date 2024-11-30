"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cell-actions";
import { FinishedMaterial } from "../page";
import calculateDimensions from "./cuttingWithOutAllowanceColumns";

export const polishingInchesWithOutAllowanceColumns: ColumnDef<FinishedMaterial>[] = [
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
            const { adjustedLength } = calculateDimensions(
                row.original?.dimensions?.length?.value - row.original?.trim?.length?.value,
                row.original?.dimensions?.height?.value - row.original?.trim?.height?.value,
                6,
                2
            );
            return <div>{adjustedLength}</div>;
        },
    },
    {
        accessorKey: "height",
        header: "Height (inch)",
        cell: ({ row }) => {
            const { adjustedHeight } = calculateDimensions(
                row.original?.dimensions?.length?.value - row.original?.trim?.length?.value,
                row.original?.dimensions?.height?.value - row.original?.trim?.height?.value,
                6,
                2
            );
            return <div>{adjustedHeight}</div>;
        },
    },
    {
        accessorKey: "lengthCm",
        header: "Length (cm)",
        cell: ({ row }) => {
            const { lengthInCm } = calculateDimensions(
                row.original?.dimensions?.length?.value - row.original?.trim?.length?.value,
                row.original?.dimensions?.height?.value - row.original?.trim?.height?.value,
                6,
                2
            );
            return <div>{lengthInCm}</div>;
        },
    },
    {
        accessorKey: "heightCm",
        header: "Height (cm)",
        cell: ({ row }) => {
            const { heightInCm } = calculateDimensions(
                row.original?.dimensions?.length?.value - row.original?.trim?.length?.value,
                row.original?.dimensions?.height?.value - row.original?.trim?.height?.value,
                6,
                2
            );
            return <div>{heightInCm}</div>;
        },
    },
    {
        accessorKey: "squareFt",
        header: "Total SQF",
        cell: ({ row }) => {
            const { adjustedLength, adjustedHeight } = calculateDimensions(
                row.original?.dimensions?.length?.value - row.original?.trim?.length?.value,
                row.original?.dimensions?.height?.value - row.original?.trim?.height?.value,
                6,
                2
            );
            const squareFt = ((parseFloat(adjustedLength) * parseFloat(adjustedHeight)) / 144).toFixed(2);
            return <div>{squareFt}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
