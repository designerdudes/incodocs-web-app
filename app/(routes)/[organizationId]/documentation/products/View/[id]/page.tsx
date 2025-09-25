"use server";

import { Button } from "@/components/ui/button";
import { ChevronLeft, EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
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
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Product {
  _id: string;
  productType: "Slabs" | "Tiles" | "StepsAndRisers";
  slabDetails?: {
    stoneName: string;
    stonePhoto: string;
    manualMeasurement: string;
    uploadMeasurement: string;
    _id: string;
  };
  tileDetails?: {
    size: { length: number; breadth: number };
    thickness: { value: number };
    moulding: { mouldingSide: string; typeOfMoulding: string };
    stoneName: string;
    stonePhoto: string;
    noOfBoxes: number;
    piecesPerBox: number;
    _id: string;
  };
  stepRiserDetails?: {
    mixedBox: {
      sizeOfStep: { length: number; breadth: number; thickness: number };
      sizeOfRiser: { length: number; breadth: number; thickness: number };
      noOfBoxes: number;
      noOfSteps: number;
      noOfRiser: number;
    };
    separateBox: {
      sizeOfBoxOfSteps: { length: number; breadth: number; thickness: number };
      sizeOfBoxOfRisers: { length: number; breadth: number; thickness: number };
      noOfBoxOfSteps: number;
      noOfPiecesPerBoxOfSteps: number;
      noOfBoxOfRisers: number;
      noOfPiecesPerBoxOfRisers: number;
    };
    stoneName: string;
    _id: string;
  };
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
      addProductDetails: Product[];
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

interface ProductResponse {
  products: Product;
  shipments: Shipment[];
}

async function getProductData(id: string): Promise<ProductResponse> {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  try{
    var res = await fetchWithAuth<any>(`/shipment/productdetails/get/${id}`);
  }catch(error){
    console.log('failed to fetch product details')
    res=null
  }

  const productData =  res
  return productData;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Conversion factors
const CM2_TO_SQFT = 0.00107639; // 1 cm² to square feet
const SQM_TO_SQFT = 10.7639; // 1 square meter to square feet

function calculateTileMeasurements(tileDetails?: Product["tileDetails"]) {
  if (!tileDetails) return { totalSqM: 0, totalSqFt: 0 };

  const { length, breadth } = tileDetails.size || { length: 0, breadth: 0 };
  const { noOfBoxes, piecesPerBox } = tileDetails;

  const totalSqM =
    length && breadth && piecesPerBox && noOfBoxes
      ? ((length * breadth) / 10000) * piecesPerBox * noOfBoxes // cm² to m²
      : 0;
  const totalSqFt = totalSqM * SQM_TO_SQFT;

  return {
    totalSqM: Number(totalSqM.toFixed(3)),
    totalSqFt: Number(totalSqFt.toFixed(3)),
  };
}

function calculateStepRiserMeasurements(stepRiserDetails?: Product["stepRiserDetails"]) {
  if (!stepRiserDetails) return {
    totalMixedBoxStepSqM: 0,
    totalMixedBoxStepSqFt: 0,
    totalMixedBoxRiserSqM: 0,
    totalMixedBoxRiserSqFt: 0,
    totalSeparateBoxStepSqM: 0,
    totalSeparateBoxStepSqFt: 0,
    totalSeparateBoxRiserSqM: 0,
    totalSeparateBoxRiserSqFt: 0,
    totalSqM: 0,
    totalSqFt: 0,
  };

  const {
    noOfBoxes = 0,
    noOfSteps = 0,
    noOfRiser = 0,
    sizeOfStep: { length: mixedStepLength = 0, breadth: mixedStepBreadth = 0 } = {},
    sizeOfRiser: { length: mixedRiserLength = 0, breadth: mixedRiserBreadth = 0 } = {},
  } = stepRiserDetails.mixedBox || {};

  const {
    noOfBoxOfSteps = 0,
    noOfPiecesPerBoxOfSteps = 0,
    noOfBoxOfRisers = 0,
    noOfPiecesPerBoxOfRisers = 0,
    sizeOfBoxOfSteps: { length: separateStepLength = 0, breadth: separateStepBreadth = 0 } = {},
    sizeOfBoxOfRisers: { length: separateRiserLength = 0, breadth: separateRiserBreadth = 0 } = {},
  } = stepRiserDetails.separateBox || {};

  // Mixed Box Calculations
  const totalMixedBoxStepSqM =
    noOfBoxes && noOfSteps && mixedStepLength && mixedStepBreadth
      ? (noOfBoxes * noOfSteps * mixedStepLength * mixedStepBreadth) / 10000 // cm² to m²
      : 0;
  const totalMixedBoxRiserSqM =
    noOfBoxes && noOfRiser && mixedRiserLength && mixedRiserBreadth
      ? (noOfBoxes * noOfRiser * mixedRiserLength * mixedRiserBreadth) / 10000 // cm² to m²
      : 0;

  // Separate Box Calculations
  const totalSeparateBoxStepSqM =
    noOfBoxOfSteps && noOfPiecesPerBoxOfSteps && separateStepLength && separateStepBreadth
      ? (noOfBoxOfSteps * noOfPiecesPerBoxOfSteps * separateStepLength * separateStepBreadth) / 10000 // cm² to m²
      : 0;
  const totalSeparateBoxRiserSqM =
    noOfBoxOfRisers && noOfPiecesPerBoxOfRisers && separateRiserLength && separateRiserBreadth
      ? (noOfBoxOfRisers * noOfPiecesPerBoxOfRisers * separateRiserLength * separateRiserBreadth) / 10000 // cm² to m²
      : 0;

  // Convert to square feet
  const totalMixedBoxStepSqFt = totalMixedBoxStepSqM * SQM_TO_SQFT;
  const totalMixedBoxRiserSqFt = totalMixedBoxRiserSqM * SQM_TO_SQFT;
  const totalSeparateBoxStepSqFt = totalSeparateBoxStepSqM * SQM_TO_SQFT;
  const totalSeparateBoxRiserSqFt = totalSeparateBoxRiserSqM * SQM_TO_SQFT;

  // Total Calculations
  const totalSqM =
    totalMixedBoxStepSqM +
    totalMixedBoxRiserSqM +
    totalSeparateBoxStepSqM +
    totalSeparateBoxRiserSqM;
  const totalSqFt = totalSqM * SQM_TO_SQFT;

  return {
    totalMixedBoxStepSqM: Number(totalMixedBoxStepSqM.toFixed(3)),
    totalMixedBoxStepSqFt: Number(totalMixedBoxStepSqFt.toFixed(3)),
    totalMixedBoxRiserSqM: Number(totalMixedBoxRiserSqM.toFixed(3)),
    totalMixedBoxRiserSqFt: Number(totalMixedBoxRiserSqFt.toFixed(3)),
    totalSeparateBoxStepSqM: Number(totalSeparateBoxStepSqM.toFixed(3)),
    totalSeparateBoxStepSqFt: Number(totalSeparateBoxStepSqFt.toFixed(3)),
    totalSeparateBoxRiserSqM: Number(totalSeparateBoxRiserSqM.toFixed(3)),
    totalSeparateBoxRiserSqFt: Number(totalSeparateBoxRiserSqFt.toFixed(3)),
    totalSqM: Number(totalSqM.toFixed(3)),
    totalSqFt: Number(totalSqFt.toFixed(3)),
  };
}

export default async function ViewProductPage({ params }: { params: { id: string } }) {
  let data: ProductResponse | null = null;
  let error: string | null = null;

  try {
    data = await getProductData(params.id);
  } catch (err) {
    error = "Failed to load product data. Please try again later.";
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (!data?.products) {
    notFound();
  }
  const { products, shipments } = data;

  // Calculate measurements
  const tileMeasurements = products.productType === "Tiles" ? calculateTileMeasurements(products.tileDetails) : null;
  const stepRiserMeasurements = products.productType === "StepsAndRisers" ? calculateStepRiserMeasurements(products.stepRiserDetails) : null;

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
              title={`${products.productType}: ${products.slabDetails?.stoneName || products.tileDetails?.stoneName || products.stepRiserDetails?.stoneName || "Product"}`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View and manage product details with insights into associated shipments.
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-10 w-full mt-4">
        <Tabs defaultValue="Product Details" className="w-full">
          <TabsList className="gap-3 flex-wrap">
            <TabsTrigger value="Product Details">Product Details</TabsTrigger>
            <TabsTrigger value="Shipment Details">Shipment Details</TabsTrigger>
          </TabsList>

          {/* Product Details */}
          <TabsContent value="Product Details">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="mt-4 w-full">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
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
                        <TableCell>Product ID</TableCell>
                        <TableCell>{products._id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Product Type</TableCell>
                        <TableCell>{products.productType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Organization ID</TableCell>
                        <TableCell>{products.organizationId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Created At</TableCell>
                        <TableCell>{formatDate(products.createdAt)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Updated At</TableCell>
                        <TableCell>{formatDate(products.updatedAt)}</TableCell>
                      </TableRow>
                      {products.productType === "Slabs" && products.slabDetails && (
                        <>
                          <TableRow>
                            <TableCell>Stone Name</TableCell>
                            <TableCell>{products.slabDetails.stoneName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Manual Measurement</TableCell>
                            <TableCell>{products.slabDetails.manualMeasurement}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Stone Photo</TableCell>
                            <TableCell>
                              {products.slabDetails?.stonePhoto ? (
                                <a
                                  href={products.slabDetails.stonePhoto}
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
                            <TableCell>Upload Measurement</TableCell>
                            <TableCell>
                              {products.slabDetails.uploadMeasurement ? (
                                <a
                                  href={products.slabDetails.uploadMeasurement}
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
                        </>
                      )}
                      {products.productType === "Tiles" && products.tileDetails && (
                        <>
                          <TableRow>
                            <TableCell>Stone Name</TableCell>
                            <TableCell>{products.tileDetails.stoneName}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Size</TableCell>
                            <TableCell>{`${products.tileDetails.size.length} x ${products.tileDetails.size.breadth} cm`}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Thickness</TableCell>
                            <TableCell>{products.tileDetails.thickness.value} mm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Moulding</TableCell>
                            <TableCell>{`${products.tileDetails.moulding.mouldingSide} (${products.tileDetails.moulding.typeOfMoulding})`}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Number of Boxes</TableCell>
                            <TableCell>{products.tileDetails.noOfBoxes}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Pieces per Box</TableCell>
                            <TableCell>{products.tileDetails.piecesPerBox}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total Area (sq m)</TableCell>
                            <TableCell>{tileMeasurements?.totalSqM || "0.000"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total Area (sq ft)</TableCell>
                            <TableCell>{tileMeasurements?.totalSqFt || "0.000"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Stone Photo</TableCell>
                            <TableCell>
                              {products.tileDetails.stonePhoto ? (
                                <a
                                  href={products.tileDetails.stonePhoto}
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
                        </>
                      )}
                      {products.productType === "StepsAndRisers" && products.stepRiserDetails && (
                        <>
                          <TableRow>
                            <TableCell>Stone Name</TableCell>
                            <TableCell>{products.stepRiserDetails.stoneName || "N/A"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mixed Box - Step Size</TableCell>
                            <TableCell>
                              {products.stepRiserDetails.mixedBox?.sizeOfStep
                                ? `${products.stepRiserDetails.mixedBox.sizeOfStep.length} x ${products.stepRiserDetails.mixedBox.sizeOfStep.breadth} x ${products.stepRiserDetails.mixedBox.sizeOfStep.thickness} cm`
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mixed Box - Riser Size</TableCell>
                            <TableCell>
                              {products.stepRiserDetails.mixedBox?.sizeOfRiser
                                ? `${products.stepRiserDetails.mixedBox.sizeOfRiser.length} x ${products.stepRiserDetails.mixedBox.sizeOfRiser.breadth} x ${products.stepRiserDetails.mixedBox.sizeOfRiser.thickness} cm`
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mixed Box - Number of Boxes</TableCell>
                            <TableCell>{products.stepRiserDetails.mixedBox?.noOfBoxes || "0"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mixed Box - Number of Steps</TableCell>
                            <TableCell>{products.stepRiserDetails.mixedBox?.noOfSteps || "0"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Mixed Box - Number of Risers</TableCell>
                            <TableCell>{products.stepRiserDetails.mixedBox?.noOfRiser || "0"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Separate Box - Steps Size</TableCell>
                            <TableCell>
                              {products.stepRiserDetails.separateBox?.sizeOfBoxOfSteps
                                ? `${products.stepRiserDetails.separateBox.sizeOfBoxOfSteps.length} x ${products.stepRiserDetails.separateBox.sizeOfBoxOfSteps.breadth} x ${products.stepRiserDetails.separateBox.sizeOfBoxOfSteps.thickness} cm`
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Separate Box - Risers Size</TableCell>
                            <TableCell>
                              {products.stepRiserDetails.separateBox?.sizeOfBoxOfRisers
                                ? `${products.stepRiserDetails.separateBox.sizeOfBoxOfRisers.length} x ${products.stepRiserDetails.separateBox.sizeOfBoxOfRisers.breadth} x ${products.stepRiserDetails.separateBox.sizeOfBoxOfRisers.thickness} cm`
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Separate Box - Number of Step Boxes</TableCell>
                            <TableCell>{products.stepRiserDetails.separateBox?.noOfBoxOfSteps || "0"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Separate Box - Pieces per Step Box</TableCell>
                            <TableCell>{products.stepRiserDetails.separateBox?.noOfPiecesPerBoxOfSteps || "0"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Separate Box - Number of Riser Boxes</TableCell>
                            <TableCell>{products.stepRiserDetails.separateBox?.noOfBoxOfRisers || "0"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Separate Box - Pieces per Riser Box</TableCell>
                            <TableCell>{products.stepRiserDetails.separateBox?.noOfPiecesPerBoxOfRisers || "0"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total Area (sq m)</TableCell>
                            <TableCell>{stepRiserMeasurements?.totalSqM || "0.000"}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total Area (sq ft)</TableCell>
                            <TableCell>{stepRiserMeasurements?.totalSqFt || "0.000"}</TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shipment Details */}
          <TabsContent value="Shipment Details">
            {shipments?.length === 0 ? (
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