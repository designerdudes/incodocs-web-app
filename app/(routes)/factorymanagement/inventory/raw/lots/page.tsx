import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { columns } from "./components/columns";
import CreateNewLotButton from "./components/CreateNewLotButton"; // Import the client-side button component

interface LotManagement {
  _id: string;
  materialType: string;
  numberofBlocks: string;
  lotname: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  height: string;
  breadth: string;
  intrimming: string;
  incutting: string;
  instock: string;
  completed: string;
  length: string;
}

export default function LotManagement() {
  const data: LotManagement[] = [
    {
      _id: "65f8fb0fc4417ea5a14fbd82",
      materialType: "Granite",
      numberofBlocks: "20",
      lotname: "xyz",
      categoryId: "Category123",
      isActive: true,
      createdAt: "2024-03-19T02:40:15.954Z",
      height: "54",
      breadth: "3.2",
      intrimming: "5",
      incutting: "7",
      instock: "8",
      completed: "5",
      length: "4.2",
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
          <Heading className="leading-tight" title="Lots Management" />
          <p className="text-muted-foreground text-sm">
            Efficiently track and manage raw material lots with detailed insights into their current status and progress through the production cycle.
          </p>
        </div>
        {/* Move the interactivity to the client-side button component */}
        <CreateNewLotButton />
      </div>
      <Separator orientation="horizontal" />
      <div className="w-250 container mx-auto py-10">
        <DataTable
          bulkDeleteIdName="_id"
          bulkDeleteTitle="Are you sure you want to delete the selected Lots?"
          bulkDeleteDescription="This will delete all the selected Lots, and they will not be recoverable."
          bulkDeleteToastMessage="Selected lots deleted successfully"
          deleteRoute="/category/ids"
          searchKey="name"
          columns={columns}
          data={data as any}
        />
      </div>
    </div>
  );
}
