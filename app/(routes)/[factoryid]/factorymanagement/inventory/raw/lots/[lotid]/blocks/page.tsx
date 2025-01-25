import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { columns } from "../../../blocks/components/columns";

interface Props {
    params: {
        lotid: string;
    }
}

export default async function BlocksPage({ params }: Props) {
    let BlocksData = null
    const cookieStore = cookies();
    const token = cookieStore.get('AccessToken')?.value || ""

    const res = await fetch(`http://localhost:4080/factory-management/inventory/blocksbylot/get/${params?.lotid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        return response.json()
    })

    BlocksData = res;
    console.log("BlocksData:", BlocksData);

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
                    <Heading className="leading-tight" title={` Details of ${BlocksData[0]?.lotName}'s Blocks`} />
                    <p className="text-muted-foreground text-sm mt-2">
                        Efficiently track and manage Blocks with detailed insights into its current status and progress through the production cycle.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
                    bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
                    bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                    deleteRoute="/category/ids"
                    searchKey="blockNumber"
                    columns={columns}
                    data={BlocksData as any}
                />
            </div>
        </div>
    );
}
