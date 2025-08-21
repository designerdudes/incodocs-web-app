import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronLeft, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { cookies } from "next/headers";
import { MachineLogColumns } from "../../components/MachineLogColumns";
import { PolishSlabColumns, Slab } from "../../components/PolishSlabColumns";
import {
  Block,
  CuttingBlocksColumns,
} from "../../components/CuttingBlocksColumns";
import { MachineDetailsColumns } from "../../components/MachineDetailsColumns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";

export default async function ViewMachinePage({
  params,
}: {
  params: { id: string };
}) {
  const _id = params.id;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/machine/getone/${_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  const MachineData = await res.json();

  const logsRes = await fetch(
    `https://incodocs-server.onrender.com/machine/log/getbymachine/${_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );

  const machineLogs = await logsRes.json();

  const isCutting = !!MachineData.typeCutting;
  const isPolishing = !!MachineData.typePolish;

  const totalSlabSqft = (MachineData.blocks ?? []).reduce(
    (blockTotal: any, block: { blockId: { SlabsId: never[] } }) => {
      const slabs = block.blockId?.SlabsId ?? [];

      const blockSlabSqft = slabs.reduce(
        (
          slabTotal: number,
          slab: {
            dimensions: {
              length: { value: number };
              height: { value: number };
            };
          }
        ) => {
          const length = slab?.dimensions?.length?.value ?? 0;
          const height = slab.dimensions?.height?.value ?? 0;
          const sqft = (length * height) / 144;
          return slabTotal + sqft;
        },
        0
      );

      return blockTotal + blockSlabSqft;
    },
    0
  );

  const totalSqft = (MachineData.slabs ?? []).reduce(
    (acc: number, slab: Slab) => {
      const length = slab?.slabId.dimensions?.length?.value ?? 0;
      const height = slab?.slabId.dimensions?.height?.value ?? 0;
      return acc + (length * height) / 144;
    },
    0
  );

  return (
    <div className="w-full h-full flex flex-col p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="topbar flex items-center justify-between gap-4 w-full">
          <Link href="../">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="flex-1">
            <Heading
              className="leading-tight "
              title={`Details of Machine: ${MachineData.machineName}`}
            />
            <p className="text-muted-foreground text-sm mt-2">
              View Machine with detailed insights into specifications and
              status.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="gap-4 mb-6">
          <TabsTrigger value="details">Machine Details</TabsTrigger>
          <TabsTrigger value="logs">Machine Logs</TabsTrigger>
          {isCutting && <TabsTrigger value="blocks">Blocks Cut</TabsTrigger>}
          {isPolishing && (
            <TabsTrigger value="slabs">Slabs Polished</TabsTrigger>
          )}
        </TabsList>

        {/* Tab: Machine Details */}
        <TabsContent value="details">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
            <div className="flex-1">
              <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Machine Details</CardTitle>
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
                            Machine Name
                          </TableCell>
                          <TableCell>{MachineData?.machineName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Machine Id
                          </TableCell>
                          <TableCell>{MachineData.machineId}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Machine Type
                          </TableCell>
                          <TableCell>
                            {MachineData.typeCutting
                              ? `Cutting - ${MachineData.typeCutting}`
                              : MachineData.typePolish
                              ? `Polish - ${MachineData.typePolish}`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Machine Ownership
                          </TableCell>
                          <TableCell>
                            {MachineData.ownership
                              ? MachineData.ownership === "owned"
                                ? "Owned"
                                : "Rented"
                              : "N/A"}
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell>Machine Photo</TableCell>
                          <TableCell>
                            {MachineData.machinePhoto ? (
                              <a
                                href={MachineData.machinePhoto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                <EyeIcon className="h-4 w-4 cursor-pointer" />
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Status
                          </TableCell>
                          <TableCell>
                            {MachineData?.isActive === true
                              ? "Active"
                              : MachineData?.isActive === false
                              ? "Inactive"
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Machine Cost
                          </TableCell>
                          <TableCell>{MachineData?.machineCost}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Current Component
                          </TableCell>
                          <TableCell>
                            {MachineData?.currentComponent?.Name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Total Processed
                          </TableCell>
                          <TableCell>{MachineData?.totalProcessed}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Installed Date
                          </TableCell>
                          <TableCell>
                            {moment(MachineData.installedDate).format(
                              "DD-MMM-YYYY"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Last Maintenance
                          </TableCell>
                          <TableCell>
                            {moment(MachineData.lastMaintenance).format(
                              "DD-MMM-YYYY"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="whitespace-nowrap">
                            Review
                          </TableCell>
                          <TableCell>{MachineData?.review}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Machine Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Machine Logs</CardTitle>
              <CardDescription>Maintenance and usage history</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                searchKey="componentType"
                columns={MachineLogColumns}
                data={machineLogs}
                token={token}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Blocks Cut */}
        {isCutting && (
          <TabsContent value="blocks">
            <Card>
              <CardHeader>
                <CardTitle>Blocks Cut</CardTitle>
                <CardDescription>
                  All blocks processed by this cutting machine
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DataTable
                  columns={CuttingBlocksColumns}
                  data={MachineData.blocks ?? []}
                  token={token}
                  searchKey="blockNumber"
                />
                {/* ✅ Show total block SQFT above table */}
                <div className="flex justify-end pt-4 border-t mt-4">
                  <div className="text-base font-semibold text-gray-800">
                    Total Blocks(slabs) SQFT: {totalSlabSqft.toFixed(2)} ft²
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab: Slabs Polished */}
        {isPolishing && (
          <TabsContent value="slabs">
            <Card>
              <CardHeader>
                <CardTitle>Slabs Polished</CardTitle>
                <CardDescription>
                  All slabs polished by this machine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  searchKey="shippingLineName"
                  columns={PolishSlabColumns}
                  data={MachineData.slabs ?? []}
                  token={token}
                />
                <div className="flex justify-end pt-4 border-t mt-4">
                  <div className="text-right font-bold p-4">
                    Total SQFT Polished: {totalSqft.toFixed(2)} ft²
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
