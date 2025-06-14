import { cookies } from "next/headers";
import axios from "axios";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import moment from "moment";

interface PartyData {
  name: string;
  address: string;
  responsiblePerson?: string;
  email?: string;
  mobileNo?: string;
  state?: string;
  factoryAddress?: string;
}

interface Shipment {
  _id: string;
  bookingDetails: {
    review: string;
    invoiceNumber: string;
    bookingNumber: string;
    portOfLoading: string;
    destinationPort: string;
    vesselSailingDate: string;
    vesselArrivingDate: string;
    containers: Array<{
      containerType: string;
      containerNumber: string;
      truckNumber: string;
      truckDriverContactNumber: string;
      addProductDetails: any[];
      _id: string;
    }>;
    _id: string;
  };
  shippingDetails: {
    review: string;
    transporterName: string;
    transporterInvoices: Array<{
      invoiceNumber: string;
      uploadInvoiceUrl: string;
      date: string;
      valueWithGst: number;
      valueWithoutGst: number;
      _id: string;
    }>;
    forwarderName: string;
    forwarderInvoices: Array<{
      invoiceNumber: string;
      uploadInvoiceUrl: string;
      date: string;
      valueWithGst: number;
      valueWithoutGst: number;
      _id: string;
    }>;
    _id: string;
  };
  shippingBillDetails: {
    review: string;
    portCode: string;
    cbName: string;
    cbCode: string;
    ShippingBills: Array<{
      shippingBillUrl: string;
      shippingBillNumber: string;
      shippingBillDate: string;
      drawbackValue: string;
      rodtepValue: string;
      _id: string;
    }>;
    _id: string;
  };
  supplierDetails: {
    review: string;
    clearance: {
      noOfSuppliers: number;
      suppliers: Array<{
        supplierName: string;
        noOfInvoices: number;
        invoices: Array<{
          supplierInvoiceNumber: string;
          supplierInvoiceDate: string;
          supplierInvoiceValueWithGST: string;
          supplierInvoiceValueWithOutGST: string;
          clearanceSupplierInvoiceUrl: string;
          _id: string;
        }>;
        _id: string;
      }>;
      _id: string;
    };
    actual: {
      actualSupplierName: string;
      actualSupplierInvoiceValue: string;
      actualSupplierInvoiceUrl: string;
      shippingBillUrl: string;
      _id: string;
    };
    _id: string;
  };
  saleInvoiceDetails: {
    review: string;
    consignee: string;
    actualBuyer: string;
    commercialInvoices: Array<{
      clearanceCommercialInvoiceNumber: string;
      clearanceCommercialInvoiceUrl: string;
      clearancecommercialInvoiceDate: string;
      clearanceCommercialInvoiceValue: string;
      actualCommercialInvoiceUrl: string;
      actualCommercialInvoiceValue: string;
      packingListUrl: string;
      saberInvoiceUrl: string;
      saberInvoiceValue: string;
      _id: string;
    }>;
    _id: string;
  };
  blDetails: {
    shippingLineName: string;
    noOfBl: number;
    Bl: Array<{
      blNumber: string;
      blDate: string;
      telexDate: string;
      uploadBLUrl: string;
      _id: string;
    }>;
    review: string;
    _id: string;
  };
  otherDetails: Array<{
    review: string;
    certificateName: string;
    certificateNumber: string;
    date: string;
    issuerOfCertificate: string;
    uploadCopyOfCertificate: string;
    _id: string;
  }>;
  organizationId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  createdBy: string;
  shipmentId: string;
}

interface Props {
  params: {
    organizationId: string;
    partyType: string;
    id: string;
  };
}

const partyConfig: Record<
  string,
  {
    endpoint: string;
    nameLabel: string;
    nameField: string;
    responseKey: string;
    fields: Array<keyof PartyData>;
  }
