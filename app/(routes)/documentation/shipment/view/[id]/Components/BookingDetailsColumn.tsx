"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Shipment } from "../../../data/schema";

export const BookingDetailsColumn: ColumnDef<Shipment>[] = [
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
    accessorKey: "Container Number",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Container Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {shipmentData?.bookingDetails?.ContainerNumber}
      </div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "Truck Number",
    header:({column}) =>(
      <Button
      variant="ghost"
      onClick={() =>column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Truck Number
      <ArrowUpDown className="ml-2 h-4 w-4"/>
      </Button>
    ),
    cell: ({ row }) =>(
      <div className="capitalize">
        { shipmentData?.bookingDetails?.TruckName}

      </div>
    )
  },
  {
    accessorKey: "Truck Driver Number",
    header:({column}) =>(
      <Button
      variant="ghost"
      onClick={() =>column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Truck Driver Number
      <ArrowUpDown className="ml-2 h-4 w-4"/>
      </Button>
    ),
    cell: ({ row }) =>(
      <div className="capitalize">
        { shipmentData?.bookingDetails?.TruckDriverName}

      </div>
    )
  }
  
];
