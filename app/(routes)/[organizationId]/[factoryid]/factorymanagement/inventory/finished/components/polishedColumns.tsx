"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PolishedCellAction } from "./polishedCellAction";

export type Slab = {
  _id: string;
  slabNumber: string;   // <- string, not number
  blockNumber?: string; // <- optional since not always there
  factoryId: string;
  productName: string;
  status: string;
  inStock: boolean;
  dimensions: {
    length: { value: number; units: string };
    height: { value: number; units: string };
  };
  trim: {
    length: { value: number; units: string };
    height: { value: number; units: string };
  };
  polishedValues?: {
    length: { value: number; units: string };
    height: { value: number; units: string };
  };
  saleMarketMeasurements?: {
    length: { value: number; units: string };
    height: { value: number; units: string };
  };
  workersCuttingPay: number;
  workersPolishingPay: number;
  cuttingPaymentStatus: { status: string };
  polishingPaymentStatus: { status: string };
  createdAt: string;
  updatedAt: string;
};


export const Polishedcolumns: ColumnDef<Slab>[] = [
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
      <div className="capitalize">{row.original.slabNumber}</div>
    ),
    filterFn: "includesString",
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
      <div className="capitalize">{row.original.blockNumber}</div>
    ),
  },

  // {
  //     accessorKey: "status",
  //     header: ({ column }) => (
  //         <Button
  //             variant="ghost"
  //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //             Slab Status
  //             <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //     ),
  //     cell: ({ row }) => (
  //         <div className="capitalize">
  //             {row.original.status}
  //         </div>
  //     ),
  // },
 
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
    accessorKey: "squareft",
    header: "Total SQF",
    cell: ({ row }) => {
      const squareFt = (
        (row.original.dimensions?.length?.value *
          row.original.dimensions?.height?.value) /
        144
      ).toFixed(2);
      return <div>{squareFt}</div>;
    },
    footer: ({ table }) => {
      const totalSQF = table.getRowModel().rows.reduce((sum, row) => {
        const sqf =
          (row.original.dimensions?.length?.value *
            row.original.dimensions?.height?.value) /
          144;
        return sum + sqf;
      }, 0);
      return (
        <span className="font-medium text-gray-600">
          Total SQF: {totalSQF.toFixed(2)}{" "}
        </span>
      );
    },
  },
  {
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <PolishedCellAction data={row.original} />,
  },
];
