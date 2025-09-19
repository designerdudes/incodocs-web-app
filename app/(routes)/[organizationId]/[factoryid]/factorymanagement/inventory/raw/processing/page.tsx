import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { incuttingcolumns } from "./components/incuttingcolumns";
import { Readyforpolishcolumns } from "./components/readyforpolishcolumns";
import { inPolishingcolumns } from "./components/inpolishingcolumns";
import { cookies } from "next/headers";
import { Polishedcolumns } from "./components/polishedcolumns";
import TabsDataTable from "./components/tabsDataTable";
import { indressingcolumns } from "./components/inDressingColumns";
import { dressedcolumns } from "./components/dressedColumns";
import { insplittingcolumns } from "./components/inSplittingColumns";
import { splittedcolumns } from "./components/splittedColumns";

export type FinishedMaterial = {
  _id: string; // Unique identifier
  slabNumber: number; // Sequential slab number
  blockNumber: number | null; // Block number, can be null
  factoryId: string; // Associated factory identifier
  productName: string; // Name of the product
  quantity: number; // Quantity of the finished material
  status: string; // Status (e.g., "polished")
  inStock: boolean; // Availability status
  blockId: {
    _id: string;
    lotId?: {
      _id: string;
      materialType: string;
    };
  };

  dimensions: {
    length: {
      value: number;
      units: string; // E.g., "inch"
    };
    height: {
      value: number;
      units: string; // E.g., "inch"
    };
  };

  trim: {
    length: {
      value: number;
      units: string; // E.g., "inch"
    };
    height: {
      value: number;
      units: string; // E.g., "inch"
    };
  };

  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  workersCuttingPay: number;
  workersPolishingPay: number;
  cuttingPaymentStatus: { status: string };
  polishingPaymentStatus: { status: string };
};

interface Props {
  params: {
    factoryid: string;
  };
}

