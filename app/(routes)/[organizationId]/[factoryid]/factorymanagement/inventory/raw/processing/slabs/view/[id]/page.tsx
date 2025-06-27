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
    id: string;
    factoryid: string;
  };
}

export default async function SlabsPage({ params }: Props) {
  let SlabData = null;

  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  // Fetch slab data
  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/finished/get/${params?.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());

  SlabData = res;

  // Format polishing date and time to match "DD MMM YYYY, hh:mm A"
  const polishingDateTime = SlabData?.polishingScheduledAt
    ? moment(
        `${SlabData.polishingScheduledAt.date.split("T")[0]}T${String(
          SlabData.polishingScheduledAt.time.hours
        ).padStart(2, "0")}:${String(
          SlabData.polishingScheduledAt.time.minutes
        ).padStart(2, "0")}:00Z`
      ).format("DD MMM YYYY, hh:mm A")
    : "N/A";

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={`Details of Slab: ${SlabData.slabNumber}`}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Efficiently track Slabs with detailed insights into its current
            status and progress through the production cycle.
          </p>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Slab Details</CardTitle>
              <CardDescription>{`Details of Slab: ${SlabData?.slabNumber}`}</CardDescription>
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
                      Slab Number
                    </TableCell>
                    <TableCell>{SlabData?.slabNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Block Number
                    </TableCell>
                    <TableCell>{SlabData?.blockNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Material Type
                    </TableCell>
                    <TableCell>
                      {SlabData?.blockId?.lotId?.materialType ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">Status</TableCell>
                    <TableCell>{SlabData?.status ?? "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Before Trim Length (inch)
                    </TableCell>
                    <TableCell>
                      {SlabData?.dimensions?.length?.value ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Before Trim Height (inch)
                    </TableCell>
                    <TableCell>
                      {SlabData?.dimensions?.height?.value ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Trim Length (inch)
                    </TableCell>
                    <TableCell>
                      {SlabData?.trim?.length?.value ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Trim Height (inch)
                    </TableCell>
                    <TableCell>
                      {SlabData?.trim?.height?.value ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Slab Created At
                    </TableCell>
                    <TableCell>
                      {moment(SlabData?.createdAt).format("DD-MMM-YYYY") ?? "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Slab Updated At
                    </TableCell>
                    <TableCell>
                      {moment(SlabData?.updatedAt).format("DD-MMM-YYYY") ?? "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            {/* Polishing Details Section */}
            <CardHeader>
              <CardTitle>Polishing Details</CardTitle>
              <CardDescription>Polishing information for this slab</CardDescription>
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
                    <TableCell className="whitespace-nowrap">Machine</TableCell>
                    <TableCell>
                      {SlabData?.polishingMachineId?.machineName
                        ? `${SlabData.polishingMachineId.machineName} - ${SlabData.polishingMachineId.typePolish}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-nowrap">
                      Polishing Date and Time
                    </TableCell>
                    <TableCell>
                      {SlabData?.polishingScheduledAt
                        ? moment(
                            `${SlabData.polishingScheduledAt.date.split("T")[0]}T${String(
                              SlabData.polishingScheduledAt.time.hours
                            ).padStart(2, "0")}:${String(
                              SlabData.polishingScheduledAt.time.minutes
                            ).padStart(2, "0")}:00Z`
                          ).format("DD MMM YYYY, hh:mm A")
                        : "N/A"}
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