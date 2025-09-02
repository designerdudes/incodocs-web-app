"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cellActions";

export type Employee = {
  _id: string;
  fullName: string;
  employeeId: string;
  email: string;
  mobileNumber: number;
  role: string;
  designation: string;
  teamMemberPhoto:string;
  isVerified: boolean;
  address: {
    location: string;
    pincode: number;
  }; 
  profileImg: string;
  ownedOrganizations: string[];
  memberInOrganizations: Organization[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
interface Organization {
  _id: string;
  name: string;
  prefix: string;
  description: string;
  owner: string;
  members: string[];
  address: {
    location: string;
    pincode: number;
  };
  shipments: string[];
  factory: string[];
  employees: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  productIds: string[];
}

export const columns: ColumnDef<Employee>[] = [
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
    accessorKey: "employeeId", // Corrected key
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Employee Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original?.employeeId}</div>
    ),
  },
  {
    accessorKey: "teamMemberName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Employee Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original?.fullName}</div>
    ),
  },
  {
      accessorKey: "teamMemberPhoto",
      header: () => <div>Team member Photo</div>,
      cell: ({ row }) => {
        const photo = row.original.teamMemberPhoto;
  
        return photo && photo !== "N/A" && !photo.startsWith("data:image") ? (
          <div className="flex gap-2">
            <Eye
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                window.open(photo, "_blank");
              }}
              aria-label={`View photo for ${row.original.teamMemberPhoto || "Teammember"
                }`}
            />
          </div>
        ) : (
          <div>N/A</div>
        );
      },
    },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Phone Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original?.mobileNumber}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original?.email}
      </div>
    ),
  },
  {
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
