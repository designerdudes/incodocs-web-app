"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellActions from "./cell-actions";
import { Product } from "../page";

export const ProductsColumns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: any) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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
        accessorKey: "code",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Product Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.original.code}</div>,
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.original.description}</div>,
    },
    {
        accessorKey: "unit",
        header: () => <div>Unit Of Measurements</div>,
        cell: ({ row }) => <div>{row.original.unitOfMeasurements}</div>,
    },
    {
        accessorKey: "origin",
        header: () => <div>Country of Origin</div>,
        cell: ({ row }) => <div>{row.original.countryOfOrigin}</div>,
    },
    {
        accessorKey: "hsCode",
        header: () => <div>HS Code</div>,
        cell: ({ row }) => <div>{row.original.HScode}</div>,
    },
    {
        accessorKey: "netWeight",
        header: () => <div>Net Weight (Kg)</div>,
        cell: ({ row }) => <div>{row.original.netWeight} Kg</div>,
    },
    {
        accessorKey: "grossWeight",
        header: () => <div>Gross Weight (Kg)</div>,
        cell: ({ row }) => <div>{row.original.grossWeight} Kg</div>,
    },
    {
        accessorKey: "cubicMeasurement",
        header: () => <div>Cubic Measurement (m³)</div>,
        cell: ({ row }) => <div>{row.original.cubicMeasurement} m³</div>,
    },
    {
        header: () => <div>Action</div>,
        id: "actions",
        cell: ({ row }) => <CellActions data={row.original} />,
    },
];
