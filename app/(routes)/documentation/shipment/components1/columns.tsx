"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnHeader } from "./column-header";
import moment from "moment";
import { shipment } from "../data/schema";
import { DataTableCellActions } from "./cell-actions";
import { Eye } from "lucide-react";

export const columns: ColumnDef<shipment>[] = [
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
    accessorKey: "bookingDetailsSchema.containerNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Container Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.bookingDetails?.containerNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Truck Number",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Truck Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.bookingDetails?.truckNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Truck Driver Number",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Truck Driver Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.bookingDetails?.truckDriverNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "bookingDetailsSchema.destinationPort",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Destination Port" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original.bookingDetails?.destinationPort}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "bookingDetailsSchema.portOfLoading",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Port Of Loading" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original.bookingDetails?.portOfLoading}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Vessel Sailing Date",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Vessel Sailing Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
          
            {moment(row.original?.bookingDetails?.vesselSailingDate).format(
              "MMM Do YY"
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "vessel Arriving Date",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Vessel Arriving Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {moment(row.original?.bookingDetails?.vesselArrivingDate).format(
              "MMM Do YY"
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "shippingLine",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipping Line" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.shippingDetails?.shippingLine}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "forwarder",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Forwarder Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.shippingDetails?.forwarder}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "forwarderInvoice",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Forwarder Invoice" />
    ),
    cell: ({ row }) => {
        const fileUrl = row.original?.shippingDetails?.forwarderInvoice;

        return (
          <div className="flex items-center space-x-2">
            <span className="truncate font-medium">{fileUrl}</span>
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
    accessorKey: "valueOfForwarderInvoice",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Value Of Forwarder Invoice " />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.shippingDetails?.valueOfForwarderInvoice}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "transporter",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Transporter" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.shippingDetails?.transporter}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "transporterInvoice",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Transporter Invoice" />
    ),
    cell: ({ row }) => {
        const fileUrl = row.original?.shippingDetails?.transporterInvoice;

        return (
          <div className="flex items-center space-x-2">
            <span className="truncate font-medium">{fileUrl}</span>
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
    accessorKey: "valueOfTransporterInvoice",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Value Of Transporter Invoice" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.shippingDetails?.valueOfTransporterInvoice}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "shippingBillNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipping Bill Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.shippingBillDetails?.shippingBillNumber}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "shippingBillDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipping Bill Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {moment(row.original?.shippingBillDetails?.shippingBillDate).format(
              "MMM Do YY"
            )}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "uploadShippingBill",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Upload Shipping Bill" />
    ),
    cell: ({ row }) => {
        const fileUrl = row.original?.shippingBillDetails?.uploadShippingBill;

        return (
          <div className="flex items-center space-x-2">
            <span className="truncate font-medium">{fileUrl}</span>
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
    accessorKey: "supplierName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier Name " />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.supplierName}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "actualSupplierName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Actual Supplier Name " />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.actualSupplierName}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "supplierGSTIN",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier GSTIN " />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.supplierGSTIN}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "supplierInvoiceNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier Invoice Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.supplierInvoiceNumber}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "supplierInvoiceDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier Invoice Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
          
            {moment(row.original?.supplierDetails?.supplierInvoiceDate).format(
              "MMM Do YY"
            )}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "supplierInvoiceValueWithOutGST",
    header: ({ column }) => (
      <ColumnHeader
        column={column}
        title="Supplier Invoice Value WithOut GST "
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.supplierInvoiceValueWithOutGST}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "supplierInvoiceValueWithGST",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier Invoice Value With GST " />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.supplierInvoiceValueWithOutGST}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "uploadSupplierInvoice",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Upload Supplier Invoice" />
    ),
    cell: ({ row }) => {
        const fileUrl = row.original?.supplierDetails?.uploadSupplierInvoice;

        return (
          <div className="flex items-center space-x-2">
            <span className="truncate font-medium">{fileUrl}</span>
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
    accessorKey: "actualSupplierInvoice",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Actual Supplier Invoice" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.actualSupplierInvoice}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actualSupplierInvoiceValue",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Actual Supplier Invoice Value" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.supplierDetails?.actualSupplierInvoiceValue}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "commercialInvoiceNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Commercial Invoice Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.saleInvoiceDetails?.commercialInvoiceNumber}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "commercialInvoiceDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Commercial Invoice Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
          
          {moment(row.original?.saleInvoiceDetails?.commercialInvoiceDate).format(
              "MMM Do YY"
            )}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "commercialInvoice",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Commercial Invoice" />
    ),
    cell: ({ row }) => {
        const fileUrl = row.original?.saleInvoiceDetails?.commercialInvoice;

        return (
          <div className="flex items-center space-x-2">
            <span className="truncate font-medium">{fileUrl}</span>
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
    accessorKey: "consigneeDetails",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Consignee Details" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.saleInvoiceDetails?.consigneeDetails}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actualBuyer",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Actual Buyer" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.saleInvoiceDetails?.actualBuyer}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "blNumber",
    header: ({ column }) => <ColumnHeader column={column} title="BL Number" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            {row.original?.blDetails?.blNumber}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "blDate",
    header: ({ column }) => <ColumnHeader column={column} title="BL Date" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            
            {moment(row.original?.blDetails?.blDate).format(
              "MMM Do YY"
            )}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "telexDate",
    header: ({ column }) => <ColumnHeader column={column} title="Telex Date" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className=" truncate font-medium">
            
            {moment(row.original?.blDetails?.telexDate).format(
              "MMM Do YY"
            )}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "uploadBL",
    header: ({ column }) => <ColumnHeader column={column} title="Upload BL" />,
    cell: ({ row }) => {
      const fileUrl = row.original?.blDetails?.uploadBL;
      return (
        <div className="flex items-center space-x-2">
          <span className="truncate font-medium">{fileUrl}</span>
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
    id: "actions",
    header: ({ column }) => <ColumnHeader column={column} title="Action" />,
    cell: ({ row }) => <DataTableCellActions row={row} />,
  },
];
