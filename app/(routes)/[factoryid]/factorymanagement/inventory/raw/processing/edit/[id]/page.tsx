import React from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import EditSlabForm from "@/components/forms/EditSlabForm";


interface Props {
  params: {
    id: string;
  };
}

export default async function EditPage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  const res = await fetch(
    `https://incodocs-server.onrender.com/factory-management/inventory/raw/get/${params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  ).then((response) => response.json());

  let BlockData = res;

  return (
    <div className="w-auto space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex justify-between items-center">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title={`Edit Slabs of Block ${BlockData.blockNumber}`} />
          <p className="text-muted-foreground text-sm mt-2">
            Enter the total number of slabs for Block {BlockData.blockNumber} and efficiently track its progress in the cutting process.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto py-10">
        {BlockData ? (
          <EditSlabForm id={BlockData._id} />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            <p className="text-muted-foreground text-lg">No Category Found</p>
          </div>
        )}
      </div>
    </div>
  );
}
