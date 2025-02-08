"use client";
import * as React from "react";
import * as z from "zod";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { DataTablePagination } from "./data-table-pagination";
import toast from "react-hot-toast";
import { deleteAllData, putData } from "@/axiosUtility/api";
import { Alert } from "../forms/Alert";
import { useGlobalModal } from "@/hooks/GlobalModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Icons } from "./icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  trim: z.object({
    length: z.object({
      value: z
        .number()
        .positive({ message: "Length must be greater than zero" }),
      units: z.literal("inch"),
    }),
    height: z.object({
      value: z
        .number()
        .positive({ message: "Height must be greater than zero" }),
      units: z.literal("inch"),
    }),
  }),
  status: z.literal("polished"),
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  bulkDeleteIdName?: string;
  bulkDeleteTitle?: string;
  bulkDeleteDescription?: string;
  bulkDeleteToastMessage?: string;
  deleteRoute?: string;
  tab?: string; // New prop to determine the active tab
  bulkPolishTitle?: string;
  bulkPOlishDescription?: string;
  bulkPolishIdName?: string;
  updateRoute?: string;
  bulkPolisToastMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  bulkDeleteIdName,
  bulkDeleteTitle,
  bulkDeleteDescription,
  bulkDeleteToastMessage,
  deleteRoute,
  tab, // Get the tab name from props
  bulkPolishTitle,
  bulkPOlishDescription,
  bulkPolishIdName,
  updateRoute,
  bulkPolisToastMessage,
}: DataTableProps<TData, TValue>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trim: {
        height: { value: 0, units: "inch" },
        length: { value: 0, units: "inch" },
      },
      status: "polished",
    },
  });

  const modal = useGlobalModal();

  const handleBulkDelete = async () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row: any) => row.original[bulkDeleteIdName as string]);

    if (selectedIds.length === 0) {
      toast.error("No product selected for deletion.");
      return;
    }

    try {
      await deleteAllData(deleteRoute as string, { ids: selectedIds });

      toast.success(
        bulkDeleteToastMessage ?? "Selected product deleted successfully"
      );

      // Clear selection after deletion
      table.resetRowSelection();

      // Refresh data (optional, better to use state update)
      window.location.reload();

      modal.onClose();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Error deleting data. Please try again.");
    }
  };

  const handleBulkPolish = async (values: z.infer<typeof formSchema>) => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row: any) => row.original[bulkPolishIdName as string]);

    if (selectedIds.length === 0) {
      toast.error("No slabs selected to polish.");
      return;
    }

    // Ensure values are passed correctly
    // console.log("Form Values:", values);
    // console.log("Selected IDs:", selectedIds);

    try {
      const res = await putData(updateRoute as string, {
        ids: selectedIds, // ✅ Correct key name
        ...values,
      });
      // console.log(res)
      toast.success(
        bulkPolisToastMessage ?? "Selected slabs marked as polished!"
      );

      // Clear selection after polishing
      table.resetRowSelection();

      // Refresh data (if needed, but state update is preferable)
      window.location.reload();

      modal.onClose();
    } catch (error: any) {
      console.error("Error marking slabs as polished:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      toast.error("Error processing request. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="relative max-w-sm w-full flex items-center">
          <Search className="h-4 absolute right-2 text-gray-500" />
          <Input
            placeholder={`Search by ${searchKey}`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              console.log("Search Input:", event.target.value); // Debug input
              table.getColumn(searchKey)?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {/* Add the 'fixed' class to the last column header */}
                      {index === columns.length - 1 && (
                        <div className="fixed" />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="h-fit py-2 text-sm" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span className="ml-2  text-sm font-semibold text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </span>
          )}
          {table.getFilteredSelectedRowModel().rows.length > 1 && (
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => table.toggleAllPageRowsSelected()}
            >
              Clear Selection
            </Button>
          )}

          {table.getFilteredSelectedRowModel().rows.length > 1 && (
            <Button
              variant="destructive"
              className="ml-2"
              onClick={() => {
                modal.title = bulkDeleteTitle ?? "Delete Selected Slabs?";
                modal.description =
                  bulkDeleteDescription ??
                  "Are you sure you want to delete these slabs? This action cannot be undone.";
                modal.children = (
                  <Alert onConfirm={handleBulkDelete} actionType="delete" />
                );
                modal.onOpen();
              }}
            >
              Delete Selected
            </Button>
          )}

          {tab === "inPolishing" &&
            table.getFilteredSelectedRowModel().rows.length > 1 && (
              <Button
                variant="destructive"
                className="ml-2 hover:bg-green-400 bg-green-500"
                onClick={() => {
                  modal.title = bulkPolishTitle ?? "Polish Selected Slabs?";
                  modal.description =
                    bulkPOlishDescription ??
                    "Are you sure you want to polish these slabs? This action cannot be undone.";

                  modal.children = (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleBulkPolish)}
                        className="grid gap-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {/* Height Input */}
                          <FormField
                            control={form.control}
                            name="trim.height.value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height (inches)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Eg: 54"
                                    type="number"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* Length Input */}
                          <FormField
                            control={form.control}
                            name="trim.length.value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Length (inches)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Eg: 120"
                                    type="number"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Submit
                        </Button>
                      </form>
                    </Form>
                  );

                  modal.onOpen();
                }}
              >
                Mark Polished
              </Button>
            )}
        </div>
        <div>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
