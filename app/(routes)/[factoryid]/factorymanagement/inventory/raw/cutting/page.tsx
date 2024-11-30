import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import CreateNewLotButton from '../lots/components/CreateNewLotButton';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { columns } from './components/columns';
import { Block } from './components/columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const CuttingInventoryPage: React.FC = () => {

    const data: Block[] = [
        {
            _id: "65f8fb0fc4417ea5a14fbd82",
            materialType: "Granite",
            numberofSlabs: "",
            isActive: true,
            createdAt: "2024-03-19T02:40:15.954Z",
            height: "54",
            breadth: "3.2",
            length: "4.2",
            blockNumber: '12345',
            blockLotName: 'LOT 1',
            updatedAt: '',
            weight: '45',
            volume: '785',
            status: 'in Cutting'
        },
        {
            _id: "65f8fb0fc4417ea5a14fbd82",
            materialType: "Marble",
            numberofSlabs: "",
            isActive: true,
            createdAt: "2024-06-19T02:40:15.954Z",
            height: "51",
            breadth: "3.2",
            length: "4.9",
            blockNumber: '54321',
            blockLotName: 'LOT 12',
            updatedAt: '',
            weight: '47',
            volume: '750',
            status: 'ready for polish'
        },
    ];

    const inCutting = data.filter((data: any) => data.status === 'in Cutting')
    const readyForPolish = data.filter((data: any) => data.status === 'ready for polish')
    const inPolishing = data.filter((data: any) => data.status === 'in polishing')

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
                    <Heading className="leading-tight" title="Slabs In Cutting" />
                    <p className="text-muted-foreground text-sm mt-2">
                        Efficiently track and manage slabs in process with detailed insights into their dimensions, weight, and progress through the cutting process.
                    </p>
                </div>
                {/* Move the interactivity to the client-side button component */}
                {/* <CreateNewLotButton /> */}
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                <Tabs defaultValue="in Cutting" className="w-full">
                    <TabsList className='gap-3'>
                        <TabsTrigger className='gap-2' value="in Cutting">In Cutting<Badge className='text-bg-primary-foreground ' variant="outline">{inCutting?.length}</Badge> </TabsTrigger>
                        <TabsTrigger className='gap-2' value="ready for polish">Ready For Polish<Badge className='text-bg-primary-foreground' variant="outline">{readyForPolish?.length}</Badge> </TabsTrigger>
                    </TabsList>
                    <TabsContent value="in Cutting">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected blocks?'
                            bulkDeleteDescription='This will delete the selected blocks, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected blocks deleted successfully'
                            searchKey='title' columns={columns} data={inCutting} />
                    </TabsContent>
                    <TabsContent value="ready for polish">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected blocks?'
                            bulkDeleteDescription='This will delete the selected blocks, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected blocks deleted successfully'
                            searchKey='title' columns={columns} data={readyForPolish} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default CuttingInventoryPage;
