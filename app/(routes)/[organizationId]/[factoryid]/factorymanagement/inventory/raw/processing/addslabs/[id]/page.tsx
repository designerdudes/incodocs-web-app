import React from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { AddSlabForm } from "@/components/forms/AddSlabForm";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
  params: {
    id: string;
    factoryid: string;
  };
}

export default async function AddSlabPage({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  let BlockData;
  try {
    var res = await fetchWithAuth<any>(
      `/factory-management/inventory/raw/get/${params.id}`
    );
  } catch (error) {
    console.log("failed to fetch block");
    BlockData = null;
  }
  BlockData = res;

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
          <Heading
            className="leading-tight"
            title={`Block ${BlockData.blockNumber}: Add Number of Slabs`}
          />
          <p className="text-muted-foreground text-sm mt-2">
            Add the total number of slabs for Block {BlockData.blockNumber} and
            efficiently track its progress in the ready for polish process.
          </p>
        </div>
        {/* <CreateNewLotButton /> */}
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto  py-10">
        {BlockData ? (
          <AddSlabForm gap={3} BlockData={BlockData} />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            <p className="text-muted-foreground text-lg">No Category Found</p>
            {/* <Button onClick={() => router.back()} variant='default'>Go Back</Button> */}
          </div>
        )}
      </div>
    </div>
  );
}
