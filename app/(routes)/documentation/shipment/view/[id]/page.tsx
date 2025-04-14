import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
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
import { ShippingDetailsColumn } from "./Components/ShippingDetailscolumn";
import { SupplierDetailscolumn } from "./Components/SupplierDetailscolumn";
import { SaleInvoiceDetailscolumn } from "./Components/SaleInvoiceDetailscolumn";
import { ShippingBillsDetailscolumn } from "./Components/ShippingBillsDetailscolumn";
import { ForwarderDetailsColumn } from "./Components/ForwarderDetailscolumn";
import { TransporterDetailsColumn } from "./Components/TransporterDetailscolumn";
import { OtherDetailsColumn } from "./Components/OtherDetailsColumn";
import ExportCsvButton from "./Components/ExportCsvButton"


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
  const shipmentData = await res.json();
  console.log(shipmentData)

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
                shipmentData?.shipmentId || "N/A"
              }`}

            />
            <p className="text-muted-foreground text-sm mt-2">
              View and manage shipment details with insights into tracking,
              delivery status, and logistics.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`../edit/${params.id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <ExportCsvButton shipmentData={shipmentData} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-10 w-full mt-4">
        <Tabs defaultValue="Booking details" className="w-full">
          <TabsList className="gap-3 flex-wrap">
            <TabsTrigger value="Booking details">Booking Details</TabsTrigger>
            <TabsTrigger value="Shipping Details">Shipping Details</TabsTrigger>
            <TabsTrigger value="Shipping Bills Details">
              Shipping Bills Details
            </TabsTrigger>
            <TabsTrigger value="Supplier Details">Supplier Details</TabsTrigger>
            <TabsTrigger value="Sale Invoice Details">
              Sale Invoice Details
            </TabsTrigger>
            <TabsTrigger value="Bill Of Lading Details">
              Bill Of Lading Details
            </TabsTrigger>
            <TabsTrigger value="Certificate Of Origin">
              Other details
            </TabsTrigger>
          </TabsList>

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
                        <TableCell>Booking Number</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.bookingNumber}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Port Of Loading</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.portOfLoading}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Destination Port</TableCell>
                        <TableCell>
                          {shipmentData?.bookingDetails?.destinationPort}
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
                  deleteRoute="shipment/deleteall" // Adjust if needed
                  searchKey="containerNumber"
                  data={shipmentData?.bookingDetails?.containers || []}
                  columns={BookingDetailsColumn}
                // showDropdown={true}
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
                  // showDropdown={true}
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
                  // showDropdown={true}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Shipping Bills Details */}
          <TabsContent value="Shipping Bills Details">
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
                          {shipmentData?.shippingBillDetails?.portCode || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CB Name</TableCell>
                        <TableCell>
                          {shipmentData?.shippingBillDetails?.cbName || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CB Code</TableCell>
                        <TableCell>
                          {shipmentData?.shippingBillDetails?.cbCode || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number Of Bills</TableCell>
                        <TableCell>
                          {shipmentData?.shippingBillDetails?.ShippingBills
                            ?.length || 0}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Review</TableCell>
                        <TableCell>
                          {shipmentData?.shippingBillDetails?.review || "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className=" w-full md:w-2/3">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected bills?"
                  bulkDeleteDescription="This will delete the selected shipping bills."
                  bulkDeleteToastMessage="Selected bills deleted successfully"
                  deleteRoute="shipment/deleteall"
                  searchKey="shippingBillNumber"
                  data={shipmentData?.shippingBillDetails?.ShippingBills || []}
                  columns={ShippingBillsDetailscolumn}
                // showDropdown={true}
                />
              </div>
            </div>
          </TabsContent>

          {/* Supplier Details */}
          <TabsContent value="Supplier Details">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="mt-4 w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Supplier Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Clearance Supplier Details Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Clearance Supplier Details
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Supplier Name</TableCell>
                          <TableCell>
                            {shipmentData?.supplierDetails?.clearance
                              ?.supplierName?.supplierName || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Invoices</TableCell>
                          <TableCell>
                            {shipmentData?.supplierDetails?.clearance?.invoices
                              ?.length || 0}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Actual Supplier Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Actual Supplier Details
                    </h3>
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
                                View
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
                              ?.shippingBillUrl || "N/A"}
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
              <div className="w-full md:w-2/3">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected invoices?"
                  bulkDeleteDescription="This will delete the selected supplier invoices."
                  bulkDeleteToastMessage="Selected invoices deleted successfully"
                  deleteRoute="shipment/deleteall"
                  searchKey="supplierInvoiceNumber"
                  data={
                    shipmentData?.supplierDetails?.clearance?.invoices || []
                  }
                  columns={SupplierDetailscolumn}
                // showDropdown={true}
                />
              </div>
            </div>
          </TabsContent>

          {/* Sale Invoice Details */}
          <TabsContent value="Sale Invoice Details">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="mt-4 w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Sale Invoice Details</CardTitle>
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
                  searchKey="commercialInvoiceNumber"
                  data={
                    shipmentData?.saleInvoiceDetails?.commercialInvoices || []
                  }
                  columns={SaleInvoiceDetailscolumn}
                // showDropdown={true}
                />
              </div>
            </div>
          </TabsContent>

          {/* Bill Of Lading Details */}

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
                            {shipmentData?.shippingDetails?.shippingLineName
                              ?.shippingLineName || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Invoices</TableCell>
                          <TableCell>
                            {shipmentData?.shippingDetails?.shippingLineInvoices
                              ?.length || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Review</TableCell>
                          <TableCell>
                            {shipmentData?.shippingDetails?.review || "N/A"}
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
                    searchKey="invoiceNumber"
                    data={
                      shipmentData?.shippingDetails?.shippingLineInvoices || []
                    }
                    columns={ShippingDetailsColumn}
                  // showDropdown={true}
                  />
                </div>
                    </div>




          <TabsContent value="Bill Of Lading Details">
            <div className="flex flex-col md:flex-row gap-4">
              
              <Card className="mt-4 w-full md:w-1/2">
                <CardHeader>
                  <CardTitle>Bill Of Lading Details</CardTitle>
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
                        <TableCell>BL Number</TableCell>
                        <TableCell>
                          {shipmentData?.blDetails?.blNumber || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>BL Date</TableCell>
                        <TableCell>
                          {shipmentData?.blDetails?.blDate
                            ? format(
                              new Date(shipmentData.blDetails.blDate),
                              "PPP"
                            )
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Telex Date</TableCell>
                        <TableCell>
                          {shipmentData?.blDetails?.telexDate
                            ? format(
                              new Date(shipmentData.blDetails.telexDate),
                              "PPP"
                            )
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Uploaded BL</TableCell>
                        <TableCell>
                          {shipmentData?.blDetails?.uploadBL ? (
                            <a
                              href={shipmentData.blDetails.uploadBL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
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
                // showDropdown={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
