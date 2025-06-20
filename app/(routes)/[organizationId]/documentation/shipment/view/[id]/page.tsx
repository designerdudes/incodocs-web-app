import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cookies } from "next/headers";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
import { BookingDetailsColumn } from "./Components/BookingDetailsColumn";
import { BillOfLandingColumn } from "./Components/BillOfLandingColumn";
import { SupplierDetailscolumn } from "./Components/SupplierDetailscolumn";
import { CommercialInvoiceDetailscolumn } from "./Components/CommercialInvoiceDetailscolumn";
import { ShippingBillsDetailscolumn } from "./Components/ShippingBillsDetailscolumn";
import { ForwarderDetailsColumn } from "./Components/ForwarderDetailscolumn";
import { TransporterDetailsColumn } from "./Components/TransporterDetailscolumn";
import { OtherDetailsColumn } from "./Components/OtherDetailsColumn";
import ExportCsvButton from "./Components/ExportCsvButton";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DocColumns } from "./Components/DocumentColumns";
import { ShipmentLogs } from "@/components/shipmentLogs";
import ViewShipment from "./Components/ViewShipment";

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/shipment/getbyid/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) {
    return <div>Error loading shipment data</div>;
  }
  const responseData = await res.json();
  const shipmentData = responseData?.shipment || {};
  const shipmentLogs = responseData?.shipmentLogs || {};
  // console.log("shipmentData", shipmentLogs);

  // Extract documents from shipmentData
  const transporterInvoices =
    shipmentData?.shippingDetails?.transporterInvoices?.map(
      (invoice: { invoiceNumber: any; uploadInvoiceUrl: any }) => ({
        documentName: "Transporter Invoice",
        documentNumber: invoice.invoiceNumber,
        documentUrl: invoice.uploadInvoiceUrl || "N/A",
      })
    ) || [];

  const forwarderInvoices =
    shipmentData?.shippingDetails?.forwarderInvoices?.map(
      (invoice: { invoiceNumber: any; uploadInvoiceUrl: any }) => ({
        documentName: "Forwarder Invoice",
        documentNumber: invoice.invoiceNumber,
        documentUrl: invoice.uploadInvoiceUrl || "N/A",
      })
    ) || [];

  const shippingBills =
    shipmentData?.shippingBillDetails?.ShippingBills?.map(
      (invoice: { shippingBillNumber: any; shippingBillUrl: any }) => ({
        documentName: "Shipping Bill",
        documentNumber: invoice.shippingBillNumber,
        documentUrl: invoice.shippingBillUrl || "N/A",
      })
    ) || [];

  const supplierActualInvoice = shipmentData?.supplierDetails?.actual
    ? [
        {
          documentName: "Supplier Actual Invoice",
          documentNumber:
            shipmentData.supplierDetails.actual.actualSupplierName || "N/A",
          documentUrl:
            shipmentData.supplierDetails.actual.actualSupplierInvoiceUrl ||
            "N/A",
        },
      ]
    : [];
  const supplierInvoice =
    shipmentData?.supplierDetails?.clearance?.suppliers?.invoices?.map(
      (invoice: {
        supplierInvoiceNumber: any;
        clearanceSupplierInvoiceUrl: any;
      }) => ({
        documentName: "Supplier Invoice",
        documentNumber: invoice.supplierInvoiceNumber,
        documentUrl: invoice.clearanceSupplierInvoiceUrl || "N/A",
      })
    ) || [];

  const commercialInvoices =
    shipmentData?.saleInvoiceDetails?.commercialInvoices?.map(
      (invoice: {
        commercialInvoiceNumber: any;
        clearanceCommercialInvoiceUrl: any;
      }) => ({
        documentName: "Commercial Invoice",
        documentNumber: invoice.commercialInvoiceNumber || "N/A",
        documentUrl: invoice.clearanceCommercialInvoiceUrl || "N/A",
      })
    ) || [];

  const actualInvoices =
    shipmentData?.saleInvoiceDetails?.commercialInvoices?.map(
      (invoice: {
        commercialInvoiceNumber: any;
        actualCommercialInvoiceUrl: any;
      }) => ({
        documentName: "Actual Invoice",
        documentNumber: invoice.commercialInvoiceNumber || "N/A",
        documentUrl: invoice.actualCommercialInvoiceUrl || "N/A",
      })
    ) || [];

  const saberInvoices =
    shipmentData?.saleInvoiceDetails?.commercialInvoices?.map(
      (invoice: { commercialInvoiceNumber: any; saberInvoiceUrl: any }) => ({
        documentName: "SABER Invoice",
        documentNumber: invoice.commercialInvoiceNumber || "N/A",
        documentUrl: invoice.saberInvoiceUrl || "N/A",
      })
    ) || [];

  const billsOfLading =
    shipmentData?.blDetails?.Bl?.map(
      (invoice: { blNumber: any; uploadBLUrl: any }) => ({
        documentName: "Bill of Lading",
        documentNumber: invoice.blNumber || "N/A",
        documentUrl: invoice.uploadBLUrl || "N/A",
      })
    ) || [];

  const certificates =
    shipmentData?.otherDetails
      ?.map(
        (cert: {
          certificateName: any;
          certificateNumber: any;
          uploadCopyOfCertificate: any;
        }) => ({
          documentName: "Certificate",
          documentNumber: cert.certificateNumber || "N/A",
          documentUrl: cert.uploadCopyOfCertificate || "N/A",
        })
      )
      .filter(
        (doc: { documentName: any; documentNumber: any; documentUrl: any }) =>
          doc.documentName && (doc.documentNumber || doc.documentUrl)
      ) || [];

  const documents = [
    ...transporterInvoices,
    ...forwarderInvoices,
    ...shippingBills,
    ...supplierActualInvoice,
    ...supplierInvoice,
    ...commercialInvoices,
    ...actualInvoices,
    ...saberInvoices,
    ...billsOfLading,
    ...certificates,
  ];

  return (
    <div className="w-full h-full flex flex-col p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="topbar flex items-center gap-4 justify-between w-full">
          <Link href="../">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="flex-1">
            <Heading
              className="leading-tight"
              title={`Shipment: ${
                shipmentData?.bookingDetails?.invoiceNumber || "N/A"
              }`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View and manage shipment details with insights into tracking,
              delivery status, and logistics.
            </p>
          </div>
          <div className="flex gap-2">
            <ShipmentLogs isView={true} logs={shipmentLogs} />
            <a
              href={`../edit/${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Edit</Button>
            </a>
            <ExportCsvButton shipmentData={shipmentData} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-10 w-full mt-4">
        <Card className="w-full flex flex-row items-center space-between p-6">
          <div className="flex w-1/2 items-center justify-between gap-4">
            <div className="flex flex-col">
              <Heading
                title={shipmentData?.bookingDetails?.portOfLoading || "N/A"}
                className="text-2xl font-semibold"
              />
              <p className="text-muted-foreground text-xs">
                Vessel Sailing Date:{" "}
                <span className="font-semibold text-black">
                  {shipmentData?.bookingDetails?.vesselSailingDate
                    ? moment(
                        shipmentData.bookingDetails.vesselSailingDate
                      ).format("MMM Do YY")
                    : "N/A"}
                </span>
              </p>
            </div>
            <div className="h-0.5 flex justify-center items-center w-full bg-gray-300">
              <ChevronRight className="h-6 w-6 text-gray-300" />
            </div>
            <div className="flex flex-col">
              <Heading
                title={shipmentData?.bookingDetails?.destinationPort || "N/A"}
                className="text-2xl font-semibold"
              />
              <p className="text-muted-foreground text-xs">
                Vessel Arriving Date:{" "}
                <span className="font-semibold text-black">
                  {shipmentData?.bookingDetails?.vesselArrivingDate
                    ? moment(
                        shipmentData.bookingDetails.vesselArrivingDate
                      ).format("MMM Do YY")
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex w-1/2 items-center justify-end gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs">Shipment Status:</p>
              <Badge
                className={cn(
                  shipmentData?.status === "Trucks Dispatched" &&
                    "bg-gray-200 text-gray-800 hover:bg-gray-200/70",
                  shipmentData?.status === "Trucks Arrived" &&
                    "bg-blue-200 text-blue-800 hover:bg-blue-300/80",
                  shipmentData?.status === "Trucks Halted" &&
                    "bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80",
                  shipmentData?.status === "Stuffing" &&
                    "bg-orange-200 text-orange-800 hover:bg-orange-400/80",
                  shipmentData?.status === "In Clearance" &&
                    "bg-purple-200 text-purple-800 hover:bg-purple-400/80",
                  shipmentData?.status === "Loaded On Vessel" &&
                    "bg-teal-200 text-teal-800 hover:bg-teal-400/80",
                  shipmentData?.status === "In Transit" &&
                    "bg-cyan-200 text-cyan-800 hover:bg-cyan-400/80",
                  shipmentData?.status === "Arrived At POD" &&
                    "bg-green-200 text-green-800 hover:bg-green-300/80",
                  shipmentData?.status === "Delivery Completed" &&
                    "bg-green-200 text-green-800 hover:bg-green-500/80",
                  ![
                    "Trucks Dispatched",
                    "Trucks Arrived",
                    "Trucks Halted",
                    "Stuffing",
                    "In Clearance",
                    "Loaded On Vessel",
                    "In Transit",
                    "Arrived At POD",
                    "Delivery Completed",
                  ].includes(shipmentData?.status) &&
                    "bg-muted-foreground/60 text-primary-foreground"
                )}
              >
                {shipmentData?.status || "N/A"}
              </Badge>
            </div>
          </div>
        </Card>
        <Tabs
          defaultValue="Shipment Overview"
          className="w-full overflow-hidden overflow-x-auto whitespace-nowrap"
        >
          <TabsList className="gap-2 flex-nowrap overflow-hidden overflow-x-auto whitespace-nowrap text-sm px-2">
            <TabsTrigger value="Shipment Overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="Booking details">Booking Details</TabsTrigger>
            <TabsTrigger value="Shipping Details">Shipping Details</TabsTrigger>
            <TabsTrigger value="Shipping Bills Details">
              Shipping Bills Details
            </TabsTrigger>
            <TabsTrigger value="Supplier Details">Supplier Details</TabsTrigger>
            <TabsTrigger value="Commercial Invoice Details">
              Commercial Invoice Details
            </TabsTrigger>
            <TabsTrigger value="Bill Of Lading Details">
              Bill Of Lading Details
            </TabsTrigger>
            <TabsTrigger value="Certificate Of Origin">
              Other details
            </TabsTrigger>
            <TabsTrigger value="Documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="Shipment Overview">
            <ViewShipment shipmentData={shipmentData} />
          </TabsContent>
          {/* Booking Details */}
          <TabsContent value="Booking details">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="mt-4 w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Invoice Number</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.invoiceNumber || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Booking Number</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.bookingNumber || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Port Of Loading</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.portOfLoading || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Destination Port</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.destinationPort ||
                            "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vessel Sailing Date</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.vesselSailingDate
                            ? format(
                                new Date(
                                  shipmentData.bookingDetails.vesselSailingDate
                                ),
                                "PPP"
                              )
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vessel Arriving Date</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.vesselArrivingDate
                            ? format(
                                new Date(
                                  shipmentData.bookingDetails.vesselArrivingDate
                                ),
                                "PPP"
                              )
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Review</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.review || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="w-full md:w-2/3">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected containers?"
                  bulkDeleteDescription="This will delete the selected containers from this shipment."
                  bulkDeleteToastMessage="Selected containers deleted successfully"
                  deleteRoute="shipment/deleteall"
                  searchKey="containerNumber"
                  data={shipmentData?.bookingDetails?.containers || []}
                  columns={BookingDetailsColumn}
                />
              </div>
            </div>
          </TabsContent>
          {/* Shipping Details */}
          <TabsContent value="Shipping Details">
            <div className="space-y-6">
              {/* Forwarder Details */}
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="mt-4 w-full md:w-1/3">
                  <CardHeader>
                    <CardTitle>Forwarder Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Forwarder Name</TableCell>
                          <TableCell>
                            {shipmentData?.shippingDetails?.forwarderName
                              ?.forwarderName || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Invoices</TableCell>
                          <TableCell>
                            {shipmentData?.shippingDetails?.forwarderInvoices
                              ?.length || 0}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="w-full md:w-2/3">
                  <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected invoices?"
                    bulkDeleteDescription="This will delete the selected forwarder invoices."
                    bulkDeleteToastMessage="Selected invoices deleted successfully"
                    deleteRoute="shipment/deleteall"
                    searchKey="invoiceNumber"
                    data={
                      shipmentData?.shippingDetails?.forwarderInvoices || []
                    }
                    columns={ForwarderDetailsColumn}
                  />
                </div>
              </div>

              {/* Transporter Details */}
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="mt-4 w-full md:w-1/3">
                  <CardHeader>
                    <CardTitle>Transporter Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Transporter Name</TableCell>
                          <TableCell>
                            {shipmentData?.shippingDetails?.transporterName
                              ?.transporterName || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Invoices</TableCell>
                          <TableCell>
                            {shipmentData?.shippingDetails?.transporterInvoices
                              ?.length || 0}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="w-full md:w-2/3">
                  <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected invoices?"
                    bulkDeleteDescription="This will delete the selected transporter invoices."
                    bulkDeleteToastMessage="Selected invoices deleted successfully"
                    deleteRoute="shipment/deleteall"
                    searchKey="invoiceNumber"
                    data={
                      shipmentData?.shippingDetails?.transporterInvoices || []
                    }
                    columns={TransporterDetailsColumn}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Shipping Bills Details */}
          <TabsContent value="Shipping Bills Details">
            {!shipmentData?.shippingBillDetails ? (
              <div>No shipping bill details available</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="mt-4 w-full md:w-1/3">
                  <CardHeader>
                    <CardTitle>Shipping Bills Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Port Code</TableCell>
                          <TableCell>
                            {shipmentData.shippingBillDetails.portCode || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Custom Broker</TableCell>
                          <TableCell>
                            {shipmentData.shippingBillDetails.cbName?.cbName ||
                              "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Custom Broker Code</TableCell>
                          <TableCell>
                            {shipmentData.shippingBillDetails.cbCode || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Bills</TableCell>
                          <TableCell>
                            {shipmentData.shippingBillDetails.ShippingBills
                              ?.length || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Review</TableCell>
                          <TableCell>
                            {shipmentData.shippingBillDetails.review || "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="w-full md:w-2/3">
                  <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected bills?"
                    bulkDeleteDescription="This will delete the selected shipping bills."
                    bulkDeleteToastMessage="Selected bills deleted successfully"
                    deleteRoute="shipment/deleteall"
                    searchKey="shippingBillNumber"
                    data={shipmentData.shippingBillDetails.ShippingBills || []}
                    columns={ShippingBillsDetailscolumn}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Supplier Details */}
          <TabsContent value="Supplier Details">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected invoices?"
                  bulkDeleteDescription="This will delete the selected supplier invoices."
                  bulkDeleteToastMessage="Selected invoices deleted successfully"
                  deleteRoute="shipment/deleteall"
                  searchKey="supplierInvoiceNumber"
                  data={
                    shipmentData?.supplierDetails?.clearance?.suppliers || []
                  }
                  columns={SupplierDetailscolumn}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Actual Supplier Details Section */}
              <Card className="mt-4 w-full md:w-1/3 ">
                <CardHeader>
                  <CardTitle>Actual Supplier Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Actual Supplier Name</TableCell>
                          <TableCell>
                            {shipmentData?.supplierDetails?.actual
                              ?.actualSupplierName || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Actual Invoice Value</TableCell>
                          <TableCell>
                            {shipmentData?.supplierDetails?.actual
                              ?.actualSupplierInvoiceValue || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Actual Invoice URL</TableCell>
                          <TableCell>
                            {shipmentData?.supplierDetails?.actual
                              ?.actualSupplierInvoiceUrl ? (
                              <a
                                href={
                                  shipmentData.supplierDetails.actual
                                    .actualSupplierInvoiceUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                <EyeIcon className="h-4 w-4 cursor-pointer" />
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Shipping Bill URL</TableCell>
                          <TableCell>
                            {shipmentData?.supplierDetails?.actual
                              ?.shippingBillUrl ? (
                              <a
                                href={
                                  shipmentData.supplierDetails.actual
                                    .actualSupplierInvoiceUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                <EyeIcon className="h-4 w-4 cursor-pointer" />
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Review</TableCell>
                          <TableCell>
                            {shipmentData?.supplierDetails?.review || "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Commercial Invoice Details */}
          <TabsContent value="Commercial Invoice Details">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="mt-4 w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Commercial Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Consignee</TableCell>
                        <TableCell>
                          {shipmentData?.saleInvoiceDetails?.consignee?.name ||
                            "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Actual Buyer</TableCell>
                        <TableCell>
                          {shipmentData?.saleInvoiceDetails?.actualBuyer ||
                            "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number Of Invoices</TableCell>
                        <TableCell>
                          {shipmentData?.saleInvoiceDetails?.commercialInvoices
                            ?.length || 0}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Review</TableCell>
                        <TableCell>
                          {shipmentData?.saleInvoiceDetails?.review || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="w-full md:w-2/3">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected invoices?"
                  bulkDeleteDescription="This will delete the selected commercial invoices."
                  bulkDeleteToastMessage="Selected invoices deleted successfully"
                  deleteRoute="shipment/deleteall"
                  searchKey="clearanceCommercialInvoiceNumber"
                  data={
                    shipmentData?.saleInvoiceDetails?.commercialInvoices || []
                  }
                  columns={CommercialInvoiceDetailscolumn}
                />
              </div>
            </div>
          </TabsContent>

          {/* Bill Of Lading Details */}
          <TabsContent value="Bill Of Lading Details">
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Card className="mt-4 w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Shipping Line Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Shipping Line Name</TableCell>
                        <TableCell>
                          {shipmentData?.blDetails?.shippingLineName
                            ?.shippingLineName || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number Of Bills</TableCell>
                        <TableCell>
                          {shipmentData?.blDetails?.Bl?.length || 0}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Review</TableCell>
                        <TableCell>
                          {shipmentData?.blDetails?.review || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="w-full md:w-2/3">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected invoices?"
                  bulkDeleteDescription="This will delete the selected shipping line invoices."
                  bulkDeleteToastMessage="Selected invoices deleted successfully"
                  deleteRoute="shipment/deleteall"
                  searchKey="blNumber"
                  data={shipmentData?.blDetails?.Bl || []}
                  columns={BillOfLandingColumn}
                />
              </div>
            </div>
          </TabsContent>

          {/* Certificate Of Origin (Other Details) */}
          <TabsContent value="Certificate Of Origin">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected certificates?"
                  bulkDeleteDescription="This will delete the selected certificates from this shipment."
                  bulkDeleteToastMessage="Selected certificates deleted successfully"
                  deleteRoute="shipment/deleteall"
                  searchKey="certificateNumber"
                  data={shipmentData?.otherDetails || []}
                  columns={OtherDetailsColumn}
                />
              </div>
            </div>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="Documents">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                {documents.length === 0 ? (
                  <div>No documents available</div>
                ) : (
                  <DataTable
                    searchKey="documentName"
                    data={documents}
                    columns={DocColumns}
                    showDropdown={true}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
