import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cookies } from 'next/headers';
import { Polishedcolumns } from './components/polishedColumns';
import { Badge } from '@/components/ui/badge';

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
        length: {
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

interface Props {
    params: {
        factoryid: string;
    }
}


export default async function FinishedMaterialPage({ params }: Props) {
    const cookieStore = cookies();
    const token = cookieStore.get('AccessToken')?.value || "";

    const res = await fetch(`http://localhost:4080/factory-management/inventory/getslabsbyfactory/${params.factoryid} `, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(response => {
        return response.json()
    })


    const slabsData = res
    const Polished = Array.isArray(slabsData)
        ? slabsData.filter((data: any) => data.status === "polished")
        : [];

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
                        Track and manage finished materials with detailed insights into dimensions, weight, and processing stages for accurate inventory control, efficient cutting, and real-time stock updates.</p>
                </div>
            </div>
            <Separator orientation='horizontal' />
            <div className="container mx-auto py-10">
                <Tabs defaultValue="Polished" className="w-full">
                    <div className='text-center mb-4'>
                        <TabsList className='gap-6'>
                            <TabsTrigger className="gap-2" value="Polished">
                                Polished Slab Data
                                <Badge className="text-bg-primary-foreground" variant="outline">
                                    {Polished?.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger className="gap-2" value="Sold">
                                Sold Slab Data
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="Polished">
                        <DataTable
                            bulkDeleteIdName="order_id"
                            bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
                            bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
                            bulkDeleteToastMessage="Selected slabs deleted successfully"
                            searchKey="slabNumber"
                            columns={Polishedcolumns}
                            data={Polished}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}




