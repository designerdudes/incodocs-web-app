"use client";
import { fetchData } from "@/axiosUtility/api";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { columns } from "./components1/columns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

function Page() {
    const [shipmentData, setShipmentData] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getShipmentData = async () => {
            try {
                setLoading(true);
                const data = await fetchData("/shipment/getAll");
                setShipmentData(data);
                console.log(setShipmentData)
            } catch (error) {
                console.error("Error fetching shipment data:", error);
            } finally {
                setLoading(false);
            }
        };

        getShipmentData();
    }, []);

    return (
        <div className="flex flex-col p-6">
            <div className="flex justify-between items-center gap-2">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Shipment Page" />
          <p className="text-muted-foreground text-sm">
          Track and manage shipments with real-time visibility of container details, status, and progress through the logistics cycle. 
          </p>
                </div>
                <Link href={`./shipment/createnew`}>
                    <Button className="bg-primary text-white">New Shipment</Button>
                </Link>
            </div>
            <Separator className="my-2" />
<div >

<DataTable 
  bulkDeleteIdName="_id"
                bulkDeleteTitle="Are you sure you want to delete the selected Shipment?"
                bulkDeleteDescription="This will delete all the selected Shipment, and they will not be recoverable."
                bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                deleteRoute="/shipment/delete/all"
  searchKey="containerNumber" 
  data={shipmentData} 
  columns={columns} 
  showDropdown={true} // ✅ Enable dropdown for Shipment Page
/> 

</div>
        </div>
    );
}

export default Page;
