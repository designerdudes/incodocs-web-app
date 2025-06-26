"use client";
import { ColumnDef } from "@tanstack/react-table";
import {  Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type Machine = {
  _id: string;
  machineId: string;
  machineName: string;
  machinePhoto: string;
  machineCost: number;
  currentComponent:{
    Name:string;
  },
  totalProcessed?: number;
  lastMaintenance: string;
  installedDate: string;
  review?: string; 
  factoryId: {
    _id: string;
    factoryName: string;
  };
  typeCutting: "Single Cutter" | "Multi Cutter" | "Rope Cutter";
  typePolish: "Auto Polishing" | "Line Polishing" | "Hand Polishing";
  isActive: boolean;
};

export const MachineDetailsColumns: ColumnDef<Machine>[] = [
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
    header: "Machine ID",
    cell: ({ row }) => <div>{row.original?.machineId}</div>,
  },
  {
    accessorKey: "machineName",
    header: "Machine Name",
    cell: ({ row }) => <div>{row.original?.machineName}</div>,
  },
  {
  header: "Material Type",
  cell: ({ row }) => {
    const { typeCutting, typePolish } = row.original;

    const materialTypes = [
      typeCutting && `Cutting: ${typeCutting}`,
      typePolish && `Polish: ${typePolish}`,
    ]
      .filter(Boolean)
      .join(" | ");

    return <div>{materialTypes}</div>;
  },
},
  {
    accessorKey: "machinePhoto",
    header: () => <div>Machine Photo</div>,
    cell: ({ row }) => {
      const photo = row.original.machinePhoto;

      // Log the photo URL or "N/A" based on validity
      if (photo && photo !== "N/A" && !photo.startsWith("data:image")) {
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
    accessorKey: "machineCost",
    header: "Machine Cost",
    cell: ({ row }) => <div>₹{row.original?.machineCost}</div>,
  },
  {
    accessorKey: "currentComponent",
    header: "Current Component",
    cell: ({ row }) => <div>{row.original?.currentComponent?.Name}</div>,
  },
  {
    accessorKey: "totalProcessed",
    header: "Blocks/Slabs Processed",
    cell: ({ row }) => <div>{row.original?.totalProcessed}</div>,
  },
  {
    accessorKey: "lastMaintenance",
    header: "Last Maintenance",
    cell: ({ row }) => (
      <div>{new Date(row.original?.lastMaintenance).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "installedDate",
    header: "Installed Date",
    cell: ({ row }) => (
      <div>{new Date(row.original?.installedDate).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "review",
    header: "Review",
    cell: ({ row }) => <div>{row.original?.review}</div>,
  },

  // {
  //   header: () => <Button variant="ghost">Action</Button>,

  //   id: "actions",
  //   cell: ({ row }) => <MachineDetailsCellAction data={row.original} />,
  // },
];
