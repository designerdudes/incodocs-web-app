import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { columns } from "./components/columns";
import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Lots {
  _id: string;
  lotName: string;
  factoryId: string;
  organizationId: string;
  materialType: string;
  noOfBlocks: number;
  blocksId: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Props {
  params: {
    factoryid: string;
  };
}

export default async function LotManagement({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  try {
    var res = await fetchWithAuth<any>(
      `/factory-management/inventory/factory-lot/get/${params?.factoryid}`
    );
  } catch (error) {
    console.log("failed to fetch lots");
    res = [];
  }

  let lotsData;
  lotsData = res;

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
          <Heading className="leading-tight" title="Lots Management" />
          <p className="text-muted-foreground text-sm mt-2">
            Track and manage lots in detail, including associated blocks, slabs,
            material type, status, and production progress.
          </p>
        </div>
        {/* Move the interactivity to the client-side button component */}
        <Link href="./lots/create-new">
          <Button> Add New Lot</Button>
        </Link>
        {/* <CreateNewLotButton /> */}
      </div>
      <Separator className="my-2" />
      <div>
        <DataTable
          bulkDeleteIdName="_id"
          bulkDeleteTitle="Are you sure you want to delete the selected Lots?"
          bulkDeleteDescription="This will delete all the selected Lots, and they will not be recoverable."
          bulkDeleteToastMessage="Selected lots deleted successfully"
          deleteRoute="/factory-management/inventory/deletemultiplelots"
          searchKey="lotName"
          columns={columns}
          data={lotsData as any}
          token={token}
        />
      </div>
    </div>
  );
}