> = {
  shippingline: {
    endpoint: "/shipment/shippingline/getone",
    nameLabel: "Shipping Line Name",
    nameField: "shippingLineName",
    responseKey: "shipmentLine",
    fields: ["name", "address", "responsiblePerson", "email", "mobileNo"],
  },
  forwarder: {
    endpoint: "/shipment/forwarder/getone",
    nameLabel: "Forwarder Name",
    nameField: "forwarderName",
    responseKey: "findForwarder",
    fields: ["name", "address", "responsiblePerson", "email", "mobileNo"],
  },
  transporter: {
    endpoint: "/shipment/transporter/getone",
    nameLabel: "Transporter Name",
    nameField: "transporterName",
    responseKey: "findTransporter",
    fields: ["name", "address", "responsiblePerson", "email", "mobileNo"],
  },
  supplier: {
    endpoint: "/shipment/supplier/getbyid",
    nameLabel: "Supplier Name",
    nameField: "supplierName",
    responseKey: "findsupplier",
    fields: [
      "name",
      "address",
      "responsiblePerson",
      "mobileNo",
      "state",
      "factoryAddress",
    ],
  },
  consignee: {
    endpoint: "/shipment/consignee/getone",
    nameLabel: "Consignee Name",
    nameField: "name",
    responseKey: "getConsignee",
    fields: ["name", "address", "email", "mobileNo"],
  },
  cbname: {
    endpoint: "/shipment/cbname/get",
    nameLabel: "Custom Broker Name",
    nameField: "cbName",
    responseKey: "cbname",
    fields: ["name", "address", "email", "mobileNo"],
  },
};

