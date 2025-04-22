"use client";
import { Column, ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnHeader } from "./column-header";
import moment from "moment";
import { DataTableCellActions } from "./cell-actions";
import { Copy, Eye } from "lucide-react";
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
    accessorKey: "ShipmentId",
    header: ({ column }) => <ColumnHeader column={column} title="Shipment ID" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="truncate font-medium">{row.original.shipmentId || "N/A"}</span>
    { row.original.shipmentId &&   <Copy
          className="h-3 w-3 text-gray-500 cursor-pointer hover:text-blue-700"
          onClick={() => navigator.clipboard.writeText(row.original.shipmentId)}
        />}
      </div>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "Invoice Number",
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
    accessorKey: "Consignee",
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
    size: 300,
  },
  {
    accessorKey: "Description of goods",
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
    accessorKey: "BL Number",
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
    accessorKey: "Container Numbers",
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
         {   row.original.bookingDetails.containers[0]?.containerNumber}
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
    accessorKey: "Truck Number",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Truck Number" />
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
         {   row.original.bookingDetails.containers[0]?.truckNumber}
         {/* <Button variant="link" className="text-blue-500 pl-3 hover:text-blue-700">
         View All
          </Button> */}
          <ViewAllComponent
          params={{ organizationId: "your-organization-id" }}
          data={ row.original.bookingDetails.containers
            .map((container) => container.truckNumber)
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
    accessorKey: "Port Of Loading",
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
    accessorKey: "Destination Port",
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
    accessorKey: "Commercial Invoices Value",
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
    accessorKey: "Actual Invoice Value",
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
    accessorKey: "Booking Number",
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
    accessorKey: "Vessel Sailing Date",
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
    accessorKey: "Vessel Arriving Date",
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
    accessorKey: "Transporter Name",
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
    accessorKey: "Forwarder Name",
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
    accessorKey: "Shipping Line Invoices",
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
    accessorKey: "Port Code",
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
    accessorKey: "CB Name",
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
    accessorKey: "Shipping Bills",
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
    accessorKey: "Supplier Name",
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
    accessorKey: "Supplier Invoice Number",
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
    accessorKey: "Actual Buyer",
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
    accessorKey: "BL Date",
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
    accessorKey: "Other Documents",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Other Documents" />
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
    accessorKey: "createdBy",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
        {row.original?.createdBy
            ? row.original?.createdBy
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
        {row.original.createdAt
            ? moment(row.original.createdAt).format("MMM Do YY")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => <ColumnHeader column={column} title="Action" />,
    cell: ({ row }) => <DataTableCellActions row={row} />,
    size: 70,
    enablePinning: false,
  },
];