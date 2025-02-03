"use client";
import { fetchData } from "@/axiosUtility/api";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { columns } from "./components1/columns";
import Link from "next/link";

function Page() {
    const [shipmentData, setShipmentData] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getShipmentData = async () => {
            try {
                setLoading(true);
                const data = await fetchData("/shipment/getAll");
                setShipmentData(data);
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
                <div className="flex flex-col">
                    <Heading className="text-3xl" title="Shipments" />
                    <p>This is the shipments page</p>
                </div>
                <Link href={`./shipment/createnew`}>
                    <Button className="bg-primary text-white">New Shipment</Button>
                </Link>
            </div>
            <Separator className="my-2" />
        <DataTable searchKey="" data={shipmentData} columns={columns} />
        
        </div>
    );
}

export default Page;
