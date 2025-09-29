import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cookies } from "next/headers";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/ui/data-table";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { ShipmentLogs } from "@/components/shipmentLogs";
import DownloadInvRemittance from "../../components/remittanceDownloadBtn";
import { columns } from "../../components/columns";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
    params: {
        organizationId: string
        id: string;
    };
}


export default async function Page({ params }: Props) {
    const cookieStore = cookies();
    const token = cookieStore.get("AccessToken")?.value || "";

  try{
    
      var res = await fetchWithAuth<any>(
          `/remittance/inward/getbyconsignee/${params.id}?orgId=${params.organizationId}`,
      )
  }catch(error){
    console.error("failed to fetch Data");
    res = [];
  }

    const responseData =  res;

    const totalInvoiceValue = responseData.reduce(
        (sum: number, remittance: any) => sum + (remittance.invoiceValue || 0),
        0
    );

    const totalRemittanceValue = responseData.reduce(
        (sum: number, remittance: any) => sum + (remittance.inwardRemittanceValue || 0),
        0
    );


    const status = totalInvoiceValue - totalRemittanceValue > 0 ? "Balance Pending" : "Recieved"

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
                            title={`${responseData[0]?.consigneeId?.name} - Inward Remittances`}
                        />
                        <p className="text-muted-foreground text-sm mt-2">
                            View all inward remittances related to your consignee - {responseData[0]?.consigneeId?.name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <DownloadInvRemittance remittanceData={responseData} consigneeData={responseData[0]?.consigneeId} />
                    </div>
                </div>
            </div>
            <Separator />
            <div className="flex flex-1 gap-6 pt-4">
                <Card className="w-2/5">
                    <CardHeader>
                        <CardTitle>Consignee Details</CardTitle>
                        {/* <CardDescription>{`Details of ${BlockData?.blockNumber}`}</CardDescription> */}
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
                                {/* General block details */}
                                <TableRow>
                                    <TableCell className="whitespace-nowrap">Name</TableCell>
                                    <TableCell>{responseData[0]?.consigneeId?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="whitespace-nowrap">Address</TableCell>
                                    <TableCell>{responseData[0]?.consigneeId?.address}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="whitespace-nowrap">Mobile No</TableCell>
                                    <TableCell>{responseData[0].consigneeId?.mobileNo}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="whitespace-nowrap">Email</TableCell>
                                    <TableCell>{responseData[0].consigneeId?.email}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>

                    <CardHeader>
                        <CardTitle>Overall Remittance Details</CardTitle>
                        <CardDescription>
                            Overall remittances details of your consignee - {responseData[0].consigneeId?.name}
                        </CardDescription>
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
                                    <TableCell>Total Invoices Value</TableCell>
                                    <TableCell>{new Intl.NumberFormat("en-IN", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(totalInvoiceValue)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Remittances Value</TableCell>
                                    <TableCell>{new Intl.NumberFormat("en-IN", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(totalRemittanceValue)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Difference Value</TableCell>
                                    <TableCell>{new Intl.NumberFormat("en-IN", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(totalInvoiceValue - totalRemittanceValue)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Status</TableCell>
                                    <TableCell> <Badge
                                        className={cn(
                                            status === "Balance Pending" &&
                                            "bg-amber-200 text-amber-800 hover:bg-amber-300/80 text-xs",

                                            status === "Recieved" &&
                                            "bg-green-200 text-green-800 hover:bg-green-300/80 text-xs",
                                            !status && "bg-gray-100 text-gray-600 hover:bg-gray-200/60"
                                        )}
                                    >
                                        {status.split("_").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "N/A"}
                                    </Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="w-3/5">
                    <DataTable
                        bulkDeleteIdName="_id"
                        bulkDeleteTitle="Are you sure you want to delete the selected Remittances?"
                        bulkDeleteDescription="This will delete all the selected Remittances, and they will not be recoverable."
                        bulkDeleteToastMessage="Selected Remittances deleted successfully"
                        deleteRoute="/factory-management/inventory/deletemultipleslabs"
                        searchKey="inwardRemittanceNumber"
                        columns={columns}
                        data={responseData as any}
                    />

                </div>
            </div>
        </div>
    )
}
