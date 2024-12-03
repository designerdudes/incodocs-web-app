import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { rawPurchaseColumns } from "./components/rawPurchaseColumns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FinishedPurchaseColumns } from "./components/finishedPurchaseColumns";
import { Badge } from "@/components/ui/badge";

export type RawPurchased = {
    _id: string,
    supplierName: string;
    supplierGSTN: string;
    purchaseType: string;
    noOfBlocks: number;
    length: string;
    height: string;
    breadth: string,
    purchaseDate: string;
    GstPercentage: number;
    ratePerCubicMeter: string;
}

export type FinishedPurchased = {
    _id: string,
    supplierName: string;
    supplierGSTN: string;
    purchaseType: string;
    noOfSlabs: number;
    length: string;
    height: string;
    GstPercentage: number;
    purchaseDate: string;
    ratePerSqft: string;
}


interface Props {
    params: {
        factoryid: string;
    }
}

export default async function Purchases({ params }: Props) {

    //   const cookieStore = cookies();
    //   const token = cookieStore.get('AccessToken')?.value || ""

    //   const res = await fetch(`http://localhost:4080/factory-management/inventory/factory-lot/get/${params?.factoryid}`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + token
    //     }
    //   }).then(response => {
    //     return response.json()
    //   })

    //   let PurchasesData
    //   PurchasesData = res
    const rawPurchasesData = [
        {
            _id: "1",
            supplierName: "Ramesh Traders",
            supplierGSTN: "18AABCT2341Q2ZX",
            purchaseType: "Raw",
            noOfBlocks: 15,
            length: "120",
            height: "80",
            breadth: "50",
            purchaseDate: "02/12/2024",
            ratePerCubicMeter: "150",
            GstPercentage: 18
        },
        {
            _id: "3",
            supplierName: "Kamlesh Suppliers",
            supplierGSTN: "10AACFT1234K1Z5",
            purchaseType: "Raw",
            noOfBlocks: 12,
            length: "110",
            height: "85",
            breadth: "55",
            purchaseDate: "29/11/2024",
            ratePerCubicMeter: "145",
            GstPercentage: 18

        },
        {
            _id: "5",
            supplierName: "Ganesh Granite",
            supplierGSTN: "06AADBG4517H1ZX",
            purchaseType: "Raw",
            noOfBlocks: 20,
            length: "120",
            height: "90",
            breadth: "60",
            purchaseDate: "03/12/2024",
            ratePerCubicMeter: "155",
            GstPercentage: 18

        },
        {
            _id: "6",
            supplierName: "Om Marble Suppliers",
            supplierGSTN: "33AABCX2345N1Z2",
            purchaseType: "Raw",
            noOfBlocks: 18,
            length: "115",
            height: "88",
            breadth: "52",
            purchaseDate: "30/11/2024",
            ratePerCubicMeter: "147",
            GstPercentage: 18

        },
        {
            _id: "8",
            supplierName: "Nandi Marble Mart",
            supplierGSTN: "29AAACD2567Q1ZY",
            purchaseType: "Raw",
            noOfBlocks: 22,
            length: "118",
            height: "92",
            breadth: "58",
            purchaseDate: "02/12/2024",
            ratePerCubicMeter: "160",
            GstPercentage: 18

        },
        {
            _id: "10",
            supplierName: "Global Stones",
            supplierGSTN: "04AACDF4536T1ZX",
            purchaseType: "Raw",
            noOfBlocks: 16,
            length: "110",
            height: "85",
            breadth: "53",
            purchaseDate: "29/11/2024",
            ratePerCubicMeter: "148",
            GstPercentage: 18

        },
    ];

    const finishedPurchasesData = [
        {
            _id: "2",
            supplierName: "Suresh Stones",
            supplierGSTN: "27AAGFG6789P1ZY",
            purchaseType: "Finished",
            noOfSlabs: 25,
            length: "95",
            height: "75",
            purchaseDate: "01/12/2024",
            ratePerSqft: "22",
            GstPercentage: 18

        },
        {
            _id: "4",
            supplierName: "StoneCrafts Ltd",
            supplierGSTN: "09AADCF5698L1ZM",
            purchaseType: "Finished",
            noOfSlabs: 8,
            length: "100",
            height: "70",
            purchaseDate: "28/11/2024",
            ratePerSqft: "25",
            GstPercentage: 18

        },
        {
            _id: "7",
            supplierName: "Shree Stones",
            supplierGSTN: "24AACDF1256R1Z9",
            purchaseType: "Finished",
            noOfSlabs: 10,
            length: "105",
            height: "80",
            purchaseDate: "27/11/2024",
            ratePerSqft: "20",
            GstPercentage: 18

        },
        {
            _id: "9",
            supplierName: "Galaxy Granites",
            supplierGSTN: "07AADFG6732P1ZY",
            purchaseType: "Finished",
            noOfSlabs: 14,
            length: "98",
            height: "75",
            purchaseDate: "03/12/2024",
            ratePerSqft: "24",
            GstPercentage: 18

        },
    ]

    const RawPurchased = rawPurchasesData.filter((data: any) => data.purchaseType === 'Raw')
    const FinishedPurchased = finishedPurchasesData.filter((data: any) => data.purchaseType === 'Finished')

    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href="./">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Purchases" />
                    <p className="text-muted-foreground text-sm mt-2">
                        Seamlessly manage and monitor raw material and finished goods purchases with comprehensive details, ensuring efficient tracking and streamlined progress through the production workflow.
                    </p>
                </div>
                <Link href='./lots/create-new'>
                    <Button> Create New Purchase</Button>
                </Link>
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                <Tabs defaultValue="Raw" className="w-full">
                    <TabsList className='gap-3'>
                        <TabsTrigger className='gap-2' value="Raw">Raw Material Purchased<Badge className='text-bg-primary-foreground ' variant="outline">{rawPurchasesData?.length}</Badge> </TabsTrigger>
                        <TabsTrigger className='gap-2' value="Finished">Finished Material Purchased<Badge className='text-bg-primary-foreground' variant="outline">{finishedPurchasesData?.length}</Badge> </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Raw">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected purchases?'
                            bulkDeleteDescription='This will delete the purchases, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected purchases deleted successfully'
                            searchKey='title' columns={rawPurchaseColumns} data={RawPurchased} />
                    </TabsContent>
                    <TabsContent value="Finished">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected purchases?'
                            bulkDeleteDescription='This will delete the selected purchases, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected purchases deleted successfully'
                            searchKey='title' columns={FinishedPurchaseColumns} data={FinishedPurchased} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
