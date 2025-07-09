import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { rawPurchaseWithGstColumn } from "./components/rawPurchaseWithGstColumn";
import { rawPurchaseColumns } from "./components/rawPurchaseColumns";
import { FinishedPurchaseWithGstColumns } from "./components/finishedPurchaseWithGstColumn";
import { FinishedPurchaseColumns } from "./components/finishedPurchaseColumns";
import AddPurchases from "./components/purchasesDropdown";

export type RawPurchaseWithGST = {
  _id: string;
  supplierId: { supplierName: string };

  supplierGSTN: string;
  purchaseType: "Raw";
  noOfBlocks: number;
  length: string;
  breadth: string;
  height: string;
  purchaseDate: string;
  gstPercentage: number;
  ratePerCubicVolume: string;
};

export type ActualRawPurchase = {
  _id: string;
  supplierId: { supplierName: string };
  supplierGSTN: string;
  purchaseType: "Raw";
  noOfBlocks: number;
  length: string;
  breadth: string;
  height: string;
  purchaseDate: string;
  ratePerCubicVolume: string;
};

export type FinishedPurchaseWithGST = {
  _id: string;
 supplierId: { supplierName: string };
  supplierGSTN: string;
  purchaseType: "Finished";
  noOfSlabs: number;
  length: string;
  height: string;
  purchaseDate: string;
  gstPercentage: number;
  ratePerSqft: string;
};

export type ActualFinishedPurchase = {
  _id: string;
  supplierId: { supplierName: string };
  supplierGSTN: string;
  purchaseType: "Finished";
  noOfSlabs: number;
  length: string;
  height: string;
  purchaseDate: string;
  ratePerSqft: string;
};

export type RawPurchased = RawPurchaseWithGST | ActualRawPurchase;

export type FinishedPurchased = | FinishedPurchaseWithGST | ActualFinishedPurchase;

interface Props {
  params: {
    factoryid: string;
    organizationid: string;
  };
}

export default async function Purchases({ params }: Props) {
  const token = cookies().get("AccessToken")?.value || "";

  const [rawWithGst, actualRaw, slabWithGst, actualSlab] = await Promise.all([
    fetch(
      `https://incodocs-server.onrender.com/transaction/purchase/getgstrawbyfactory/${params.factoryid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => res.json()),

    fetch(
      `https://incodocs-server.onrender.com/transaction/purchase/getrawbyfactory/${params.factoryid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => res.json()),

    fetch(
      `https://incodocs-server.onrender.com/transaction/purchase/getgstslabbyfactory/${params.factoryid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => res.json()),

    fetch(
      `https://incodocs-server.onrender.com/transaction/purchase/getslabbyfactory/${params.factoryid}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => res.json()),
  ]);

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
          <Heading className="leading-tight" title="Purchases" />
          <p className="text-muted-foreground text-sm mt-2">
            Seamlessly manage and monitor raw material and finished goods
            purchases.
          </p>
        </div>
        <AddPurchases factoryId={params.factoryid} />
      </div>

      <Separator orientation="horizontal" />

      <div className="w-250 container mx-auto py-10">
        <Tabs defaultValue="Raw" className="w-full">
          <TabsList className="gap-3">
            <TabsTrigger className="gap-2" value="Raw">
              Raw Materials
              <Badge variant="outline">
                {(rawWithGst?.length || 0) + (actualRaw?.length || 0)}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="Finished">
              Finished Materials
              <Badge variant="outline">
                {(slabWithGst?.length || 0) + (actualSlab?.length || 0)}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Raw Material Tabs */}
          <TabsContent value="Raw">
            <Tabs defaultValue="RawWithGST" className="w-full">
              <TabsList className="gap-3 mt-4">
                <TabsTrigger value="RawWithGST">
                  Raw Purchase with GST
                </TabsTrigger>
                <TabsTrigger value="ActualRaw">Actual Raw Purchase</TabsTrigger>
              </TabsList>

              <TabsContent value="RawWithGST">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure?"
                  bulkDeleteDescription="This will delete raw purchases permanently."
                  bulkDeleteToastMessage="Raw purchases deleted."
                  searchKey="supplierName"
                  deleteRoute="transaction/purchase/deletemultiple"
                  columns={rawPurchaseWithGstColumn}
                  data={rawWithGst}
                />
              </TabsContent>

              <TabsContent value="ActualRaw">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure?"
                  bulkDeleteDescription="This will delete raw purchases permanently."
                  bulkDeleteToastMessage="Raw purchases deleted."
                  searchKey="supplierName"
                  deleteRoute="transaction/purchase/deletemultiple"
                  columns={rawPurchaseColumns}
                  data={actualRaw}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Finished Material Tabs */}
          <TabsContent value="Finished">
            <Tabs defaultValue="FinishedWithGST" className="w-full">
              <TabsList className="gap-3 mt-4">
                <TabsTrigger value="FinishedWithGST">
                  Finished Purchase with GST
                </TabsTrigger>
                <TabsTrigger value="ActualFinished">
                  Actual Finished Purchase
                </TabsTrigger>
              </TabsList>

              <TabsContent value="FinishedWithGST">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure?"
                  bulkDeleteDescription="This will delete finished purchases permanently."
                  bulkDeleteToastMessage="Finished purchases deleted."
                  searchKey="supplierName"
                  deleteRoute="transaction/purchase/deletemultiple"
                  columns={FinishedPurchaseWithGstColumns}
                  data={slabWithGst}
                />
              </TabsContent>

              <TabsContent value="ActualFinished">
                <DataTable
                  bulkDeleteIdName="_id"
                  bulkDeleteTitle="Are you sure?"
                  bulkDeleteDescription="This will delete finished purchases permanently."
                  bulkDeleteToastMessage="Finished purchases deleted."
                  searchKey="supplierName"
                  deleteRoute="transaction/purchase/deletemultiple"
                  columns={FinishedPurchaseColumns}
                  data={actualSlab}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
