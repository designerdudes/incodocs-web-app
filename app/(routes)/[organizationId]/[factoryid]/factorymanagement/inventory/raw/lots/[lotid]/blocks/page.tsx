import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import moment from "moment";
import { columns } from "./columns";
import { HorizontalCardAccordion } from "@/components/ui/horizontal-card-accordion";

interface Props {
  params: {
    id: any;
    factoryid: any;
    lotid: string;
  };
}

export default async function BlocksPage({ params }: Props) {
  let BlocksData = null;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/blocksbylot/get/${params?.lotid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());

  BlocksData = res;
  // console.log("dddddddddd",BlocksData)

  let LotData = null;
  const resp = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/lot/getbyid/${params?.lotid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());

  LotData = resp;

  return (
    <div className="w-full space-y-6 h-full flex p-6 flex-col">
      {/* Top Bar */}
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={`Details of Lot : ${BlocksData[0]?.lotId}`}
          />
          <p className="text-muted-foreground text-sm mt-2">
            This section allows you to send blocks from your inventory for
            cutting. Select the block and initiate the cutting process as the
            next step in its preparation.
          </p>
        </div>
      </div>

      <Separator orientation="horizontal" />

      {/* Content Area */}
      <div className="flex flex-1 gap-6">
        {/* Lot Details Card */}
        {/* <HorizontalCardAccordion title="Lot Details"> */}
        <Card className="w-1.5/5">
          <CardHeader>
            <CardTitle>Lot Details</CardTitle>
            <CardDescription>{`Details of ${LotData?.lotName}`}</CardDescription>
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
                  <TableCell className="whitespace-nowrap">Lot Id</TableCell>
                  <TableCell>{LotData?.lotId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Lot Name</TableCell>
                  <TableCell>{LotData?.lotName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Material Type</TableCell>
                  <TableCell>{LotData?.materialType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Blocks</TableCell>
                  <TableCell>{LotData?.blocksId?.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Block Loading Cost</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(LotData?.blockLoadingCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Material Cost</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(LotData?.materialCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Permit Cost</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(LotData?.permitCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marker Cost</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(LotData?.markerCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marker Operator</TableCell>
                  <TableCell>{LotData?.markerOperatorName}</TableCell>
                </TableRow>
                {LotData?.quarryName && (
                  <TableRow>
                    <TableCell>Quarry Name</TableCell>
                    <TableCell>{LotData?.quarryName}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell>Quarry Transport Cost</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(LotData?.quarryCost || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Commission Cost</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(LotData?.commissionCost || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lot Created At</TableCell>
                  <TableCell>
                    {moment(LotData?.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lot Updated At</TableCell>
                  <TableCell>
                    {moment(LotData?.updatedAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
             
                <TableRow>
                  <TableCell>End-to-End Measurement</TableCell>
                  
                </TableRow>
                <TableRow>
                  <TableCell> Net Measurement</TableCell>
                 
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* </HorizontalCardAccordion> */}

        {/* Block's DataTable */}
        <div className="w-3.5/5">
          <DataTable
            bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected Blocks?"
            bulkDeleteDescription="This will delete all the selected Blocks, and they will not be recoverable."
            bulkDeleteToastMessage="Selected Blocks deleted successfully"
            deleteRoute="/factory-management/inventory/deletemultipleblocks"
            searchKey="blockNumber"
            columns={columns}
            data={BlocksData as any}
            token={token}
          />
        </div>
      </div>
    </div>
  );
}
