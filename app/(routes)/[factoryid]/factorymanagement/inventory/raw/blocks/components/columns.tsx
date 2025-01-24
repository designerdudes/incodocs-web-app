"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export type Slabs = {    
    dimensions: {
        
        length: {
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
            value: number;
            units: string;
        };
    
        height: {
            value: number;
            units: string;
        };
    };
    _id: string;
    blockNumber: number;
    slabNumber: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export const columns: ColumnDef<Slabs>[] = [
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
    },
    
    {
        accessorKey: "length",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Lenght
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.dimensions?.length?.value}
            </div>
        ),
    },
    {
        accessorKey: "height",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Height
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.dimensions?.height?.value}
            </div>
        ),
    },
    {
        accessorKey: "squareft",
        header: "Total SQF",
        cell: ({ row }) => {
          const squareFt = (
            (row.original?.dimensions?.length?.value * row.original?.dimensions?.height?.value) /
            144
          ).toFixed(2);
          return <div>{squareFt}</div>;
        },
      },
]
