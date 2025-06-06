"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export interface ShipmentSupplierInvoice {
  supplierName: {
    supplierName: string;
  };
  invoices?: {
    supplierInvoiceNumber: string;
    supplierInvoiceDate: string;
    supplierInvoiceValueWithGST: string;
    supplierInvoiceValueWithOutGST: string;
    clearanceSupplierInvoiceUrl: string;
  }[];
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
    id: "supplierInvoiceNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invoices = row.original.invoices;
      if (!invoices || invoices.length === 0) return <div>N/A</div>;
      return (
        <div className="flex flex-col gap-1">
          {invoices.map((inv, idx) => (
            <div key={idx}>{inv.supplierInvoiceNumber || "N/A"}</div>
          ))}
        </div>
      );
    },
  },
  {
    id: "supplierInvoiceDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Invoice Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invoices = row.original.invoices;
      if (!invoices || invoices.length === 0) return <div>N/A</div>;
      return (
        <div className="flex flex-col gap-1">
          {invoices.map((inv, idx) => (
            <div key={idx}>
              {inv.supplierInvoiceDate
                ? format(new Date(inv.supplierInvoiceDate), "PPP")
                : "N/A"}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "supplierInvoiceValueWithGST",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Value With GST
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invoices = row.original.invoices;
      if (!invoices || invoices.length === 0) return <div>N/A</div>;
      return (
        <div className="flex flex-col gap-1">
          {invoices.map((inv, idx) => (
            <div key={idx}>{inv.supplierInvoiceValueWithGST || "N/A"}</div>
          ))}
        </div>
      );
    },
  },
  {
    id: "supplierInvoiceValueWithOutGST",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Value Without GST
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invoices = row.original.invoices;
      if (!invoices || invoices.length === 0) return <div>N/A</div>;
      return (
        <div className="flex flex-col gap-1">
          {invoices.map((inv, idx) => (
            <div key={idx}>{inv.supplierInvoiceValueWithOutGST || "N/A"}</div>
          ))}
        </div>
      );
    },
  },
  {
    id: "clearanceSupplierInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Uploaded Invoice
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invoices = row.original.invoices;
      if (!invoices || invoices.length === 0) return <div>N/A</div>;
      return (
        <div className="flex flex-col gap-1">
          {invoices.map((inv, idx) => (
            <div key={idx}>
              {inv.clearanceSupplierInvoiceUrl ? (
                <a
                  href={inv.clearanceSupplierInvoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View
                </a>
              ) : (
                "N/A"
              )}
            </div>
          ))}
        </div>
      );
    },
  },
];