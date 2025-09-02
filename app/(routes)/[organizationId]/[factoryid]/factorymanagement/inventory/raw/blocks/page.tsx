import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { columns } from "./components/columns";
import { cookies } from "next/headers";

// import CreateNewLotButton from "./components/CreateNewLotButton"; // Import the client-side button component
interface Props {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

interface Blocks {
  _id: string
  blocknumber: string
  materialType: string
  numberofslabs: string
  instock: string
  createdAt: string
}

export default async function Blocks({ params }: Props) {
const cookieStore = cookies();
const token = cookieStore.get("AccessToken")?.value || "";
const Blockres = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/getblocksbyfactory/${params.factoryid}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => response.json());
  let BlockData = Blockres;

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
          <Heading className="leading-tight" title="Blocks" />
          <p className="text-muted-foreground text-sm">
            The tracking of blocks through various stages of production.</p>
        </div>
        {/* Move the interactivity to the client-side button component */}
        {/* <CreateNewLotButton /> */}
      </div>
      <Separator orientation="horizontal" />
      <div className="w-250 container mx-auto py-10">
        <DataTable
          bulkDeleteIdName="_id"
          bulkDeleteTitle="Are you sure you want to delete the selected Raw Material?"
          bulkDeleteDescription="This will delete all the selected Raw Material, and they will not be recoverable."
          bulkDeleteToastMessage="Selected Raw Material deleted successfully"
          deleteRoute="/category/ids"
          searchKey="name"
          columns={columns}
          data={BlockData as any}
        />
      </div>
    </div>
  );
}
