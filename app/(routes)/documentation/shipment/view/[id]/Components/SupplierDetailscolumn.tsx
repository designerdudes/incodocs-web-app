"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Shipment } from "../../../data/schema";

export const SupplierDetailscolumn: ColumnDef<Shipment>[] = [
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
    accessorKey: "Supplier GSTN",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
       Supplier GSTN
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.supplierGSTN}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "SupplierInvoiceNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supplier Invoice Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.supplierInvoiceNumber}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "supplier Invoice Date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supplier Invoice Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.supplierInvoiceDate}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "supplier InvoiceValue With GST",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
       Supplier Invoice Value With GST
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.supplierInvoiceValueWithGST}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "supplier Invoice Value WithOut GST",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supplier Invoice Value WithOut GST
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.supplierInvoiceValueWithOutGST}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "clearance Supplier Invoice Url",
    header:({column}) =>(
      <Button
      variant="ghost"
      onClick={() =>column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Clearance Supplier Invoice Url
      <ArrowUpDown className="ml-2 h-4 w-4"/>
      </Button>
    ),
    cell: ({ row }) =>(
      <div className="capitalize">
        { shipmentData?.bookingDetails?.clearanceSupplierInvoiceUrl}

      </div>
    )
  },
];
