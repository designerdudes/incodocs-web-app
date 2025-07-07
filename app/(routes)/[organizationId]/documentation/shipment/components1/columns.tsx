"use client";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnHeader } from "./column-header";
import moment from "moment";
import { DataTableCellActions } from "./cell-actions";
import { Copy, ChevronDown } from "lucide-react";
import { Shipment } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ViewAllComponent from "./viewAllComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";

// Extend TableMeta to include updateData
interface CustomTableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

const multiColumnFilterFn: FilterFn<Shipment> = (
  row,
  columnId,
  filterValue
) => {
  const consigneeName =
    typeof row.original.saleInvoiceDetails?.consignee === "string"
      ? row.original.saleInvoiceDetails.consignee
      : row.original.saleInvoiceDetails?.consignee?.name || "";
  const transporterName =
    typeof row.original.shippingDetails?.transporterName === "string"
      ? row.original.shippingDetails.transporterName
      : row.original.shippingDetails?.transporterName?.transporterName || "";
  const forwarderName =
    typeof row.original.shippingDetails?.forwarderName === "string"
      ? row.original.shippingDetails.forwarderName
      : row.original.shippingDetails?.forwarderName?.forwarderName || "";
  const cbName =
    typeof row.original.shippingBillDetails?.cbName === "string"
      ? row.original.shippingBillDetails.cbName
      : row.original.shippingBillDetails?.cbName?.cbName || "";
  const firstSupplier = row.original.supplierDetails?.clearance?.suppliers?.[0];
  const supplierName = firstSupplier
    ? typeof firstSupplier.supplierName === "string"
      ? firstSupplier.supplierName
      : firstSupplier.supplierName?.supplierName ||
        row.original.supplierDetails?.actual?.actualSupplierName ||
        ""
    : row.original.supplierDetails?.actual?.actualSupplierName || "";

  const searchableRowContent = [
    row.original.shipmentId || "",
    row.original.bookingDetails?.invoiceNumber || "",
    consigneeName,
    row.original.blDetails?.Bl?.map((bl) => bl.blNumber).join(", ") || "",
    row.original.bookingDetails?.containers
      ?.map((container) => container.containerNumber)
      .join(", ") || "",
    row.original.bookingDetails?.containers
      ?.map((container) => container.truckNumber)
      .join(", ") || "",
    row.original.bookingDetails?.vesselSailingDate || "",
    row.original.bookingDetails?.vesselArrivingDate || "",
    row.original.shippingDetails?.shippingLineInvoices?.[0]?.uploadInvoiceUrl ||
      "",
    row.original.bookingDetails?.portOfLoading || "",
    row.original.bookingDetails?.destinationPort || "",
    row.original.saleInvoiceDetails?.commercialInvoices
      ?.map((invoice) => invoice.clearanceCommercialInvoiceNumber)
      .join(", ") || "",
    supplierName,
    row.original.bookingDetails?.bookingNumber || "",
    transporterName,
    forwarderName,
    row.original.shippingBillDetails?.portCode || "",
    cbName,
    row.original.shippingBillDetails?.ShippingBills?.map(
      (bill) => bill.shippingBillNumber
    ).join(", ") || "",
    row.original.saleInvoiceDetails?.actualBuyer || "",
  ]
    .join(" ")
    .toLowerCase();

  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Shipment> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string | undefined;
  return status ? filterValue.includes(status) : false;
};

// Define available status options
const statusOptions = [
  "Booking Confirmed",
  "Trucks Booked",
  "Trucks Dispatched",
  "Trucks Arrived",
  "Trucks Halted",
  "Stuffing",
  "In Clearance",
  "Loaded On Vessel",
  "In Transit",
  "Arrived At POD",
  "Delivery Completed",
];

