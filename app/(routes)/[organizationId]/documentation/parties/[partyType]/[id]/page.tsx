import { cookies } from "next/headers";
import axios from "axios";
import Link from "next/link";
import { ChevronLeft, EyeIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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

interface Document {
  fileName: string;
  fileUrl: string;
  date: string;
  review: string;
  _id: string;
}

interface Invoice {
  invoiceNumber: string;
  uploadInvoiceUrl: string;
  date: string;
  valueWithGst: number;
  valueWithoutGst: number;
  _id: string;
}

interface BillOfLading {
  blNumber: string;
  blDate: string;
  telexDate: string;
  uploadBLUrl: string;
  _id: string;
}

interface ShippingBill {
  shippingBillNumber: string;
  shippingBillDate: string;
  drawbackValue: number;
  rodtepValue: number;
  shippingBillUrl: string;
  _id: string;
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
    _id: string;
  };
  shippingDetails: {
    transporterName: string;
    forwarderName: string;
    forwarderInvoices: Invoice[];
    transporterInvoices: Invoice[];
    _id: string;
  };
  shippingBillDetails: {
    cbName: string;
    ShippingBills: ShippingBill[];
    _id: string;
  };
  supplierDetails: {
    clearance: {
      suppliers: Array<{
        supplierName: string;
        invoices: Array<{
          supplierInvoiceNumber: string;
          clearanceSupplierInvoiceUrl: string;
          supplierInvoiceDate: string;
          supplierInvoiceValueWithGST: number;
          supplierInvoiceValueWithOutGST: number;
          _id: string;
        }>;
      }>;
    };
    actual: {
      actualSupplierName: string;
    };
    _id: string;
  };
  saleInvoiceDetails: {
    consignee: string;
    commercialInvoices: Array<{
      clearanceCommercialInvoiceNumber: string;
      clearanceCommercialInvoiceUrl: string;
      clearancecommercialInvoiceDate: string;
      clearanceCommercialInvoiceValue: number;
      actualCommercialInvoiceValue: number;
      _id: string;
    }>;
    _id: string;
  };
  blDetails: {
    shippingLineName: string;
    Bl: BillOfLading[];
    _id: string;
  };
  organizationId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
    shipmentField: string;
    shipmentNamePath: string;
    invoiceField: string;
  }
