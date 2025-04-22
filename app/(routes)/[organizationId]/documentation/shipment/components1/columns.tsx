"use client";
import { Column, ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnHeader } from "./column-header";
import moment from "moment";
import { DataTableCellActions } from "./cell-actions";
import { Eye } from "lucide-react";
import { Shipment } from "../data/schema";
import { Button } from "@/components/ui/button";
import ViewAllComponent from "./viewAllComponent";
import { CSSProperties } from "react";

const multiColumnFilterFn: FilterFn<Shipment> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.shipmentId} ${row.original.bookingDetails?.invoiceNumber} ${row.original.saleInvoiceDetails?.consignee?.name} ${row.original.blDetails?.blNumber} ${row.original.bookingDetails?.containers.map(
      (container) => container.containerNumber 
    )}
    ${row.original.bookingDetails?.portOfLoading} ${row.original.bookingDetails?.destinationPort} ${row.original.saleInvoiceDetails?.commercialInvoices?.commercialInvoiceNumber} ${row.original.supplierDetails?.clearance?.supplierName?.supplierName || row.original.supplierDetails?.actual?.actualSupplierName} ${row.original.bookingDetails?.bookingNumber} ${row.original.shippingDetails?.transporterName?.transporterName} ${row.original.shippingDetails?.forwarderName?.forwarderName} ${row.original.shippingBillDetails?.portCode} ${row.original.shippingBillDetails?.cbName} ${row.original.shippingBillDetails?.ShippingBills.map(
      (bill) => bill.shippingBillNumber
    )} ${row.original.supplierDetails?.clearance?.supplierName?.supplierName || row.original.supplierDetails?.actual?.actualSupplierName} ${row.original.saleInvoiceDetails?.actualBuyer}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn: FilterFn<Shipment> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const getPinningStyles = (column: Column<Shipment>): CSSProperties => {
  const isPinned = column.getIsPinned()
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

export const columns: ColumnDef<Shipment>[] = [
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
    accessorKey: "shipmentId",
    header: ({ column }) => <ColumnHeader column={column} title="Shipment ID" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">{row.original.shipmentId}</span>
      </div>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "bookingDetails.invoiceNumber",
    // header: ({ column }) => (
    //   <ColumnHeader column={column} title=" Invoice Number" />
    // ),
    header: "Invoice Number",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.invoiceNumber || "N/A"}
        </span>
      </div>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "saleInvoiceDetails.consignee",
    // header: ({ column }) => (
    //   <ColumnHeader column={column} title="Consignee Name" />
    // ),
    header: "Consignee Name",

    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.saleInvoiceDetails?.consignee?.name || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "saleInvoiceDetails.DescriptionofGoods",
    // header: ({ column }) => (
    //   <ColumnHeader column={column} title="Description of Goods" />
    // ),
    header: "Description of Goods",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.saleInvoiceDetails?.consignee?.name || "N/A"}
        </span>
      </div>
    ),
    size: 300,
    
  },
  {
    accessorKey: "blDetails.blNumber",
    header: ({ column }) => <ColumnHeader column={column} title="BL Number" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.blDetails?.blNumber || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "bookingDetails.containers",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Container Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {/* {row.original.bookingDetails?.containers?.length > 0
            ? row.original.bookingDetails.containers
              .map((container) => container.containerNumber)
              .join(", ")
            : "N/A"} */}
          {row.original.bookingDetails?.containers?.length > 0
            ? <>
         {   row.original.bookingDetails.containers[1]?.containerNumber}
         {/* <Button variant="link" className="text-blue-500 pl-3 hover:text-blue-700">
         View All
          </Button> */}
          <ViewAllComponent
          params={{ organizationId: "your-organization-id" }}
          data={ row.original.bookingDetails.containers
            .map((container) => container.containerNumber)
            .join(", ")}
          setIsFetching={() => {}}
          setIsLoading={() => {}}
          />
            </>
            : "N/A"}
        </span>
      </div>
    ),
    filterFn: multiColumnFilterFn,
    size: 200,
  },
  {
    accessorKey: "bookingDetails.portOfLoading",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Port of Loading" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.portOfLoading || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "bookingDetails.destinationPort",
    header: ({ column }) => (
      <ColumnHeader column={column} title=" Port Of Destination " />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.destinationPort || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "saleInvoiceDetails.commercialInvoicesValue",
    header: ({ column }) => (
      <ColumnHeader column={column} title=" Invoice Value " />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.saleInvoiceDetails?.commercialInvoices
            ?.commercialInvoiceNumber || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "supplierDetails.Actualinvoicevalue",
    header: ({ column }) => (
      <ColumnHeader column={column} title=" Actual invoice value" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.supplierDetails?.clearance?.supplierName?.supplierName ||
            row.original.supplierDetails?.actual?.actualSupplierName ||
            "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "bookingDetails.bookingNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Booking Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.bookingNumber || "N/A"}
        </span>
      </div>
    ),
  },

 


  {
    accessorKey: "bookingDetails.vesselSailingDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Vessel Sailing Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.vesselSailingDate
            ? moment(row.original.bookingDetails.vesselSailingDate).format(
              "MMM Do YY"
            )
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "bookingDetails.vesselArrivingDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Vessel Arriving Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.vesselArrivingDate
            ? moment(row.original.bookingDetails.vesselArrivingDate).format(
              "MMM Do YY"
            )
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shippingDetails.transporterName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Transporter Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.shippingDetails?.transporterName?.transporterName ||
            "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shippingDetails.forwarderName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Forwarder Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.shippingDetails?.forwarderName?.forwarderName || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shippingDetails.shippingLineInvoices",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipping Line Invoice" />
    ),
    cell: ({ row }) => {
      const fileUrl =
        row.original.shippingDetails?.shippingLineInvoices?.length > 0
          ? row.original.shippingDetails.shippingLineInvoices[0].uploadInvoiceUrl
          : null;
      return (
        <div className="flex items-center space-x-2">
          <span className="truncate font-medium">
            {fileUrl || "No Invoice"}
          </span>
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Eye className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700" />
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "shippingBillDetails.portCode",
    header: ({ column }) => <ColumnHeader column={column} title="Port Code" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.shippingBillDetails?.portCode || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shippingBillDetails.cbName",
    header: ({ column }) => <ColumnHeader column={column} title="CB Name" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.shippingBillDetails?.cbName || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shippingBillDetails.ShippingBills",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipping Bill Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.shippingBillDetails?.ShippingBills?.length > 0
            ? row.original.shippingBillDetails.ShippingBills.map(
              (bill) => bill.shippingBillNumber
            ).join(", ")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "supplierDetails.clearance",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.supplierDetails?.clearance?.supplierName?.supplierName ||
            row.original.supplierDetails?.actual?.actualSupplierName ||
            "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "supplierDetails.clearance.invoices",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier Invoice Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.supplierDetails?.clearance?.invoices?.length > 0
            ? row.original.supplierDetails.clearance.invoices[0]
              .supplierInvoiceNumber
            : "N/A"}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "saleInvoiceDetails.actualBuyer",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Actual Buyer" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.saleInvoiceDetails?.actualBuyer || "N/A"}
        </span>
      </div>
    ),
  },


  {
    accessorKey: "blDetails.blDate",
    header: ({ column }) => <ColumnHeader column={column} title="BL Date" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.blDetails?.blDate
            ? moment(row.original.blDetails.blDate).format("MMM Do YY")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "otherDetails",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Certificate Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.otherDetails?.length > 0
            ? row.original.otherDetails[0].certificateNumber || "N/A"
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => <ColumnHeader column={column} title="Action" />,
    cell: ({ row }) => <DataTableCellActions row={row} />,
  },
];