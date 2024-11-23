import React from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { MarkCutAndCreateSlabsForm } from "@/components/forms/MarkCutAndCreateSlabsForm";
import { Block } from "../../components/columns";


// interface Props {
//     params: {
//         _id: string
//         blockNumber: string
//         blockLotName: string
//         materialType: string
//         numberofSlabs: string
//         isActive: boolean
//         createdAt: string
//         updatedAt: string
//         weight: string
//         height: string
//         breadth: string
//         length: string
//         volume: string
//         status: string
//     }
// }
const data: Block = {
    _id: "65f8fb0fc4417ea5a14fbd82",
    blockNumber: "12345",
    blockLotName: "LOT 1",
    materialType: "Granite",
    numberofSlabs: "",
    isActive: true,
    createdAt: "2024-03-19T02:40:15.954Z",
    updatedAt: "",
    weight: "45",
    height: "54",
    breadth: "3.2",
    length: "4.2",
    volume: "785",
    status: "In Cutting",
};

export default async function MarkCutPage() {


    // const BlockId = params._id
    //
    // const cookieStore = cookies();
    // const token = cookieStore.get('AccessToken')?.value;

    // // const res = await fetch('https://api.github.com/repos/vercel/next.js', {
    // const res = await fetch(`/${BlockId}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + token
    //     }
    // }).then(response => {
    //     return response.json()
    // })
    let BlockData = null
    BlockData = data


    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href="/factorymanagement/inventory/raw/processing/">
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
            <div className="container mx-auto  py-10">

                {data ?
                    <MarkCutAndCreateSlabsForm gap={3} BlockData={data} />
                    :
                    <div className="flex flex-col gap-2 items-center justify-center h-full">

                        <p className="text-muted-foreground text-lg">No Category Found</p>
                        {/* <Button onClick={() => router.back()} variant='default'>Go Back</Button> */}
                    </div>
                }
            </div>
        </div>
    );
}