const fieldLabels: Record<keyof PartyData, string> = {
  name: "",
  address: "Address",
  responsiblePerson: "Responsible Person",
  email: "Email",
  mobileNo: "Mobile No",
  state: "State",
  factoryAddress: "Factory Address",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PartyViewPage({ params }: Props) {
  const { organizationId, partyType, id } = params;
  const token = cookies().get("AccessToken")?.value || "";

  console.log("AccessToken in PartyViewPage:", token);

  const config = partyConfig[partyType.toLowerCase()];
  if (!config) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-red-500">Invalid party type: {partyType}</p>
      </div>
    );
  }

  let party: PartyData | null = null;
  let shipments: Shipment[] = [];
  let error = null;

  try {
    const response = await axios.get(
      `https://incodocs-server.onrender.com${config.endpoint}/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(`Raw API response for ${partyType}:`, response.data);

    const partyData = response.data[config.responseKey] || response.data;
    shipments = response.data.shipment || [];

    console.log(`Parsed party data for ${partyType}:`, partyData);
    console.log(`Shipments for ${partyType}:`, shipments);

    if (!partyData) throw new Error("No party data found");

    party = {
      name: partyData[config.nameField] || "",
      address: partyData.address || "",
      responsiblePerson: partyData.responsiblePerson || "",
      email: partyData.email || "",
      mobileNo:
        partyData.mobileNo?.toString() || partyData.mobileNumber?.toString() || "",
      state: partyData.state || "",
      factoryAddress: partyData.factoryAddress || "",
    };

    console.log(`Normalized party data for ${partyType}:`, party);
  } catch (err: any) {
    console.error(`Error fetching ${partyType} data:`, err.message);
    console.error(`Error details:`, err.response?.data);
    error = `Failed to fetch ${partyType} data: ${err.message}`;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!party || !party.name) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-gray-500">No party data found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="topbar flex items-center gap-4 justify-between w-full">
          <Link href={`/${organizationId}/documentation/parties`}>
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="flex-1">
            <Heading
              className="leading-tight"
              title={`${config.nameLabel} Details`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View all information associated with this {partyType}.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4 w-full mt-4">
        <Tabs defaultValue="Party Details" className="w-full">
          <TabsList className="gap-3 flex-wrap">
            <TabsTrigger value="Party Details">Party Details</TabsTrigger>
            <TabsTrigger value="Shipment Details">Shipment Details</TabsTrigger>
          </TabsList>

          <TabsContent value="Party Details">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="mt-4 w-full">
                <CardHeader>
                  <CardTitle>Party Details</CardTitle>
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
                      {config.fields.map((field) => (
                        <TableRow key={field}>
                          <TableCell>
                            {field === "name" ? config.nameLabel : fieldLabels[field]}
                          </TableCell>
                          <TableCell>{party?.[field] || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="Shipment Details">
            {shipments.length === 0 ? (
              <div>No shipment details available</div>
            ) : (
              shipments.map((shipment, index) => (
                <div key={index} className="flex flex-col gap-4 mt-4">
                  <Card className="w-full flex flex-row items-center justify-between p-6">
                    <div className="flex flex-col">
                      <Heading
                        title={`Shipment: ${shipment.shipmentId}`}
                        className="text-2xl font-semibold"
                      />
                      <p className="text-muted-foreground text-xs">
                        From: <span className="font-semibold text-black">{shipment.bookingDetails.portOfLoading}</span> To: <span className="font-semibold text-black">{shipment.bookingDetails.destinationPort}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-muted-foreground text-xs">Shipment Status:</p>
                      <Badge
                        className={cn(
                          shipment.status === "Trucks Dispatched" && "bg-gray-200 text-gray-800 hover:bg-gray-200/70",
                          shipment.status === "Trucks Arrived" && "bg-blue-200 text-blue-800 hover:bg-blue-300/80",
                          shipment.status === "Trucks Halted" && "bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80",
                          shipment.status === "Stuffing" && "bg-orange-200 text-orange-800 hover:bg-orange-400/80",
                          shipment.status === "In Clearance" && "bg-purple-200 text-purple-800 hover:bg-purple-400/80",
                          shipment.status === "Loaded On Vessel" && "bg-teal-200 text-teal-800 hover:bg-teal-400/80",
                          shipment.status === "In Transit" && "bg-cyan-200 text-cyan-800 hover:bg-cyan-400/80",
                          shipment.status === "Arrived At POD" && "bg-green-200 text-green-800 hover:bg-green-300/80",
                          shipment.status === "Delivery Completed" && "bg-green-600 text-green-800 hover:bg-green-500/80",
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
                          ].includes(shipment.status) && "bg-muted-foreground/60 text-primary-foreground"
                        )}
                      >
                        {shipment.status || "N/A"}
                      </Badge>
                    </div>
                  </Card>
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
                              <TableCell>Shipment ID</TableCell>
                              <TableCell>{shipment.shipmentId}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Invoice Number</TableCell>
                              <TableCell>{shipment.bookingDetails.invoiceNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Booking Number</TableCell>
                              <TableCell>{shipment.bookingDetails.bookingNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Port of Loading</TableCell>
                              <TableCell>{shipment.bookingDetails.portOfLoading}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Destination Port</TableCell>
                              <TableCell>{shipment.bookingDetails.destinationPort}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Vessel Sailing Date</TableCell>
                              <TableCell>
                                {shipment.bookingDetails.vesselSailingDate
                                  ? moment(shipment.bookingDetails.vesselSailingDate).format("MMM Do YY")
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Vessel Arriving Date</TableCell>
                              <TableCell>
                                {shipment.bookingDetails.vesselArrivingDate
                                  ? moment(shipment.bookingDetails.vesselArrivingDate).format("MMM Do YY")
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Created At</TableCell>
                              <TableCell>{formatDate(shipment.createdAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Updated At</TableCell>
                              <TableCell>{formatDate(shipment.updatedAt)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    <Card className="mt-4 w-full md:w-2/3">
                      <CardHeader>
                        <CardTitle>Container Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {shipment.bookingDetails.containers.length === 0 ? (
                          <div>No containers available</div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Container Type</TableHead>
                                <TableHead>Container Number</TableHead>
                                <TableHead>Truck Number</TableHead>
                                <TableHead>Driver Contact</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {shipment.bookingDetails.containers.map((container) => (
                                <TableRow key={container._id}>
                                  <TableCell>{container.containerType}</TableCell>
                                  <TableCell>{container.containerNumber}</TableCell>
                                  <TableCell>{container.truckNumber}</TableCell>
                                  <TableCell>{container.truckDriverContactNumber}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}