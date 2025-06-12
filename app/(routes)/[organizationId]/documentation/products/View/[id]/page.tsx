"use server";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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
    seperateBox: {
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
  
  const res = await fetch(
    `https://incodocs-server.onrender.com/shipment/productdetails/get/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product data");
  }

  const productData = await res.json();
  return productData;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ViewProductPage({ params }: { params: { id: string } }) {
  let data: ProductResponse | null = null;
  let error: string | null = null;

  try {
    data = await getProductData(params.id);
  } catch (err) {
    error = "Failed to load product data. Please try again later.";
  }

  if (!data || !data.products) {
    notFound();
  }

  const { products, shipments } = data;

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={`${products.productType} : ${products.slabDetails?.stoneName || products.tileDetails?.stoneName || products.stepRiserDetails?.stoneName || "Product"}`}
          />
          <p className="text-muted-foreground text-sm">
            Details of the selected product and associated shipments.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto py-6">
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        {products && (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product ID</p>
                    <p className="font-medium">{products._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Product Type</p>
                    <p className="font-medium">{products.productType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organization ID</p>
                    <p className="font-medium">{products.organizationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium">{formatDate(products.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">{formatDate(products.updatedAt)}</p>
                  </div>

                  {products.productType === "Slabs" && products.slabDetails && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Stone Name</p>
                        <p className="font-medium">{products.slabDetails.stoneName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Manual Measurement</p>
                        <p className="font-medium">{products.slabDetails.manualMeasurement}</p>
                      </div>
                      {products.slabDetails.stonePhoto && (
                        <div>
                          <p className="text-sm text-muted-foreground">Stone Photo</p>
                          <a href={products.slabDetails.stonePhoto} className="font-medium text-blue-600 hover:underline">
                            View Photo
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {products.productType === "Tiles" && products.tileDetails && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Stone Name</p>
                        <p className="font-medium">{products.tileDetails.stoneName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>
                        <p className="font-medium">{`${products.tileDetails.size.length} x ${products.tileDetails.size.breadth}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Thickness</p>
                        <p className="font-medium">{products.tileDetails.thickness.value}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Moulding</p>
                        <p className="font-medium">{`${products.tileDetails.moulding.mouldingSide} (${products.tileDetails.moulding.typeOfMoulding})`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Number of Boxes</p>
                        <p className="font-medium">{products.tileDetails.noOfBoxes}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pieces per Box</p>
                        <p className="font-medium">{products.tileDetails.piecesPerBox}</p>
                      </div>
                      {products.tileDetails.stonePhoto && (
                        <div>
                          <p className="text-sm text-muted-foreground">Stone Photo</p>
                          <a href={products.tileDetails.stonePhoto} className="font-medium text-blue-600 hover:underline">
                            View Photo
                          </a>
                        </div>
                      )}
                    </>
                  )}

                  {products.productType === "StepsAndRisers" && products.stepRiserDetails && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Stone Name</p>
                        <p className="font-medium">{products.stepRiserDetails.stoneName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mixed Box - Step Size</p>
                        <p className="font-medium">{`${products.stepRiserDetails.mixedBox.sizeOfStep.length} x ${products.stepRiserDetails.mixedBox.sizeOfStep.breadth} x ${products.stepRiserDetails.mixedBox.sizeOfStep.thickness}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mixed Box - Riser Size</p>
                        <p className="font-medium">{`${products.stepRiserDetails.mixedBox.sizeOfRiser.length} x ${products.stepRiserDetails.mixedBox.sizeOfRiser.breadth} x ${products.stepRiserDetails.mixedBox.sizeOfRiser.thickness}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mixed Box - Number of Boxes</p>
                        <p className="font-medium">{products.stepRiserDetails.mixedBox.noOfBoxes}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mixed Box - Number of Steps</p>
                        <p className="font-medium">{products.stepRiserDetails.mixedBox.noOfSteps}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mixed Box - Number of Risers</p>
                        <p className="font-medium">{products.stepRiserDetails.mixedBox.noOfRiser}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Separate Box - Steps Size</p>
                        <p className="font-medium">{`${products.stepRiserDetails.seperateBox.sizeOfBoxOfSteps.length} x ${products.stepRiserDetails.seperateBox.sizeOfBoxOfSteps.breadth} x ${products.stepRiserDetails.seperateBox.sizeOfBoxOfSteps.thickness}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Separate Box - Risers Size</p>
                        <p className="font-medium">{`${products.stepRiserDetails.seperateBox.sizeOfBoxOfRisers.length} x ${products.stepRiserDetails.seperateBox.sizeOfBoxOfRisers.breadth} x ${products.stepRiserDetails.seperateBox.sizeOfBoxOfRisers.thickness}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Separate Box - Number of Step Boxes</p>
                        <p className="font-medium">{products.stepRiserDetails.seperateBox.noOfBoxOfSteps}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Separate Box - Pieces per Step Box</p>
                        <p className="font-medium">{products.stepRiserDetails.seperateBox.noOfPiecesPerBoxOfSteps}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Separate Box - Number of Riser Boxes</p>
                        <p className="font-medium">{products.stepRiserDetails.seperateBox.noOfBoxOfRisers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Separate Box - Pieces per Riser Box</p>
                        <p className="font-medium">{products.stepRiserDetails.seperateBox.noOfPiecesPerBoxOfRisers}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {shipments && shipments.length > 0 && (
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">Shipment Details</h3>
                {shipments.map((shipment) => (
                  <div key={shipment._id} className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Shipment ID</p>
                        <p className="font-medium">{shipment.shipmentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium">{shipment.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created At</p>
                        <p className="font-medium">{formatDate(shipment.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Updated At</p>
                        <p className="font-medium">{formatDate(shipment.updatedAt)}</p>
                      </div>
                    </div>

                    <h4 className="text-md font-semibold mt-4">Booking Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Invoice Number</p>
                        <p className="font-medium">{shipment.bookingDetails.invoiceNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Booking Number</p>
                        <p className="font-medium">{shipment.bookingDetails.bookingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Port of Loading</p>
                        <p className="font-medium">{shipment.bookingDetails.portOfLoading}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Destination Port</p>
                        <p className="font-medium">{shipment.bookingDetails.destinationPort}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vessel Sailing Date</p>
                        <p className="font-medium">{formatDate(shipment.bookingDetails.vesselSailingDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vessel Arriving Date</p>
                        <p className="font-medium">{formatDate(shipment.bookingDetails.vesselArrivingDate)}</p>
                      </div>
                    </div>

                    <h4 className="text-md font-semibold mt-4">Container Details</h4>
                    {shipment.bookingDetails.containers.map((container) => (
                      <div key={container._id} className="border rounded-lg p-2 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Container Type</p>
                            <p className="font-medium">{container.containerType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Container Number</p>
                            <p className="font-medium">{container.containerNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Truck Number</p>
                            <p className="font-medium">{container.truckNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Driver Contact</p>
                            <p className="font-medium">{container.truckDriverContactNumber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* <div className="flex gap-4">
              <Link href={`documentation/products/edit/${params.id}`}>
                <Button variant="default">Edit Product</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline">Back to Products</Button>
              </Link>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}