import React from "react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { DataTable } from "@/components/ui/data-table";
import { rawblockcolumns } from "./component/rawblockcolumn";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: {
    id: string;
  };
}

export default async function SlabsPage({ params }: Props) {
  const BlockDataId = params.id;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  // console.log("this us dddddddd",BlockDataId)

  const res = await fetch(
    `https://incodocs-server.onrender.com/transaction/purchase/rawgetbyid/${BlockDataId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const { getPurchase: BlockData } = await res.json();
  // console.log("ffffffffffffffdd",BlockData)
  const calculateVolumeInCm = (
    length: number,
    breadth: number,
    height: number
  ) => {
    const volumeInCubicInches = length * breadth * height;
    const conversionFactor = 16.387064;
    return (volumeInCubicInches * conversionFactor).toFixed(2);
  };

  const volumeCm = calculateVolumeInCm(
    BlockData.length,
    BlockData.breadth,
    BlockData.height
  );

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
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
            title={`Details of Raw Purchase ${BlockData.invoiceNo}`}
          />
          <p className="text-muted-foreground text-sm mt-2">
            A comprehensive view of all transactions involving the purchase of
            raw materials.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />

      <div className="flex flex-5 gap-6">
          <Card className="w-2/5">
            <CardHeader>
              <CardTitle>Raw Purchase Details</CardTitle>
              <CardDescription>{`Details of invoice ${BlockData.invoiceNo}`}</CardDescription>
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
                    <TableCell>Factory</TableCell>
                    <TableCell>{BlockData.factoryId?.factoryName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Supplier Name</TableCell>
                    <TableCell>{BlockData.supplierId?.supplierName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of Blocks</TableCell>
                    <TableCell>{BlockData.noOfBlocks}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Invoice No.</TableCell>
                    <TableCell>{BlockData.invoiceNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Invoice Value</TableCell>
                    <TableCell>{BlockData.invoiceValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Volume Quantity</TableCell>
                    <TableCell>{BlockData.volumeQuantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weight (tons)</TableCell>
                    <TableCell>{BlockData.weight}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rate per Cubic Volume</TableCell>
                    <TableCell>{BlockData.ratePerCubicVolume}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Volume (cm³)</TableCell>
                    <TableCell>{volumeCm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>GST Percentage</TableCell>
                    <TableCell>{BlockData.gstPercentage}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Payment Proof
                    </TableCell>
                    <TableCell>
                      {BlockData.paymentProof ? (
                        <a
                          href={BlockData.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="link" className="p-0 m-0">
                            View Payment Proof
                          </Button>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>
                      {moment(BlockData.purchaseDate).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Created At</TableCell>
                    <TableCell>
                      {moment(BlockData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Updated At</TableCell>
                    <TableCell>
                      {moment(BlockData.updatedAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="w-3/5">
                    <DataTable
                      // bulkDeleteIdName="_id"
                      // bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
                      // bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
                      // bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                      // deleteRoute="/factory-management/inventory/deletemultipleblocks"
                      searchKey="blockNumber"
                      columns={rawblockcolumns}
                      data={BlockData.blockIds}
                      token={token}
                    />
                  </div>
      </div>
    </div>
  );
}
