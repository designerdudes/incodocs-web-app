
import React from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { MarkCutAndCreateSlabsForm } from "@/components/forms/MarkCutAndCreateSlabsForm";


interface Props {
    params: {
        blockid: string
    }
}

export default async function MarkCutPage(params: Props) {

    const cookieStore = cookies();
    const token = cookieStore.get('AccessToken')?.value || ""

    const res = await fetch(`https://incodocs-server.onrender.com/factory-management/inventory/raw/get/${params.params.blockid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        return response.json()
    })
    let BlockData = null
    BlockData = res


    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href="../../">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading
                        className="leading-tight"
                        title={`Block ${BlockData.blockNumber}: Enter Number of Slabs`}
                    />
                    <p className="text-muted-foreground text-sm mt-2">
                        Enter the total number of slabs for Block {BlockData.blockNumber} and efficiently track its progress in the cutting process.
                    </p>
                </div>
                {/* <CreateNewLotButton /> */}
            </div>
            <Separator orientation="horizontal" />
            <div className="max-h-full ">

                {BlockData ?
                    <MarkCutAndCreateSlabsForm  BlockData={BlockData} />
                    :
                    <div className="flex flex-col gap-1 items-center justify-center h-full">

                        <p className="text-muted-foreground text-lg">No Category Found</p>
                        {/* <Button onClick={() => router.back()} variant='default'>Go Back</Button> */}
                    </div>
                }
            </div>
        </div>
    );
}