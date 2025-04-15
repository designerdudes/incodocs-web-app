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
    productCategory: string;
    graniteAndMarble?: string;
    tiles?: {
      noOfBoxes: number;
      noOfPiecesPerBoxes: number;
      sizePerTile: {
        length: { value: number; units: string };
        breadth: { value: number; units: string };
      };
    };
  };
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
      const product = row.original.addProductDetails;
      return product ? (
        <div>
          {product.productCategory}{" "}
          {product.tiles && (
            <span>
              ({product.tiles.noOfBoxes} boxes,{" "}
              {product.tiles.sizePerTile.length.value}x{product.tiles.sizePerTile.breadth.value}{" "}
              {product.tiles.sizePerTile.length.units})
            </span>
          )}
        </div>
      ) : (
        "N/A"
      );
    },
    enableSorting: false,
  },
];