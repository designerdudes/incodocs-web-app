import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Columns } from "./components/columns";
import { GstColumns } from "./components/GstColumns";
import { cookies } from "next/headers";

export type Sales = {
  _id: string;
  customerId: {
    customerName: string;
  };
  customerGSTN: string;
  noOfSlabs: number;
  length: string;
  height: string;
  saleDate: string;
  gstPercentage: number;
};

interface Props {
  params: {
    factoryid: string;
  };
}

export default async function SalesPage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const factoryId = params.factoryid;

  // Fetch With GST Sales
  const gstRes = await fetch(
    ` https://incodocs-server.onrender.com/transaction/sale/getgstsalebyfactory/${factoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      cache: "no-store",
    }
  );

  const withoutGstRes = await fetch(
    ` https://incodocs-server.onrender.com/transaction/sale/getsalebyfactory/${factoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      cache: "no-store",
    }
  );

  const withGstSales: Sales[] = await gstRes.json();
  const withoutGstSales: Sales[] = await withoutGstRes.json();

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
          <Heading className="leading-tight" title="Sales" />
          <p className="text-muted-foreground text-sm mt-2">
            Effortlessly track and manage the sale of finished goods with
            detailed records, ensuring transparency, compliance, and streamlined
            monitoring of customer transactions.
          </p>
        </div>
        <Link href="./sales/create-new">
          <Button>Create New Sale</Button>
        </Link>
      </div>

      <Separator orientation="horizontal" />

      <div className="w-250 container mx-auto py-10">
        <Tabs defaultValue="withgst" className="w-full">
          <TabsList className="gap-3">
            <TabsTrigger value="withgst" className="gap-2">
              With GST
              <Badge variant="outline">{withGstSales.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="withoutgst" className="gap-2">
              Without GST
              <Badge variant="outline">{withoutGstSales.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="withgst">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected sales?"
              bulkDeleteDescription="This will delete the selected sales, and they will not be recoverable."
              bulkDeleteToastMessage="Selected sales deleted successfully"
              searchKey="customerName"
              columns={GstColumns}
              data={withGstSales}
            />
          </TabsContent>

          <TabsContent value="withoutgst">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected sales?"
              bulkDeleteDescription="This will delete the selected sales, and they will not be recoverable."
              bulkDeleteToastMessage="Selected sales deleted successfully"
              searchKey="customerName"
              columns={Columns}
              data={withoutGstSales}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
