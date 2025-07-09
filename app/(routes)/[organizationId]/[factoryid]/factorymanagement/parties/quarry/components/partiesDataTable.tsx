"use client";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { QuarryColumns } from "./columns";
import { Quarry } from "../../page";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import Heading from "@/components/ui/heading";

interface params {
  token: string;
  quarryData: Quarry[];
}

function PartiesDataTable({ token, quarryData }: params) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const party = searchParams.get("party") || "quarry";

  const [selectedTab, setSelectedTab] = useState(party);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("party", value);

    router.push(`?${params.toString()}`);
  };
  return (
    <div>
      <div className="topbar w-full flex justify-between items-center">
        <Link href={`./`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Parties" />
          <p className="text-muted-foreground text-sm mt-2">
            Streamline parties operations with real-time tracking, activity
            monitoring, and seamless integration into production.
          </p>
        </div>
        <Link href={`./parties/quarry/createnew`}>
          <Button className="bg-primary text-white capitalize">
            Add {party}
          </Button>
        </Link>
      </div>
      <Separator className="my-2" />
      <Tabs
        defaultValue="quarry"
        value={selectedTab}
        onValueChange={handleTabChange}
        className="w-full mt-4"
      >
        <TabsList className="gap-4 w-full flex justify-start items-start">
          <TabsTrigger value="quarry">Quarry Details</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
        </TabsList>
        <div>
          {party === "quarry" && (
            <TabsContent value="quarry">
              <DataTable
                bulkDeleteIdName="_id"
                bulkDeleteTitle="Are you sure you want to delete the selected Quarries?"
                bulkDeleteDescription="This will delete the selected Quarries, and they will not be recoverable."
                bulkDeleteToastMessage="Selected Quarries deleted successfully"
                deleteRoute="quarry/deletemany"
                searchKey="lesseeName"
                columns={QuarryColumns}
                token={token}
                data={quarryData}
              />
            </TabsContent>
          )}
          {party === "supplier" && (
            <TabsContent value="customer">
              <DataTable
                bulkDeleteIdName="_id"
                bulkDeleteTitle="Are you sure you want to delete the selected Quarries?"
                bulkDeleteDescription="This will delete the selected Quarries, and they will not be recoverable."
                bulkDeleteToastMessage="Selected Quarries deleted successfully"
                deleteRoute="quarry/deletemany"
                searchKey="lesseeName"
                columns={QuarryColumns}
                token={token}
                data={quarryData}
              />
            </TabsContent>
          )}
          {party === "customer" && (
            <TabsContent value="customer">
              <DataTable
                bulkDeleteIdName="_id"
                bulkDeleteTitle="Are you sure you want to delete the selected Quarries?"
                bulkDeleteDescription="This will delete the selected Quarries, and they will not be recoverable."
                bulkDeleteToastMessage="Selected Quarries deleted successfully"
                deleteRoute="quarry/deletemany"
                searchKey="lesseeName"
                columns={QuarryColumns}
                token={token}
                data={quarryData}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}

export default PartiesDataTable;
