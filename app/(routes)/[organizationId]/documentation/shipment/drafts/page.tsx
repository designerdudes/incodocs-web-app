"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ShipmentDataTable from "@/components/shipmentDataTable";
import { columns } from "../components1/columns";
import { shipmentSchema, Shipment } from "../data/schema";
import { z } from "zod";

export default function Page() {
  // Initialize shipmentData as empty array
  let shipmentData: Shipment[] = [];

  try {
    const res = localStorage.getItem("shipmentDraft");
    console.log("Raw localStorage shipmentDraft:", res);

    if (!res) {
      console.warn("No shipmentDraft found in localStorage");
    } else {
      const parsedData = JSON.parse(res);
      // Handle case where data is wrapped in "shipment" key or not
      const shipment = parsedData?.shipment || parsedData;
      // Ensure shipment is an array
      const shipments = Array.isArray(shipment) ? shipment : [shipment];

      // Transform and validate shipments
      shipmentData = shipments
        .map((item: any, index: number) => {
          try {
            // Transform data to match shipmentSchema
            const transformedItem = {
              ...item,
              _id: item._id || `temp_${index}`,
              shipmentId: item.shipmentId || `DRAFT_${index}`,
              bookingDetails: item.bookingDetails
                ? {
                    ...item.bookingDetails,
                    _id: item.bookingDetails._id || `temp_booking_${index}`,
                    invoiceNumber: item.bookingDetails.invoiceNumber || "N/A",
                    bookingNumber: item.bookingDetails.bookingNumber || "N/A",
                    portOfLoading: item.bookingDetails.portOfLoading || "N/A",
                    destinationPort:
                      item.bookingDetails.destinationPort || "N/A",
                    vesselSailingDate:
                      item.bookingDetails.vesselSailingDate ||
                      new Date().toISOString(),
                    vesselArrivingDate:
                      item.bookingDetails.vesselArrivingDate ||
                      new Date().toISOString(),
                    containers: Array.isArray(item.bookingDetails.containers)
                      ? item.bookingDetails.containers.map(
                          (container: any) => ({
                            ...container,
                            containerNumber: container.containerNumber || "N/A",
                            truckNumber: container.truckNumber || "N/A",
                            truckDriverContactNumber:
                              container.truckDriverContactNumber
                                ? parseFloat(container.truckDriverContactNumber)
                                : undefined,
                            containerType: container.containerType || "N/A",
                            addProductDetails: Array.isArray(
                              container.addProductDetails
                            )
                              ? container.addProductDetails.map(
                                  (product: any) =>
                                    typeof product === "string"
                                      ? { _id: product, description: "Unknown" }
                                      : {
                                          ...product,
                                          _id:
                                            product._id ||
                                            `temp_product_${index}`,
                                        }
                                )
                              : [],
                          })
                        )
                      : [],
                    review: item.bookingDetails.review || "",
                  }
                : {
                    _id: `temp_booking_${index}`,
                    invoiceNumber: "N/A",
                    bookingNumber: "N/A",
                    portOfLoading: "N/A",
                    destinationPort: "N/A",
                    vesselSailingDate: new Date().toISOString(),
                    vesselArrivingDate: new Date().toISOString(),
                    containers: [],
                    review: "",
                  },
              shippingDetails: item.shippingDetails
                ? {
                    ...item.shippingDetails,
                    _id: item.shippingDetails._id || `temp_shipping_${index}`,
                    review: item.shippingDetails.review || "",
                    noOfShipmentinvoices:
                      item.shippingDetails.noOfShipmentinvoices || 0,
                    shippingLineInvoices: Array.isArray(
                      item.shippingDetails.shippingLineInvoices
                    )
                      ? item.shippingDetails.shippingLineInvoices.map(
                          (invoice: any) => ({
                            ...invoice,
                            invoiceNumber: invoice.invoiceNumber || "N/A",
                            date: invoice.date || new Date().toISOString(),
                            valueWithGst: invoice.valueWithGst
                              ? parseFloat(invoice.valueWithGst)
                              : 0,
                            valueWithoutGst: invoice.valueWithoutGst
                              ? parseFloat(invoice.valueWithoutGst)
                              : 0,
                            _id:
                              invoice._id || `temp_shipping_invoice_${index}`,
                            uploadInvoiceUrl: invoice.uploadInvoiceUrl || "",
                          })
                        )
                      : [],
                    transporterName:
                      typeof item.shippingDetails.transporterName === "string"
                        ? {
                            _id: item.shippingDetails.transporterName,
                            transporterName: "Unknown",
                          }
                        : item.shippingDetails.transporterName || undefined,
                    forwarderName:
                      typeof item.shippingDetails.forwarderName === "string"
                        ? {
                            _id: item.shippingDetails.forwarderName,
                            forwarderName: "Unknown",
                          }
                        : item.shippingDetails.forwarderName || undefined,
                    transporterInvoices: Array.isArray(
                      item.shippingDetails.transporterInvoices
                    )
                      ? item.shippingDetails.transporterInvoices.map(
                          (invoice: any) => ({
                            ...invoice,
                            invoiceNumber: invoice.invoiceNumber || "N/A",
                            date: invoice.date || new Date().toISOString(),
                            valueWithGst: invoice.valueWithGst
                              ? parseFloat(invoice.valueWithGst)
                              : 0,
                            valueWithoutGst: invoice.valueWithoutGst
                              ? parseFloat(invoice.valueWithoutGst)
                              : 0,
                            _id:
                              invoice._id ||
                              `temp_transporter_invoice_${index}`,
                            uploadInvoiceUrl: invoice.uploadInvoiceUrl || "",
                          })
                        )
                      : [],
                    forwarderInvoices: Array.isArray(
                      item.shippingDetails.forwarderInvoices
                    )
                      ? item.shippingDetails.forwarderInvoices.map(
                          (invoice: any) => ({
                            ...invoice,
                            invoiceNumber: invoice.invoiceNumber || "N/A",
                            date: invoice.date || new Date().toISOString(),
                            valueWithGst: invoice.valueWithGst
                              ? parseFloat(invoice.valueWithGst)
                              : 0,
                            valueWithoutGst: invoice.valueWithoutGst
                              ? parseFloat(invoice.valueWithoutGst)
                              : 0,
                            _id:
                              invoice._id || `temp_forwarder_invoice_${index}`,
                            uploadInvoiceUrl: invoice.uploadInvoiceUrl || "",
                          })
                        )
                      : [],
                  }
                : undefined,
              shippingBillDetails: item.shippingBillDetails
                ? {
                    ...item.shippingBillDetails,
                    _id:
                      item.shippingBillDetails._id ||
                      `temp_shipping_bill_${index}`,
                    review: item.shippingBillDetails.review || "",
                    portCode: item.shippingBillDetails.portCode || "N/A",
                    cbName:
                      typeof item.shippingBillDetails.cbName === "string"
                        ? {
                            _id: item.shippingBillDetails.cbName,
                            cbName: "Unknown",
                          }
                        : item.shippingBillDetails.cbName || undefined,
                    cbCode: item.shippingBillDetails.cbCode || "N/A",
                    noOfShippingBills:
                      item.shippingBillDetails.noOfShippingBills || 0,
                    ShippingBills: Array.isArray(
                      item.shippingBillDetails.ShippingBills
                    )
                      ? item.shippingBillDetails.ShippingBills.map(
                          (bill: any) => ({
                            ...bill,
                            shippingBillNumber:
                              bill.shippingBillNumber || "N/A",
                            shippingBillDate:
                              bill.shippingBillDate || new Date().toISOString(),
                            shippingBillUrl: bill.shippingBillUrl || "",
                            drawbackValue: bill.drawbackValue || "0",
                            rodtepValue: bill.rodtepValue || "0",
                            _id: bill._id || `temp_shipping_bill_${index}`,
                          })
                        )
                      : [],
                  }
                : undefined,
              NumberOfContainer: item.NumberOfContainer || 0,
              supplierDetails: item.supplierDetails
                ? {
                    ...item.supplierDetails,
                    _id: item.supplierDetails._id || `temp_supplier_${index}`,
                    review: item.supplierDetails.review || "",
                    clearance: item.supplierDetails.clearance
                      ? {
                          ...item.supplierDetails.clearance,
                          _id:
                            item.supplierDetails.clearance._id ||
                            `temp_clearance_${index}`,
                          noOfSuppliers:
                            item.supplierDetails.clearance.noOfSuppliers || 0,
                          suppliers: Array.isArray(
                            item.supplierDetails.clearance.suppliers
                          )
                            ? item.supplierDetails.clearance.suppliers.map(
                                (supplier: any) => ({
                                  ...supplier,
                                  supplierName:
                                    typeof supplier.supplierName === "string"
                                      ? {
                                          _id: supplier.supplierName,
                                          supplierName: "Unknown",
                                        }
                                      : supplier.supplierName || undefined,
                                  noOfInvoices: supplier.noOfInvoices || 0,
                                  invoices: Array.isArray(supplier.invoices)
                                    ? supplier.invoices.map((invoice: any) => ({
                                        ...invoice,
                                        supplierInvoiceNumber:
                                          invoice.supplierInvoiceNumber ||
                                          "N/A",
                                        supplierInvoiceDate:
                                          invoice.supplierInvoiceDate ||
                                          new Date().toISOString(),
                                        supplierInvoiceValueWithGST:
                                          invoice.supplierInvoiceValueWithGST ||
                                          "0",
                                        supplierInvoiceValueWithOutGST:
                                          invoice.supplierInvoiceValueWithOutGST ||
                                          "0",
                                        clearanceSupplierInvoiceUrl:
                                          invoice.clearanceSupplierInvoiceUrl ||
                                          "",
                                        _id:
                                          invoice._id ||
                                          `temp_supplier_invoice_${index}`,
                                      }))
                                    : [],
                                })
                              )
                            : [],
                        }
                      : undefined,
                    actual: item.supplierDetails.actual
                      ? {
                          ...item.supplierDetails.actual,
                          _id:
                            item.supplierDetails.actual._id ||
                            `temp_actual_${index}`,
                          actualSupplierName:
                            item.supplierDetails.actual.actualSupplierName ||
                            "N/A",
                          actualSupplierInvoiceValue:
                            item.supplierDetails.actual
                              .actualSupplierInvoiceValue || "0",
                          actualSupplierInvoiceUrl:
                            item.supplierDetails.actual
                              .actualSupplierInvoiceUrl || "",
                          shippingBillUrl:
                            item.supplierDetails.actual.shippingBillUrl || "",
                        }
                      : undefined,
                  }
                : undefined,
              saleInvoiceDetails: item.saleInvoiceDetails
                ? {
                    ...item.saleInvoiceDetails,
                    _id: item.saleInvoiceDetails._id || `temp_sale_${index}`,
                    consignee:
                      typeof item.saleInvoiceDetails.consignee === "string"
                        ? {
                            _id: item.saleInvoiceDetails.consignee,
                            name: "Unknown",
                          }
                        : item.saleInvoiceDetails.consignee || undefined,
                    actualBuyer: item.saleInvoiceDetails.actualBuyer || "N/A",
                    numberOfSalesInvoices:
                      item.saleInvoiceDetails.numberOfSalesInvoices || "0",
                    review: item.saleInvoiceDetails.review || "",
                    commercialInvoices: Array.isArray(
                      item.saleInvoiceDetails.commercialInvoices
                    )
                      ? item.saleInvoiceDetails.commercialInvoices.map(
                          (invoice: any) => ({
                            ...invoice,
                            commercialInvoiceNumber:
                              invoice.commercialInvoiceNumber || "N/A",
                            clearanceCommercialInvoiceUrl:
                              invoice.clearanceCommercialInvoiceUrl || "",
                            actualCommercialInvoiceUrl:
                              invoice.actualCommercialInvoiceUrl || "",
                            saberInvoiceUrl: invoice.saberInvoiceUrl || "",
                            _id:
                              invoice._id || `temp_commercial_invoice_${index}`,
                          })
                        )
                      : [],
                  }
                : undefined,
              blDetails: item.blDetails
                ? {
                    ...item.blDetails,
                    _id: item.blDetails._id || `temp_bl_${index}`,
                    shippingLineName:
                      typeof item.blDetails.shippingLineName === "string"
                        ? {
                            _id: item.blDetails.shippingLineName,
                            shippingLineName: "Unknown",
                          }
                        : item.blDetails.shippingLineName || undefined,
                    noOfBl: item.blDetails.noOfBl || 0,
                    review: item.blDetails.review || "",
                    Bl: Array.isArray(item.blDetails.Bl)
                      ? item.blDetails.Bl.map((bl: any) => ({
                          ...bl,
                          blNumber: bl.blNumber || "N/A",
                          blDate: bl.blDate || new Date().toISOString(),
                          telexDate: bl.telexDate || new Date().toISOString(),
                          uploadBLUrl: bl.uploadBLUrl || "",
                          _id: bl._id || `temp_bl_${index}`,
                        }))
                      : [],
                  }
                : undefined,
              otherDetails: Array.isArray(item.otherDetails)
                ? item.otherDetails.map((detail: any) => ({
                    ...detail,
                    _id: detail._id || `temp_other_${index}`,
                    date: detail.date || new Date().toISOString(),
                    review: detail.review || "",
                    certificateName: detail.certificateName || "N/A",
                    certificateNumber: detail.certificateNumber || "N/A",
                    issuerOfCertificate: detail.issuerOfCertificate || "N/A",
                    uploadCopyOfCertificate:
                      detail.uploadCopyOfCertificate || "",
                  }))
                : [],
              createdBy: item.createdBy || {
                _id: `temp_user_${index}`,
                fullName: "Unknown",
                email: "unknown@example.com",
                profileImg: "",
              },
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: item.updatedAt || new Date().toISOString(),
              __v: item.__v || 0,
            };

            // Validate transformed item
            const result = shipmentSchema.safeParse(transformedItem);
            if (result.success) {
              return result.data;
            } else {
              console.error(
                `Validation error for shipment at index ${index}:`,
                transformedItem
              );
              console.error("Zod validation issues:", result.error.issues);
              return null;
            }
          } catch (transformError) {
            console.error(
              `Error transforming shipment at index ${index}:`,
              transformError
            );
            return null;
          }
        })
        .filter((item): item is Shipment => item !== null);
    }
  } catch (error) {
    console.error("Error parsing shipmentDraft from localStorage:", error);
  }

  console.log("Transformed shipmentData:", shipmentData);

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center gap-2">
        <Link href="/documentation/dashboard">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Draft Shipments" />
          <p className="text-muted-foreground text-sm">
            View and manage your draft shipments
          </p>
        </div>
        <Link href="./shipment/createnew">
          <Button className="bg-primary text-white">Add New Shipment</Button>
        </Link>
      </div>
      <Separator className="my-2" />
      <div>
        <ShipmentDataTable
          columns={columns}
          data={shipmentData}
          searchKeys={[
            "shipmentId",
            "saleInvoiceDetails.consignee.name",
            "bookingDetails.invoiceNumber",
            "bookingDetails.bookingNumber",
            "shippingDetails.transporterInvoices.invoiceNumber",
          ]}
          bulkDeleteIdName="_id"
          deleteRoute="shipment/deleteall"
        />
      </div>
    </div>
  );
}
