"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellActions from "./cell-actions";
import moment from "moment";

export interface Quarry {
  _id: any;
  lesseeId?: string;
  lesseeName?: string;
  mineralName?: string;
  businessLocationNames?: string[];
  factoryId?: any;
  documents?: {
    fileName?: string;
    fileUrl?: string;
    date?: Date;
    review?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const QuarryColumns: ColumnDef<Quarry>[] = [
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
    accessorKey: "lesseeId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lessee ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.lesseeId || "N/A"}</div>,
  },

  {
    accessorKey: "lesseeName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lessee Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.lesseeName || "N/A"}</div>,
  },

  {
    accessorKey: "mineralName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Mineral Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.mineralName || "N/A"}</div>,
  },

  {
    accessorKey: "businessLocationNames",
    header: () => <div>Business Locations</div>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        {(row.original.businessLocationNames || []).map(
          (location: string, index: number) => (
            <span key={index}>{location}</span>
          )
        )}
      </div>
    ),
  },

  {
    accessorKey: "documents",
    header: () => <div>Documents</div>,
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
    header: () => <div>Created</div>,
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
    header: () => <div>Updated</div>,
    cell: ({ row }) => (
      <div>
        {row.original.updatedAt
          ? moment(row.original.updatedAt).format("YYYY-MM-DD")
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
