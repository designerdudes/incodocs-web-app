import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import { shippingLinecolumns } from "./components/shippingLineColumn";
import { forwardercolumns } from "./components/forwarderColumn";
import { transportercolumns } from "./components/transporterColumn";
import { suppliercolumns } from "./components/supplierColumn";
import { consigneecolumns } from "./components/consigneeColumn";
import { cbNamecolumns } from "./components/CbNameColumn";
import AddParties from "./components/PartiesDropdown";

interface Props {
  params: {
    organizationId: string;
  };
}

export default async function PartiesPage({ params }: Props) {
  const cookieStore = cookies();
  const organisationID = params.organizationId; // Could use params.organizationId
  const token = cookieStore.get("AccessToken")?.value || "";
  // Fetch data (unchanged)
  const GetCurrentUser = await fetch(
    `https://incodocs-server.onrender.com/user/currentUser`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());
  const currentUser = GetCurrentUser._id;

  const shippingLineRes = await fetch(
    `https://incodocs-server.onrender.com/shipment/shippingline/getbyorg/${organisationID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());
  const shippingLine = shippingLineRes;

  const ForwarderRes = await fetch(
    `https://incodocs-server.onrender.com/shipment/forwarder/getbyorg/${organisationID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());
  const forwarder = ForwarderRes;

  const transporterRes = await fetch(
    `https://incodocs-server.onrender.com/shipment/transporter/getbyorg/${organisationID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());
  const transporter = transporterRes;

  const supplierRes = await fetch(
    `https://incodocs-server.onrender.com/shipment/supplier/getbyorg/${organisationID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());
  const supplier = supplierRes;

  const consigneeRes = await fetch(
    `https://incodocs-server.onrender.com/shipment/consignee/getbyorg/${organisationID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());
  const consignee = consigneeRes;
  


  const cbNameRes = await fetch(
    `https://incodocs-server.onrender.com/shipment/cbname/getbyorg/${organisationID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());
  const cbName = cbNameRes;

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
        <div className="flex justify-end mb-4">
          <AddParties organizationId={organisationID} currentUser={currentUser} />
        </div>
      </div>
      
      {/* Moved AddParties here */}

      <Separator className="my-2" />
      <div>
        <Tabs defaultValue="shippingLine" className="w-full">
          {" "}
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
            <TabsTrigger className="gap-2" value="cbName">
              CustomBroker 
              <Badge className="text-bg-primary-foreground" variant="outline">
                {cbName?.length ?? 0}
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
              searchKey="shippingLineName"
              columns={shippingLinecolumns}
              data={shippingLine}
              organizationId={organisationID}
              token={token}
            />
          </TabsContent>
          <TabsContent value="forwarder">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected forwarders?"
              bulkDeleteDescription="This will delete the selected forwarders, and they will not be recoverable."
              bulkDeleteToastMessage="Selected forwarders deleted successfully"
              deleteRoute="/shipment/forwarder/deletemany"
              searchKey="forwarderName"
              columns={forwardercolumns}
              data={forwarder}
              organizationId={organisationID}
              token={token}
            />
          </TabsContent>
          <TabsContent value="transporter">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected transporter?"
              bulkDeleteDescription="This will delete the selected transporters, and they will not be recoverable."
              bulkDeleteToastMessage="Selected transporters deleted successfully"
              deleteRoute="/shipment/transporter/deletemany"
              searchKey="transporterName"
              columns={transportercolumns}
              data={transporter}
              organizationId={organisationID}
              token={token}
            />
          </TabsContent>
          <TabsContent value="supplier">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected suppliers?"
              bulkDeleteDescription="This will delete the selected suppliers, and they will not be recoverable."
              bulkDeleteToastMessage="Selected suppliers deleted successfully"
              deleteRoute="/shipment/supplier/deletemany"
              searchKey="supplierName"
              columns={suppliercolumns}
              data={supplier}
              organizationId={organisationID}
              token={token}
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
              data={consignee}
              organizationId={organisationID}
              token={token}
            />
          </TabsContent>
          <TabsContent value="cbName">
            <DataTable
              bulkDeleteIdName="_id"
              bulkDeleteTitle="Are you sure you want to delete the selected Cb Name's ?"
              bulkDeleteDescription="This will delete the selected Cb Name, and they will not be recoverable."
              bulkDeleteToastMessage="Selected Cb Name's deleted successfully"
              deleteRoute="/shipment/cbname/deletemany"
              searchKey="cbName"
              columns={cbNamecolumns}
              data={cbName}
              organizationId={organisationID}
              token={token}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
