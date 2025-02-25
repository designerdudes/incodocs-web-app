/* eslint-disable react/jsx-no-undef */
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cookies } from "next/headers";
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

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  // console.log(params);

  const res = await fetch(
    `https://incodocs-server.onrender.com/shipment/getbyid/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => {
    return response.json();
  });
  let shipmentData;
  shipmentData = res;
  console.log(shipmentData);

  return (
    <div>
      <div className="w-full h-full flex  flex-col p-8">
        <div className="flex items-center  justify-between mb-4">
          <div className="topbar flex  items-center gap-4 justify-between w-full">
            <Link href="../">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div className="flex-1">
              <Heading
                className="leading-tight "
                title="View and Manage Shipment Details"
              />
              <p className="text-muted-foreground text-sm mt-2">
                View and manage shipment details with insights into tracking,
                delivery status, and logistics for efficient operations.
              </p>
            </div>
          </div>
        </div>
        <Separator />

        <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full mt-4">
          <div className="flex-1">
            <Tabs defaultValue="Booking details" className="w-full">
              <TabsList className="gap-3">
                <TabsTrigger className="gap-2" value="Booking details">
                  Booking Details
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="Shipping Details">
                  Shipping Details
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="Shipping Bills Details">
                  Shipping Bills Details
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="Supplier Details">
                  Supplier Details
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="Sale Invoice Details">
                  Sale Invoice Details
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="Bill Of Landing Details">
                  Bill Of Landing Details
                </TabsTrigger>
                <TabsTrigger className="gap-2" value="Certificate Of Origin">
                  Certificate Of Origin
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Booking details">
                <div className="flex gap-4">
                  <Card className="mt-4 w-1/3">
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
                            <TableCell className="whitespace-nowrap">
                              Booking Number
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.bookingNumber}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Port Of Loading
                            </TableCell>
                            <TableCell>{shipmentData?.bookingDetails?.portOfLoading}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Destination Port
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.destinationPort}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Vessel Sailing Date
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.vesselSailingDate}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Vessel Arriving Date
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.vesselArrivingDate}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Number Of Container
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.containers.length}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="mt-4 w-1/2">
                    <DataTable
                      bulkDeleteIdName="_id"
                      bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                      bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                      bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                      deleteRoute="shipment/deleteall"
                      searchKey="containerNumber"
                      data={shipmentData?.bookingDetails?.containers || []}  // Pass the containers array
                      columns={BookingDetailsColumn}
                      showDropdown={true} // ✅ Enable dropdown for Shipment Page
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="Shipping Details">
                <div className="space-y-4">
                  {/* Shipping Details Row */}
                  <div className="flex gap-4">
                    {/* Shipping Details Card */}
                    <Card className=" mt-4 w-1/3">
                      <CardHeader>
                        <CardTitle>Shipping Details</CardTitle>
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
                              <TableCell className="whitespace-nowrap">
                                Shipping Name
                              </TableCell>
                              <TableCell>
                                {shipmentData?.shippingDetails?.noOfShipmentinvoices}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="whitespace-nowrap">
                                Number Of Shipping Invoices
                              </TableCell>
                              <TableCell>
                                {shipmentData?.shippingDetails?.shippingLineInvoices.length}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Shipping Details Table */}
                    <div className="w-1/2">
                      <DataTable
                        bulkDeleteIdName="_id"
                        bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                        bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                        bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                        deleteRoute="shipment/deleteall"
                        searchKey="ShippingName"
                        data={shipmentData?.shippingDetails?.shippingLineInvoices || []}
                        columns={ShippingDetailsColumn}
                        showDropdown={true} // ✅ Enable dropdown for Shipment Page
                      />
                    </div>
                  </div>

                  {/* Forwarder Details Row */}
                  <div className="flex gap-4">
                    {/* Forwarder Details Card */}
                    <Card className="w-1/3">
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
                              <TableCell className="whitespace-nowrap">
                                Forwarder Name
                              </TableCell>
                              <TableCell>
                                {shipmentData?.shippingDetails?.forwarderName}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="whitespace-nowrap">
                                Number Of Forwarder Invoices
                              </TableCell>
                              <TableCell>
                                {shipmentData?.shippingDetails?.forwarderInvoices.length}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Forwarder Details Table */}
                    <div className="w-1/2">
                      <DataTable
                        bulkDeleteIdName="_id"
                        bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                        bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                        bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                        deleteRoute="shipment/deleteall"
                        searchKey="Forwarder"
                        data={shipmentData?.shippingDetails?.forwarderInvoices || []}
                        columns={ForwarderDetailsColumn}
                        showDropdown={true} // ✅ Enable dropdown for Shipment Page
                      />
                    </div>
                  </div>

                  {/* Transporter Details Row */}
                  <div className="flex gap-4">
                    {/* Transporter Details Card */}
                    <Card className="w-1/3">
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
                              <TableCell className="whitespace-nowrap">
                                Transporter Name
                              </TableCell>
                              <TableCell>
                                {shipmentData?.shippingDetails?.transporterName}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="whitespace-nowrap">
                                Number Of Transporter Invoices
                              </TableCell>
                              <TableCell>
                                {shipmentData?.shippingDetails?.transporterInvoices.length}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Transporter Details Table */}
                    <div className="w-1/2">
                      <DataTable
                        bulkDeleteIdName="_id"
                        bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                        bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                        bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                        deleteRoute="shipment/deleteall"
                        searchKey="Transporter"
                        data={shipmentData}
                        columns={TransporterDetailsColumn}
                        showDropdown={true} // ✅ Enable dropdown for Shipment Page
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="Shipping Bills Details">
                <div className="flex gap-4">
                  <Card className="mt-4 w-1/3">
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
                            <TableCell className="whitespace-nowrap">
                              Port Code
                            </TableCell>
                            <TableCell>
                              {
                                shipmentData?.ShippingBillsDetails
                                  ?.portCode
                              }
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              CB Name
                            </TableCell>
                            <TableCell>
                              {shipmentData?.CBName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              CD Code
                            </TableCell>
                            <TableCell>
                              {shipmentData?.CDCode}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Number Of Shipping Bills
                            </TableCell>
                            <TableCell>
                              {shipmentData?.NumberOfShippingBills}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <div className="mt-4 w-1/2">
                    <DataTable
                      bulkDeleteIdName="_id"
                      bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                      bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                      bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                      deleteRoute="shipment/deleteall"
                      searchKey="ShippingBills"
                      data={shipmentData}
                      columns={ShippingBillsDetailscolumn}
                      showDropdown={true} // ✅ Enable dropdown for Shipment Page
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Supplier Details">
                <div className="flex gap-4">
                  <Card className="mt-4 w-1/4">
                    <CardHeader>
                      <CardTitle>Supplier Details</CardTitle>
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
                            <TableCell className="whitespace-nowrap">
                              Supplier Name
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.SupplierName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Number OF Supplier Invoices
                            </TableCell>
                            <TableCell>
                              {shipmentData?.NumberOfInvoices}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Actual Supplier Name
                            </TableCell>
                            <TableCell>
                              {shipmentData?.actualSupplierName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Actual Supplier Invoice Value
                            </TableCell>
                            <TableCell>{shipmentData?.actualSupplierInvoiceValue}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Actual Supplier Invoice Url
                            </TableCell>
                            <TableCell>
                              {shipmentData?.actualSupplierInvoiceUrl}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Shipping Bill Url
                            </TableCell>
                            <TableCell>
                              {shipmentData?.shippingBillUrl}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <div className="mt-4 w-1/2">
                    <DataTable
                      bulkDeleteIdName="_id"
                      bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                      bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                      bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                      deleteRoute="shipment/deleteall"
                      searchKey="SupplierName"
                      data={shipmentData}
                      columns={SupplierDetailscolumn}
                      showDropdown={true} // ✅ Enable dropdown for Shipment Page
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Sale Invoice Details">
                <div className="flex gap-4">
                  <Card className="mt-4 w-1/3">
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
                            <TableCell className="whitespace-nowrap">
                              Consignee Name
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.ConsigneeName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Actual Buyer
                            </TableCell>
                            <TableCell>
                              {shipmentData?.actualBuyer}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Number Of  Commercial Invoices
                            </TableCell>
                            <TableCell>
                              {shipmentData?.NumberOfCommercialInvoices}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <div className="mt-4 w-1/2">
                    <DataTable
                      bulkDeleteIdName="_id"
                      bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                      bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                      bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                      deleteRoute="shipment/deleteall"
                      searchKey="ConsigneeName"
                      data={shipmentData}
                      columns={SaleInvoiceDetailscolumn}
                      showDropdown={true} // ✅ Enable dropdown for Shipment Page
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Bill Of Landing Details">
                <div className="flex gap-4">
                  <Card className="mt-4 w-1/2">
                    <CardHeader>
                      <CardTitle>Bill Of Landing Details</CardTitle>
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
                            <TableCell className="whitespace-nowrap">
                              Bill Number
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.BillNumber}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Bill Date
                            </TableCell>
                            <TableCell>
                              {shipmentData?.BillDate}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Telex Date
                            </TableCell>
                            <TableCell>
                              {shipmentData?.TelexDate}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              upload Bill
                            </TableCell>
                            <TableCell>{shipmentData?.uploadBill}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="Certificate Of Origin">
                <div className="flex gap-4">
                  <Card className="mt-4 w-1/2">
                    <CardHeader>
                      <CardTitle>Certificate Of Origin</CardTitle>
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
                            <TableCell className="whitespace-nowrap">
                              Certificate Name
                            </TableCell>
                            <TableCell>
                              {shipmentData?.bookingDetails?.CertificateName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Certificate Number
                            </TableCell>
                            <TableCell>
                              {shipmentData?.CertificateNumber}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Date
                            </TableCell>
                            <TableCell>
                              {shipmentData?.Date}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Issuer Of Certificate
                            </TableCell>
                            <TableCell>{shipmentData?.IssuerOfCertificate}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Upload Copy Of Certificate
                            </TableCell>
                            <TableCell>
                              {shipmentData?.UploadCopyOfCertificate}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}