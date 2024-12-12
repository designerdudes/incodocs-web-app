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

interface Props {
  params: {
    blockid: string;
  };
}

export default async function SlabsPage({ params }: Props) {
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

  SlabData = res;
  console.log(SlabData);
  console.log(SlabData.dimensionsNumber);
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
    SlabData?.dimensions?.length?.value,
    SlabData?.dimensions?.breadth?.value,
    SlabData?.dimensions?.height?.value
  );

  function convertInchCubeToCmCube(volumeinInchs: any) {
    const conversionFactor = 16.387064; // 1 cubic inch = 16.387064 cubic centimeters
    return volumeinInchs * conversionFactor;
  }

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
            title={` Details of Raw Purchase ${SlabData.blockNumber} `}
          />
          <p className="text-muted-foreground text-sm mt-2">
            A comprehensive view of all customer transactions involving the
            purchase of raw materials. It serves as a centralized hub to track,
            manage, and review details such as customer names, purchase
            quantities, dates, and other relevant information.
          </p>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Raw Purchase Details</CardTitle>
              <CardDescription>{`Details of ${SlabData?.blockNumber}`}</CardDescription>
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
                      Supplier Name
                    </TableCell>
                    <TableCell>{SlabData?.blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Number of blocks
                    </TableCell>
                    <TableCell>{SlabData?.SlabsId?.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Invoice No.
                    </TableCell>
                    <TableCell>{SlabData.materialType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Invoice Value
                    </TableCell>
                    <TableCell>{SlabData?.blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Volume Quantity
                    </TableCell>
                    <TableCell>{SlabData.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Weight (tons)
                    </TableCell>
                    <TableCell>{SlabData?.dimensions?.weight?.value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Length (inch)
                    </TableCell>
                    <TableCell>{SlabData?.dimensions?.length?.value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Breadth (inch)
                    </TableCell>
                    <TableCell>
                      {SlabData?.dimensions?.breadth?.value}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Height (inch)
                    </TableCell>
                    <TableCell>{SlabData?.dimensions?.height?.value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Rate per Cubic Volume
                    </TableCell>
                    <TableCell>{SlabData?.blockNumber}</TableCell>
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
                      GST Percentage
                    </TableCell>
                    <TableCell>{SlabData.materialType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Purchase Date
                    </TableCell>
                    <TableCell>
                      {moment(SlabData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Created At
                    </TableCell>
                    <TableCell>
                      {moment(SlabData.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Updated At
                    </TableCell>
                    <TableCell>
                      {moment(SlabData.updatedAt).format("YYYY-MM-DD")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
