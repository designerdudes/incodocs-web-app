import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import CreateNewLotButton from '../lots/components/CreateNewLotButton';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { columns, Slabs } from './components/columns';


const polishingInventoryPage: React.FC = () => {

    const data: Slabs[] = [
        {
            _id: "65f8fb0fc4417ea5a14fbd82",
            slabId: "SLAB-123",
            materialType: "Granite",
            isActive: true,
            createdAt: "2024-03-19T02:40:15.954Z",
            height: "54",
            length: "4.2",
            blockNumber: '12345',
            blockLotName: 'LOT 1',
            updatedAt: '',
            status: 'Ready For polish',
        },
    ];

    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href="../raw">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Slabs In Polishing Inventory" />
                    <p className="text-muted-foreground text-sm mt-2">
                        Efficiently track and manage slabs in the polishing inventory with detailed insights into their dimensions and progress through the polishing process.                    </p>
                </div>
                {/* Move the interactivity to the client-side button component */}
                {/* <CreateNewLotButton /> */}
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                <DataTable
                    bulkDeleteIdName="_id"
                    bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
                    bulkDeleteDescription="This will delete all the selected slabs, and they will not be recoverable."
                    bulkDeleteToastMessage="Selected slabs deleted successfully"
                    deleteRoute="/delete/ids"
                    searchKey="name"
                    columns={columns}
                    data={data as any}
                />
            </div>
        </div>
    );
};

export default polishingInventoryPage;
