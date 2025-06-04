import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { ProductsColumns } from "./components/columns";
import { log } from "console";
export interface Product {
  _id: string;
  productType?: string;
  code?: string;
  description?: string;
  unitOfMeasurements?: string;
  countryOfOrigin?: string;
  HScode?: string;
  netWeight?: number;
  grossWeight?: number;
  cubicMeasurement?: number;
  prices?: {
    variantName: string;
    variantType?: string;
    sellPrice: number;
    buyPrice: number;
  }[];
  slabDetails?: {
    stoneName: string;
    stonePhoto: string;
    manualMeasurement: string;
    uploadMeasurement: string;
  };
  tileDetails?: {
    stoneName: string;
    stonePhoto: string;
    noOfBoxes: number;
    piecesPerBox: number;
    size: { length: number; breadth: number };
    thickness?: { value: number };
    moulding?: { mouldingSide: string; typeOfMoulding: string };
  };
  stepRiserDetails?: {
    stoneName: string;
    stonePhoto: string;
    mixedBox?: {
      sizeOfStep: { length: number; breadth: number; thickness: number };
      sizeOfRiser: { length: number; breadth: number; thickness: number };
      noOfBoxes: number;
      noOfSteps: number;
      noOfRiser: number;
    };
    seperateBox?: {
      sizeOfBoxOfSteps: { length: number; breadth: number; thickness: number };
      sizeOfBoxOfRisers: { length: number; breadth: number; thickness: number };
      noOfBoxOfSteps: number;
      noOfBoxOfRisers: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  shipments?: any[];
}
interface Props {
    params: {
        organizationId: string;
    };
}

export default async function ProductPage({ params }: Props) {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";
    const orgId = params.organizationId

    // Fetch data (unchanged)
    const res = await fetch(
        `https://incodocs-server.onrender.com/shipment/productdetails/getbyorg/${orgId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
    ).then((response) => response.json());
    const ProductsData = res;

    console.log("gggg");
    
    console.log(
        ProductsData
    );
    

    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href="/documentation/dashboard">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Products" />
                    <p className="text-muted-foreground text-sm mt-2">
                        Effortlessly manage your Products, ensuring accuracy and
                        easy retrieval.
                    </p>
                </div>
                <Link href={`./products/createnew`}>
                    <Button className="bg-primary text-white">Add Product</Button>
                </Link>
            </div>
            {/* Moved PartiesDropdown here */}

            <Separator className="my-2" />
            <div>
           <DataTable
  bulkDeleteIdName="_id"
  bulkDeleteTitle="Are you sure you want to delete the selected products?"
  bulkDeleteDescription="This will delete the selected products, and they will not be recoverable."
  bulkDeleteToastMessage="Selected products deleted successfully"
  deleteRoute="/shipment/productdetails/deletemany" // Verify this endpoint
  searchKey="productType"
  columns={ProductsColumns}
  data={ProductsData}
  token={token}
/>
            </div>
        </div>
    );
}
