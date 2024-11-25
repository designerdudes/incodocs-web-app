import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { columns, FinishedMaterial } from '../components/columns';
import { cookies } from 'next/headers';

export default async function FinishedMaterialPage() {

    const data: FinishedMaterial[] = [
        {
            _id: "65f8fb0fc4417ea5a14fbd82",
            materialName: "Sample Material 1",
            materialType: "TypeABC",
            categoryId: "Category123",
            isActive: true,
            createdAt: "2024-03-19T02:40:15.954Z",
            updatedAt: "2024-03-19T02:40:15.954Z",
            weight: "1000",
            height: "54",
            breadth: "3.2",
            quantity: "200" // Placeholder value
        },
        {
            _id: "65f8fd0ac4417ea5a14fbda1",
            materialName: "Sample Material 2",
            materialType: "TypeXYZ",
            categoryId: "Category456",
            isActive: true,
            createdAt: "2024-03-19T02:48:42.837Z",
            updatedAt: "2024-03-19T02:58:00.445Z",
            weight: "1200",
            height: "40",
            breadth: "2.8",
            quantity: "150" // Placeholder value
        },
        {
            _id: "65f8febec4417ea5a14fbdad",
            materialName: "Sample Material 3",
            materialType: "TypeDEF",
            categoryId: "Category789",
            isActive: true,
            createdAt: "2024-03-19T02:55:58.275Z",
            updatedAt: "2024-03-19T02:55:58.275Z",
            weight: "1100",
            height: "45",
            breadth: "3.5",
            quantity: "180" // Placeholder value
        }
    ];

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