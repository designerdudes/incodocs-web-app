"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import { FinishedPurchased } from "../page";
import CellAction from "./finishedPurchaseCell-actions";

export const FinishedPurchaseWithGstColumns: ColumnDef<FinishedPurchased>[] = [
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
    accessorKey: "supplierName", // Corrected key
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supplier Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original?.supplierId?.supplierName}</div>
    ),
  },
  {
    accessorKey: "gstPercentage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        GST Percentage
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = row.original;

      // Show GST % only if present (i.e., in *WithGST types)
      return (
        <div className="capitalize">
          {"gstPercentage" in data && typeof data.gstPercentage === "number"
            ? `${data.gstPercentage}%`
            : "-"}
        </div>
      );
    },
  },
   {
        accessorKey: "paymentProof", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Payment Proof
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize flex items-center justify-center gap-2 ">
            {row.original.paymentProof &&    <Button size={"icon"} variant="outline"
            onClick={() => window.open(row.original.paymentProof, "_blank")}
            ><Eye className="h-4 w-4" /></Button>}
            </div>

        ),
    },
  {
    accessorKey: "ratePerSqft",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rate per Sqft
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.ratePerSqft}</div>
    ),
  },
  {
    accessorKey: "numberofBlocks",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Number of Slabs
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.noOfSlabs}</div>
    ),
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Purchase Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.purchaseDate).format("DD MMM YYYY")}</div>
    ),
  },

  {
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
