"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnHeader } from "./column-header";
import moment from "moment";
import { DataTableCellActions } from "./cell-actions";
import { Eye } from "lucide-react";
import { Shipment } from "../data/schema";

export const columns: ColumnDef<Shipment>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
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
    accessorKey: "bookingDetails.containers",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Container Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.containers?.length > 0
            ? row.original.bookingDetails.containers
              .map((container) => container.containerNumber)
              .join(", ")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "bookingDetails.containers",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Truck Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.containers?.length > 0
            ? row.original.bookingDetails.containers
              .map((container) => container.truckNumber)
              .join(", ")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "bookingDetails.containers",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Truck Driver Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.bookingDetails?.containers?.length > 0
            ? row.original.bookingDetails.containers
              .map((container) => container.truckDriverContactNumber)
              .join(", ")
            : "N/A"}
        </span>
      </div>
    ),
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
      <ColumnHeader column={column} title="Destination Port" />
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
    accessorKey: "shippingBillDetails.ShippingBills",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipping Bill Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.shippingBillDetails?.ShippingBills?.length > 0
            ? row.original.shippingBillDetails.ShippingBills.map((bill) =>
              moment(bill.shippingBillDate).format("MMM Do YY")
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
    accessorKey: "saleInvoiceDetails.consignee",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Consignee Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.saleInvoiceDetails?.consignee?.name || "N/A"}
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
    accessorKey: "saleInvoiceDetails.commercialInvoices",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Commercial Invoice Number" />
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