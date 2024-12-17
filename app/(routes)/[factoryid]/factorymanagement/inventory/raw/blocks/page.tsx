import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { columns } from "./components/columns";
// import CreateNewLotButton from "./components/CreateNewLotButton"; // Import the client-side button component


interface Blocks {
  _id: string
  blocknumber: string
  materialType: string
  numberofslabs: string
  instock: string
  createdAt: string
}

export default function Blocks() {
  const data: Blocks[] = [
    {
      _id: "65f8fb0fc4417ea5a14fbd82",
      materialType: "type A",
      numberofslabs: "20",
      blocknumber: "123",
      instock: "20",
      createdAt: "9-11-24"

    },
  ];

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../raw">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Blocks" />
          <p className="text-muted-foreground text-sm">
            The tracking of blockssssss through various stages of production.</p>
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
          data={data as any}
        />
      </div>
    </div>
  );
}
