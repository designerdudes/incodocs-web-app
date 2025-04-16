import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GstSalesColumns } from "./components/GstSalesColumns";
import { ActualSalesColumns } from "./components/ActualSalesColumns";

export type Sales = {
  actualInvoiceValue: ReactNode;
  _id: string;
  customerName: string;
  customerGSTN: string;
  noOfSlabs: number;
  length: string;
  height: string;
  saleDate: string;
  GstPercentage: number;
};

interface Props {
  params: {
    factoryid: string;
  };
}

export default async function Purchases({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `http://localhost:4080/transaction/sale/getgstsale/${params?.factoryid}`,
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

  let SalesData;
  SalesData = res;

  const Actualres = await fetch(
    `http://localhost:4080/transaction/sale/getsale/${params?.factoryid}`,
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

  let GetSalesData;
  GetSalesData = Actualres;

  const InvoiceValue = SalesData.filter(
    (data: any) => data.purchaseType === "Raw"
  );
  const ActualInvoiceValue = SalesData.filter(
    (data: any) => data.purchaseType === "Finished"
  );

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
            monitoring of customer transactions.{" "}
          </p>
        </div>
        <Link href="./sales/create-new">
          <Button> Create New Sale</Button>
        </Link>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-250 container mx-auto py-10">
        <Tabs defaultValue="Gstsales" className="w-full">
          <TabsList className="gap-3">
            <TabsTrigger className="gap-2" value="Gstsales">
              Gst sales
              <Badge className="text-bg-primary-foreground" variant="outline">
                {SalesData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="Actualsales">
              Actual sales
              <Badge className="text-bg-primary-foreground" variant="outline">
                {SalesData.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Gstsales">
            <DataTable
              bulkDeleteIdName="order_id"
              bulkDeleteTitle="Are you sure you want to delete the selected sales?"
              bulkDeleteDescription="This will delete the selected sales, and they will not be recoverable."
              bulkDeleteToastMessage="Selected sales deleted successfully"
              searchKey="title"
              columns={GstSalesColumns}
              data={SalesData as any}
            />
          </TabsContent>
          <TabsContent value="Actualsales">
            <DataTable
              bulkDeleteIdName="order_id"
              bulkDeleteTitle="Are you sure you want to delete the selected sales?"
              bulkDeleteDescription="This will delete the selected sales, and they will not be recoverable."
              bulkDeleteToastMessage="Selected sales deleted successfully"
              searchKey="title"
              columns={ActualSalesColumns}
              data={GetSalesData as any}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
