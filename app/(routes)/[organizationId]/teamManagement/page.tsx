import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { columns } from "./components/columns";

interface Props {
  params: {
    organizationId : string;
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { organizationId  } = params;
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  const res = await fetch(`https://incodocs-server.onrender.com/employers/getbyorg/${organizationId }`, 
    {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then((response) => {
    return response.json();
  });

  let teamData;
  teamData = res;

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <div className="flex-1">
          <Heading className="leading-tight" title="Team Management" />
          <p className="text-muted-foreground text-sm mt-2">
            Streamline team structure, ensure proper record-keeping, and
            facilitate effective communication within the organization.
          </p>
        </div>
        {/* Move the interactivity to the client-side button component */}
        <Link href="./teamManagement/add-New-Member">
          <Button> Add Member</Button>
        </Link>
        {/* <CreateNewLotButton /> */}
      </div>
      <Separator orientation="horizontal" />
      <div className="w-250 container mx-auto py-10">
        <DataTable
          bulkDeleteIdName="_id"
          bulkDeleteTitle="Are you sure you want to delete the selected Team Members?"
          bulkDeleteDescription="This will delete all the selected Members, and they will not be recoverable."
          bulkDeleteToastMessage="Selected Members deleted successfully"
          deleteRoute="/employers/deleteall"
          searchKey="employeeId"
          columns={columns}
          data={teamData as any}
        />
      </div>
    </div>
  );
}