// Separate component for status cell
const StatusCell: React.FC<{
  row: any;
  table: any;
}> = ({ row, table }) => {
  const currentStatus = row.original.status || "Booking Confirmed";
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      await putData(`/shipment/update/${row.original._id}`, {
        status: newStatus,
      });
      toast.success("Shipment status updated successfully");
      // Update the row data to refresh the table
      row.original.status = newStatus;
      // Force table to re-render by updating state
      (table.options.meta as CustomTableMeta<Shipment>)?.updateData?.(
        row.index,
        "status",
        newStatus
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update shipment status");
    } finally {
      setIsLoading(false);
    }
  };
  const onStatusClick = (status: string) => {
    setSelectedStatus(status);
    setIsConfirmDialogOpen(true);
  };

  const onConfirmStatusChange = () => {
    if (selectedStatus) {
      handleStatusUpdate(selectedStatus);
    }
    setIsConfirmDialogOpen(false);
    setSelectedStatus(null);
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge
        className={cn(
          currentStatus === "Booking Confirmed" &&
            "bg-amber-200 text-amber-800 hover:bg-amber-300/80",
          currentStatus === "Trucks Booked" &&
            "bg-orange-200 text-yellow-800 hover:bg-orange-300/80",
          currentStatus === "Trucks Dispatched" &&
            "bg-gray-200 text-gray-800 hover:bg-gray-300/70",
          currentStatus === "Trucks Arrived" &&
            "bg-blue-200 text-blue-800 hover:bg-blue-300/80",
          currentStatus === "Trucks Halted" &&
            "bg-yellow-200 text-yellow-800 hover:bg-yellow-300/80",
          currentStatus === "Stuffing" &&
            "bg-orange-200 text-orange-800 hover:bg-orange-300/80",
          currentStatus === "In Clearance" &&
            "bg-purple-200 text-purple-800 hover:bg-purple-300/80",
          currentStatus === "Loaded On Vessel" &&
            "bg-teal-200 text-teal-800 hover:bg-teal-300/80",
          currentStatus === "In Transit" &&
            "bg-cyan-200 text-cyan-800 hover:bg-cyan-300/80",
          currentStatus === "Arrived At POD" &&
            "bg-lime-200 text-lime-800 hover:bg-lime-300/80",
          currentStatus === "Delivery Completed" &&
            "bg-green-200 text-green-800 hover:bg-green-300/80",
          !currentStatus && "bg-gray-100 text-gray-600 hover:bg-gray-200/60"
        )}
      >
        {currentStatus}
      </Badge>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 max-h-60 overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant="ghost"
                className={cn(
                  "justify-start",
                  status === currentStatus && "bg-gray-100"
                )}
                onClick={() => onStatusClick(status)}
                disabled={isLoading}
              >
                {status}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setSelectedStatus(null);
        }}
        onConfirm={onConfirmStatusChange}
        title="Are you sure?"
        description={`You are about to change the status to "${selectedStatus}". This action cannot be undone.`}
      />
    </div>
  );
};

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
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipment ID" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="truncate font-medium">
          {row.original.shipmentId || "N/A"}
        </span>
        {row.original.shipmentId && (
          <Copy
            className="h-3 w-3 text-gray-500 cursor-pointer hover:text-blue-700"
            onClick={() => {
              if (row.original.shipmentId) {
                navigator.clipboard.writeText(row.original.shipmentId);
              }
            }}
          />
        )}
      </div>
    ),
    filterFn: multiColumnFilterFn,
  },
  {
    accessorKey: "invoiceNumber",
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
    accessorKey: "consignee",
    header: "Consignee Name",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {typeof row.original.saleInvoiceDetails?.consignee === "string"
            ? row.original.saleInvoiceDetails.consignee
            : row.original.saleInvoiceDetails?.consignee?.name || "N/A"}
        </span>
      </div>
    ),
    size: 300,
  },
  {
    accessorKey: "addProductDetails",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Container and Product Details" />
    ),
    cell: ({ row }) => {
      const containers = row.original?.bookingDetails?.containers || [];

      const calculateTileSquareMeter = (
        length: number,
        breadth: number,
        piecesPerBox: number,
        noOfBoxes: number
      ) =>
        length && breadth && piecesPerBox && noOfBoxes
          ? (((length * breadth) / 929) * piecesPerBox * noOfBoxes) / 10.764
          : 0;

      const calculateStepRiserSquareMeter = (details: any) => {
        const { mixedBox = {}, seperateBox = {} } = details || {};

        const mixedStep =
          (mixedBox.noOfBoxes || 0) *
          (mixedBox.noOfSteps || 0) *
          (mixedBox.sizeOfStep?.length || 0) *
          (mixedBox.sizeOfStep?.breadth || 0);

        const mixedRiser =
          (mixedBox.noOfBoxes || 0) *
          (mixedBox.noOfRiser || 0) *
          (mixedBox.sizeOfRiser?.length || 0) *
          (mixedBox.sizeOfRiser?.breadth || 0);

        const separateStep =
          (seperateBox.noOfBoxOfSteps || 0) *
          (seperateBox.noOfPiecesPerBoxOfSteps || 0) *
          (seperateBox.sizeOfBoxOfSteps?.length || 0) *
          (seperateBox.sizeOfBoxOfSteps?.breadth || 0);

        const separateRiser =
          (seperateBox.noOfBoxOfRisers || 0) *
          (seperateBox.noOfPiecesPerBoxOfRisers || 0) *
          (seperateBox.sizeOfBoxOfRisers?.length || 0) *
          (seperateBox.sizeOfBoxOfRisers?.breadth || 0);

        const total = mixedStep + mixedRiser + separateStep + separateRiser;
        return total ? total / 929 / 10.764 : 0;
      };

      const jsxData = containers.map((container: any, containerIdx: number) => {
        const grouped: Record<string, string[]> = {};

        const addProductDetails = container?.addProductDetails || [];

        addProductDetails.forEach((product: any) => {
          const productType = product.productType || "N/A";
          const stoneName =
            product.tileDetails?.stoneName ||
            product.slabDetails?.stoneName ||
            product.stepRiserDetails?.stoneName ||
            "N/A";

          let sqm = "N/A";
          if (productType === "Tiles") {
            const d = product.tileDetails || {};
            sqm = calculateTileSquareMeter(
              d.size?.length,
              d.size?.breadth,
              d.piecesPerBox,
              d.noOfBoxes
            ).toFixed(2);
          } else if (productType === "StepsAndRisers") {
            sqm = calculateStepRiserSquareMeter(
              product.stepRiserDetails
            ).toFixed(2);
          }

          const line = `StoneName: ${stoneName}, SqM: ${sqm}`;
          if (!grouped[productType]) grouped[productType] = [];
          grouped[productType].push(line);
        });

        return (
          <div key={containerIdx} className="mb-4 border-b pb-2">
            <div className="font-bold text-blue-600 mb-2">
              🚢 Container {container.containerNumber || containerIdx + 1} | 🚛
              Truck: {container.truckNumber || "N/A"}
            </div>
            {Object.entries(grouped).map(([type, lines], i) => (
              <div key={i} className="mb-3 ml-3">
                <div className="font-semibold text-gray-800 mb-1">
                  🟩 ProductType: {type}
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {lines.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      });

      return (
        <ViewAllComponent
          title="Containers And Products Details"
          params={{
            organizationId: row.original.organizationId?._id || "unknown",
          }}
          data={jsxData}
          setIsFetching={() => {}}
          setIsLoading={() => {}}
          containerCount={containers.length} // Pass container count
        />
      );
    },
  },
  {
    accessorKey: "blNumber",
    header: ({ column }) => <ColumnHeader column={column} title="BL Number" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.blDetails?.Bl?.[0]?.blNumber || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "portOfLoading",
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
    accessorKey: "destinationPort",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Port Of Destination" />
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
    accessorKey: "clearanceCommercialInvoiceNumber",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Commercial Invoice Number" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.saleInvoiceDetails?.commercialInvoices?.[0]
            ?.clearanceCommercialInvoiceNumber || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "actualInvoiceValue",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Actual Invoice Value" />
    ),
    cell: ({ row }) => {
      const value =
        row.original.supplierDetails?.actual?.actualSupplierInvoiceValue;
      const formattedValue = value
        ? isNaN(parseFloat(value))
          ? "Invalid Value"
          : new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              notation: "compact",
              compactDisplay: "short",
            }).format(parseFloat(value))
        : "N/A";
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{formattedValue}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "bookingNumber",
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
    accessorKey: "vesselSailingDate",
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
    accessorKey: "vesselArrivingDate",
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
    accessorKey: "transporterName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Transporter Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {typeof row.original.shippingDetails?.transporterName === "string"
            ? row.original.shippingDetails.transporterName
            : row.original.shippingDetails?.transporterName?.transporterName ||
              "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "forwarderName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Forwarder Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {typeof row.original.shippingDetails?.forwarderName === "string"
            ? row.original.shippingDetails.forwarderName
            : row.original.shippingDetails?.forwarderName?.forwarderName ||
              "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shippingLineName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="shippingLineName" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {typeof row.original.blDetails?.shippingLineName === "string"
            ? row.original.blDetails.shippingLineName
            : row.original.blDetails?.shippingLineName?.shippingLineName ||
              "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "cbName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="CustomBroker" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {typeof row.original.shippingBillDetails?.cbName === "string"
            ? row.original.shippingBillDetails.cbName
            : row.original.shippingBillDetails?.cbName?.cbName || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Supplier Name" />
    ),
    cell: ({ row }) => {
      const firstSupplier =
        row.original.supplierDetails?.clearance?.suppliers?.[0];
      const supplierName = firstSupplier
        ? typeof firstSupplier.supplierName === "string"
          ? firstSupplier.supplierName
          : firstSupplier.supplierName?.supplierName ||
            row.original.supplierDetails?.actual?.actualSupplierName ||
            "N/A"
        : row.original.supplierDetails?.actual?.actualSupplierName || "N/A";
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{supplierName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "portCode",
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
    accessorKey: "shippingBills",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Shipping Bill Number" />
    ),
    cell: ({ row }) => {
      const shippingBills = row.original.shippingBillDetails?.ShippingBills;
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {shippingBills && shippingBills.length > 0
              ? shippingBills.map((bill) => bill.shippingBillNumber).join(", ")
              : "N/A"}
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
      const suppliers = row.original.supplierDetails?.clearance?.suppliers;
      const invoices =
        suppliers && suppliers.length > 0 ? suppliers[0].invoices : undefined;
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {invoices && invoices.length > 0
              ? invoices[0].supplierInvoiceNumber
              : "N/A"}
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
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.saleInvoiceDetails?.actualBuyer || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "blDate",
    header: ({ column }) => <ColumnHeader column={column} title="BL Date" />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {row.original.blDetails?.Bl?.[0]?.blDate
            ? moment(row.original.blDetails.Bl[0].blDate).format("MMM Do YY")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "otherDocuments",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Other Documents" />
    ),
    cell: ({ row }) => {
      const otherDetails = row.original.otherDetails;
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {otherDetails &&
            otherDetails.length > 0 &&
            otherDetails[0].certificateNumber
              ? otherDetails[0].certificateNumber
              : "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row, table }) => <StatusCell row={row} table={table} />,
    filterFn: statusFilterFn,
    size: 200,
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => <ColumnHeader column={column} title="Created By" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={row.original.createdBy?.profileImg || ""}
            alt={row.original.createdBy?.fullName || "Unknown"}
          />
          <AvatarFallback>
            {row.original.createdBy?.fullName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1 leading-none">
          <span className="capitalize">
            {row.original.createdBy?.fullName || "Unknown"}
          </span>
          <span className="text-xs truncate text-muted-foreground">
            {row.original.createdBy?.email || "N/A"}
          </span>
        </div>
      </div>
    ),
    size: 280,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
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
