import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Columns } from "./components/columns";
import { FinishedPurchaseColumns } from "../purchases/components/finishedPurchaseColumns";


export type Sales = {
    _id: string;
    customerName: string;
    customerGSTN: string;
    noOfSlabs: number;
    length: string;
    height: string;
    saleDate: string;
    GstPercentage: number;
}

interface Props {
    params: {
        factoryid: string;
    }
}

export default async function Purchases({ params }: Props) {

    //   const cookieStore = cookies();
    //   const token = cookieStore.get('AccessToken')?.value || ""

    //   const res = await fetch(`https://incodocs-server.onrender.com/factory-management/inventory/factory-lot/get/${params?.factoryid}`, {
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
    const SalesData = [
        {
            _id: "1",
            customerName: "Ramesh Singh",
            customerGSTN: "18AABCT2341Q2ZX",
            noOfSlabs: 15,
            length: "120",
            height: "80",
            saleDate: "02/12/2024",
            GstPercentage: 18,
        },
        {
            _id: "2",
            customerName: "Suresh Verma",
            customerGSTN: "27AAGFG6789P1ZY",
            noOfSlabs: 20,
            length: "110",
            height: "75",
            saleDate: "03/12/2024",
            GstPercentage: 12,
        },
        {
            _id: "3",
            customerName: "Kamlesh Yadav",
            customerGSTN: "10AACFT1234K1Z5",
            noOfSlabs: 12,
            length: "115",
            height: "85",
            saleDate: "01/12/2024",
            GstPercentage: 18,
        },
        {
            _id: "4",
            customerName: "Anita Enterprises",
            customerGSTN: "09AADCF5698L1ZM",
            noOfSlabs: 10,
            length: "100",
            height: "70",
            saleDate: "29/11/2024",
            GstPercentage: 5,
        },
        {
            _id: "5",
            customerName: "Global Stones Ltd.",
            customerGSTN: "06AADBG4517H1ZX",
            noOfSlabs: 18,
            length: "118",
            height: "90",
            saleDate: "30/11/2024",
            GstPercentage: 18,
        },
        {
            _id: "6",
            customerName: "Om Marble Suppliers",
            customerGSTN: "33AABCX2345N1Z2",
            noOfSlabs: 22,
            length: "105",
            height: "80",
            saleDate: "28/11/2024",
            GstPercentage: 12,
        },
        {
            _id: "7",
            customerName: "Shree Traders",
            customerGSTN: "24AACDF1256R1Z9",
            noOfSlabs: 25,
            length: "95",
            height: "75",
            saleDate: "27/11/2024",
            GstPercentage: 5,
        },
        {
            _id: "8",
            customerName: "Nandi Marble Mart",
            customerGSTN: "29AAACD2567Q1ZY",
            noOfSlabs: 14,
            length: "98",
            height: "85",
            saleDate: "26/11/2024",
            GstPercentage: 18,
        },
        {
            _id: "9",
            customerName: "Galaxy Exports",
            customerGSTN: "07AADFG6732P1ZY",
            noOfSlabs: 16,
            length: "120",
            height: "92",
            saleDate: "25/11/2024",
            GstPercentage: 12,
        },
        {
            _id: "10",
            customerName: "StoneCrafts Ltd.",
            customerGSTN: "04AACDF4536T1ZX",
            noOfSlabs: 8,
            length: "115",
            height: "88",
            saleDate: "24/11/2024",
            GstPercentage: 5,
        },
    ];

    const InvoiceValue = SalesData.filter((data: any) => data.purchaseType === 'Raw')
    const ActualInvoiceValue = SalesData.filter((data: any) => data.purchaseType === 'Finished')

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
                    <Heading className="leading-tight" title="Sales" />
                    <p className="text-muted-foreground text-sm mt-2">
                        Effortlessly track and manage the sale of finished goods with detailed records, ensuring transparency, compliance, and streamlined monitoring of customer transactions.                    </p>
                </div>
                <Link href='./sales/create-new'>
                    <Button> Create New Sale</Button>
                </Link>
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                {/* <Tabs defaultValue="Raw" className="w-full">
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
                </Tabs> */}
                <DataTable
                    bulkDeleteIdName='order_id'
                    bulkDeleteTitle='Are you sure you want to delete the selected sales?'
                    bulkDeleteDescription='This will delete the selected sales, and they will not be recoverable.'
                    bulkDeleteToastMessage='Selected sales deleted successfully'
                    searchKey='customerName' columns={Columns} data={SalesData} />
            </div>
        </div>
    );
}
