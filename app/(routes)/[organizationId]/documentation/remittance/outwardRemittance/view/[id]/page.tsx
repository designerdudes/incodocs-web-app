import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, EyeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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
    organizationId: string;
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  try {
    var res = await fetchWithAuth<any>(
      `/remittance/outward/getbyid/${params.id}`
    );
  } catch (error) {
    console.error("failed to fetch Data");
    res = [];
  }

  const responseData = res;

  // console.log("This is the datataaa",responseData)
  // const totalInvoiceValue = responseData.reduce(
  //     (sum: number, remittance: any) => sum + (remittance.invoiceValue || 0),
  //     0
  // );

  // const totalRemittanceValue = responseData.reduce(
  //     (sum: number, remittance: any) => sum + (remittance.inwardRemittanceValue || 0),
  //     0
  // );

  // const status = totalInvoiceValue - totalRemittanceValue > 0 ? "Balance Pending" : "Recieved"

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
              title={`${responseData?.customerName} - Outward Remittances`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View all outward remittances - {responseData?.customerName}
            </p>
          </div>
          <div className="flex gap-2">
            {/* <DownloadInvRemittance remittanceData={responseData} consigneeData={responseData[0]?.consigneeId} /> */}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 gap-6 pt-4">
        <Card className="w-2/5">
          <CardHeader>
            <CardTitle>Outward Remittance Details</CardTitle>
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
                  <TableCell>Organization</TableCell>
                  <TableCell>{responseData?.organizationId?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>{responseData?.customerName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>
                    {new Date(responseData?.paymentDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{responseData?.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Proof</TableCell>
                  <TableCell>
                    <a
                      href={responseData?.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="link" className="p-0 m-0">
                        View Payment Proof
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Method</TableCell>
                  <TableCell>{responseData?.method}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>{responseData?.amount || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bank Name</TableCell>
                  <TableCell>{responseData?.bankName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Created By</TableCell>
                  <TableCell>
                    {responseData?.createdBy?.fullName} (
                    {responseData?.createdBy?.email})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Created At</TableCell>
                  <TableCell>
                    {new Date(responseData?.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Updated At</TableCell>
                  <TableCell>
                    {new Date(responseData?.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* <div className="w-3/5">
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

                </div> */}
      </div>
    </div>
  );
}
