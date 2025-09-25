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
import { BookingDetailsColumn } from "../../../view/[id]/Components/BookingDetailsColumn";
import { BillOfLandingColumn } from "../../../view/[id]/Components/BillOfLandingColumn";
import { SupplierDetailscolumn } from "../../../view/[id]/Components/SupplierDetailscolumn";
import { CommercialInvoiceDetailscolumn } from "../../../view/[id]/Components/CommercialInvoiceDetailscolumn";
import { ShippingBillsDetailscolumn } from "../../../view/[id]/Components/ShippingBillsDetailscolumn";
import { ForwarderDetailsColumn } from "../../../view/[id]/Components/ForwarderDetailscolumn";
import { TransporterDetailsColumn } from "../../../view/[id]/Components/TransporterDetailscolumn";
import { OtherDetailsColumn } from "../../../view/[id]/Components/OtherDetailsColumn";
import ExportCsvButton from "../../../view/[id]/Components/ExportCsvButton";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DocColumns } from "../../../view/[id]/Components/DocumentColumns";
import ViewShipment from "../../../view/[id]/Components/ViewShipment";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  // const cookieStore = cookies();
  // const token = cookieStore.get("AccessToken")?.value || "";

  try {
    var res = await fetchWithAuth<any>(`/shipmentdrafts/getbyid/${params.id}`);
  } catch (error) {
    console.log("failed to fetch drafts");
    res = null;
  }

  const responseData = res;
  // Handle both possible response structures
  const draftData =
    responseData?.shipmentDraft ||
    responseData?.shipmentDrafts?.find(
      (draft: any) => draft._id === params.id
    ) ||
    {};

  console.log("Extracted draft data:", draftData);

  if (!draftData._id) {
    return <div>No draft found for ID: {params.id}</div>;
  }

  // Extract documents from draftData
  const transporterInvoices =
    draftData?.shippingDetails?.transporterInvoices?.map(
      (invoice: { invoiceNumber: any; uploadInvoiceUrl: any }) => ({
        documentName: "Transporter Invoice",
        documentNumber: invoice.invoiceNumber || "N/A",
        documentUrl: invoice.uploadInvoiceUrl || "",
      })
    ) || [];

  const forwarderInvoices =
    draftData?.shippingDetails?.forwarderInvoices?.map(
      (invoice: { invoiceNumber: any; uploadInvoiceUrl: any }) => ({
        documentName: "Forwarder Invoice",
        documentNumber: invoice.invoiceNumber || "N/A",
        documentUrl: invoice.uploadInvoiceUrl || "",
      })
    ) || [];

  const shippingBills =
    draftData?.shippingBillDetails?.ShippingBills?.map(
      (invoice: { shippingBillNumber: any; shippingBillUrl: any }) => ({
        documentName: "Shipping Bill",
        documentNumber: invoice.shippingBillNumber || "N/A",
        documentUrl: invoice.shippingBillUrl || "",
      })
    ) || [];

  const supplierActualInvoice = draftData?.supplierDetails?.actual
    ? [
        {
          documentName: "Supplier Actual Invoice",
          documentNumber:
            draftData.supplierDetails.actual.actualSupplierName || "N/A",
          documentUrl:
            draftData.supplierDetails.actual.actualSupplierInvoiceUrl || "",
        },
      ]
    : [];

  // Fixed supplierInvoice extraction to map nested invoices correctly
  const supplierInvoice =
    draftData?.supplierDetails?.clearance?.suppliers?.flatMap(
      (supplier: any) =>
        supplier.invoices?.map(
          (invoice: {
            supplierInvoiceNumber: any;
            clearanceSupplierInvoiceUrl: any;
          }) => ({
            documentName: "Supplier Invoice",
            documentNumber: invoice.supplierInvoiceNumber || "N/A",
            documentUrl: invoice.clearanceSupplierInvoiceUrl || "",
          })
        ) || []
    ) || [];

  const commercialInvoices =
    draftData?.saleInvoiceDetails?.commercialInvoices?.map(
      (invoice: {
        commercialInvoiceNumber: any;
        clearanceCommercialInvoiceUrl: any;
      }) => ({
        documentName: "Commercial Invoice",
        documentNumber: invoice.commercialInvoiceNumber || "N/A",
        documentUrl: invoice.clearanceCommercialInvoiceUrl || "",
      })
    ) || [];

  const actualInvoices =
    draftData?.saleInvoiceDetails?.commercialInvoices?.map(
      (invoice: {
        commercialInvoiceNumber: any;
        actualCommercialInvoiceUrl: any;
      }) => ({
        documentName: "Actual Invoice",
        documentNumber: invoice.commercialInvoiceNumber || "N/A",
        documentUrl: invoice.actualCommercialInvoiceUrl || "",
      })
    ) || [];

  const saberInvoices =
    draftData?.saleInvoiceDetails?.commercialInvoices?.map(
      (invoice: { commercialInvoiceNumber: any; saberInvoiceUrl: any }) => ({
        documentName: "SABER Invoice",
        documentNumber: invoice.commercialInvoiceNumber || "N/A",
        documentUrl: invoice.saberInvoiceUrl || "",
      })
    ) || [];

  const billsOfLading =
    draftData?.blDetails?.Bl?.map(
      (invoice: { blNumber: any; uploadBLUrl: any }) => ({
        documentName: "Bill of Lading",
        documentNumber: invoice.blNumber || "N/A",
        documentUrl: invoice.uploadBLUrl || "",
      })
    ) || [];

  const certificates =
    draftData?.otherDetails
      ?.map(
        (cert: {
          certificateName: any;
          certificateNumber: any;
          uploadCopyOfCertificate: any;
        }) => ({
          documentName: "Certificate",
          documentNumber: cert.certificateNumber || "N/A",
          documentUrl: cert.uploadCopyOfCertificate || "",
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
              title={`Draft: ${draftData?.bookingDetails?.invoiceNumber || draftData._id}`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View and manage draft details with insights into tracking, delivery status, and logistics.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`../edit/${params.id}`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <ExportCsvButton shipmentData={draftData} />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-10 w-full mt-4">
        <Card className="w-full flex flex-row items-center justify-between p-6">
          <div className="flex w-1/2 items-center justify-between gap-4">
            <div className="flex flex-col">
              <Heading
                title={draftData?.bookingDetails?.portOfLoading || "N/A"}
                className="text-2xl font-semibold"
              />
              <p className="text-muted-foreground text-xs">
                Vessel Sailing Date:{" "}
                <span className="font-semibold text-black">
                  {draftData?.bookingDetails?.vesselSailingDate
                    ? moment(draftData.bookingDetails.vesselSailingDate).format("MMM Do YY")
                    : "N/A"}
                </span>
              </p>
            </div>
            <div className="h-0.5 flex justify-center items-center w-full bg-gray-300">
              <ChevronRight className="h-6 w-6 text-gray-300" />
            </div>
            <div className="flex flex-col">
              <Heading
                title={draftData?.bookingDetails?.destinationPort || "N/A"}
                className="text-2xl font-semibold"
              />
              <p className="text-muted-foreground text-xs">
                Vessel Arriving Date:{" "}
                <span className="font-semibold text-black">
                  {draftData?.bookingDetails?.vesselArrivingDate
                    ? moment(draftData.bookingDetails.vesselArrivingDate).format("MMM Do YY")
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex w-1/2 items-center justify-end gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs">Draft Status:</p>
              <Badge
                className={cn(
                  draftData?.status === "Trucks Dispatched" && "bg-gray-200 text-gray-800 hover:bg-gray-200/70",
                  draftData?.status === "Trucks Arrived" && "bg-blue-200 text-blue-800 hover:bg-blue-300/80",
                  draftData?.status === "Trucks Halted" && "bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80",
                  draftData?.status === "Stuffing" && "bg-orange-200 text-orange-800 hover:bg-orange-400/80",
                  draftData?.status === "In Clearance" && "bg-purple-200 text-purple-800 hover:bg-purple-400/80",
                  draftData?.status === "Loaded On Vessel" && "bg-teal-200 text-teal-800 hover:bg-teal-400/80",
                  draftData?.status === "In Transit" && "bg-cyan-200 text-cyan-800 hover:bg-cyan-400/80",
                  draftData?.status === "Arrived At POD" && "bg-green-200 text-green-800 hover:bg-green-300/80",
                  draftData?.status === "Delivery Completed" && "bg-green-200 text-green-800 hover:bg-green-500/80",
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
                  ].includes(draftData?.status) && "bg-muted-foreground/60 text-primary-foreground"
                )}
              >
                {draftData?.status || "N/A"}
              </Badge>
            </div>
          </div>
        </Card>
        <Tabs defaultValue="Draft Overview" className="w-full overflow-hidden overflow-x-auto whitespace-nowrap">
          <TabsList className="gap-2 flex-nowrap overflow-hidden overflow-x-auto whitespace-nowrap text-sm px-2">
            <TabsTrigger value="Draft Overview">Overview</TabsTrigger>
            <TabsTrigger value="Booking details">Booking Details</TabsTrigger>
            <TabsTrigger value="Shipping Details">Shipping Details</TabsTrigger>
            <TabsTrigger value="Shipping Bills Details">Shipping Bills Details</TabsTrigger>
            <TabsTrigger value="Supplier Details">Supplier Details</TabsTrigger>
            <TabsTrigger value="Commercial Invoice Details">Commercial Invoice Details</TabsTrigger>
            <TabsTrigger value="Bill Of Lading Details">Bill Of Lading Details</TabsTrigger>
            <TabsTrigger value="Certificate Of Origin">Other details</TabsTrigger>
            <TabsTrigger value="Documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="Draft Overview">
            <ViewShipment shipmentData={draftData} />
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
                        <TableCell>{draftData?.bookingDetails?.invoiceNumber || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Booking Number</TableCell>
                        <TableCell>{draftData?.bookingDetails?.bookingNumber || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Port Of Loading</TableCell>
                        <TableCell>{draftData?.bookingDetails?.portOfLoading || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Destination Port</TableCell>
                        <TableCell>{draftData?.bookingDetails?.destinationPort || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vessel Sailing Date</TableCell>
                        <TableCell>
                          {draftData?.bookingDetails?.vesselSailingDate
                            ? format(new Date(draftData.bookingDetails.vesselSailingDate), "PPP")
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vessel Arriving Date</TableCell>
                        <TableCell>
                          {draftData?.bookingDetails?.vesselArrivingDate
                            ? format(new Date(draftData.bookingDetails.vesselArrivingDate), "PPP")
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Review</TableCell>
                        <TableCell>{draftData?.bookingDetails?.review || "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="w-full md:w-2/3">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected containers?"
                  bulkDeleteDescription="This will delete the selected containers from this draft."
                  bulkDeleteToastMessage="Selected containers deleted successfully"
                  deleteRoute="shipmentdrafts/deleteall"
                  searchKey="containerNumber"
                  data={draftData?.bookingDetails?.containers || []}
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
                          <TableCell>{draftData?.shippingDetails?.forwarderName?.forwarderName || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Address</TableCell>
                          <TableCell>{draftData?.shippingDetails?.forwarderName?.address || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Responsible Person</TableCell>
                          <TableCell>{draftData?.shippingDetails?.forwarderName?.responsiblePerson || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mobile Number</TableCell>
                          <TableCell>{draftData?.shippingDetails?.forwarderName?.mobileNo || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Email</TableCell>
                          <TableCell>{draftData?.shippingDetails?.forwarderName?.email || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Invoices</TableCell>
                          <TableCell>{draftData?.shippingDetails?.noOfForwarderinvoices || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Review</TableCell>
                          <TableCell>{draftData?.shippingDetails?.review || "N/A"}</TableCell>
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
                    deleteRoute="shipmentdrafts/deleteall"
                    searchKey="invoiceNumber"
                    data={draftData?.shippingDetails?.forwarderInvoices || []}
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
                          <TableCell>{draftData?.shippingDetails?.transporterName?.transporterName || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Address</TableCell>
                          <TableCell>{draftData?.shippingDetails?.transporterName?.address || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Responsible Person</TableCell>
                          <TableCell>{draftData?.shippingDetails?.transporterName?.responsiblePerson || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mobile Number</TableCell>
                          <TableCell>{draftData?.shippingDetails?.transporterName?.mobileNo || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Email</TableCell>
                          <TableCell>{draftData?.shippingDetails?.transporterName?.email || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Invoices</TableCell>
                          <TableCell>{draftData?.shippingDetails?.noOftransportinvoices || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Review</TableCell>
                          <TableCell>{draftData?.shippingDetails?.review || "N/A"}</TableCell>
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
                    deleteRoute="shipmentdrafts/deleteall"
                    searchKey="invoiceNumber"
                    data={draftData?.shippingDetails?.transporterInvoices || []}
                    columns={TransporterDetailsColumn}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          {/* Shipping Bills Details */}
          <TabsContent value="Shipping Bills Details">
            {!draftData?.shippingBillDetails ? (
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
                          <TableCell>{draftData.shippingBillDetails.portCode || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Custom Broker</TableCell>
                          <TableCell>{draftData.shippingBillDetails.cbName?.cbName || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Custom Broker Code</TableCell>
                          <TableCell>{draftData.shippingBillDetails.cbCode || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Broker Email</TableCell>
                          <TableCell>{draftData.shippingBillDetails.cbName?.email || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Broker Mobile</TableCell>
                          <TableCell>{draftData.shippingBillDetails.cbName?.mobileNo || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Broker Address</TableCell>
                          <TableCell>{draftData.shippingBillDetails.cbName?.address || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Number Of Bills</TableCell>
                          <TableCell>{draftData.shippingBillDetails.ShippingBills?.length || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Review</TableCell>
                          <TableCell>{draftData.shippingBillDetails.review || "N/A"}</TableCell>
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
                    deleteRoute="shipmentdrafts/deleteall"
                    searchKey="shippingBillNumber"
                    data={draftData.shippingBillDetails.ShippingBills || []}
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
                  deleteRoute="shipmentdrafts/deleteall"
                  searchKey="supplierInvoiceNumber"
                  data={draftData?.supplierDetails?.clearance?.suppliers || []}
                  columns={SupplierDetailscolumn}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="mt-4 w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Actual Supplier Details</CardTitle>
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
                        <TableCell>Actual Supplier Name</TableCell>
                        <TableCell>{draftData?.supplierDetails?.actual?.actualSupplierName || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Actual Invoice Value</TableCell>
                        <TableCell>
                          {draftData?.supplierDetails?.actual?.actualSupplierInvoiceValue
                            ? `₹${draftData.supplierDetails.actual.actualSupplierInvoiceValue}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Actual Invoice URL</TableCell>
                        <TableCell>
                          {draftData?.supplierDetails?.actual?.actualSupplierInvoiceUrl ? (
                            <a
                              href={draftData.supplierDetails.actual.actualSupplierInvoiceUrl}
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
                          {draftData?.supplierDetails?.actual?.shippingBillUrl ? (
                            <a
                              href={draftData.supplierDetails.actual.shippingBillUrl}
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
                        <TableCell>Status</TableCell>
                        <TableCell>{draftData?.supplierDetails?.status || "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                        <TableCell>Consignee Name</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.consignee?.name || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Consignee Address</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.consignee?.address || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Consignee Mobile</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.consignee?.mobileNo || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Consignee Email</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.consignee?.email || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Actual Buyer</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.actualBuyer || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number Of Invoices</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.commercialInvoices?.length || 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Review</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.review || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>{draftData?.saleInvoiceDetails?.status || "N/A"}</TableCell>
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
                  deleteRoute="shipmentdrafts/deleteall"
                  searchKey="clearanceCommercialInvoiceNumber"
                  data={draftData?.saleInvoiceDetails?.commercialInvoices || []}
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
                        <TableCell>{draftData?.blDetails?.shippingLineName?.shippingLineName || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell>{draftData?.blDetails?.shippingLineName?.address || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Responsible Person</TableCell>
                        <TableCell>{draftData?.blDetails?.shippingLineName?.responsiblePerson || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mobile Number</TableCell>
                        <TableCell>{draftData?.blDetails?.shippingLineName?.mobileNo || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>{draftData?.blDetails?.shippingLineName?.email || "N/A"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Number Of Bills</TableCell>
                        <TableCell>{draftData?.blDetails?.noOfBl || 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>{draftData?.blDetails?.status || "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="w-full md:w-2/3">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected invoices?"
                  bulkDeleteDescription="This will delete the selected shipping bills."
                  bulkDeleteToastMessage="Selected invoices deleted successfully"
                  deleteRoute="bulk/delete"
                  searchKey="id"
                  data={billsOfLading}
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
                  bulkDeleteDescription="Are you sure you want to delete selected certificates."
                  bulkDeleteToastMessage="Selected certificates deleted successfully"
                  deleteRoute="bulk/delete"
                  searchKey="certificateNumber"
                  data={draftData?.otherDetails || []}
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