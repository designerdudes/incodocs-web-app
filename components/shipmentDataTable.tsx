"use client";

import { useState, useId, useMemo, useRef, useEffect, CSSProperties } from "react";
import {
    Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
    ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  Download,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PinOffIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { subDays, startOfMonth, startOfYear, endOfMonth, endOfYear, subMonths, subYears } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Shipment } from "@/app/(routes)/[organizationId]/documentation/shipment/data/schema";

interface TanDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  searchKeys?: any;
  onDeleteRows?: (rows: Row<T>[]) => void;
  enableAddButton?: boolean;
  addButtonUrl: string;
  statusColumnName?: any;
  enableFilterByDate?: boolean;
}

function ShipmentDataTable<T>({
  data,
  columns,
  onDeleteRows,
  enableAddButton = false,
  addButtonUrl,
  searchKeys,
  statusColumnName,
  enableFilterByDate = false,
}: TanDataTableProps<T>) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: searchKeys[0], desc: false },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Date filter state
  const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date  }>({} as any);
  const [month, setMonth] = useState(new Date() as any);


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    filterFns: {
      dateRange: (row, columnId, filterValue) => {
        if (!filterValue?.from || !filterValue?.to) return true;
        const rowDate = new Date(row.getValue(columnId));
        const fromDate = new Date(filterValue.from);
        const toDate = new Date(filterValue.to);
    
        rowDate.setHours(0, 0, 0, 0);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
    
        console.log(`Row Date: ${rowDate}, From: ${fromDate}, To: ${toDate}, Match: ${rowDate >= fromDate && rowDate <= toDate}`);
        return rowDate >= fromDate && rowDate <= toDate;
      },
    },
  });

  useEffect(() => {
   table.setColumnPinning({
      left: ["ShipmentId"],
      right: ["actions"],
    });
    const filterValue = dateFilter.from && dateFilter.to ? dateFilter : undefined;
    table.getColumn("booking_date")?.setFilterValue(filterValue);
    console.log("Applied Date Filter:", filterValue);
    console.log("Filtered Rows:", table.getFilteredRowModel().rows.map(row => row.original));
  }, [dateFilter, table]);


  const getPinningStyles = (column: Column<Shipment>): CSSProperties => {
    const isPinned = column.getIsPinned()
    const isAction = column.id === "actions"
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" || isAction ? `${column.getAfter("right")}px` : undefined,
      
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    }
  }
  // Predefined date ranges
  const today = new Date();
  const yesterday = { from: subDays(today, 1), to: subDays(today, 1) };
  const last7Days = { from: subDays(today, 6), to: today };
  const last30Days = { from: subDays(today, 29), to: today };
  const monthToDate = { from: startOfMonth(today), to: today };
  const lastMonth = { from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) };
  const yearToDate = { from: startOfYear(today), to: today };
  const lastYear = { from: startOfYear(subYears(today, 1)), to: endOfYear(subYears(today, 1)) };


  


  const handleDeleteRows = () => {
    if (onDeleteRows) {
      onDeleteRows(table.getSelectedRowModel().rows);
    }
  };

  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn(statusColumnName);
    if (!statusColumn) return [];
    return Array.from(statusColumn.getFacetedUniqueValues().keys()).sort();
  }, [table.getColumn(statusColumnName)?.getFacetedUniqueValues()]);

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn(statusColumnName);
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn(statusColumnName)?.getFacetedUniqueValues()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn(statusColumnName)?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn(statusColumnName)?.getFilterValue()]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn(statusColumnName)?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];
    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }
    table
      .getColumn(statusColumnName)
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer w-[550px] ps-9",
                Boolean(table.getColumn(searchKeys[0])?.getFilterValue()) && "pe-9"
              )}
              value={(table.getColumn(searchKeys[0])?.getFilterValue() ?? "") as string}
              onChange={(e) =>
                table.getColumn(searchKeys[0])?.setFilterValue(e.target.value)
              }
              // placeholder={`Filter by ${searchKeys?.join(", ").replace("_", " ").replace(/_/g, " ")}`}
              placeholder="Filter by ShipmentID, Consignee Name, Invoice Number, Booking Number"
              type="text"
              aria-label={`Filter by ${searchKeys?.join(", ").replace("_", " ")}`}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn(searchKeys[0])?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn(searchKeys[0])?.setFilterValue("");
                  if (inputRef.current) inputRef.current.focus();
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                Status
                {selectedStatuses.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">Filters</div>
                <div className="space-y-3">
                  {uniqueStatusValues?.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedStatuses.includes(value)}
                        onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {value}{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {statusCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Filter */}
          {enableFilterByDate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                  Date
                  {dateFilter.from && (
                    <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                      {dateFilter.from.toLocaleDateString()} -{" "}
                      {dateFilter.to?.toLocaleDateString() || ""}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="rounded-md border">
                  <div className="flex max-sm:flex-col">
                    <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
                      <div className="h-full sm:border-e">
                        <div className="flex flex-col px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter({ from: today, to: today });
                              setMonth(today);
                            }}
                          >
                            Today
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter(yesterday);
                              setMonth(yesterday.to);
                            }}
                          >
                            Yesterday
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter(last7Days);
                              setMonth(last7Days.to);
                            }}
                          >
                            Last 7 days
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter(last30Days);
                              setMonth(last30Days.to);
                            }}
                          >
                            Last 30 days
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter(monthToDate);
                              setMonth(monthToDate.to);
                            }}
                          >
                            Month to date
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter(lastMonth);
                              setMonth(lastMonth.to);
                            }}
                          >
                            Last month
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter(yearToDate);
                              setMonth(yearToDate.to);
                            }}
                          >
                            Year to date
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              setDateFilter(lastYear);
                              setMonth(lastYear.to);
                            }}
                          >
                            Last year
                          </Button>
                          {dateFilter.from && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-red-500"
                              onClick={() => setDateFilter({})}
                            >
                              Clear Filter
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Calendar
                      mode="range"
                      selected={dateFilter as any}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDateFilter(newDate)
                        }
                      }}
                      month={month}
                      onMonthChange={setMonth}
                      className="p-2"
                      disabled={[
                        { after: today }, // Dates before today
                      ]}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                ?.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.id.replace(/_/g, " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          {table.getSelectedRowModel().rows?.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="m-auto" variant="outline">
                  <TrashIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                  Delete
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows?.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-auto">
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows?.length} selected{" "}
                      {table.getSelectedRowModel().rows?.length === 1 ? "row" : "rows"}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {enableAddButton && (
            <Button
              className="ml-auto"
              variant="outline"
              onClick={() => router.push(addButtonUrl)}
            >
              <PlusIcon className="-ms-1 opacity-60" size={16} />
              Add
            </Button>
          )}
          {
           <Popover>
           <PopoverTrigger asChild>
             <Button variant="outline">
               <Download className="-ms-1 opacity-60" size={16} aria-hidden="true" />
               Export
               {selectedStatuses.length > 0 && (
                 <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                   {selectedStatuses.length}
                 </span>
               )}
             </Button>
           </PopoverTrigger>
           <PopoverContent className="w-auto min-w-36 p-3" align="start">
             <div className="space-y-3">
               <div className="text-muted-foreground text-xs font-medium">Export</div>
               <div className="space-y-3">
                <Button
                onClick={() => {
                  // Implement CSV export logic here
                  console.log("Exporting data to CSV...");
                  const csvContent = [
                    columns.map((col) => col.header).join(","),
                    ...data.map((row) => columns.map((col) => row[col.accessorKey]).join(",")),
                  ].join("\n");
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.setAttribute("download", "shipment_data.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                >
                  Export in CSV
                </Button>
             
               </div>
             </div>
           </PopoverContent>
         </Popover>
          }
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups()?.map((headerGroup) => (
            //   <TableRow key={headerGroup.id} className="hover:bg-transparent">
            //     {headerGroup.headers?.map((header) => (
            //       <TableHead key={header.id} 
            //     //   style={{ width: `${header.getSize()}px` }}
            //     style={{ ...getPinningStyles(column) }}
            //     className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 relative h-10 truncate border-t data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
            //        >
            //         {header.isPlaceholder ? null : header.column.getCanSort() ? (
            //           <div
            //             className={cn(
            //               header.column.getCanSort() &&
            //               "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
            //             )}
            //             onClick={header.column.getToggleSortingHandler()}
            //             onKeyDown={(e) => {
            //               if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
            //                 e.preventDefault();
            //                 header.column.getToggleSortingHandler()?.(e);
            //               }
            //             }}
            //             tabIndex={header.column.getCanSort() ? 0 : undefined}
            //           >
            //             {flexRender(header.column.columnDef.header, header.getContext())}
            //             {{
            //               asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
            //               desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
            //             }[header.column.getIsSorted() as string] ?? null}
            //           </div>
            //         ) : (
            //           flexRender(header.column.columnDef.header, header.getContext())
            //         )}
            //       </TableHead>
            //     ))}
            //   </TableRow>
            <TableRow key={headerGroup.id} className="bg-muted">
              {headerGroup.headers.map((header) => {
                const { column } = header as any
                const isPinned = column.getIsPinned()
                const isLastLeftPinned =
                  isPinned === "left" && column.getIsLastColumn("left")
                const isFirstRightPinned =
                  isPinned === "right" && column.getIsFirstColumn("right")

                return (
                  <TableHead
                    key={header.id}
                    className="[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-muted/90 relative h-10 truncate border-t [&[data-pinned]]:backdrop-blur-sm [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-1 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
                    colSpan={header.colSpan}
                    style={{ ...getPinningStyles(column) }}
                    data-pinned={isPinned || undefined}
                    data-last-col={
                      isLastLeftPinned
                        ? "left"
                        : isFirstRightPinned
                          ? "right"
                          : undefined
                    }
                  >
                  {/* {table.getColumn("select") && (
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={headerGroup.getIsAllColumnsVisible()}
                        onCheckedChange={(value: any) =>
                          headerGroup.toggleAllColumnsVisible(!!value)
                        }
                        aria-label="Select all"
                      />
                    </div>
                    )} */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      {/* Pin/Unpin column controls with enhanced accessibility */}
                      {!header.isPlaceholder &&
                        header.column.getCanPin() && 
                        (header.column.getIsPinned() ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="-mr-1 size-7 shadow-none"
                            onClick={() => header.column.pin(false)}
                            aria-label={`Unpin ${header.column.columnDef.header as string} column`}
                            title={`Unpin ${header.column.columnDef.header as string} column`}
                          >
                            <PinOffIcon
                              className="opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="-mr-1 size-7 shadow-none"
                                aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
                                title={`Pin options for ${header.column.columnDef.header as string} column`}
                              >
                                <EllipsisIcon
                                  className="opacity-60"
                                  size={16}
                                  aria-hidden="true"
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => header.column.pin("left")}
                              >
                                <ArrowLeftToLineIcon
                                  size={16}
                                  className="opacity-60"
                                  aria-hidden="true"
                                />
                                Stick to left
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => header.column.pin("right")}
                              >
                                <ArrowRightToLineIcon
                                  size={16}
                                  className="opacity-60"
                                  aria-hidden="true"
                                />
                                Stick to right
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ))}
                      {header.column.getCanResize() && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className:
                              "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                          }}
                        />
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
            ))}
          </TableHeader>
          {/* <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows?.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells()?.map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody> */}
          <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell as any
                  const isPinned = column.getIsPinned()
                  const isLastLeftPinned =
                    isPinned === "left" && column.getIsLastColumn("left")
                  const isFirstRightPinned =
                    isPinned === "right" && column.getIsFirstColumn("right")

                  return (
                    <TableCell
                      key={cell.id}
                      className="[&[data-pinned][data-last-col]]:border-border [&[data-pinned]]:bg-background/90 [&[data-pinned]]:backdrop-blur-sm  [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l"
                      style={
                        column.id === "ShipmentId" ?
                        //pin it to left 
                        { 
                          left: `${column.getStart("left")}px`

                      } :
                        //pin it to right
                        column.id === "actions" ?
                        { right: `${column.getAfter("right")}px` } :
                        //default

                        { 
                      
                        ...getPinningStyles(column)

                       }}
                      data-pinned={isPinned || undefined}
                      data-last-col={
                        isLastLeftPinned
                          ? "left"
                          : isFirstRightPinned
                            ? "right"
                            : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50]?.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
            <span className="text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of <span className="text-foreground">{table.getRowCount().toString()}</span>
          </p>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default ShipmentDataTable;