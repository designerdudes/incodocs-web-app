import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { columns, FinishedMaterial } from './components/columns';

export default async function FinishedMaterialPage() {

    const data: FinishedMaterial[] = [
        {
            dimensions: {
                thickness: { value: 11, units: "inch" },
                length: { value: 10, units: "inch" },
                breadth: { value: 13, units: "inch" },
                height: { value: 15, units: "inch" }
            },
            trim: { length: { units: "inch" }, height: { units: "inch" } },
            _id: '6743425cd415501d681c3b83',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 1,
            blockNumber: 23332,
            productName: 'steps',
            quantity: 10,
            status: 'polished',
            inStock: true,
            createdAt: '2024-11-24T15:12:28.302Z',
            updatedAt: '2024-11-24T15:12:28.302Z'
        },
        {
            dimensions: {
                thickness: { value: 16, units: "inch" },
                length: { value: 60, units: "inch" },
                breadth: { value: 83, units: "inch" },
                height: { value: 85, units: "inch" }
            },
            trim: { length: { units: "inch" }, height: { units: "inch" } },
            _id: '674342954e15cd3baf4c3918',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 1,
            blockNumber: 2323332,
            productName: 'steps',
            quantity: 10,
            status: 'polished',
            inStock: true,
            createdAt: '2024-11-24T15:13:25.826Z',
            updatedAt: '2024-11-24T15:13:25.826Z'
        },
        {
            dimensions: {
                thickness: [Object],
                length: [Object],
                breadth: [Object],
                height: [Object]
            },
            trim: { length: [Object], height: [Object] },
            _id: '6743430b324286e82ef37f7e',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 1,
            blockNumber: 23232,
            productName: 'steps',
            quantity: 10,
            status: 'polished',
            inStock: true,
            createdAt: '2024-11-24T15:15:23.552Z',
            updatedAt: '2024-11-24T15:15:23.552Z'
        },
        {
            dimensions: {
                thickness: [Object],
                length: [Object],
                breadth: [Object],
                height: [Object]
            },
            trim: { length: [Object], height: [Object] },
            _id: '67435b2161571819614af7a7',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 1,
            blockNumber: 2663232,
            productName: 'steps',
            quantity: 10,
            status: 'polished',
            inStock: true,
            createdAt: '2024-11-24T16:58:09.854Z',
            updatedAt: '2024-11-24T16:58:09.854Z'
        },
        {
            dimensions: {
                thickness: [Object],
                length: [Object],
                breadth: [Object],
                height: [Object]
            },
            trim: { length: [Object], height: [Object] },
            _id: '67435b977a2c6c71facbd4c1',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 11,
            blockNumber: 1234,
            productName: 'steps',
            quantity: 10,
            status: 'polished',
            inStock: true,
            createdAt: '2024-11-24T17:00:07.600Z',
            updatedAt: '2024-11-24T17:00:07.600Z'
        },
        {
            dimensions: {
                thickness: [Object],
                length: [Object],
                breadth: [Object],
                height: [Object]
            },
            trim: { length: [Object], height: [Object] },
            _id: '67435ce67a2c6c71facbd4ed',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 11,
            blockNumber: 12345,
            productName: 'steps',
            quantity: 10,
            status: 'readyForPolish',
            inStock: true,
            createdAt: '2024-11-24T17:05:42.287Z',
            updatedAt: '2024-11-24T17:05:42.287Z'
        },
        {
            dimensions: {
                thickness: [Object],
                length: [Object],
                breadth: [Object],
                height: [Object]
            },
            trim: { length: [Object], height: [Object] },
            _id: '67435d6a7a2c6c71facbd4fc',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 121,
            blockNumber: 12375,
            productName: 'steps',
            quantity: 10,
            status: 'inPolishing',
            inStock: true,
            createdAt: '2024-11-24T17:07:54.438Z',
            updatedAt: '2024-11-24T17:07:54.438Z'
        },
        {
            dimensions: {
                thickness: [Object],
                length: [Object],
                breadth: [Object],
                height: [Object]
            },
            trim: { length: [Object], height: [Object] },
            _id: '67435db37a2c6c71facbd513',
            blockId: null,
            factoryId: '673795b841a2d90248a65dea',
            slabNumber: 131,
            blockNumber: 18975,
            productName: 'steps',
            quantity: 10,
            status: 'polished',
            inStock: true,
            createdAt: '2024-11-24T17:09:07.337Z',
            updatedAt: '2024-11-24T17:09:07.337Z'
        }
    ]

    // const cookieStore = cookies();
    // const token = cookieStore.get('AccessToken')?.value || "";

    // const res = await fetch('https://apis.offersholic.zephyrapps.in/categories/v1/all', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + token
    //     }
    // });

    // const categories = await res.json();

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
                    <p className='text-muted-foreground text-sm'> Finished Material Data</p>
                </div>
                <Link href='finishedmaterial/create-new/'>
                    <Button variant='default'>
                        Create New Finished Material
                        <PlusIcon className='w-4 ml-2' />
                    </Button>
                </Link>
            </div>
            <Separator orientation='horizontal' />
            <div className="container mx-auto py-10">
                <DataTable
                    bulkDeleteIdName='_id'
                    bulkDeleteTitle='Are you sure you want to delete the selected Finished Material?'
                    bulkDeleteDescription='This will delete all the selected Finished Material, and they will not be recoverable.'
                    bulkDeleteToastMessage='Selected Finished Material deleted successfully'
                    deleteRoute="/category/ids"
                    searchKey='name'
                    columns={columns}
                    data={data as any}
                />
            </div>
        </div>
    );
}

