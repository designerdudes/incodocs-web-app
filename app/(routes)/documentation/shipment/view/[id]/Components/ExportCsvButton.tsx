"use client"; // Mark this as a client component

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ShipmentData } from "../../../Types/shipments"; // Verify this path

interface ExportCSVButtonProps {
  shipmentData: ShipmentData;
}

export default function ExportCSVButton({ shipmentData }: ExportCSVButtonProps) {
  const generateCSV = () => {
    // Helper function to escape CSV values
    const escapeCSV = (value: string | number | undefined) => {
      if (value === undefined || value === null) return "N/A";
      const str = String(value);
      return `"${str.replace(/"/g, '""')}"`; // Escape quotes and wrap in quotes
    };

    // CSV content array
    const csvRows: string[] = [];

    // Booking Details Section
    csvRows.push("Booking Details");
    csvRows.push("Field,Value");
    csvRows.push(`Booking Number,${escapeCSV(shipmentData?.bookingDetails?.bookingNumber)}`);
    csvRows.push(`Port Of Loading,${escapeCSV(shipmentData?.bookingDetails?.portOfLoading)}`);
    csvRows.push(`Destination Port,${escapeCSV(shipmentData?.bookingDetails?.destinationPort)}`);
    csvRows.push(
      `Vessel Sailing Date,${
        shipmentData?.bookingDetails?.vesselSailingDate
          ? escapeCSV(format(new Date(shipmentData.bookingDetails.vesselSailingDate), "PPP"))
          : "N/A"
      }`
    );
    csvRows.push(
      `Vessel Arriving Date,${
        shipmentData?.bookingDetails?.vesselArrivingDate
          ? escapeCSV(format(new Date(shipmentData.bookingDetails.vesselArrivingDate), "PPP"))
          : "N/A"
      }`
    );
    csvRows.push(`Review,${escapeCSV(shipmentData?.bookingDetails?.review)}`);
    csvRows.push(""); // Empty line for separation

    // Containers Table
    if (shipmentData?.bookingDetails?.containers?.length) {
      csvRows.push("Containers");
      csvRows.push("Container Number,Type,Size");
      shipmentData.bookingDetails.containers.forEach((container) => {
        csvRows.push(
          `${escapeCSV(container.containerNumber)},${escapeCSV(container.type)},${escapeCSV(container.size)}`
        );
      });
      csvRows.push("");
    }

    // Shipping Details Section
    csvRows.push("Shipping Details");
    csvRows.push("Field,Value");
    csvRows.push(
      `Shipping Line Name,${escapeCSV(shipmentData?.shippingDetails?.shippingLineName?.shippingLineName)}`
    );
    csvRows.push(
      `Number Of Invoices,${escapeCSV(shipmentData?.shippingDetails?.shippingLineInvoices?.length || 0)}`
    );
    csvRows.push("");

    // Shipping Line Invoices Table
    if (shipmentData?.shippingDetails?.shippingLineInvoices?.length) {
      csvRows.push("Shipping Line Invoices");
      csvRows.push("Invoice Number");
      shipmentData.shippingDetails.shippingLineInvoices.forEach((invoice) => {
        csvRows.push(`${escapeCSV(invoice.invoiceNumber)}`);
      });
      csvRows.push("");
    }

    csvRows.push(
      `Forwarder Name,${escapeCSV(shipmentData?.shippingDetails?.forwarderName?.forwarderName)}`
    );
    csvRows.push(
      `Number Of Forwarder Invoices,${escapeCSV(shipmentData?.shippingDetails?.forwarderInvoices?.length || 0)}`
    );
    csvRows.push("");

    // Forwarder Invoices Table
    if (shipmentData?.shippingDetails?.forwarderInvoices?.length) {
      csvRows.push("Forwarder Invoices");
      csvRows.push("Invoice Number");
      shipmentData.shippingDetails.forwarderInvoices.forEach((invoice) => {
        csvRows.push(`${escapeCSV(invoice.invoiceNumber)}`);
      });
      csvRows.push("");
    }

    csvRows.push(
      `Transporter Name,${escapeCSV(shipmentData?.shippingDetails?.transporterName?.transporterName)}`
    );
    csvRows.push(
      `Number Of Transporter Invoices,${escapeCSV(shipmentData?.shippingDetails?.transporterInvoices?.length || 0)}`
    );
    csvRows.push("");

    // Transporter Invoices Table
    if (shipmentData?.shippingDetails?.transporterInvoices?.length) {
      csvRows.push("Transporter Invoices");
      csvRows.push("Invoice Number");
      shipmentData.shippingDetails.transporterInvoices.forEach((invoice) => {
        csvRows.push(`${escapeCSV(invoice.invoiceNumber)}`);
      });
      csvRows.push("");
    }

    // Shipping Bills Details Section
    csvRows.push("Shipping Bills Details");
    csvRows.push("Field,Value");
    csvRows.push(`Port Code,${escapeCSV(shipmentData?.shippingBillDetails?.portCode)}`);
    csvRows.push(`CB Name,${escapeCSV(shipmentData?.shippingBillDetails?.cbName)}`);
    csvRows.push(`CD Code,${escapeCSV(shipmentData?.shippingBillDetails?.cdCode)}`);
    csvRows.push(
      `Number Of Bills,${escapeCSV(shipmentData?.shippingBillDetails?.ShippingBills?.length || 0)}`
    );
    csvRows.push("");

    // Shipping Bills Table
    if (shipmentData?.shippingBillDetails?.ShippingBills?.length) {
      csvRows.push("Shipping Bills");
      csvRows.push("Shipping Bill Number");
      shipmentData.shippingBillDetails.ShippingBills.forEach((bill) => {
        csvRows.push(`${escapeCSV(bill.shippingBillNumber)}`);
      });
      csvRows.push("");
    }

    // Supplier Details Section
    csvRows.push("Supplier Details");
    csvRows.push("Field,Value");
    csvRows.push(
      `Clearance Supplier Name,${escapeCSV(shipmentData?.supplierDetails?.clearance?.supplierName)}`
    );
    csvRows.push(
      `Number Of Clearance Invoices,${escapeCSV(shipmentData?.supplierDetails?.clearance?.invoices?.length || 0)}`
    );
    csvRows.push("");

    // Clearance Invoices Table
    if (shipmentData?.supplierDetails?.clearance?.invoices?.length) {
      csvRows.push("Clearance Invoices");
      csvRows.push("Supplier Invoice Number");
      shipmentData.supplierDetails.clearance.invoices.forEach((invoice) => {
        csvRows.push(`${escapeCSV(invoice.supplierInvoiceNumber)}`);
      });
      csvRows.push("");
    }

    csvRows.push(
      `Actual Supplier Name,${escapeCSV(shipmentData?.supplierDetails?.actual?.actualSupplierName)}`
    );
    csvRows.push(
      `Actual Invoice Value,${escapeCSV(shipmentData?.supplierDetails?.actual?.actualSupplierInvoiceValue)}`
    );
    csvRows.push("");

    // Sale Invoice Details Section
    csvRows.push("Sale Invoice Details");
    csvRows.push("Field,Value");
    csvRows.push(`Consignee,${escapeCSV(shipmentData?.saleInvoiceDetails?.consignee?.name)}`);
    csvRows.push(`Actual Buyer,${escapeCSV(shipmentData?.saleInvoiceDetails?.actualBuyer)}`);
    csvRows.push(
      `Number Of Invoices,${escapeCSV(shipmentData?.saleInvoiceDetails?.commercialInvoices?.length || 0)}`
    );
    csvRows.push("");

    // Commercial Invoices Table
    if (shipmentData?.saleInvoiceDetails?.commercialInvoices?.length) {
      csvRows.push("Commercial Invoices");
      csvRows.push("Commercial Invoice Number");
      shipmentData.saleInvoiceDetails.commercialInvoices.forEach((invoice) => {
        csvRows.push(`${escapeCSV(invoice.commercialInvoiceNumber)}`);
      });
      csvRows.push("");
    }

    // Bill Of Lading Details Section
    csvRows.push("Bill Of Lading Details");
    csvRows.push("Field,Value");
    csvRows.push(`BL Number,${escapeCSV(shipmentData?.blDetails?.blNumber)}`);
    csvRows.push(
      `BL Date,${
        shipmentData?.blDetails?.blDate
          ? escapeCSV(format(new Date(shipmentData.blDetails.blDate), "PPP"))
          : "N/A"
      }`
    );
    csvRows.push(
      `Telex Date,${
        shipmentData?.blDetails?.telexDate
          ? escapeCSV(format(new Date(shipmentData.blDetails.telexDate), "PPP"))
          : "N/A"
      }`
    );

    // Join rows with newlines to create CSV content
    const csvContent = csvRows.join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Shipment_${shipmentData?.bookingDetails?.bookingNumber || "N/A"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };

  return <Button onClick={generateCSV}>Export CSV</Button>;
}