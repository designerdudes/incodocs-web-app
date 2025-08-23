import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { columns } from "../../../blocks/components/columns";
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
import { NetMeasurmentForm } from "./components/NetMeasurmentForm";

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
  ).then((response) => {
    return response.json();
  });

  BlocksData = res;
  // console.log("wwwwwww",BlocksData)

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
  ).then((response) => {
    return response.json();
  });
  LotData = resp;

  // console.log("this i slot data",LotData)
  // console.log("this i Block data",BlocksData)

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
            title={`Details of Lot : ${BlocksData[0]?.lotName}`}
          />
          <p className="text-muted-foreground text-sm mt-2">
            This section allows you to send blocks from your inventory for
            cutting. Select the block and initiate the cutting process as the
            next step in its  preparation.
          </p>
        </div>
      </div>

      <Separator orientation="horizontal" />

      {/* Content Area */}
      <div className="flex flex-1 gap-6">
        {/* Lot Details Card */}
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
                  <TableCell className="whitespace-nowrap">
                    Material Type
                  </TableCell>
                  <TableCell>{LotData?.materialType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Total Blocks
                  </TableCell>
                  <TableCell>{LotData?.blocksId?.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Block Loading Cost{" "}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(LotData?.blockLoadingCost)}
                  </TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Block Photo
                  </TableCell>
                  <TableCell>
                    {LotData.blockphoto ? (
                      <a
                        href={LotData.blockphoto}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="link" className="p-0 m-0">
                          View Block Photo
                        </Button>
                      </a>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Material Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(LotData?.materialCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(LotData?.markerCost)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Marker Operator
                  </TableCell>
                  <TableCell>{LotData?.markerOperatorName}</TableCell>
                </TableRow>
                {LotData?.quarryName && (
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Quarry Name
                    </TableCell>
                    <TableCell>{LotData?.quarryName}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Quarry Transport Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(LotData?.quarryCost || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Comission Cost
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(LotData?.commissionCost || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Lot Created At
                  </TableCell>
                  <TableCell>
                    {moment(LotData.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    Lot Updated At
                  </TableCell>
                  <TableCell>
                    {moment(LotData.updatedAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="w-full lg:w-2/3">
          <NetMeasurmentForm LotData={LotData} BlocksData={BlocksData} />
        </div>
      </div>
    </div>
  );
}
