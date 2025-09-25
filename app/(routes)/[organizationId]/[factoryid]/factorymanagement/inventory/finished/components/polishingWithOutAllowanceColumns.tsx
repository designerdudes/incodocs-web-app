"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cuttingDataCellAction";
import { FinishedMaterial } from "../page";
import calculateDimensions from "./cuttingWithOutAllowanceColumns";

export const polishingInchesWithOutAllowanceColumns: ColumnDef<FinishedMaterial>[] =
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
      accessorKey: "polishedValuesLength",
      header: "polishedValues Length (inch)",
      cell: ({ row }) => (
        <div>
          {row.original?.dimensions?.length?.value -
            row.original?.polishedValues?.length?.value || ""}
        </div>
      ),
    },
    {
      accessorKey: "polishedValuesHeight",
      header: "polishedValues Height (inch)",
      cell: ({ row }) => (
        <div>
          {row.original?.dimensions?.height?.value -
            row.original?.polishedValues?.height?.value || ""}
        </div>
      ),
    },
    {
      accessorKey: "length",
      header: "Length (inch)",
      cell: ({ row }) => {
        const { adjustedLength } = calculateDimensions(
          (row.original?.dimensions?.length?.value ?? 0) -
            (row.original?.polishedValues?.length?.value ?? 0),
          (row.original?.dimensions?.height?.value ?? 0) -
            (row.original?.polishedValues?.height?.value ?? 0),
          6,
          2
        );
        return <div>{row.original?.polishedValues?.length?.value + 6 || ""}</div>;
      },
    },
    {
      accessorKey: "height",
      header: "Height (inch)",
      cell: ({ row }) => {
        const { adjustedHeight } = calculateDimensions(
          (row.original?.dimensions?.length?.value ?? 0) -
            (row.original?.polishedValues?.length?.value ?? 0),
          (row.original?.dimensions?.height?.value ?? 0) -
            (row.original?.polishedValues?.height?.value ?? 0),
          6,
          2
        );
        return <div>{row.original?.polishedValues?.height?.value + 2 || ""}</div>;
      },
    },
    {
      accessorKey: "lengthCm",
      header: "Length (cm)",
      cell: ({ row }) => {
        const { lengthInCm } = calculateDimensions(
          (row.original?.dimensions?.length?.value ?? 0) -
            (row.original?.polishedValues?.length?.value ?? 0),
          (row.original?.dimensions?.height?.value ?? 0) -
            (row.original?.polishedValues?.height?.value ?? 0),
          6,
          2
        );
        return (
          <div>
            {row.original?.polishedValues?.length?.value
              ? `${((row.original.polishedValues.length.value + 6) * 2.54).toFixed(2)}`
              : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "heightCm",
      header: "Height (cm)",
      cell: ({ row }) => {
        const { heightInCm } = calculateDimensions(
          (row.original?.dimensions?.length?.value ?? 0) -
            (row.original?.polishedValues?.length?.value ?? 0),
          (row.original?.dimensions?.height?.value ?? 0) -
            (row.original?.polishedValues?.height?.value ?? 0),
          6,
          2
        );
        return (
          <div>
            {row.original?.polishedValues?.height?.value
              ? `${((row.original.polishedValues.height.value + 2) * 2.54).toFixed(2)}`
              : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "squareFt",
      header: "Total SQF",
      cell: ({ row }) => {
        const { adjustedLength, adjustedHeight } = calculateDimensions(
          (row.original?.dimensions?.length?.value ?? 0) -
            (row.original?.polishedValues?.length?.value ?? 0),
          (row.original?.dimensions?.height?.value ?? 0) -
            (row.original?.polishedValues?.height?.value ?? 0),
          6,
          2
        );
        const squareFt =
          adjustedLength && adjustedHeight
            ? (
                (parseFloat(adjustedLength) * parseFloat(adjustedHeight)) /
                144
              ).toFixed(2)
            : "";
        return <div>{squareFt}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];
