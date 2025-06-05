"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export interface ShipmentSupplierInvoice {
  
  supplierName: {
    supplierName: string
  };
  invoices?: {
   supplierInvoiceNumber: string;
   supplierInvoiceDate: string;
   supplierInvoiceValueWithGST: string;
   supplierInvoiceValueWithOutGST: string;
   clearanceSupplierInvoiceUrl: string;
  };
}

export const SupplierDetailscolumn: ColumnDef<ShipmentSupplierInvoice>[] = [
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
        accessorKey: "supplierName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                 Supplier Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.original.supplierName?.supplierName}</div>,
        filterFn: "includesString",
  },
  {
    accessorKey: "supplierInvoiceNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
         Invoice Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.invoices?.supplierInvoiceNumber}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "supplierInvoiceDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original.invoices?.supplierInvoiceDate
          ? format(new Date(row.original.invoices?.supplierInvoiceDate), "PPP")
          : "N/A"}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "supplierInvoiceValueWithGST",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Value With GST
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.invoices?.supplierInvoiceValueWithGST}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "supplierInvoiceValueWithOutGST",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Value Without GST
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.invoices?.supplierInvoiceValueWithOutGST}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "clearanceSupplierInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Uploaded Invoice
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.invoices?.clearanceSupplierInvoiceUrl ? (
        <a href={row.original.invoices?.clearanceSupplierInvoiceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View
        </a>
      ) : (
        "N/A"
      ),
    filterFn: "includesString",
  },
];