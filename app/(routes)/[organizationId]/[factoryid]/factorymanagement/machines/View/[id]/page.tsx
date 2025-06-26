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
import MachineLogColumns from "../../components/MachineLogColumns";
import PolishSlabColumns from "../../components/PolishSlabColumns";
import CuttingBlocksColumns from "../../components/CuttingBlocksColumns";
import { MachineDetailsColumns } from "../../components/MachineDetailsColumns";

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
  // console.log("logssssssssssss",MachineData)
  const isCutting = !!MachineData.typeCutting;
  const isPolishing = !!MachineData.typePolish;

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
          <DataTable
            searchKey="machineName"
            columns={MachineDetailsColumns}
            data={[MachineData]}
            token={token}
          />
        </TabsContent>

        {/* Tab: Machine Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Machine Logs</CardTitle>
              <CardDescription>Maintenance and usage history</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <DataTable
            bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected shipping lines?"
            bulkDeleteDescription="This will delete the selected shipping lines, and they will not be recoverable."
            bulkDeleteToastMessage="Selected shipping lines deleted successfully"
            deleteRoute="/shipment/shippingline/deletemany"
            searchKey="shippingLineName"
            columns={MachineLogColumns}
            data={MachineData}
            organizationId={organisationID}
            token={token}
          /> */}
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
              <CardContent>
                {/* <DataTable
                bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected shipping lines?"
            bulkDeleteDescription="This will delete the selected shipping lines, and they will not be recoverable."
            bulkDeleteToastMessage="Selected shipping lines deleted successfully"
            deleteRoute="/shipment/shippingline/deletemany"
            searchKey="shippingLineName"
            columns={CuttingBlocksColumns}
            data={MachineData}
            organizationId={organisationID}
            token={token}
          /> */}
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
                {/* <DataTable
                bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected shipping lines?"
            bulkDeleteDescription="This will delete the selected shipping lines, and they will not be recoverable."
            bulkDeleteToastMessage="Selected shipping lines deleted successfully"
            deleteRoute="/shipment/shippingline/deletemany"
            searchKey="shippingLineName"
            columns={PolishSlabColumns}
            data={MachineData}
            organizationId={organisationID}
            token={token}
          /> */}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
