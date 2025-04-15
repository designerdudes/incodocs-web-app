"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface ShipmentCommercialInvoice {
  commercialInvoiceNumber: string;
  clearanceCommercialInvoiceUrl: string;
  actualCommercialInvoiceUrl: string;
  saberInvoiceUrl: string;
  _id?: string; // Optional, added from backend data
}

export const SaleInvoiceDetailscolumn: ColumnDef<ShipmentCommercialInvoice>[] = [
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
    accessorKey: "commercialInvoiceNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.commercialInvoiceNumber}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "clearanceCommercialInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Clearance Invoice
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
    accessorKey: "actualCommercialInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Actual Invoice
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
    accessorKey: "saberInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        SABER Invoice
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
];