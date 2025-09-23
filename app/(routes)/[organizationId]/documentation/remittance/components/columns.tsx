"use client";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import moment from "moment";
import { Copy, ChevronDown } from "lucide-react";
import { Remittance } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import ViewAllComponent from "./viewAllComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { ColumnHeader } from "./column-header";
import { DataTableCellActions } from "./cell-actions";

// Extend TableMeta to include updateData
interface CustomTableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

const multiColumnFilterFn: FilterFn<Remittance> = (
  row,
  columnId,
  filterValue
) => {
  const consigneeName =
    typeof row.original?.consigneeId === "string"
      ? row.original?.consigneeId
      : row.original?.consigneeId?.name || "";

  const searchableRowContent = [
    row.original.inwardRemittanceNumber,
    row.original.invoiceNumber,
    consigneeName,
  ]
    .join(" ")
    .toLowerCase();

  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Remittance> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string | undefined;
  return status ? filterValue.includes(status) : false;
};


// Separate component for status cell
export const StatusCell: React.FC<{
  row: any;
  table: any;
}> = ({ row, table }) => {
  const currentStatus = row.original.invoiceValue - row.original.inwardRemittanceValue > 0 ? "balance_pending" : "recieved";
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);




  return (
    <div className="flex items-center space-x-2 w-[max-content]">
      <Badge
        className={cn(
          currentStatus === "balance_pending" &&
          "bg-amber-200 text-amber-800 hover:bg-amber-300/80 text-xs",

          currentStatus === "recieved" &&
          "bg-green-200 text-green-800 hover:bg-green-300/80 text-xs",
          !currentStatus && "bg-gray-100 text-gray-600 hover:bg-gray-200/60"
        )}
      >
        {currentStatus.split("_").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "N/A"}
      </Badge>

      {/* Confirmation Dialog */}

    </div>
  );
};

export const columns: ColumnDef<Remittance>[] = [
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
    size: 50,
    enablePinning: false,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "inwardRemittanceNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Remittance No." />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="truncate font-medium">
          {row.original.inwardRemittanceNumber || "N/A"}
        </span>
        {row.original.inwardRemittanceNumber && (
          <Copy
            className="h-3 w-3 text-gray-500 cursor-pointer hover:text-blue-700"
            onClick={() => {
              if (row.original.inwardRemittanceNumber) {
                navigator.clipboard.writeText(row.original.inwardRemittanceNumber);
              }
            }}
          />
        )}
      </div>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Invoice No" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original?.invoiceNumber || "N/A"}
        </span>
      </div>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "consignee",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Consignee" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {typeof row.original?.consigneeId === "string"
            ? row.original.consigneeId
            : row.original?.consigneeId?.name || "N/A"}
        </span>
      </div>
    ),
    size: 300,
  },
  {
    accessorKey: "invoiceCopy",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Invoice Copy" />
    ),
    cell: ({ row }) => {
      const invoiceCopy = row.original?.invoiceCopy || [];
      return (
        <div className="flex space-x-2">
          {invoiceCopy && invoiceCopy.length > 0 ? (
            <Button
              onClick={
                () => {
                  window.open(row.original.invoiceCopy)
                }
              }
              variant={"link"}>View</Button>
          ) : (
            <span className="truncate font-medium">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "inwardRemittanceCopy",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Remittance Copy" />
    ),
    cell: ({ row }) => {
      const invoiceCopy = row.original?.inwardRemittanceCopy || [];
      return (
        <div className="flex space-x-2">
          {invoiceCopy && invoiceCopy.length > 0 ? (
            <Button
              onClick={
                () => {
                  window.open(row.original.invoiceCopy)
                }
              }
              variant={"link"}>View</Button>
          ) : (
            <span className="truncate font-medium">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "invoiceValue",
    header: ({ column }) => <ColumnHeader column={column} title="Invoice Value" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.invoiceValue
            ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "USD",
            }).format(row.original.invoiceValue)
            : "N/A"}

        </span>
      </div>
    ),
  },
  {
    accessorKey: "inwardRemittanceValue",
    header: ({ column }) => <ColumnHeader column={column} title="Remittance Value" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.inwardRemittanceValue
            ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "USD",
            }).format(row.original.inwardRemittanceValue)
            : "N/A"}

        </span>
      </div>
    ),
  },


  {
    accessorKey: "differenceAmount",
    header: ({ column }) => <ColumnHeader column={column} title="Difference Amount" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {

            (row.original.invoiceValue ?? 0) - (row.original.inwardRemittanceValue ?? 0) > 0
              ? new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
              }).format((row.original?.invoiceValue ?? 0) - (row.original?.inwardRemittanceValue ?? 0))
              : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "invoiceDate",
    header: ({ column }) => <ColumnHeader column={column} title="Invoice Date" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.invoiceDate
            ? moment(row.original.invoiceDate).format("MMM Do YY")
            : "N/A"}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "inwardRemittanceDate",
    header: ({ column }) => <ColumnHeader column={column} title="Remittance Date" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.inwardRemittanceDate
            ? moment(row.original.inwardRemittanceDate).format("MMM Do YY")
            : "N/A"}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row, table }) => <StatusCell row={row} table={table} />,
    filterFn: statusFilterFn,
    size: 300,
  },
  {
    accessorKey: "method",
    header: ({ column }) => <ColumnHeader column={column} title="Method" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.method !== undefined
            ? row.original.method.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => <ColumnHeader column={column} title="Created By" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={row.original.createdBy?.profileImg || ""}
            alt={row.original.createdBy?.fullName || "Unknown"}
          />
          <AvatarFallback>
            {row.original.createdBy?.fullName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1 leading-none">
          <span className="capitalize">
            {row.original.createdBy?.fullName || "Unknown"}
          </span>
          <span className="text-xs truncate text-muted-foreground">
            {row.original.createdBy?.email || "N/A"}
          </span>
        </div>
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.createdAt
            ? moment(row.original.createdAt).format("MMM Do YY")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => <ColumnHeader column={column} title="Action" />,
    cell: ({ row }) => <DataTableCellActions row={row} />,
    size: 70,
    enablePinning: false,
  },
];
