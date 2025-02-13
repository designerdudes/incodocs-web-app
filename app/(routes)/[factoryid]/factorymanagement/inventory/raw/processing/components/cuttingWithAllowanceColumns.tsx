"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cuttingWithAllowaneCellAction";
import { FinishedMaterial } from "../page";

export const CuttingInchesWithAllowanceColumns: ColumnDef<FinishedMaterial>[] = [

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
                Slab. No
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize">{row.original?.slabNumber}</div>,
        filterFn: 'includesString',
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
        accessorKey: "length",
        header: "Length (inch)",
        cell: ({ row }) => <div>{row.original?.dimensions?.length?.value}</div>,
    },
    {
        accessorKey: "height",
        header: "Height (inch)",
        cell: ({ row }) => <div>{row.original?.dimensions?.height?.value}</div>,
    },
    {
        accessorKey: "lengthincm",
        header: "Length (cm)",
        cell: ({ row }) => {
            const lengthInCm = (row.original?.dimensions?.length?.value * 2.54).toFixed(2);
            return <div>{lengthInCm}</div>;
        },
    },
    {
        accessorKey: "heightincm",
        header: "Height (cm)",
        cell: ({ row }) => {
            const heightInCm = (row.original?.dimensions?.height?.value * 2.54).toFixed(2);
            return <div>{heightInCm}</div>;
        },
    },
    {
        accessorKey: "squareft",
        header: "Total SQF",
        cell: ({ row }) => {
          const squareFt = ((row.original.dimensions?.length?.value * row.original.dimensions?.height?.value) / 144).toFixed(2);
          return <div>{squareFt}</div>;
        },
        footer: ({ table }) => {
          const totalSQF = table.getRowModel().rows.reduce((sum, row) => {
            const sqf = (row.original.dimensions?.length?.value * row.original.dimensions?.height?.value) / 144;
            return sum + sqf;
          }, 0);
          return <span className="font-medium text-gray-600">Total SQF: {totalSQF.toFixed(2)} </span>;
        },
      },
      
      {
        accessorKey: "amount",
        header: "Total Amount",
        cell: ({ row }) => {
          const amount = (
            (row.original?.dimensions?.length?.value * row.original?.dimensions?.height?.value) / 144 * (3.75)
          ).toFixed(2);
          return <div>{amount}</div>;
        },
        footer: ({ table }) => {
          const totalAmount = table.getRowModel().rows.reduce((sum, row) => {
            const amt = ((row.original?.dimensions?.length?.value * row.original?.dimensions?.height?.value) / 144) * (row.original?.workersCuttingPay);
            return sum + amt;
          }, 0);
          return <span className="font-medium text-gray-600">Total Amount: {totalAmount.toFixed(2)}</span>;
        },
      },
      

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
