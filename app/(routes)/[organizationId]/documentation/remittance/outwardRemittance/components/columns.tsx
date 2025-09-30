"use client";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnHeader } from "./column-header";
import { DataTableCellActions } from "./cell-actions";
import { Remittance } from "../data/schema";
import { useState } from "react";
import { Eye } from "lucide-react";

// Multi-column filter (search)
const multiColumnFilterFn: FilterFn<Remittance> = (
  row,
  columnId,
  filterValue
) => {
  const rowContent = Object.values(row.original || {})
    .join(" ")
    .toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return rowContent.includes(searchTerm);
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
    accessorKey: "customerName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Customer Name" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.customerName || "N/A"}
      </span>
    ),
    filterFn: multiColumnFilterFn,
  },

  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.paymentDate
          ? moment(row.original.paymentDate).format("MMM Do YY")
          : "N/A"}
      </span>
    ),
  },
   {
        accessorKey: "amount", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                 Amount
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {
                    new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,

                    }).format(row?.original?.amount as any)

                }
            </div>
        ),
    },

  // {
  //   accessorKey: "amount",
  //   header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
  //   cell: ({ row }) => (
  //     <span className="truncate font-medium">
  //       {row.original.amount
  //         ? new Intl.NumberFormat("en-IN", {
  //             style: "currency",
  //             currency: "INR",
  //           }).format(row.original?.amount)
  //         : "N/A"}
  //     </span>
  //   ),
  // },

  {
    accessorKey: "method",
    header: ({ column }) => <ColumnHeader column={column} title="Method" />,
    cell: ({ row }) => (
      <span className="truncate font-medium capitalize">
        {row.original.method || "N/A"}
      </span>
    ),
  },

  {
    accessorKey: "bankName",
    header: ({ column }) => <ColumnHeader column={column} title="Bank Name" />,
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.bankName || "N/A"}
      </span>
    ),
  },
   
  {
    accessorKey: "paymentProofUrl",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Payment Proof" />
    ),
    cell: ({ row }) =>
      row.original.paymentProofUrl ? (
        <Button
          onClick={() => window.open(row.original.paymentProofUrl, "_blank")}
          variant="link"
        >
          View
        </Button>
      ) : (
        <span className="truncate font-medium">N/A</span>
      ),
  },
{
    accessorKey: "description",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.description || "N/A"}
      </span>
    ),
    size: 250,
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
        <div className="flex flex-col leading-none">
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
      <span className="truncate font-medium">
        {row.original.createdAt
          ? moment(row.original.createdAt).format("MMM Do YY")
          : "N/A"}
      </span>
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
