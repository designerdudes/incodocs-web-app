"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export interface ShipmentContainer {
  containerNumber: string;
  truckNumber: string;
  truckDriverContactNumber: number; // Fixed typo
  addProductDetails?: {
    code: string;
    description: string;
    unitOfMeasurements: string;
    countryOfOrigin: string;
    HScode: string;
    prices: [
      {
        variantName: string;
        sellPrice: number;
        buyPrice: number;
        _id: string;
      }
    ];
    netWeight: number;
    grossWeight: number;
    cubicMeasurement: number;
    organizationId: string;
  }[];
}

export const BookingDetailsColumn: ColumnDef<ShipmentContainer>[] = [
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
    accessorKey: "containerNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Container Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.containerNumber}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "truckNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Truck Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.truckNumber}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "truckDriverContactNumber", // Fixed typo
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Truck Driver Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.truckDriverContactNumber}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "addProductDetails",
    header: "Product Details",
    cell: ({ row }) => {
      const products = row.original.addProductDetails;

      if (!products || products.length === 0) return "N/A";

      return (
        <div className="space-y-2">
          {products.map((product, idx) => (
            <div key={idx} className="border-b pb-1">
              <div><strong>Code:</strong> {product.code}</div>
              <div><strong>Description:</strong> {product.description}</div>
              <div><strong>HS Code:</strong> {product.HScode}</div>
            </div>
          ))}
        </div>
      );
    },
    enableSorting: false,
  }

];