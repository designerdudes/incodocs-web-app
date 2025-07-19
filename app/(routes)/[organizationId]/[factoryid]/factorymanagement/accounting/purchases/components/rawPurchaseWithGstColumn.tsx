"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./rawPurchaseCell-actions";
import moment from "moment";
import { RawPurchased } from "../page";

export const rawPurchaseWithGstColumn: ColumnDef<RawPurchased>[] = [
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
    accessorFn: (row) => row.supplierId?.supplierName || "",
  id: "supplierName", // required when using accessorFn
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

      return (
        <div className="capitalize">
          {"gstPercentage" in data ? `${data.gstPercentage}%` : "-"}
        </div>
      );
    },
  },

  {
    accessorKey: "ratePerCubicVolume",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rate per Cubic Volumn
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.ratePerCubicVolume}</div>
    ),
  },
  {
    accessorKey: "numberofBlocks",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Number of Blocks
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.noOfBlocks}</div>
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
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
