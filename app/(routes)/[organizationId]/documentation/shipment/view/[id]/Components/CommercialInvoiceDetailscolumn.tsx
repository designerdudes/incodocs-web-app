"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export interface ShipmentCommercialInvoice {
  clearanceCommercialInvoiceNumber: string;
  clearancecommercialInvoiceDate: string;
  clearanceCommercialInvoiceUrl: string;
  clearanceCommercialInvoiceValue: string;
  actualCommercialInvoiceUrl: string;
  actualCommercialInvoiceValue: string;
  saberInvoiceUrl: string;
  saberInvoiceValue: string;
  packingListUrl: string;
  _id?: string; // Optional, added from backend data
}

export const CommercialInvoiceDetailscolumn: ColumnDef<ShipmentCommercialInvoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "clearanceCommercialInvoiceNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        clearance  Invoice Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.clearanceCommercialInvoiceNumber}</div>,
    filterFn: "includesString",
  },
  {
      accessorKey: "clearanceCommercialInvoiceDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
           clearance Invoice Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.clearancecommercialInvoiceDate
            ? format(new Date(row.original.clearancecommercialInvoiceDate), "PPP")
            : "N/A"}
        </div>
      ),
      filterFn: "includesString",
    },
  {
    accessorKey: "clearanceCommercialInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Clearance Invoice Url
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.clearanceCommercialInvoiceUrl ? (
        <a
          href={row.original.clearanceCommercialInvoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View
        </a>
      ) : (
        "N/A"
      ),
    filterFn: "includesString",
  },
  {
      accessorKey: "clearanceCommercialInvoiceValue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          clearance Invoice Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.clearanceCommercialInvoiceValue}</div>,
      filterFn: "includesString",
  },
  {
    accessorKey: "actualCommercialInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Actual Invoice Url
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.actualCommercialInvoiceUrl ? (
        <a
          href={row.original.actualCommercialInvoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View
        </a>
      ) : (
        "N/A"
      ),
    filterFn: "includesString",
  },
  {
      accessorKey: "actualCommercialInvoiceValue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Actual Invoice Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.actualCommercialInvoiceValue}</div>,
      filterFn: "includesString",
  },
  {
    accessorKey: "saberInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        SABER Invoice Url
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.saberInvoiceUrl ? (
        <a
          href={row.original.saberInvoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View
        </a>
      ) : (
        "N/A"
      ),
    filterFn: "includesString",
  },
  {
      accessorKey: "saberInvoiceValue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SABER Invoice Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.saberInvoiceValue}</div>,
      filterFn: "includesString",
    },
    {
    accessorKey: "packingListUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Packing List Url
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.packingListUrl ? (
        <a
          href={row.original.packingListUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View
        </a>
      ) : (
        "N/A"
      ),
    filterFn: "includesString",
  },
];