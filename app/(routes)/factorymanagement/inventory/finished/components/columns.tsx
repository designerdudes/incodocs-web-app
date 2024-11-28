
"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cell-actions";
import moment from "moment";

// Define the FinishedMaterial type
export type FinishedMaterial = {
  _id: string;
  slabnumber: string;
  blockNumber: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  height: string;
  length: string;
  lengthincm: string;
  heightincm: string;
  squareft: string;
};

// Utility function for calculating dimensions
export const calculateDimensions = (lengthInInches: string, heightInInches: string) => {
  const lengthInCm = (parseFloat(lengthInInches) * 2.54).toFixed(2);
  const heightInCm = (parseFloat(heightInInches) * 2.54).toFixed(2);
  const squareFt = (
    (parseFloat(lengthInInches) * parseFloat(heightInInches)) /
    144
  ).toFixed(2);

  return {
    lengthInCm,
    heightInCm,
    squareFt,
  };
};



// Define the columns for the data table
export const columns: ColumnDef<FinishedMaterial>[] = [

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
        Block Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.original.blockNumber}</div>,
  },
  {
    accessorKey: "slabnumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Slab Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.original.slabnumber}</div>,
  },
  {
    accessorKey: "length",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        L (inch)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.length}</div>,
  },
  {
    accessorKey: "height",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        H (inch)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.height}</div>,
  },
  {
    accessorKey: "lengthincm",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        L (cm)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const lengthInCm = (parseFloat(row.original.length) * 2.54).toFixed(2);
      return <div>{lengthInCm}</div>;
    },
  },
  {
    accessorKey: "heightincm",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        H (cm)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const heightInCm = (parseFloat(row.original.height) * 2.54).toFixed(2);
      return <div>{heightInCm}</div>;
    },
  },
  {
    accessorKey: "squareft",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
<<<<<<< HEAD
=======

>>>>>>> e88b210efafc21d94060744e4b18d48eab26f1ce
        Workera&apos;s SQF
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const squareFt = (
        (parseFloat(row.original.length) * parseFloat(row.original.height)) /
        144
      ).toFixed(2);
      return <div>{squareFt}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <Button variant="ghost">Status</Button>
    ),
    cell: ({ row }) => (
      <div
        className={`capitalize w-fit p-2 py-1 rounded-md text-xs ${row.original.isActive
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800"
          }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost">
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{moment(row.original.createdAt).format("DD MMM YYYY")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
