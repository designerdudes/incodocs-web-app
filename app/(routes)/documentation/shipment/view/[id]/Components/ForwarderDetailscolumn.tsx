"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Shipment } from "../../../data/schema";

export const ForwarderDetailsColumn: ColumnDef<Shipment>[] = [
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
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        invoiceNumber
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.invoiceNumber}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "uploadInvoiceUrl",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        uploadInvoiceUrl
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.uploadInvoiceUrl}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.date}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "valueWithGst",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        valueWithGst
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.valueWithGst}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "Transporter Invoice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transporter Invoice
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.TransporterInvoice}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "Value Of Transporter Invoicer",
    header:({column}) =>(
      <Button
      variant="ghost"
      onClick={() =>column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Value Of Transporter Invoicer
      <ArrowUpDown className="ml-2 h-4 w-4"/>
      </Button>
    ),
    cell: ({ row }) =>(
      <div className="capitalize">
        { shipmentData?.bookingDetails?.ValueOfTransporterInvoicer}

      </div>
    )
  },
];
