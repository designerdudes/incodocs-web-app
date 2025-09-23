import React from "react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { headers } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

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
  const headersList = headers();
  const referer = headersList.get("referer") || "/fallback"; // fallback if no referer

  const res = await fetchWithAuth<any>(
    `/factory-management/inventory/raw/get/${params?.blockid}`
  );

  BlockData = res;

  const resp = await fetchWithAuth<any>(
    `/factory-management/inventory/slabsbyblock/get/${params?.blockid}`
  );

  SlabData = resp;

  const slabs = Array.isArray(SlabData) ? SlabData : [];
  const totalSlabSqft = slabs.reduce((total: number, slab: any) => {
    const length = slab?.dimensions?.length?.value ?? 0;
    const height = slab?.dimensions?.height?.value ?? 0;
    return total + (length * height) / 144;
  }, 0);

  function calculateVolumeCm(
    length: number,
    breadth: number,
    height: number
  ): number {
    if (length && breadth && height) {
      // return in cm³
      return length * breadth * height;
    }
    return 0;
  }

  function convertCmCubeToMeterCube(volumeInCm: number): string {
    if (!volumeInCm || isNaN(volumeInCm)) return "0.00";
    return (volumeInCm / 1_000_000).toFixed(2); // cm³ → m³
  }

  const volumeInCm = calculateVolumeCm(
    BlockData?.dimensions?.length?.value,
    BlockData?.dimensions?.breadth?.value,
    BlockData?.dimensions?.height?.value
  );
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
        {/* <Link href={`../../${BlockData?.lotId?._id}/blocks`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link> */}
        <Link href={referer}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>

        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={` Details of Block : ${BlockData?.blockNumber} `}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Efficiently track Blocks with detailed insights into its current
            status and progress through the production cycle.
          </p>
        </div>
      </div>

      <Separator />

      {/* <div className="flex flex-col flex-1 py-2"> */}
      <div className="flex flex-1 gap-6">
        {/* Block Details Card */}
        <Card className="w-2/6">
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
                  <TableCell className="whitespace-nowrap">Block Id</TableCell>
                  <TableCell>{BlockData?.blockId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Block Number
                  </TableCell>
                  <TableCell>{BlockData?.blockNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Type
                  </TableCell>
                  <TableCell>{BlockData?.lotId?.materialType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">Status</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      className={cn(
                        BlockData?.status === "inStock" &&
                          "bg-blue-100 text-blue-800 hover:bg-blue-200/80",
                        BlockData?.status === "inDressing" &&
                          "bg-purple-100 text-purple-900 hover:bg-purple-200/80",
                        BlockData?.status === "dressed" &&
                          "bg-indigo-100 text-indigo-800 hover:bg-indigo-200/80",
                        BlockData?.status === "inSplitting" &&
                          "bg-red-100 text-red-800 hover:bg-red-200/80",
                        BlockData?.status === "split" &&
                          "bg-pink-100 text-pink-800 hover:bg-pink-200/80",
                        BlockData?.status === "readyForCutting" &&
                          "bg-amber-100 text-amber-800 hover:bg-amber-200/80",
                        BlockData?.status === "inCutting" &&
                          "bg-orange-100 text-orange-800 hover:bg-orange-200/80",
                        BlockData?.status === "cut" &&
                          "bg-green-100 text-green-800 hover:bg-green-200/80",
                        BlockData?.status === "N/A" &&
                          "bg-gray-100 text-gray-600 hover:bg-gray-200/60"
                      )}
                    >
                      {BlockData?.status === "inStock"
                        ? " In Stock"
                        : BlockData?.status === "inDressing"
                        ? " In Dressing"
                        : BlockData?.status === "dressed"
                        ? " Dressed"
                        : BlockData?.status === "inSplitting"
                        ? " In Splitting"
                        : BlockData?.status === "split"
                        ? " Split"
                        : BlockData?.status === "inCutting"
                        ? " In Cutting"
                        : BlockData?.status === "readyForCutting"
                        ? " Ready For Cutting"
                        : BlockData?.status === "cut"
                        ? " Cut"
                        : BlockData?.status === "cracked"
                        ? " Cracked"
                        : BlockData?.status}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="p-0">
                    <Accordion type="single" className="w-full" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          End to End Measurement
                        </AccordionTrigger>
                        <AccordionContent>
                          {BlockData && (
                            <div className="border p-3 rounded-lg bg-gray-100">
                              <h3 className="font-semibold mb-2">
                                Original Block
                              </h3>
                              <div className="grid grid-cols-5 gap-4">
                                <div>
                                  <Label>Length (cm)</Label>
                                  <Input
                                    type="number"
                                    value={BlockData?.dimensions?.length?.value}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label>Breadth (cm)</Label>
                                  <Input
                                    type="number"
                                    value={
                                      BlockData?.dimensions?.breadth?.value
                                    }
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label>Height (cm)</Label>
                                  <Input
                                    type="number"
                                    value={BlockData?.dimensions?.height?.value}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label>Volume (m³)</Label>
                                  <Input
                                    type="number"
                                    value={convertCmCubeToMeterCube(
                                      (BlockData?.dimensions?.length?.value ||
                                        0) *
                                        (BlockData?.dimensions?.breadth
                                          ?.value || 0) *
                                        (BlockData?.dimensions?.height?.value ||
                                          0)
                                    )}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label>Weight (tons)</Label>
                                  <Input
                                    type="number"
                                    value={
                                      BlockData?.dimensions?.weight?.value ||
                                      calculateWeightTons(
                                        BlockData?.dimensions?.length?.value ||
                                          0,
                                        BlockData?.dimensions?.breadth?.value ||
                                          0,
                                        BlockData?.dimensions?.height?.value ||
                                          0
                                      )
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger>Net Measurement</AccordionTrigger>
                        <AccordionContent>
                          <div className="border p-3 rounded-lg bg-gray-100">
                            <h3 className="font-semibold mb-2">
                              Net Dimensions Block
                            </h3>
                            <div className="grid grid-cols-5 gap-4">
                              <div>
                                <Label>Length (cm)</Label>
                                <Input
                                  type="number"
                                  value={
                                    BlockData?.netDimensions?.length?.value
                                  }
                                  disabled
                                />
                              </div>
                              <div>
                                <Label>Breadth (cm)</Label>
                                <Input
                                  type="number"
                                  value={
                                    BlockData?.netDimensions?.breadth?.value
                                  }
                                  disabled
                                />
                              </div>
                              <div>
                                <Label>Height (cm)</Label>
                                <Input
                                  type="number"
                                  value={
                                    BlockData?.netDimensions?.height?.value
                                  }
                                  disabled
                                />
                              </div>
                              <div>
                                <Label>Volume (m³)</Label>
                                <Input
                                  type="number"
                                  value={convertCmCubeToMeterCube(
                                    (BlockData?.netDimensions?.length?.value ||
                                      0) *
                                      (BlockData?.netDimensions?.breadth
                                        ?.value || 0) *
                                      (BlockData?.netDimensions?.height
                                        ?.value || 0)
                                  )}
                                  disabled
                                />
                              </div>
                              <div>
                                <Label>Weight (tons)</Label>
                                <Input
                                  type="number"
                                  value={
                                    BlockData?.netDimensions?.weight?.value ||
                                    calculateWeightTons(
                                      BlockData?.netDimensions?.length?.value ||
                                        0,
                                      BlockData?.netDimensions?.breadth
                                        ?.value || 0,
                                      BlockData?.netDimensions?.height?.value ||
                                        0
                                    )
                                  }
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
            <CardTitle>Machine Details</CardTitle>
            <CardDescription>
              Machine information for this block
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>In</TableHead>
                  <TableHead>Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Dressing */}
                {BlockData?.dressing && (
                  <TableRow>
                    <TableCell>Dressing</TableCell>
                    <TableCell>
                      {BlockData.dressing.machineId?.machineName} -{" "}
                      {BlockData.dressing.machineId?.typeCutting}
                    </TableCell>
                    <TableCell>
                      {BlockData.dressing.in
                        ? moment(BlockData.dressing.in).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {BlockData.dressing.out
                        ? moment(BlockData.dressing.out).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                )}

                {/* Cutting */}
                {BlockData?.cutting && (
                  <TableRow>
                    <TableCell>Cutting</TableCell>
                    <TableCell>
                      {BlockData.cutting.machineId?.machineName} -{" "}
                      {BlockData.cutting.machineId?.typeCutting}
                    </TableCell>
                    <TableCell>
                      {BlockData.cutting.in
                        ? moment(BlockData.cutting.in).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {BlockData.cutting.out
                        ? moment(BlockData.cutting.out).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                )}

                {/* Splitting */}
                {BlockData?.splitting && (
                  <TableRow>
                    <TableCell>Splitting</TableCell>
                    <TableCell>
                      {BlockData.splitting.machineId?.machineName} -{" "}
                      {BlockData.splitting.machineId?.typeCutting}
                    </TableCell>
                    <TableCell>
                      {BlockData.splitting.in
                        ? moment(BlockData.splitting.in).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {BlockData.splitting.out
                        ? moment(BlockData.splitting.out).format(
                            "DD MMM YYYY, hh:mm A"
                          )
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Slabs DataTable + SQFT total */}
        <div className="w-3/4">
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
      {/* </div> */}
    </div>
  );
}
