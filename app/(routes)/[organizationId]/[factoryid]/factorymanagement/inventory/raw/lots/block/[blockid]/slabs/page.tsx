import React from "react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface Props {
  params: {
    blockid: string;
  };
}

export default async function SlabsPage({ params }: Props) {
  let BlockData = null;
  let SlabData = null;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/raw/get/${params?.blockid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());

  BlockData = res;
  // console.log("ssssssssss",BlockData);

  const resp = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/slabsbyblock/get/${params?.blockid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());

  SlabData = resp;

  const slabs = Array.isArray(SlabData) ? SlabData : [];
  const totalSlabSqft = slabs.reduce((total: number, slab: any) => {
    const length = slab?.dimensions?.length?.value ?? 0;
    const height = slab?.dimensions?.height?.value ?? 0;
    return total + (length * height) / 144;
  }, 0);

  function calculateVolume(
    length: number,
    breadth: number,
    height: number
  ): string {
    if (length && breadth && height) {
      const volumeInch = length * breadth * height;
      return volumeInch.toFixed(2);
    }
    return "";
  }

  const volumeInInches = calculateVolume(
    BlockData?.dimensions?.length?.value,
    BlockData?.dimensions?.breadth?.value,
    BlockData?.dimensions?.height?.value
  );

  function convertInchCubeToMeterCube(volumeInInches: any) {
    if (!volumeInInches || isNaN(volumeInInches)) return "0.000000";
    const conversionFactor = 0.000016387064;
    return (volumeInInches * conversionFactor).toFixed(2);
  }
  const calculateWeightTons = (
    lengthCm: number,
    breadthCm: number,
    heightCm: number
  ): number => {
    // Convert cm³ to m³
    const volumeM3 = (lengthCm * breadthCm * heightCm) / 1_000_000;

    // Density in tons/m³
    const density = 3.5;

    // Weight in tons, rounded to 2 decimals
    return Number((volumeM3 * density).toFixed(2));
  };

  function getCuttingDateTime(cuttingScheduledAt: any): Date | null {
    if (
      cuttingScheduledAt &&
      cuttingScheduledAt.date &&
      cuttingScheduledAt.time &&
      typeof cuttingScheduledAt.time.hours === "number" &&
      typeof cuttingScheduledAt.time.minutes === "number"
    ) {
      const { date, time } = cuttingScheduledAt;
      const { hours, minutes } = time;
      const dateObj = new Date(date);
      dateObj.setUTCHours(hours, minutes, 0, 0);
      return dateObj;
    }
    return null;
  }

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href={`../../${BlockData.lotId._id}/blocks`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={` Details of Block : ${BlockData.blockNumber} `}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Efficiently track Blocks with detailed insights into its current
            status and progress through the production cycle.
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col flex-1 py-2">
        <div className="flex flex-1 gap-6">
          {/* Block Details Card */}
          <Card className="w-2/5">
            <CardHeader>
              <CardTitle>Block Details</CardTitle>
              <CardDescription>{`Details of ${BlockData?.blockNumber}`}</CardDescription>
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
                    <TableCell>Block Id</TableCell>
                    <TableCell>{BlockData?.blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Block Number</TableCell>
                    <TableCell>{BlockData?.blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Material Type</TableCell>
                    <TableCell>{BlockData?.lotId?.materialType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{BlockData?.status}</TableCell>
                  </TableRow>

                  {/* --- End-to-End Measurement --- */}
                  <TableRow className="bg-gray-100 font-semibold">
                    <TableCell colSpan={2}>End-to-End Measurement</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Length (cm)</TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.length?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Breadth (cm)</TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.breadth?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Height (cm)</TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.height?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Volume (m³)</TableCell>
                    <TableCell>
                      {convertInchCubeToMeterCube(
                        (BlockData?.dimensions?.length?.value || 0) *
                          (BlockData?.dimensions?.breadth?.value || 0) *
                          (BlockData?.dimensions?.height?.value || 0)
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Weight (tons)</TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.weight?.value ||
                        calculateWeightTons(
                          BlockData?.dimensions?.length?.value || 0,
                          BlockData?.dimensions?.breadth?.value || 0,
                          BlockData?.dimensions?.height?.value || 0
                        )}
                    </TableCell>
                  </TableRow>

                  {/* --- Net Measurement (from another API: NetData) --- */}
                  <TableRow className="bg-gray-100 font-semibold">
                    <TableCell colSpan={2}>Net Measurement</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Length (cm)</TableCell>
                    {/* <TableCell>{NetData?.dimensions?.length?.value}</TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell>Breadth (cm)</TableCell>
                    {/* <TableCell>{NetData?.dimensions?.breadth?.value}</TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell>Height (cm)</TableCell>
                    {/* <TableCell>{NetData?.dimensions?.height?.value}</TableCell> */}
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Volume (m³)</TableCell>
                    <TableCell>
                      {/* {convertInchCubeToMeterCube(
            (NetData?.dimensions?.length?.value || 0) *
              (NetData?.dimensions?.breadth?.value || 0) *
              (NetData?.dimensions?.height?.value || 0)
          )} */}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Weight (tons)</TableCell>
                    <TableCell>
                      {/* {NetData?.dimensions?.weight?.value ||
            calculateWeightTons(
              NetData?.dimensions?.length?.value || 0,
              NetData?.dimensions?.breadth?.value || 0,
              NetData?.dimensions?.height?.value || 0
            )} */}
                    </TableCell>
                  </TableRow>

                  {/* Created / Updated */}
                  <TableRow>
                    <TableCell>Block Created At</TableCell>
                    <TableCell>
                      {moment(BlockData.createdAt).format("DD-MMM-YYYY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Block Updated At</TableCell>
                    <TableCell>
                      {moment(BlockData.updatedAt).format("DD-MMM-YYYY")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>

            <CardHeader>
              <CardTitle>Cutting Details</CardTitle>
              <CardDescription>
                Cutting information for this block
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
                    <TableCell>Machine</TableCell>
                    <TableCell>
                      {BlockData?.cuttingMachineId?.machineName} -{" "}
                      {BlockData?.cuttingMachineId?.typeCutting}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cutting Date and Time</TableCell>
                    <TableCell>
                      {BlockData?.cuttingScheduledAt
                        ? moment(
                            getCuttingDateTime(BlockData.cuttingScheduledAt)
                          ).format("DD MMM YYYY, hh:mm A")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Slabs DataTable + SQFT total */}
          <div className="w-3/5">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
              bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
              bulkDeleteToastMessage="Selected Raw Material deleted successfully"
              deleteRoute="/factory-management/inventory/deletemultipleslabs"
              searchKey="slabNumber"
              columns={columns}
              data={SlabData as any}
            />
            {/* ✅ Total Slabs SQFT Display */}
            <div className="flex justify-end pt-4 border-t mt-4">
              <div className="text-right font-semibold p-2">
                Total Slabs SQFT: {totalSlabSqft.toFixed(2)} ft²
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
