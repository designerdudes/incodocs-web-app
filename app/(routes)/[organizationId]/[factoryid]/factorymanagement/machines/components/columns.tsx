"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellActions from "./cell-actions";

export interface Machine {
  _id: string;
  machineName: string;
  machineId: string;
  factoryId: string; // Assuming it's the ObjectId as a string
  typeCutting: "Single Cutter" | "Multi Cutter" | "Rope Cutter";
  typePolish: "Auto Polishing" | "Line Polishing" | "Hand Polishing";
  machinePhoto: string;
  isActive: boolean;
  lastMaintenance?: string; // ISO string format for dates
  machineCost: number;
  installedDate?: string; // ISO string format for dates
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const MachineColumns: ColumnDef<Machine>[] = [
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
    accessorKey: "machineId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        MachineID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.machineId}</div>
    ),
  },
  {
    accessorKey: "machineName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Machine Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.machineName || "N/A"}</div>,
  },
  {
    accessorKey: "machineType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Machine Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { typeCutting, typePolish } = row.original;
      const types = [typeCutting, typePolish].filter(Boolean).join(" / ");
      return <div>{types || "N/A"}</div>;
    },
  },

  {
    accessorKey: "machinePhoto",
    header: () => <div>Machine Photo</div>,
    cell: ({ row }) => {
      const photo = row.original.machinePhoto;

      // Log the photo URL or "N/A" based on validity
      if (photo && photo !== "N/A" && !photo.startsWith("data:image")) {
        console.log("machine Photo URL:", photo);
      } else {
        console.log("machine Photo URL: N/A");
      }

      return photo && photo !== "N/A" && !photo.startsWith("data:image") ? (
        <div className="flex gap-2">
          <Eye
            className="h-4 w-4 cursor-pointer"
            onClick={() => {
              window.open(photo, "_blank");
            }}
            aria-label={`View photo for ${
              row.original.machinePhoto || "machine"
            }`}
          />
        </div>
      ) : (
        <div>N/A</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Machine Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const isActive = row.original?.isActive;

      return (
        <div className="capitalize">
          {isActive === true
            ? "Active"
            : isActive === false
            ? "Inactive"
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "installedDate",
    header: () => <div>Installed Date</div>,
    cell: ({ row }) => (
      <div>
        {row.original.installedDate
          ? new Date(row.original.installedDate).toLocaleDateString()
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "lastMaintenance",
    header: () => <div>Last Maintenance</div>,
    cell: ({ row }) => (
      <div>
        {row.original.lastMaintenance
          ? new Date(row.original.lastMaintenance).toLocaleDateString()
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
