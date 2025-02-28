"use client";

import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ShipmentData } from "../../../Types/shipments";
// Adjust the path to where you defined the type

interface ExportPDFButtonProps {
  shipmentData: ShipmentData;
}

export default function ExportPDFButton({
  shipmentData,
}: ExportPDFButtonProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    // Helper function to add section title
    const addSectionTitle = (title: string) => {
      doc.setFontSize(16);
      doc.text(title, 10, yOffset);
      yOffset += 10;
      doc.setFontSize(12);
    };

    // Helper function to add key-value pair
    const addField = (label: string, value?: string | number) => {
      if (value) {
        doc.text(`${label}: ${value}`, 10, yOffset);
        yOffset += 10;
      }
    };

    // Booking Details
    addSectionTitle("Booking Details");
    addField("Booking Number", shipmentData?.bookingDetails?.bookingNumber);
    addField("Port Of Loading", shipmentData?.bookingDetails?.portOfLoading);
    addField("Destination Port", shipmentData?.bookingDetails?.destinationPort);
    addField(
      "Vessel Sailing Date",
      shipmentData?.bookingDetails?.vesselSailingDate
        ? format(new Date(shipmentData.bookingDetails.vesselSailingDate), "PPP")
        : "N/A"
    );
    addField(
      "Vessel Arriving Date",
      shipmentData?.bookingDetails?.vesselArrivingDate
        ? format(
            new Date(shipmentData.bookingDetails.vesselArrivingDate),
            "PPP"
          )
        : "N/A"
    );
    addField("Review", shipmentData?.bookingDetails?.review);

    // Shipping Details
    addSectionTitle("Shipping Details");
    addField(
      "Shipping Line Name",
      shipmentData?.shippingDetails?.shippingLineName?.shippingLineName
    );
    addField(
      "Number Of Invoices",
      shipmentData?.shippingDetails?.shippingLineInvoices?.length || 0
    );
    addField(
      "Forwarder Name",
      shipmentData?.shippingDetails?.forwarderName?.forwarderName
    );
    addField(
      "Number Of Forwarder Invoices",
      shipmentData?.shippingDetails?.forwarderInvoices?.length || 0
    );
    addField(
      "Transporter Name",
      shipmentData?.shippingDetails?.transporterName?.transporterName
    );
    addField(
      "Number Of Transporter Invoices",
      shipmentData?.shippingDetails?.transporterInvoices?.length || 0
    );

    // Shipping Bills Details
    addSectionTitle("Shipping Bills Details");
    addField("Port Code", shipmentData?.shippingBillDetails?.portCode);
    addField("CB Name", shipmentData?.shippingBillDetails?.cbName);
    addField("CD Code", shipmentData?.shippingBillDetails?.cdCode);
    addField(
      "Number Of Bills",
      shipmentData?.shippingBillDetails?.ShippingBills?.length || 0
    );

    // Supplier Details
    addSectionTitle("Supplier Details");
    addField(
      "Clearance Supplier Name",
      shipmentData?.supplierDetails?.clearance?.supplierName
    );
    addField(
      "Number Of Clearance Invoices",
      shipmentData?.supplierDetails?.clearance?.invoices?.length || 0
    );
    addField(
      "Actual Supplier Name",
      shipmentData?.supplierDetails?.actual?.actualSupplierName
    );
    addField(
      "Actual Invoice Value",
      shipmentData?.supplierDetails?.actual?.actualSupplierInvoiceValue
    );

    // Sale Invoice Details
    addSectionTitle("Sale Invoice Details");
    addField("Consignee", shipmentData?.saleInvoiceDetails?.consignee?.name);
    addField("Actual Buyer", shipmentData?.saleInvoiceDetails?.actualBuyer);
    addField(
      "Number Of Invoices",
      shipmentData?.saleInvoiceDetails?.commercialInvoices?.length || 0
    );

    // Bill Of Lading Details
    addSectionTitle("Bill Of Lading Details");
    addField("BL Number", shipmentData?.blDetails?.blNumber);
    addField(
      "BL Date",
      shipmentData?.blDetails?.blDate
        ? format(new Date(shipmentData.blDetails.blDate), "PPP")
        : "N/A"
    );
    addField(
      "Telex Date",
      shipmentData?.blDetails?.telexDate
        ? format(new Date(shipmentData.blDetails.telexDate), "PPP")
        : "N/A"
    );

    // Save the PDF
    doc.save(
      `Shipment_${shipmentData?.bookingDetails?.bookingNumber || "N/A"}.pdf`
    );
  };

  return <Button onClick={generatePDF}>Export PDF</Button>;
}
