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
    `http://localhost:4080/factory-management/inventory/raw/get/${params?.blockid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => {
    return response.json();
  });

  BlockData = res;

  const resp = await fetch(
    `http://localhost:4080/factory-management/inventory/slabsbyblock/get/${params?.blockid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => {
    return response.json();
  });

  SlabData = resp;

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
  const volumeinInchs = calculateVolume(
    BlockData?.dimensions?.length?.value,
    BlockData?.dimensions?.breadth?.value,
    BlockData?.dimensions?.height?.value
  );

  function convertInchCubeToCmCube(volumeinInchs: any) {
    const conversionFactor = 16.387064; // 1 cubic inch = 16.387064 cubic centimeters
    const inchToCm = volumeinInchs * conversionFactor;
    return inchToCm.toFixed(2);
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
            title={` Details of Block ${BlockData.blockNumber} `}
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
          <Card className="w-2/5" >
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
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Number
                    </TableCell>
                    <TableCell>{BlockData?.blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Number of slabs
                    </TableCell>
                    <TableCell>{BlockData?.SlabsId?.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Material Type
                    </TableCell>
                    <TableCell>{BlockData?.lotId?.materialType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">Status</TableCell>
                    <TableCell>
                      {BlockData?.status === "cut"
                        ? "Ready for Polish"
                        : BlockData?.status || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Weight (tons)
                    </TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.weight?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Length (inch)
                    </TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.length?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Breadth (inch)
                    </TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.breadth?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Height (inch)
                    </TableCell>
                    <TableCell>
                      {BlockData?.dimensions?.height?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Volume (in³)
                    </TableCell>
                    <TableCell>
                      {calculateVolume(
                        BlockData?.dimensions?.length?.value,
                        BlockData?.dimensions?.breadth?.value,
                        BlockData?.dimensions?.height?.value
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Volume (cm³)
                    </TableCell>
                    <TableCell>
                      {convertInchCubeToCmCube(volumeinInchs)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Created At
                    </TableCell>
                    <TableCell>
                      {moment(BlockData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Updated At
                    </TableCell>
                    <TableCell>
                      {moment(BlockData.updatedAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Slabs DataTable */}
          <div className="w-3/5">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
              bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
              bulkDeleteToastMessage="Selected Raw Material deleted successfully"
              deleteRoute="/category/ids"
              searchKey="slabNumber"
              columns={columns}
              data={SlabData as any}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
