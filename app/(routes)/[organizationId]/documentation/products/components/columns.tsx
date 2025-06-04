"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellActions from "./cell-actions";

export interface Product {
  _id: string;
  productType?: string;
  code?: string;
  description?: string;
  unitOfMeasurements?: string;
  countryOfOrigin?: string;
  HScode?: string;
  netWeight?: number;
  grossWeight?: number;
  cubicMeasurement?: number;
  prices?: {
    variantName: string;
    variantType?: string;
    sellPrice: number;
    buyPrice: number;
  }[];
  slabDetails?: {
    stoneName: string;
    stonePhoto: string;
    manualMeasurement: string;
    uploadMeasurement: string;
  };
  tileDetails?: {
    stoneName: string;
    stonePhoto: string;
    noOfBoxes: number;
    piecesPerBox: number;
    size: { length: number; breadth: number };
    thickness?: { value: number };
    moulding?: { mouldingSide: string; typeOfMoulding: string };
  };
  stepRiserDetails?: {
    stoneName: string;
    stonePhoto: string;
    mixedBox?: {
      sizeOfStep: { length: number; breadth: number; thickness: number };
      sizeOfRiser: { length: number; breadth: number; thickness: number };
      noOfBoxes: number;
      noOfSteps: number;
      noOfRiser: number;
    };
    seperateBox?: {
      sizeOfBoxOfSteps: { length: number; breadth: number; thickness: number };
      sizeOfBoxOfRisers: { length: number; breadth: number; thickness: number };
      noOfBoxOfSteps: number;
      noOfBoxOfRisers: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  shipments?: any[];
}

export const ProductsColumns: ColumnDef<Product>[] = [
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
    accessorKey: "productType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{row.original.productType || row.original.code || "N/A"}</div>
    ),
  },
  {
    accessorKey: "stoneName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stone Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original.slabDetails?.stoneName ||
          row.original.tileDetails?.stoneName ||
          row.original.stepRiserDetails?.stoneName ||
          row.original.description ||
          "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "stonePhoto",
    header: () => <div>Stone Photo</div>,
    cell: ({ row }) => {
      const photo =
        row.original.slabDetails?.stonePhoto ||
        row.original.tileDetails?.stonePhoto ||
        row.original.stepRiserDetails?.stonePhoto;
      
      // Log the photo URL or "N/A" based on validity
      if (photo && photo !== "N/A" && !photo.startsWith("data:image")) {
        console.log("Stone Photo URL:", photo);
      } else {
        console.log("Stone Photo URL: N/A");
      }

      return photo && photo !== "N/A" && !photo.startsWith("data:image") ? (
        <div className="flex gap-2">
          <Eye
            className="h-4 w-4 cursor-pointer"
            onClick={() => {
              window.open(photo, "_blank");
            }}
            aria-label={`View photo for ${row.original.slabDetails?.stoneName ||
              row.original.tileDetails?.stoneName ||
              row.original.stepRiserDetails?.stoneName ||
              row.original.description ||
              "stone"}`}
          />
        </div>
      ) : (
        <div>N/A</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Created At</div>,
    cell: ({ row }) => (
      <div>
        {row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A"}
      </div>
    ),
  },
  {
    header: () => <div>Action</div>,
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];