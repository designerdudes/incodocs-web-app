"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellActions from "./cell-actions";
import moment from "moment";

export interface Supplier {
  _id?: any;
  supplierName?: string;
  gstNo?: string;
  address?: string;
  responsiblePerson?: string;
  mobileNumber?: number;
  pincode?: number;
  factoryAddress?: string;
  factoryId?: any;
  createdBy?: any;
  documents?: {
    fileName?: string;
    fileUrl?: string;
    date?: Date;
    review?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const SupplierColumns: ColumnDef<Supplier>[] = [
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
    accessorKey: "supplierName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supplier Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.supplierName || "N/A"}</div>,
  },

  {
    accessorKey: "gstNo",
    header: "GST No",
    cell: ({ row }) => <div>{row.original.gstNo || "N/A"}</div>,
  },

  {
    accessorKey: "responsiblePerson",
    header: "Responsible Person",
    cell: ({ row }) => <div>{row.original.responsiblePerson || "N/A"}</div>,
  },

  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
    cell: ({ row }) => <div>{row.original.mobileNumber || "N/A"}</div>,
  },

  {
    accessorKey: "pincode",
    header: "Pincode",
    cell: ({ row }) => <div>{row.original.pincode || "N/A"}</div>,
  },

  // {
  //   accessorKey: "address",
  //   header: "Address",
  //   cell: ({ row }) => <div>{row.original.address || "N/A"}</div>,
  // },

  {
    accessorKey: "factoryAddress",
    header: "Factory Address",
    cell: ({ row }) => <div>{row.original.factoryAddress || "N/A"}</div>,
  },

  {
    accessorKey: "documents",
    header: "Documents",
    cell: ({ row }) => {
      const documents = row.original.documents || [];

      return documents.length > 0 ? (
        <div className="flex flex-col gap-2">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm">{doc.fileName}</span>
              {doc.fileUrl && (
                <Eye
                  className="h-4 w-4 cursor-pointer text-blue-700"
                  onClick={() => window.open(doc.fileUrl, "_blank")}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>N/A</div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div>
        {row.original.createdAt
          ? moment(row.original.createdAt).format("YYYY-MM-DD")
          : "N/A"}
      </div>
    ),
  },

  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <div>
        {row.original.updatedAt
          ? moment(row.original.updatedAt).format("YYYY-MM-DD")
          : "N/A"}
      </div>
    ),
  },

  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
