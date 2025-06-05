"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export interface ShipmentContainer {
  containerNumber: string;
  truckNumber: string;
  truckDriverContactNumber: number;
  addProductDetails?: Array<{
    productType: "Tiles" | "Slabs" | "StepsAndRisers";
    tileDetails?: {
      stoneName?: string;
      stonePhoto?: string;
      size?: {
        length?: number;
        breadth?: number;
      };
      thickness?: {
        value?: number;
      };
      moulding?: {
        mouldingSide?: "one side" | "two side" | "three side" | "four side";
        typeOfMoulding?: "half bullnose" | "full bullnose" | "bevel";
      };
      noOfBoxes?: number;
      piecesPerBox?: number;
    };
    slabDetails?: {
      stoneName?: string;
      stonePhoto?: string;
      manualMeasurement?: string;
      uploadMeasurement?: string;
    };
    stepRiserDetails?: {
      stoneName?: string;
      stonePhoto?: string;
      mixedBox?: {
        noOfBoxes?: number;
        noOfSteps?: number;
        sizeOfStep?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
        noOfRiser?: number;
        sizeOfRiser?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
      };
      seperateBox?: {
        noOfBoxOfSteps?: number;
        noOfPiecesPerBoxOfSteps?: number;
        sizeOfBoxOfSteps?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
        noOfBoxOfRisers?: number;
        noOfPiecesPerBoxOfRisers?: number;
        sizeOfBoxOfRisers?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
      };
    };
    organizationId?: string;
    createdBy?: string;
  }>;
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

    // Helper function to calculate square meters for Tiles
    const calculateTileSquareMeter = (
      length: number,
      breadth: number,
      piecesPerBox: number,
      noOfBoxes: number
    ): number => {
      return length && breadth && piecesPerBox && noOfBoxes
        ? (((length * breadth) / 929) * piecesPerBox * noOfBoxes) / 10.764
        : 0;
    };

    // Helper function to calculate square meters for Steps and Risers
    const calculateStepRiserSquareMeter = (stepRiserDetails: any): number => {
      let total = 0;

      // Mixed Box Calculations
      const {
        noOfBoxes = 0,
        noOfSteps = 0,
        noOfRiser = 0,
        sizeOfStep = { length: 0, breadth: 0 },
        sizeOfRiser = { length: 0, breadth: 0 },
      } = stepRiserDetails?.mixedBox || {};

      const mixedBoxStepSquareMeter =
        noOfBoxes && noOfSteps && sizeOfStep.length && sizeOfStep.breadth
          ? (noOfBoxes * noOfSteps * sizeOfStep.length * sizeOfStep.breadth) /
            929 /
            10.764
          : 0;

      const mixedBoxRiserSquareMeter =
        noOfBoxes && noOfRiser && sizeOfRiser.length && sizeOfRiser.breadth
          ? (noOfBoxes * noOfRiser * sizeOfRiser.length * sizeOfRiser.breadth) /
            929 /
            10.764
          : 0;

      // Separate Box Calculations
      const {
        noOfBoxOfSteps = 0,
        noOfPiecesPerBoxOfSteps = 0,
        sizeOfBoxOfSteps = { length: 0, breadth: 0 },
        noOfBoxOfRisers = 0,
        noOfPiecesPerBoxOfRisers = 0,
        sizeOfBoxOfRisers = { length: 0, breadth: 0 },
      } = stepRiserDetails?.seperateBox || {};

      const separateBoxStepSquareMeter =
        noOfBoxOfSteps &&
        noOfPiecesPerBoxOfSteps &&
        sizeOfBoxOfSteps.length &&
        sizeOfBoxOfSteps.breadth
          ? (noOfBoxOfSteps *
              noOfPiecesPerBoxOfSteps *
              sizeOfBoxOfSteps.length *
              sizeOfBoxOfSteps.breadth) /
            929 /
            10.764
          : 0;

      const separateBoxRiserSquareMeter =
        noOfBoxOfRisers &&
        noOfPiecesPerBoxOfRisers &&
        sizeOfBoxOfRisers.length &&
        sizeOfBoxOfRisers.breadth
          ? (noOfBoxOfRisers *
              noOfPiecesPerBoxOfRisers *
              sizeOfBoxOfRisers.length *
              sizeOfBoxOfRisers.breadth) /
            929 /
            10.764
          : 0;

      total =
        mixedBoxStepSquareMeter +
        mixedBoxRiserSquareMeter +
        separateBoxStepSquareMeter +
        separateBoxRiserSquareMeter;

      return total;
    };

    // Calculate total square meters across all products
    const totalSquareMeters = products.reduce((sum, product: any) => {
      let sqm = 0;

      if (product.productType === "Tiles") {
        const { size = { length: 0, breadth: 0 }, piecesPerBox = 0, noOfBoxes = 0 } =
          product.tileDetails || {};
        sqm = calculateTileSquareMeter(size.length, size.breadth, piecesPerBox, noOfBoxes);
      } else if (product.productType === "StepsAndRisers") {
        sqm = calculateStepRiserSquareMeter(product.stepRiserDetails);
      }
      // For Slabs, square meter is not calculated in the form, so we skip it
      return sum + sqm;
    }, 0);

    return (
      <div className="space-y-2">
        {products.map((product: any, idx: number) => {
          let stoneName = "";
          let stonePhoto = "";
          let sqm = 0;

          if (product.productType === "Tiles") {
            stoneName = product.tileDetails?.stoneName || "N/A";
            stonePhoto = product.tileDetails?.stonePhoto || "N/A";
            const { size = { length: 0, breadth: 0 }, piecesPerBox = 0, noOfBoxes = 0 } =
              product.tileDetails || {};
            sqm = calculateTileSquareMeter(size.length, size.breadth, piecesPerBox, noOfBoxes);
          } else if (product.productType === "Slabs") {
            stoneName = product.slabDetails?.stoneName || "N/A";
            stonePhoto = product.slabDetails?.stonePhoto || "N/A";
            // Slabs don't have a square meter calculation in the form
            sqm = 0;
          } else if (product.productType === "StepsAndRisers") {
            stoneName = product.stepRiserDetails?.stoneName || "N/A";
            stonePhoto = product.stepRiserDetails?.stonePhoto || "N/A";
            sqm = calculateStepRiserSquareMeter(product.stepRiserDetails);
          }

          return (
            <div key={idx} className="border-b pb-1">
              <div>
                <strong>Product Type:</strong> {product.productType}
              </div>
              <div>
                <strong>Stone Name:</strong> {stoneName}
              </div>
              <div>
                <strong>Stone Photo:</strong> {stonePhoto}
              </div>
              {product.productType !== "Slabs" && (
                <div>
                  <strong>Total Square Meter:</strong> {sqm.toFixed(3)}
                </div>
              )}
            </div>
          );
        })}
        {totalSquareMeters > 0 && (
          <div className="font-semibold">
            Total Square Meters: {totalSquareMeters.toFixed(3)}
          </div>
        )}
      </div>
    );
  },
  enableSorting: false,
}


];