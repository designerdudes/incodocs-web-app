"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cuttingWithAllowaneCellAction";
import { FinishedMaterial } from "../page";

function calculateAdjustedDimensions(
  length: number,
  height: number,
  workersPolishingPay: number,
  trimLength?: number,
  trimHeight?: number
) {
  // Use default values of 0 if trimLength or trimHeight are missing
  const validTrimLength = trimLength || 0;
  const validTrimHeight = trimHeight || 0;

  const adjustedLengthWithAllowance = length - validTrimLength + 6; // Length adjustment
  const adjustedHeightWithAllowance = height - validTrimHeight + 2; // Height adjustment
  const adjustedLength = adjustedLengthWithAllowance - 4;
  const adjustedHeight = adjustedHeightWithAllowance - 2;

  // Handle cases where adjusted values are not valid numbers
  if (isNaN(adjustedLength) || isNaN(adjustedHeight)) {
    return {
      adjustedLength: "",
      adjustedHeight: "",
      lengthInCm: "",
      heightInCm: "",
      squareFt: "",
      amount: "",
    };
  }

  const lengthInCm = (adjustedLength * 2.54).toFixed(2); // Convert to cm
  const heightInCm = (adjustedHeight * 2.54).toFixed(2); // Convert to cm
  const squareFt = ((adjustedLength * adjustedHeight) / 144).toFixed(2); // Calculate square feet
  const amount = (((adjustedLength * adjustedHeight) / 144) * workersPolishingPay).toFixed(2); // Calculate amount

  return {
    
    adjustedLength: adjustedLength.toFixed(2),
    adjustedHeight: adjustedHeight.toFixed(2),
    lengthInCm,
    heightInCm,
    squareFt,
    amount,
  };
}

export const polishingInchesWithAllowanceColumns: ColumnDef<FinishedMaterial>[] =
  [
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
      accessorKey: "slabNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slab. No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.original?.slabNumber}</div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "blockNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Block. No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.original?.blockNumber}</div>
      ),
    },

    {
      accessorKey: "trimLength",
      header: "Trim Length (inch)",
      cell: ({ row }) => <div>{row.original?.trim?.length?.value}</div>,
    },
    {
      accessorKey: "trimHeight",
      header: "Trim Height (inch)",
      cell: ({ row }) => <div>{row.original?.trim?.height?.value}</div>,
    },
    {
      accessorKey: "length",
      header: "Length (inch)",
      cell: ({ row }) => {
        const { adjustedLength } = calculateAdjustedDimensions(
          row.original?.dimensions?.length?.value,
          row.original?.dimensions?.height?.value,
          row.original?.workersPolishingPay,
          row.original?.trim?.length?.value,
          row.original?.trim?.height?.value
        );
        return <div>{adjustedLength}</div>;
      },
    },
    {
      accessorKey: "height",
      header: "Height (inch)",
      cell: ({ row }) => {
        const { adjustedHeight } = calculateAdjustedDimensions(
          row.original?.dimensions?.length?.value,
          row.original?.dimensions.height?.value,
          row.original?.workersPolishingPay,
          row.original?.trim?.length?.value,
          row.original?.trim?.height?.value
        );
        return <div>{adjustedHeight}</div>;
      },
    },
    {
      accessorKey: "lengthCm",
      header: "Length (cm)",
      cell: ({ row }) => {
        const { lengthInCm } = calculateAdjustedDimensions(
          row.original?.dimensions?.length?.value,
          row.original?.dimensions?.height?.value,
          row.original?.workersPolishingPay,
          row.original?.trim?.length?.value,
          row.original?.trim?.height?.value
        );
        return <div>{lengthInCm}</div>;
      },
    },
    {
      accessorKey: "heightCm",
      header: "Height (cm)",
      cell: ({ row }) => {
        const { heightInCm } = calculateAdjustedDimensions(
          row.original?.dimensions?.length?.value,
          row.original?.dimensions?.height?.value,
          row.original?.workersPolishingPay,
          row.original?.trim?.length?.value,
          row.original?.trim?.height?.value
        );
        return <div>{heightInCm}</div>;
      },
    },
    {
      accessorKey: "squareFt",
      header: "Total SQF",
      cell: ({ row }) => {
        const { squareFt } = calculateAdjustedDimensions(
          row.original?.dimensions?.length?.value,
          row.original?.dimensions?.height?.value,
          row.original?.workersPolishingPay,
          row.original?.trim?.length?.value,
          row.original?.trim?.height?.value
        );
        return <div>{squareFt}</div>;
      },
      footer: ({ table }) => {
        const totalSQF = table.getRowModel().rows.reduce((sum, row) => {
          const { squareFt } = calculateAdjustedDimensions(
            row.original?.dimensions?.length?.value,
            row.original?.dimensions?.height?.value,
            row.original?.workersPolishingPay,
            row.original?.trim?.length?.value,
            row.original?.trim?.height?.value
          );
          return sum + parseFloat(squareFt || "0");
        }, 0);
        return (
          <span className="font-medium text-gray-600">
            Total SQF: {totalSQF.toFixed(2)} 
          </span>
        );
      },
    },

    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const { amount } = calculateAdjustedDimensions(
          row.original?.dimensions?.length?.value,
          row.original?.dimensions?.height?.value,
          row.original?.workersPolishingPay,
          row.original?.trim?.length?.value,
          row.original?.trim?.height?.value
        );
        return <div>{amount}</div>;
      },
      footer: ({ table }) => {
        const totalAmount = table.getRowModel().rows.reduce((sum, row) => {
          const { amount } = calculateAdjustedDimensions(
            row.original?.dimensions?.length?.value,
            row.original?.dimensions?.height?.value,
            row.original?.workersPolishingPay,
            row.original?.trim?.length?.value,
            row.original?.trim?.height?.value
          );
          return sum + parseFloat(amount || "0");
        }, 0);
        return (
          <span className="font-medium text-gray-600">
            Total Amount: {totalAmount.toFixed(2)}
          </span>
        );
      },
    },

    {
      accessorKey: "polishingPaymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        // Log polishingPaymentStatus for this slab
        console.log(`Polishing Payment Status for slab ${row.original?.slabNumber}:`, row.original?.polishingPaymentStatus?.status);
        return (
          <div className="capitalize">
            {row.original?.polishingPaymentStatus?.status || "Pending"}
          </div>
        );
      },
    },


    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];
