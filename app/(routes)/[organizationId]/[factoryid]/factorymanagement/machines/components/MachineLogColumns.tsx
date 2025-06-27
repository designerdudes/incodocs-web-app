"use client";

import { ColumnDef } from "@tanstack/react-table";
import ViewAllComponent from "./viewAllComponent";
import { JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";



export interface MachineLog {
  _id: string;
  machineId: { machineName: string };
  componentType: string;
  componentId: {
    _id: string;
    ID: string;
    Name: string;
    createdDate: string;
    expired: boolean;
  };
  componetCost: number;
  workerName: string;
  createdBy: {
    fullName:string;
  };
  replacedAt: string;
  sqfProcessed: number;
  otherExpenses: {
    expenseName: string;
    expenseCost: number;
    _id: string;
  }[];
  review: string;
  createdAt: string;
}

export const MachineLogColumns: ColumnDef<MachineLog>[] = [
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
  accessorKey: "createdAt",
  header: "Created At",
  cell: ({ row }) => {
    const date = new Date(row.original.createdAt);
    return (
      <div>
        {new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date)}
      </div>
    );
  },
},
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => <div>{row.original?.createdBy?.fullName}</div>,
  },
  {
    accessorKey: "viewComponentDetails",
    header: "Component Details",
    cell: ({ row }) => {
      const component = row.original.componentId;

      const jsxData = (
        <div className="mb-4 border-b pb-2">
          <div className="text-sm text-gray-800 space-y-1">
            <div>
              <strong> Component ID:</strong> {component?.ID || "N/A"}
            </div>
            <div>
              <strong> Replaced At:</strong>{" "}
              {row.original?.replacedAt
                ? new Date(row.original.replacedAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "N/A"}
            </div>

            <div>
              <strong> Replaced By:</strong>{" "}
              {row.original?.workerName || "N/A"}
            </div>
            <div>
              <strong> Component Cost:</strong>{" "}
              {row.original?.componetCost != null
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(row.original.componetCost)
                : "N/A"}
            </div>
            <div>
              <strong> Expected SQFT:</strong>{" "}
              {row.original?.sqfProcessed != null
                ? `${row.original.sqfProcessed.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ft²`
                : "N/A"}
            </div>
            <div>
              <strong> Status:</strong>{" "}
              <span
                className={
                  component?.expired ? "text-red-600" : "text-green-600"
                }
              >
                {component?.expired ? "Replaced" : "Active"}
              </span>
            </div>
          </div>
        </div>
      );

      return (
        <ViewAllComponent
          title="Component Details"
          params={{ machineId: row.original._id }}
          data={jsxData}
          setIsFetching={() => {}}
          setIsLoading={() => {}}
        />
      );
    },
  },
 {
  accessorKey: "otherExpenses",
  header: "Other Expenses",
  cell: ({ row }) => {
    const expenses = row.original.otherExpenses || [];

    const jsxData = (
      <div className="space-y-2 text-sm text-gray-800">
        {expenses.length > 0 ? (
          expenses.map((exp) => (
            <div key={exp._id} className="border-b pb-1">
              <div>
                <strong> Expense Name:</strong> {exp.expenseName}
              </div>
              <div>
                <strong> Cost:</strong>{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(exp.expenseCost)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">No expenses</div>
        )}
      </div>
    );

    return (
      <ViewAllComponent
        title="Other Expenses"
        params={{ machineId: row.original._id }}
        data={jsxData}
        setIsFetching={() => {}}
        setIsLoading={() => {}}
      />
    );
  },
},

  {
    accessorKey: "review",
    header: "Review",
    cell: ({ row }) => <div>{row.original.review}</div>,
  },
];
