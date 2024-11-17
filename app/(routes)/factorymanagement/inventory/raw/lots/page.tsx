import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, PlusIcon } from "lucide-react";
import Link from "next/link";
import { columns } from "./components/columns";
import { cookies } from "next/headers";

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

export default async function LotManagement() {
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
    {
      _id: "65f8fd0ac4417ea5a14fbda1",
      lotname: "xyz",
      materialType: "Black Granite",
      numberofBlocks: "20",
      categoryId: "Category123",
      createdAt: "2024-03-19T02:40:15.954Z",
      height: "54",
      breadth: "3.2",
      intrimming: "5",
      incutting: "7",
      instock: "8",
      completed: "5",
      length: "4.2",
      isActive: true,
    },
    {
      _id: "65f8febec4417ea5a14fbdad",
      lotname: "xyz",
      materialType: "Marble",
      numberofBlocks: "20",
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

  // const cookieStore = cookies();
  // const token = cookieStore.get('AccessToken')?.value || "";

  // const res = await fetch('https://apis.offersholic.zephyrapps.in/categories/v1/all', {
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + token
  //     }
  // });

  // const categories = await res.json();

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="./dashboard">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight " title="Lot management " />
          <p className="text-muted-foreground text-sm">
            {" "}
            Efficiently track and manage raw material lots with detailed insights into their current status and progress through the production cycle
          </p>
        </div>
        <Button className="mr-12" asChild>
          <Link href="lotmanagement/addlot">Create New Lot</Link>
        </Button>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto py-10">
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
