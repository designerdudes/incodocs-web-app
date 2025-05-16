"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import CellAction from "./expensesCell-Action"
import { expense } from "../page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const expensecolumns: ColumnDef<expense>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
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
        accessorKey: "expenseName", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Expense Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.expenseName}
            </div>
        ),
    },
    {
        accessorKey: "expenseValue", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Expense Value
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {
                    new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 0,

                    }).format(row?.original?.expenseValue as any)

                }
            </div>
        ),
    },
    {
        accessorKey: "gstPercentage", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                GST Percentage
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {row.original.gstPercentage}%
            </div>
        ),
    },
    {
        accessorKey: "paidBy",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Paid By
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize flex items-center gap-2 ">

                {row.original.paidBy && <Avatar className="h-6 w-6">
                    <AvatarImage
                        src={row.original.paidBy || ""}
                        alt={row.original.paidBy || "Unknown"}
                    />
                    <AvatarFallback>
                        {row.original.paidBy?.charAt(0) || ""}
                    </AvatarFallback>
                </Avatar>}
                {row.original.paidBy}
            </div>

        ),
    },
    {
        accessorKey: "purchasedBy", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Purchased By
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize flex items-center gap-2 ">

                {row.original.purchasedBy && <Avatar className="h-6 w-6">
                    <AvatarImage
                        src={row.original.purchasedBy || ""}
                        alt={row.original.purchasedBy || "Unknown"}
                    />
                    <AvatarFallback>
                        {row.original.purchasedBy?.charAt(0) || ""}
                    </AvatarFallback>
                </Avatar>}
                {row.original.purchasedBy}
            </div>

        ),
    },
    {
        accessorKey: "paymentProof", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Payment Proof
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize flex items-center justify-center gap-2 ">
            {row.original.paymentProof &&    <Button size={"icon"} variant="outline"
            onClick={() => window.open(row.original.paymentProof, "_blank")}
            ><Eye className="h-4 w-4" /></Button>}
            </div>

        ),
    },
    {
        accessorKey: "expenseDate", // ✅ Correct key
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Expense Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">
                {new Date(row.original.expenseDate).toLocaleDateString()}
            </div>
        ),
    },
    {
        header: "Action",
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
