import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { ProductsColumns } from "./components/columns";

export interface Product {
    code: string;
    description: string;
    unit: string;
    origin: string;
    hsCode: string;
    sellPrice: number;
    buyPrice: number;
    netWeight: number;
    grossWeight: number;
    cubicMeasurement: number;
    priceVariants: {
        name: string;
        type: string;
        sellPrice: number;
        retail: boolean;
        code: string;
    }[];
}


interface Props {
    params: {
        organizationId: string;
    };
}

export default async function QuotesPage({ params }: Props) {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";

    // Fetch data (unchanged)
    //   const ExportDocsData = await fetch(
    //     `https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/${orgaanisationID}`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + token,
    //       },
    //     }
    //   ).then((response) => response.json());
    //     const shippingLine = ExportDocsData; 

    const Products: Product[] = [
        {
            code: "PRD-00123",
            description: "High-quality granite slab",
            unit: "Square Feet (sqft)",
            origin: "India",
            hsCode: "25161200",
            sellPrice: 450.00,
            buyPrice: 380.00,
            netWeight: 120.00,
            grossWeight: 130.00,
            cubicMeasurement: 0.85,
            priceVariants: [
                {
                    name: "Wholesale",
                    type: "Regular",
                    sellPrice: 450.00,
                    retail: true,
                    code: "WHL-001"
                }
            ]
        },
        {
            code: "PRD-00124",
            description: "Polished marble tile",
            unit: "Square Meter (sqm)",
            origin: "Turkey",
            hsCode: "68029100",
            sellPrice: 520.00,
            buyPrice: 400.00,
            netWeight: 140.00,
            grossWeight: 150.00,
            cubicMeasurement: 1.00,
            priceVariants: [
                {
                    name: "Retail",
                    type: "Discounted",
                    sellPrice: 500.00,
                    retail: true,
                    code: "RTL-002"
                }
            ]
        }
    ];



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
                    bulkDeleteTitle="Are you sure you want to delete the selected shipping lines?"
                    bulkDeleteDescription="This will delete the selected shipping lines, and they will not be recoverable."
                    bulkDeleteToastMessage="Selected shipping lines deleted successfully"
                    deleteRoute="/shipment/shippingline/deletemany"
                    searchKey="name"
                    columns={ProductsColumns}
                    data={Products as any}
                />
            </div>
        </div>
    );
}
