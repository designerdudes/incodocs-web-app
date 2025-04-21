import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./components1/columns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";

    const res = await fetch(
        `https://incodocs-server.onrender.com/shipment/getbyorg/674b0a687d4f4b21c6c980ba`,
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
    

    return (
        <div className="flex flex-col p-6">
            <div className="flex justify-between items-center gap-2">
                <Link href="/documentation/dashboard">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Shipments" />
                    <p className="text-muted-foreground text-sm">
                        Track and manage shipments with real-time visibility of container details, status, and progress through the logistics cycle.
                    </p>
                </div>
                <Link href={`./shipment/createnew`}>
                    <Button className="bg-primary text-white">Add New Shipment</Button>
                </Link>
            </div>
            <Separator className="my-2" />
            <div >
                <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                    bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                    bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                    deleteRoute="shipment/deleteall"
                    searchKey="containerNumber"
                    data={shipmentData}
                    columns={columns}
                    showDropdown={true} // ✅ Enable dropdown for Shipment Page
                />
            </div>
        </div>
    );
}


