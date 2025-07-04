import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { QuarryColumns } from "./components/columns";

import Link from "next/link";
import React from "react";

export interface Quarry {
  _id: any;
  lesseeId?: string;
  lesseeName?: string;
  mineralName?: string;
  businessLocationNames?: string[];
  factoryId?: any;
  documents?: {
    fileName?: string;
    fileUrl?: string;
    date?: Date;
    review?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface Props {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default async function quarry({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  const factoryId = params.factoryid;
  const res = await fetch(
    `https://incodocs-server.onrender.com/quarry/getbyfactory/${factoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  const quarryData = await res.json();
  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href={`./`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Quarry Management" />
          <p className="text-muted-foreground text-sm mt-2">
            Streamline quarry operations with real-time tracking, activity
            monitoring, and seamless integration into production.
          </p>
        </div>
        <Link href={`./quarry/createnew`}>
          <Button className="bg-primary text-white">Add Quarry</Button>
        </Link>
      </div>
      {/* Moved PartiesDropdown here */}

      <Separator className="my-2" />
      <div>
        <DataTable
          bulkDeleteIdName="_id"
          bulkDeleteTitle="Are you sure you want to delete the selected Quarries?"
          bulkDeleteDescription="This will delete the selected Quarries, and they will not be recoverable."
          bulkDeleteToastMessage="Selected Quarries deleted successfully"
          deleteRoute="quarry/deletemany" // Verify this endpoint
          searchKey="quarryName"
          columns={QuarryColumns}
          token={token}
          data={quarryData}
        />
      </div>
    </div>
  );
}
