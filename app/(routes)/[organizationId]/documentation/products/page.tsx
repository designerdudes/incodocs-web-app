import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { ProductsColumns } from "./components/columns";

export interface Product {
    _id: any;
    code: string;
    description: string;
    unitOfMeasurements: string;
    countryOfOrigin: string;
    HScode: string;
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

export default async function ProductPage({ params }: Props) {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";

    // Fetch data (unchanged)
    const res = await fetch(
        `https://incodocs-server.onrender.com/shipment/productdetails/get`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }
    ).then((response) => response.json());
    const ProductsData = res;

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
                    data={ProductsData as any}
                />
            </div>
        </div>
    );
}
