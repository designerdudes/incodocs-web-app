import React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { columns } from "../../blocks/components/columns";
import CreateNewLotButton from "../../lots/components/CreateNewLotButton";

interface Props {
    params: {
        id: string;
        materialName: string;
        lotname: string;
        materialType: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        weight: string
        height: string
        breadth: string
        length: string
        volume: string
        quantity: string
    }
}

export default function LotManagement({ params }: Props) {


    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href="/factorymanagement/inventory/raw/lots">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Block" />
                    <p className="text-muted-foreground text-sm">
                        Efficiently track and manage block with detailed insights into their current status and progress through the production cycle.
                    </p>
                </div>
                {/* <CreateNewLotButton /> */}
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected Raw Material?"
                    bulkDeleteDescription="This will delete all the selected Raw Material, and they will not be recoverable."
                    bulkDeleteToastMessage="Selected Raw Material deleted successfully"
                    deleteRoute="/category/ids"
                    searchKey="name"
                    columns={columns}
                    data={params as any}
                />
            </div>
        </div>
    );
}
