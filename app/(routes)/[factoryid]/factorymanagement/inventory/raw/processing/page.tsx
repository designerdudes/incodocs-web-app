import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import Heading from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { incuttingcolumns } from './components/incuttingcolumns';
import { Readyforpolishcolumns } from './components/readyforpolishcolumns';
import { inPolishingolumns } from './components/inpolishingcolumns';
import { cookies } from 'next/headers';
import { Polishedcolumns } from './components/polishedcolumns';


export default async function SlabsProcessingPage() {

    const cookieStore = cookies();
    const token = cookieStore.get('AccessToken')?.value || ""

    const blockRes = await fetch('http://localhost:4080/factory-management/inventory/raw/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        return response.json()
    })

    const slabRes = await fetch('http://localhost:4080/factory-management/inventory/finished/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        return response.json()
    })

    let Blockdata
    Blockdata = blockRes
    // console.log(Blockdata)
    let Slabdata
    Slabdata = slabRes
    // console.log("this is slabs data", Slabdata)

    const inCutting = Blockdata.filter((data: any) => data.status === 'inCutting')
    const readyForPolish = Blockdata.filter((data: any) => data.status === 'cut')
    const inPolishing = Slabdata.filter((data: any) => data.status === 'inPolishing')
    const Polished = Slabdata.filter((data: any) => data.status === 'polished')

    return (
        <div className="w-auto space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex justify-between items-center">
                <Link href="./">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Blocks and Slabs In Process" />
                    <p className="text-muted-foreground text-sm mt-2">
                        Efficiently track and manage slabs in process with detailed insights into their dimensions, weight, and progress through the cutting process.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="w-250 container mx-auto py-10">
                <Tabs defaultValue="inCutting" className="w-full">
                    <TabsList className='gap-3'>
                        <TabsTrigger className='gap-2' value="inCutting">In Cutting<Badge className='text-bg-primary-foreground ' variant="outline">{inCutting?.length}</Badge> </TabsTrigger>
                        <TabsTrigger className='gap-2' value="readyforpolish">Ready For Polish<Badge className='text-bg-primary-foreground' variant="outline">{readyForPolish?.length}</Badge> </TabsTrigger>
                        <TabsTrigger className='gap-2' value="inPolishing">In Polishing<Badge className='text-bg-primary-foreground' variant="outline">{inPolishing?.length}</Badge> </TabsTrigger>
                        <TabsTrigger className='gap-2' value="Polished">Polishied<Badge className='text-bg-primary-foreground' variant="outline">{Polished?.length}</Badge> </TabsTrigger>
                    </TabsList>
                    <TabsContent value="inCutting">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected blocks?'
                            bulkDeleteDescription='This will delete the selected blocks, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected blocks deleted successfully'
                            searchKey='title' columns={incuttingcolumns} data={inCutting} />
                    </TabsContent>
                    <TabsContent value="readyforpolish">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected blocks?'
                            bulkDeleteDescription='This will delete the selected blocks, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected blocks deleted successfully'
                            searchKey='title' columns={Readyforpolishcolumns} data={readyForPolish} />
                    </TabsContent>
                    <TabsContent value="inPolishing">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected slabs?'
                            bulkDeleteDescription='This will delete the selected slabs, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected slabs deleted successfully'
                            searchKey='title' columns={inPolishingolumns} data={inPolishing} />
                    </TabsContent>
                    <TabsContent value="Polished">
                        <DataTable
                            bulkDeleteIdName='order_id'
                            bulkDeleteTitle='Are you sure you want to delete the selected slabs?'
                            bulkDeleteDescription='This will delete the selected slabs, and they will not be recoverable.'
                            bulkDeleteToastMessage='Selected slabs deleted successfully'
                            searchKey='title' columns={Polishedcolumns} data={Polished} />
                    </TabsContent>
                </Tabs>
            </div>-
        </div>
    );
};

