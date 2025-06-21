"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellActions from "./cell-actions";


export interface Machine {
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
    cell: ({ row }) => (
      <div>{row.original.machineName  || "N/A"}</div>
    ),
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
      const photo =
        row.original.machinePhoto;
      
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
            aria-label={`View photo for ${row.original.machinePhoto ||
              "machine"}`}
          />
        </div>
      ) : (
        <div>N/A</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Created At</div>,
    cell: ({ row }) => (
      <div>
        {row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
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