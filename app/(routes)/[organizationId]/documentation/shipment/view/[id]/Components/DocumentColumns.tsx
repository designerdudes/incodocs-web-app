"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface DocumentsColumns {
  documentName: string;
  documentNumber: string;
  documentUrl: string;
}

export const extFn = (url: string) => {
  const match = url.match(/\.[0-9a-z]+$/i);
  return match ? match[0].slice(1) : "";
};

export const DocColumns: ColumnDef<DocumentsColumns>[] = [
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
    accessorKey: "documentName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Document Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.documentName}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "documentNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Document Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.documentNumber || "N/A"}</div>,
    filterFn: "includesString",
  },
  {
    accessorKey: "Action",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Action
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.documentUrl && row.original.documentUrl !== "N/A" ? (
          <Eye
            className="h-4 w-4 cursor-pointer"
            onClick={() => {
              window.open(row.original.documentUrl, "_blank");
            }}
          />
        ) : null}
      </div>
    ),
    filterFn: "includesString",
  },
];