> = {
  shippingline: {
    endpoint: "/shipment/shippingline/getone",
    nameLabel: "Shipping Line",
    nameField: "shippingLineName",
    responseKey: "shipmentLine",
    fields: ["name", "address", "responsiblePerson", "email", "mobileNo"],
    shipmentField: "blDetails",
    shipmentNamePath: "shippingLineName",
    invoiceField: "blDetails.Bl",
  },
  forwarder: {
    endpoint: "/shipment/forwarder/getone",
    nameLabel: "Forwarder",
    nameField: "forwarderName",
    responseKey: "findForwarder",
    fields: ["name", "address", "responsiblePerson", "email", "mobileNo"],
    shipmentField: "shippingDetails",
    shipmentNamePath: "forwarderName",
    invoiceField: "shippingDetails.forwarderInvoices",
  },
  transporter: {
    endpoint: "/shipment/transporter/getone",
    nameLabel: "Transporter",
    nameField: "transporterName",
    responseKey: "findTransporter",
    fields: ["name", "address", "responsiblePerson", "email", "mobileNo"],
    shipmentField: "shippingDetails",
    shipmentNamePath: "transporterName",
    invoiceField: "shippingDetails.transporterInvoices",
  },
  supplier: {
    endpoint: "/shipment/supplier/getbyid",
    nameLabel: "Supplier",
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
    shipmentField: "supplierDetails",
    shipmentNamePath: "clearance.suppliers.0.supplierName",
    invoiceField: "supplierDetails.clearance.suppliers.0.invoices",
  },
  consignee: {
    endpoint: "/shipment/consignee/getone",
    nameLabel: "Consignee",
    nameField: "name",
    responseKey: "getConsignee",
    fields: ["name", "address", "email", "mobileNo"],
    shipmentField: "saleInvoiceDetails",
    shipmentNamePath: "consignee",
    invoiceField: "saleInvoiceDetails.commercialInvoices",
  },
  cbname: {
    endpoint: "/shipment/cbname/get",
    nameLabel: "Custom Broker",
    nameField: "cbName",
    responseKey: "cbname",
    fields: ["name", "address", "email", "mobileNo"],
    shipmentField: "shippingBillDetails",
    shipmentNamePath: "cbName",
    invoiceField: "shippingBillDetails.ShippingBills",
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

async function fetchPartyDetails(
  partyType: string,
  shipment: Shipment,
  token: string,
  partyId: string
): Promise<PartyData | null> {
  const config = partyConfig[partyType.toLowerCase()];
  if (!config) return null;

  let partyIdOrName: string = "N/A";
  try {
    const [section, ...path] = config.shipmentNamePath.split(".");
    let value = (shipment as any)[section];
    for (const key of path) {
      value = value ? value[key] : null;
      if (Array.isArray(value)) {
        value = value.find((s: any) => s.supplierName === partyId)?.supplierName || "N/A";
      }
    }
    partyIdOrName = value || "N/A";

    if (partyIdOrName === partyId || !partyIdOrName.match(/^[0-9a-fA-F]{24}$/)) {
      return {
        name: partyIdOrName,
        address: "N/A",
        responsiblePerson: "N/A",
        email: "N/A",
        mobileNo: "N/A",
        state: "N/A",
        factoryAddress: "N/A",
      };
    }

    const response = await axios.get(
      `https://incodocs-server.onrender.com${config.endpoint}/${partyIdOrName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const partyData = response.data[config.responseKey] || response.data;
    return {
      name: partyData[config.nameField] || "N/A",
      address: partyData.address || "N/A",
      responsiblePerson: partyData.responsiblePerson || "N/A",
      email: partyData.email || "N/A",
      mobileNo:
        partyData.mobileNo?.toString() ||
        partyData.mobileNumber?.toString() ||
        "N/A",
      state: partyData.state || "N/A",
      factoryAddress: partyData.factoryAddress || "N/A",
    };
  } catch (err: any) {
    console.error(`Error fetching party details for ${partyType}:`, err.message);
    return {
      name: partyIdOrName,
      address: "N/A",
      responsiblePerson: "N/A",
      email: "N/A",
      mobileNo: "N/A",
      state: "N/A",
      factoryAddress: "N/A",
    };
  }
}

export default async function PartyViewPage({ params }: Props) {
  const { organizationId, partyType, id } = params;
  const token = cookies().get("AccessToken")?.value || "";

  const config = partyConfig[partyType.toLowerCase()];
  if (!config) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-red-500">Invalid party type: {partyType}</p>
      </div>
    );
  }

  let party: PartyData | null = null;
  let documents: Document[] = [];
  let shipments: Shipment[] = [];
  let error = null;

  try {
    const response = await axios.get(
      `https://incodocs-server.onrender.com${config.endpoint}/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const partyData = response.data[config.responseKey] || response.data;
    documents = partyData.documents || [];
    shipments = response.data.shipment || [];

    if (!partyData) throw new Error("No party data found");

    party = {
      name: partyData[config.nameField] || "N/A",
      address: partyData.address || "N/A",
      responsiblePerson: partyData.responsiblePerson || "N/A",
      email: partyData.email || "N/A",
      mobileNo:
        partyData.mobileNo?.toString() ||
        partyData.mobileNumber?.toString() ||
        "N/A",
      state: partyData.state || "N/A",
      factoryAddress: partyData.factoryAddress || "N/A",
    };
  } catch (err: any) {
    console.error(`Error fetching ${partyType} data:`, err.message);
    error = `Failed to fetch ${partyType} data: ${err.message}`;
  }

  if (error || !party || !party.name) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-red-500">{error || "No party data found"}</p>
      </div>
    );
  }

  const shipmentPartyDetails = await Promise.all(
    shipments.map(async (shipment) => {
      const details = await fetchPartyDetails(partyType, shipment, token, id);
      return { shipmentId: shipment._id, details };
    })
  );

  const rowsPerPage = 10;
  const currentPage = 1;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="mt-4 col-span-1">
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
              <Card className="mt-4 col-span-1">
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div>No documents available</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Review</TableHead>
                          <TableHead>View</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc) => (
                          <TableRow key={doc._id}>
                            <TableCell>{doc.fileName}</TableCell>
                            <TableCell>{formatDate(doc.date)}</TableCell>
                            <TableCell>{doc.review}</TableCell>
                            <TableCell>
                              {doc.fileUrl && doc.fileUrl !== "undefined" ? (
                                <a
                                  href={doc.fileUrl}
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
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="Shipment Details">
            {shipments.length === 0 ? (
              <div className="flex items-center justify-center h-60">
                <p className="text-gray-500">No party data available</p>
              </div>
            ) : (
              shipments.map((shipment, index) => {
                const partyDetails = shipmentPartyDetails.find(
                  (spd) => spd.shipmentId === shipment._id
                )?.details;

                let invoices: Invoice[] = [];
                if (partyType.toLowerCase() === "supplier") {
                  const supplierInvoices =
                    shipment.supplierDetails.clearance.suppliers.find(
                      (s) => s.supplierName === id
                    )?.invoices || [];
                  invoices = supplierInvoices.map((inv) => ({
                    invoiceNumber: inv.supplierInvoiceNumber,
                    uploadInvoiceUrl: inv.clearanceSupplierInvoiceUrl,
                    date: inv.supplierInvoiceDate,
                    valueWithGst: inv.supplierInvoiceValueWithGST,
                    valueWithoutGst: inv.supplierInvoiceValueWithOutGST,
                    _id: inv._id,
                  }));
                } else if (partyType.toLowerCase() === "consignee") {
                  const commercialInvoices = shipment.saleInvoiceDetails.commercialInvoices || [];
                  invoices = commercialInvoices.map((inv) => ({
                    invoiceNumber: inv.clearanceCommercialInvoiceNumber,
                    uploadInvoiceUrl: inv.clearanceCommercialInvoiceUrl,
                    date: inv.clearancecommercialInvoiceDate,
                    valueWithGst: inv.clearanceCommercialInvoiceValue,
                    valueWithoutGst: inv.actualCommercialInvoiceValue,
                    _id: inv._id,
                  }));
                } else if (partyType.toLowerCase() === "forwarder") {
                  invoices = shipment.shippingDetails.forwarderInvoices || [];
                } else if (partyType.toLowerCase() === "transporter") {
                  invoices = shipment.shippingDetails.transporterInvoices || [];
                }

                const bls: BillOfLading[] = partyType.toLowerCase() === "shippingline" &&
                  shipment.blDetails.shippingLineName === id
                  ? (shipment.blDetails.Bl || [])
                  : [];

                const shippingBills: ShippingBill[] = partyType.toLowerCase() === "cbname" &&
                  shipment.shippingBillDetails.cbName === id
                  ? (shipment.shippingBillDetails.ShippingBills || [])
                  : [];

                const totalInvoicePages = Math.ceil(invoices.length / rowsPerPage);
                const totalBlPages = Math.ceil(bls.length / rowsPerPage);
                const totalShippingBillPages = Math.ceil(shippingBills.length / rowsPerPage);
                const startIndex = (currentPage - 1) * rowsPerPage;
                const paginatedInvoices = invoices.slice(startIndex, startIndex + rowsPerPage);
                const paginatedBls = bls.slice(startIndex, startIndex + rowsPerPage);
                const paginatedShippingBills = shippingBills.slice(startIndex, startIndex + rowsPerPage);

                if (
                  invoices.length === 0 &&
                  bls.length === 0 &&
                  shippingBills.length === 0
                ) {
                  return null;
                }

                return (
                  <div key={index} className="flex flex-col gap-4 mt-4">
                    <div className="flex justify-end">
                      <Link href={`/${organizationId}/documentation/shipment/view/${shipment._id}`}>
                        <Button variant="default">View Shipment</Button>
                      </Link>
                    </div>
                    <Card className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                      <div className="flex flex-col">
                        <Heading
                          title={`Shipment: ${shipment.shipmentId}`}
                          className="text-2xl font-semibold"
                        />
                        <p className="text-muted-foreground text-xs">
                          From:{" "}
                          <span className="font-semibold text-black">
                            {shipment.bookingDetails.portOfLoading}
                          </span>{" "}
                          To:{" "}
                          <span className="font-semibold text-black">
                            {shipment.bookingDetails.destinationPort}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-start sm:items-end">
                        <p className="text-muted-foreground text-xs">Shipment Status:</p>
                        <Badge
                          className={cn(
                            shipment.status === "Trucks Dispatched" &&
                              "bg-gray-200 text-gray-800 hover:bg-gray-200/70",
                            shipment.status === "Trucks Arrived" &&
                              "bg-blue-200 text-blue-800 hover:bg-blue-300/80",
                            shipment.status === "Trucks Halted" &&
                              "bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80",
                            shipment.status === "Stuffing" &&
                              "bg-orange-200 text-orange-800 hover:bg-orange-400/80",
                            shipment.status === "In Clearance" &&
                              "bg-purple-200 text-purple-800 hover:bg-purple-400/80",
                            shipment.status === "Loaded On Vessel" &&
                              "bg-teal-200 text-teal-800 hover:bg-teal-400/80",
                            shipment.status === "In Transit" &&
                              "bg-cyan-200 text-cyan-800 hover:bg-cyan-400/80",
                            shipment.status === "Arrived At POD" &&
                              "bg-green-200 text-green-800 hover:bg-green-300/80",
                            shipment.status === "Delivery Completed" &&
                              "bg-green-600 text-green-800 hover:bg-green-500/80",
                            shipment.status === "Trucks Booked" &&
                              "bg-indigo-200 text-indigo-800 hover:bg-indigo-300/80",
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
                              "Trucks Booked",
                            ].includes(shipment.status) &&
                              "bg-muted-foreground/60 text-primary-foreground"
                          )}
                        >
                          {shipment.status || "N/A"}
                        </Badge>
                      </div>
                    </Card>
                    <div className="flex flex-col md:flex-row gap-4">
                      <Card className="mt-4 w-full md:w-1/2">
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
                                    ? moment(shipment.bookingDetails.vesselSailingDate).format(
                                        "MMM Do YY"
                                      )
                                    : "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Vessel Arriving Date</TableCell>
                                <TableCell>
                                  {shipment.bookingDetails.vesselArrivingDate
                                    ? moment(shipment.bookingDetails.vesselArrivingDate).format(
                                        "MMM Do YY"
                                      )
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
                      {(invoices.length > 0 || bls.length > 0 || shippingBills.length > 0) && (
                        <Card className="mt-4 w-full md:w-1/2">
                          <CardHeader>
                            <CardTitle>
                              {partyType.toLowerCase() === "shippingline"
                                ? "Bill of Lading"
                                : partyType.toLowerCase() === "cbname"
                                ? "Shipping Bills"
                                : "Invoices"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell>{config.nameLabel}</TableCell>
                                  <TableCell>{partyDetails?.name || "N/A"}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    Number of{" "}
                                    {partyType.toLowerCase() === "shippingline"
                                      ? "Bills of Lading"
                                      : partyType.toLowerCase() === "cbname"
                                      ? "Shipping Bills"
                                      : "Invoices"}
                                  </TableCell>
                                  <TableCell>
                                    {partyType.toLowerCase() === "shippingline"
                                      ? bls.length
                                      : partyType.toLowerCase() ==="cbname"
                                      ? shippingBills.length
                                      : invoices.length}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            <div className="mt-4">
                              <Input
                                placeholder={`Search by ${
                                  partyType.toLowerCase() === "shippingline"
                                    ? "BL number"
                                    : partyType.toLowerCase() === "cbname"
                                    ? "shipping bill number"
                                    : "invoice number"
                                }`}
                                className="w-full"
                                disabled
                              />
                            </div>
                            {partyType.toLowerCase() === "shippingline" && (
                              <Table className="mt-4">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>BL Number</TableHead>
                                    <TableHead>BL Date</TableHead>
                                    <TableHead>Telex Date</TableHead>
                                    <TableHead>View</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {paginatedBls.map((bl) => (
                                    <TableRow key={bl._id}>
                                      <TableCell>{bl.blNumber || "N/A"}</TableCell>
                                      <TableCell>
                                        {bl.blDate
                                          ? moment(bl.blDate).format("MMM Do YY")
                                          : "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {bl.telexDate
                                          ? moment(bl.telexDate).format("MMM Do YY")
                                          : "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {bl.uploadBLUrl && bl.uploadBLUrl !== "undefined" ? (
                                          <a
                                            href={bl.uploadBLUrl}
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
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                            {partyType.toLowerCase() === "cbname" && (
                              <Table className="mt-4">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Shipping Bill Number</TableHead>
                                    <TableHead>Shipping Bill Date</TableHead>
                                    <TableHead>Drawback Value</TableHead>
                                    <TableHead>RODTEP Value</TableHead>
                                    <TableHead>View</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {paginatedShippingBills.map((sb) => (
                                    <TableRow key={sb._id}>
                                      <TableCell>{sb.shippingBillNumber || "N/A"}</TableCell>
                                      <TableCell>
                                        {sb.shippingBillDate
                                          ? moment(sb.shippingBillDate).format("MMM Do YY")
                                          : "N/A"}
                                      </TableCell>
                                      <TableCell>{sb.drawbackValue || "N/A"}</TableCell>
                                      <TableCell>{sb.rodtepValue || "N/A"}</TableCell>
                                      <TableCell>
                                        {sb.shippingBillUrl && sb.shippingBillUrl !== "undefined" ? (
                                          <a
                                            href={sb.shippingBillUrl}
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
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                            {["supplier", "consignee", "forwarder", "transporter"].includes(
                              partyType.toLowerCase()
                            ) && (
                              <Table className="mt-4">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Invoice Number</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Value With GST</TableHead>
                                    <TableHead>Value Without GST</TableHead>
                                    <TableHead>View</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {paginatedInvoices.map((invoice) => (
                                    <TableRow key={invoice._id}>
                                      <TableCell>{invoice.invoiceNumber || "N/A"}</TableCell>
                                      <TableCell>
                                        {invoice.date
                                          ? moment(invoice.date).format("MMM Do YY")
                                          : "N/A"}
                                      </TableCell>
                                      <TableCell>{invoice.valueWithGst || "N/A"}</TableCell>
                                      <TableCell>{invoice.valueWithoutGst || "N/A"}</TableCell>
                                      <TableCell>
                                        {invoice.uploadInvoiceUrl &&
                                        invoice.uploadInvoiceUrl !== "undefined" ? (
                                          <a
                                            href={invoice.uploadInvoiceUrl}
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
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                            <div className="mt-4 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">Rows per page: {rowsPerPage}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  Page {currentPage} of{" "}
                                  {partyType.toLowerCase() === "shippingline"
                                    ? totalBlPages
                                    : partyType.toLowerCase() === "cbname"
                                    ? totalShippingBillPages
                                    : totalInvoicePages}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={currentPage === 1}
                                >
                                  First
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={currentPage === 1}
                                >
                                  Previous
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={
                                    currentPage ===
                                    (partyType.toLowerCase() === "shippingline"
                                      ? totalBlPages
                                      : partyType.toLowerCase() === "cbname"
                                      ? totalShippingBillPages
                                      : totalInvoicePages)
                                  }
                                >
                                  Next
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={
                                    currentPage ===
                                    (partyType.toLowerCase() === "shippingline"
                                      ? totalBlPages
                                      : partyType.toLowerCase() === "cbname"
                                      ? totalShippingBillPages
                                      : totalInvoicePages)
                                  }
                                >
                                  Last
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                );
              }).filter(Boolean)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}