export default async function SlabsProcessingPage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  // Fetch the data for blocks and slabs
  const blockRes = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/getblocksbyfactory/${params?.factoryid}`,
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

  const slabRes = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/getslabsbyfactory/${params?.factoryid}`,
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

  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/getslabsbyfactory/${params.factoryid} `,
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

  const slabsData = res;
  let Blockdata = blockRes || [];
  let Slabdata = slabRes || [];
  // console.log("Slabdatasss", Slabdata);

  const inDressing = Blockdata.filter(
    (data: any) => data.status === "inDressing"
  );
  const Dressed = Blockdata.filter((data: any) =>
   data.status === "dressed"
  );

  const inSplitting = Blockdata.filter(
    (data: any) => data.status === "inSplitting"
  );

  const split = Blockdata.filter((data: any) =>
    data.status === "split"
  );
   const readyForCutting = Blockdata.filter((data: any) =>
    data.status === "readyForCutting"
  );

  const inCutting = Blockdata.filter(
    (data: any) => data.status === "inCutting"
  );
  const readyForPolish = Blockdata.filter((data: any) =>
    data.SlabsId.some((slab: any) => slab.status === "readyForPolish")
);

  const inPolishing = Array.isArray(Slabdata)
    ? Slabdata.filter((data: any) => data.status === "inPolishing")
    : [];
  const Polished = Array.isArray(Slabdata)
    ? Slabdata.filter((data: any) => data.status === "polished")
    : [];

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title="Blocks and Slabs In Process"
          />
          <p className="text-muted-foreground text-sm mt-2">
            On this page, each block is processed into slabs by cutting. Once
            cut, the slabs are polished to perfection and then added to the
            finished materials inventory, ready for further use or distribution.
          </p>
        </div>
      </div>
      <Separator className="my-2" />
      <div>
        {/* <Tabs defaultValue="inCutting" className="w-full">
          <TabsList className="gap-3">
            <TabsTrigger className="gap-2" value="inCutting">
              In Cutting
              <Badge className="text-bg-primary-foreground" variant="outline">
                {inCutting?.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="readyforpolish">
              Ready For Polish
              <Badge className="text-bg-primary-foreground" variant="outline">
                {readyForPolish?.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="inPolishing">
              In Polishing
              <Badge className="text-bg-primary-foreground" variant="outline">
                {inPolishing?.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="Polished">
              Polished
              <Badge className="text-bg-primary-foreground" variant="outline">
                {Polished?.length}
              </Badge>
            </TabsTrigger>
            <TabsList className="gap-6">
              <TabsTrigger className="gap-2" value="CuttingData">
                Cutting Data
                <Badge className="text-bg-primary-foreground" variant="outline">
                  {slabsData?.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger className="gap-2" value="PolishingData">
                Polishing Data
                <Badge className="text-bg-primary-foreground" variant="outline">
                  {slabsData?.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </TabsList>
          <TabsContent value="inCutting">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected blocks?"
              bulkDeleteDescription="This will delete the selected blocks, and they will not be recoverable."
              bulkDeleteToastMessage="Selected blocks deleted successfully"
              deleteRoute="/factory-management/inventory/deletemultipleblocks"
              searchKey="blockNumber"
              columns={incuttingcolumns}
              data={inCutting as any}
            />
          </TabsContent>
          <TabsContent value="readyforpolish">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected blocks?"
              bulkDeleteDescription="This will delete the selected blocks, and they will not be recoverable."
              bulkDeleteToastMessage="Selected blocks deleted successfully"
              deleteRoute="/factory-management/inventory/deletemultipleblocks"
              searchKey="blockNumber"
              columns={Readyforpolishcolumns}
              data={readyForPolish.map((block: Block) => ({
                ...block,
                readyForPolishCount: block.SlabsId.filter(
                  (slab: any) => slab.status === "readyForPolish"
                ).length,
              }))}
            />
          </TabsContent>

          <TabsContent value="inPolishing">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
              bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
              bulkDeleteToastMessage="Selected slabs deleted successfully"
              deleteRoute="/factory-management/inventory/deletemultipleslabs"
              searchKey="slabNumber"
              columns={inPolishingolumns}
              data={inPolishing}
              tab="inPolishing"
              bulkPolishTitle="Are you sure you want to mark these slabs as polished?"
              bulkPOlishDescription="This will mark the selected slabs as polished, and they will not be recoverable."
              bulkPolishIdName="_id"
              updateRoute="/factory-management/inventory/addtrim-multipleslabs"
              bulkPolisToastMessage=" selected slabs marked as polished"
            />
          </TabsContent>
          <TabsContent value="Polished">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
              bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
              bulkDeleteToastMessage="Selected slabs deleted successfully"
              deleteRoute="/factory-management/inventory/deletemultipleslabs"
              searchKey="slabNumber"
              columns={Polishedcolumns}
              data={Polished}
            />
          </TabsContent>
          <TabsContent value="CuttingData">
            <Tabs defaultValue="CuttingInchesWithAllowance" className="w-full">
              <div className="text-center mt-4">
                <TabsList className="gap-6">
                  <TabsTrigger
                    className="gap-2"
                    value="CuttingInchesWithAllowance"
                  >
                    Cutting Inches With Allowance
                  </TabsTrigger>
                  <TabsTrigger
                    className="gap-2"
                    value="CuttinginchesWithOutAllowance"
                  >
                    Cutting Inches WithOut Allowance
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="CuttingInchesWithAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
                  bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected Slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={CuttingInchesWithAllowanceColumns}
                  data={slabsData}
                />
              </TabsContent>

              <TabsContent value="CuttinginchesWithOutAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
                  bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected Slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={CuttingInchesWithOutAllowanceColumns}
                  data={slabsData}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="PolishingData">
            <Tabs
              defaultValue="PolishingInchesWithAllowance"
              className="w-full"
            >
              <div className="text-center mt-4">
                <TabsList className="gap-6">
                  <TabsTrigger
                    className="gap-2"
                    value="PolishingInchesWithAllowance"
                  >
                    Polishing Inches With Allowance
                  </TabsTrigger>
                  <TabsTrigger
                    className="gap-2"
                    value="PolishingInchesWithOutAllowance"
                  >
                    Polishing Inches WithOut Allowance
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="PolishingInchesWithAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
                  bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={polishingInchesWithAllowanceColumns}
                  data={slabsData}
                />
              </TabsContent>
              <TabsContent value="PolishingInchesWithOutAllowance">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
                  bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
                  bulkDeleteToastMessage="Selected slabs deleted successfully"
                  deleteRoute="/factory-management/inventory/deletemultipleslabs"
                  searchKey="slabNumber"
                  columns={polishingInchesWithOutAllowanceColumns}
                  data={slabsData}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs> */}
        <TabsDataTable
          inDressing={inDressing}
          Dressed={Dressed}
          inSplitting={inSplitting}
          Splitted={split}
          ReadyForCutting= {readyForCutting}
          inCutting={inCutting}
          readyForPolish={readyForPolish}
          inPolishing={inPolishing}
          Polished={Polished}
          slabsData={slabsData}
          incuttingcolumns={incuttingcolumns}
          Readyforpolishcolumns={Readyforpolishcolumns}
          inPolishingcolumns={inPolishingcolumns}
          Polishedcolumns={Polishedcolumns}
          inDressingcolumns={indressingcolumns}
          Dressedcolumns={dressedcolumns}
          inSplittingcolumns={insplittingcolumns}
          Splittedcolumns={splittedcolumns}        
          />
      </div>
    </div>
  );
}
