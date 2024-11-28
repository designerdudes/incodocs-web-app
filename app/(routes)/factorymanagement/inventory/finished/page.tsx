import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { CuttingInchesWithAllowanceColumns } from './components/cuttingWithAllowanceColumns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cookies } from 'next/headers';
import { polishingInchesWithAllowanceColumns } from './components/polishingWithAllowanceColumns';
import { CuttingInchesWithOutAllowanceColumns } from './components/cuttingWithOutAllowanceColumns';
import { polishingInchesWithOutAllowanceColumns } from './components/polishingWithOutAllowanceColumns';

export type FinishedMaterial = {
    _id: string; // Unique identifier
    slabNumber: number; // Sequential slab number
    blockNumber: number | null; // Block number, can be null
    factoryId: string; // Associated factory identifier
    productName: string; // Name of the product
    quantity: number; // Quantity of the finished material
    status: string; // Status (e.g., "polished")
    inStock: boolean; // Availability status

    dimensions: {
        thickness: {
            value: number;
            units: string; // E.g., "inch"
        };
        length: {
            value: number;
            units: string; // E.g., "inch"
        };
        breadth: {
            value: number;
            units: string; // E.g., "inch"
        };
        height: {
            value: number;
            units: string; // E.g., "inch"
        };
    };

    trim: {
        length: {
            value: number;
            units: string; // E.g., "inch"
        };
        height: {
            value: number;
            units: string; // E.g., "inch"
        };
    };

    createdAt: string; // ISO 8601 timestamp
    updatedAt: string; // ISO 8601 timestamp
};


export default async function FinishedMaterialPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('AccessToken')?.value || "";

    const res = await fetch('http://localhost:4080/factory-management/inventory/finished/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    const slabsData = await res.json();
    // console.log(slabsData);
    return (
        <div className='w-full space-y-2 h-full flex p-6 flex-col'>
            <div className="topbar w-full flex justify-between items-center">
                <Link href="./">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className='leading-tight ' title='Finished Material Inventory ' />
                    <p className='text-muted-foreground text-sm mt-2'>
                        Efficiently track and manage finished materials with detailed insights into their dimensions, weight, and processing stages, ensuring accurate inventory management, streamlined cutting processes, and real-time updates on stock availability and product status.</p>
                </div>
            </div>
            <Separator orientation='horizontal' />
            <div className="container mx-auto py-10">
                <Tabs defaultValue="CuttingData" className="w-full">
                    <div className='text-center mb-4'>
                        <TabsList className='gap-6'>
                            <TabsTrigger className='gap-2' value="CuttingData">Cutting Data</TabsTrigger>
                            <TabsTrigger className='gap-2' value="PolishingData">Polishing Data</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="CuttingData">
                        <Tabs defaultValue="CuttingInchesWithAllowance" className="w-full" >
                            <TabsList className='gap-6'>
                                <TabsTrigger className='gap-2' value="CuttingInchesWithAllowance">Cutting Inches With Allowance</TabsTrigger>
                                <TabsTrigger className='gap-2' value="CuttinginchesWithOutAllowance">Cutting Inches WithOut Allowance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="CuttinginchesWithOutAllowance">
                                <DataTable
                                    bulkDeleteIdName='_id'
                                    bulkDeleteTitle='Are you sure you want to delete the selected Slabs?'
                                    bulkDeleteDescription='This will delete all the selected Slabs, and they will not be recoverable.'
                                    bulkDeleteToastMessage='Selected Slabs deleted successfully'
                                    deleteRoute="/category/ids"
                                    searchKey='slabNumber'
                                    columns={CuttingInchesWithOutAllowanceColumns}
                                    data={slabsData}
                                />
                            </TabsContent>
                            <TabsContent value="CuttingInchesWithAllowance">
                                <DataTable
                                    bulkDeleteIdName='_id'
                                    bulkDeleteTitle='Are you sure you want to delete the selected Slabs?'
                                    bulkDeleteDescription='This will delete all the selected Slabs, and they will not be recoverable.'
                                    bulkDeleteToastMessage='Selected Slabs deleted successfully'
                                    deleteRoute="/category/ids"
                                    searchKey='slabNumber'
                                    columns={CuttingInchesWithAllowanceColumns}
                                    data={slabsData}
                                />
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="PolishingData">
                        <Tabs defaultValue="PolishingInchesWithOutAllowance" className="w-full" >
                            <TabsList className='gap-6'>
                                <TabsTrigger className='gap-2' value="PolishingInchesWithOutAllowance">Polishing Inches WithOut Allowance</TabsTrigger>
                                <TabsTrigger className='gap-2' value="PolishingInchesWithAllowance">Polishing Inches With Allowance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="PolishingInchesWithOutAllowance">
                                <DataTable
                                    bulkDeleteIdName='order_id'
                                    bulkDeleteTitle='Are you sure you want to delete the selected slabs?'
                                    bulkDeleteDescription='This will delete the selected slabs, and they will not be recoverable.'
                                    bulkDeleteToastMessage='Selected slabs deleted successfully'
                                    searchKey='slabNumber' columns={polishingInchesWithOutAllowanceColumns} data={slabsData} />
                            </TabsContent>
                            <TabsContent value="PolishingInchesWithAllowance">
                                <DataTable
                                    bulkDeleteIdName='order_id'
                                    bulkDeleteTitle='Are you sure you want to delete the selected slabs?'
                                    bulkDeleteDescription='This will delete the selected slabs, and they will not be recoverable.'
                                    bulkDeleteToastMessage='Selected slabs deleted successfully'
                                    searchKey='slabNumber' columns={polishingInchesWithAllowanceColumns} data={slabsData} />
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}




