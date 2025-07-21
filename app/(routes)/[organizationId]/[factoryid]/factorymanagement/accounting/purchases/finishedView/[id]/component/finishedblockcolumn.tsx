"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
// import CellAction from "./CellAction";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CellAction from "./Cellaction";

interface Purchase {
  getPurchase: {
    _id: string;
    factoryId: {
      _id: string;
      factoryName: string;
    };
    supplierId: {
      _id: string;
      supplierName: string;
    };
    invoiceNo: string;
    actualInvoiceValue: number;
    noOfSlabs: number;
    slabIds: Slab[];
    length: number;
    height: number;
    ratePerSqft: number;
    purchaseDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface Slab {
  _id: string;
  factoryId: string;
  slabNumber: string;
  productName: string;
  status: string;
  inStock: boolean;
  dimensions: {
    length: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };
  cuttingPaymentStatus: {
    status: string;
  };
  polishingPaymentStatus: {
    status: string;
  };
  trim: {
    length: {
      units: string;
    };
    height: {
      units: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const finishedblockcolumn: ColumnDef<Slab>[] = [
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
       Slab Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original?.slabNumber}</div>,

    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original?.productName}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "length",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Length (inch)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{row.original?.dimensions?.length?.value || ""}</div>
    ),
  },
  {
    accessorKey: "height",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Height (inch)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{row.original?.dimensions?.height?.value || ""}</div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{moment(row.original?.createdAt).format("DD MMM YYYY")}</div>
    ),
  },

  {
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
