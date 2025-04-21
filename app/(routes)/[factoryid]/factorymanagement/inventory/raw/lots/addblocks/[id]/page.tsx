// "use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { AddBlockForm } from "@/components/forms/AddBlockForm";
import { cookies } from "next/headers";
interface Props {
    params: {
        id: string;
        lotid: string;
    }
}

export default async function AddBlockFormPage({ params }: Props) {
    let lotId = null
    lotId = params.id
    console.log(params.id)
    let LotData = null
    const cookieStore = cookies();
    const token = cookieStore.get('AccessToken')?.value || ""

    const res = await fetch(`https://incodocs-server.onrender.com/factory-management/inventory/blocksbylot/get/${params?.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        return response.json()
    })
    LotData = res;
    return (
        <div className="w-full space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex items-center justify-between">
                <Link href="../">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading
                        className="leading-tight"
                        title={`Add New Block to ${LotData[0]?.lotName}`}
                    />
                    <p className="text-muted-foreground text-sm">
                        Add a new block to a lot by entering its details, ensuring accurate inventory tracking and management.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="container mx-auto">
                <AddBlockForm gap={3} params={{ lotId }} />
            </div>
        </div>
    );
}
