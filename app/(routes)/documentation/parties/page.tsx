import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { shippingLinecolumns } from "./components/shippingLineColumn";
import { forwardercolumns } from "./components/forwarderColumn";
import { transportercolumns } from "./components/transporterColumn";
import { suppliercolumns } from "./components/supplierColumn";
import { consigneecolumns } from "./components/consigneeColumn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  params: {
    organizationId: string;
  };
}

export default async function PartiesPage({ params }: Props) {
  const cookieStore = cookies();
  const orgaanisationID = "674b0a687d4f4b21c6c980ba";
  const token = cookieStore.get("AccessToken")?.value || "";

  const shippingLineRes = await fetch(
    `http://localhost:4080/shipment/shippingline/getbyorg/${orgaanisationID}`,
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
  const shippingLine = shippingLineRes;

  const ForwarderRes = await fetch(
    `http://localhost:4080/shipment/forwarder/getbyorg/${orgaanisationID}`,
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
  const forwarder = ForwarderRes;

  const transporterRes = await fetch(
    `http://localhost:4080/shipment/transporter/getbyorg/${orgaanisationID}`,
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
  const transporter = transporterRes;

  const supplierRes = await fetch(
    `http://localhost:4080/shipment//supplier/getbyorg/${orgaanisationID}`,
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
  const supplier = supplierRes;

  const consigneeRes = await fetch(
    `http://localhost:4080/shipment/consignee/getbyorg/${orgaanisationID}`,
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
  const consignee = consigneeRes;

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="/documentation/dashboard">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Parties" />
          <p className="text-muted-foreground text-sm mt-2">
            Easily track and modify details of stakeholders, ensuring efficient
            coordination and up-to-date records.
          </p>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Parties
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2 flex flex-col gap-2">
            <Link href={`/parties/${orgaanisationID}/shipping-line/add`}>
              <Button variant="ghost" className="w-full justify-start">
                Shipping Line
              </Button>
            </Link>
            <Link href={`/parties/${orgaanisationID}/forwarder/add`}>
              <Button variant="ghost" className="w-full justify-start">
                Forwarder
              </Button>
            </Link>
            <Link href={`/parties/${orgaanisationID}/transporter/add`}>
              <Button variant="ghost" className="w-full justify-start">
                Transporter
              </Button>
            </Link>
            <Link href={`/parties/${orgaanisationID}/supplier/add`}>
              <Button variant="ghost" className="w-full justify-start">
                Supplier
              </Button>
            </Link>
            <Link href={`/parties/${orgaanisationID}/consignee/add`}>
              <Button variant="ghost" className="w-full justify-start">
                Consignee
              </Button>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <Tabs defaultValue="shippingLine" className="w-full">
          <TabsList className="gap-3">
            <TabsTrigger className="gap-2" value="shippingLine">
              Shipping Line
              <Badge className="text-bg-primary-foreground" variant="outline">
                {shippingLine?.length ?? 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="forwarder">
              Forwarder
              <Badge className="text-bg-primary-foreground" variant="outline">
                {forwarder?.length ?? 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="transporter">
              Transporter
              <Badge className="text-bg-primary-foreground" variant="outline">
                {transporter?.length ?? 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="supplier">
              Supplier
              <Badge className="text-bg-primary-foreground" variant="outline">
                {supplier?.length ?? 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="consignee">
              Consignee
              <Badge className="text-bg-primary-foreground" variant="outline">
                {consignee?.length ?? 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shippingLine">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected shipping lines?"
              bulkDeleteDescription="This will delete the selected shipping lines, and they will not be recoverable."
              bulkDeleteToastMessage="Selected shipping lines deleted successfully"
              deleteRoute="/shipment/shippingline/deletemany"
              searchKey="name"
              columns={shippingLinecolumns}
              data={shippingLine as any}
            />
          </TabsContent>
          <TabsContent value="forwarder">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected forwarders?"
              bulkDeleteDescription="This will delete the selected forwarders, and they will not be recoverable."
              bulkDeleteToastMessage="Selected forwarders deleted successfully"
              deleteRoute="/shipment/forwarder/deletemany"
              searchKey="name"
              columns={forwardercolumns}
              data={forwarder as any}
            />
          </TabsContent>
          <TabsContent value="transporter">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected transporters?"
              bulkDeleteDescription="This will delete the selected transporters, and they will not be recoverable."
              bulkDeleteToastMessage="Selected transporters deleted successfully"
              deleteRoute="/shipment/transporter/deletemany"
              searchKey="name"
              columns={transportercolumns}
              data={transporter as any}
            />
          </TabsContent>
          <TabsContent value="supplier">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected suppliers?"
              bulkDeleteDescription="This will delete the selected suppliers, and they will not be recoverable."
              bulkDeleteToastMessage="Selected suppliers deleted successfully"
              deleteRoute="/shipment//supplier/deletemany"
              searchKey="name"
              columns={suppliercolumns}
              data={supplier as any}
            />
          </TabsContent>
          <TabsContent value="consignee">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected consignees?"
              bulkDeleteDescription="This will delete the selected consignees, and they will not be recoverable."
              bulkDeleteToastMessage="Selected consignees deleted successfully"
              deleteRoute="/shipment/consignee/deletemany"
              searchKey="name"
              columns={consigneecolumns}
              data={consignee as any}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
