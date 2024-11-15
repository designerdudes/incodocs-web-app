import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { IconPencil } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import moment from 'moment';
import { RawMaterial } from '../../components/columns';


interface Props {
    params: RawMaterial;
}
function EditRawMaterialPage({ params }: Props) {
    const data: RawMaterial[] = [
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
            length: "4.2",
            volume: "2000",
            quantity: "120" // Placeholder value
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
            length: "3.5",
            volume: "1500",
            quantity: "100"
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
            length: "4.5",
            volume: "1800",
            quantity: "80"
        }
    ];

    const RawMaterialData = params;
    return (
        <div>
            <div className='w-full h-full flex flex-col p-8'>
                <div className="flex items-center justify-between mb-4">
                    <div className="topbar flex items-center justify-between w-full">
                        <Link href="/factorymanagement/inventory/rawmaterial/">
                            <Button variant="outline" size="icon" className="h-7 w-7">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                        </Link>
                        <h1 className="ml-4 flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            View and Manage Raw Material details
                        </h1>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Link href={`/business-category/edit/${RawMaterialData?._id}`}>
                                <Button variant='default'>Edit Raw Material Details<IconPencil className='w-4 ml-2' /></Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* New parent div to hold both sections */}
                <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
                    <div className="flex-1">
                        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <Card x-chunk="dashboard-07-chunk-0">
                                <CardHeader>
                                    <CardTitle>Raw Material Details</CardTitle>
                                    <CardDescription>{ }</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field</TableHead>
                                                <TableHead>Details</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Category Name</TableCell>
                                                <TableCell>{RawMaterialData.materialName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Category Description</TableCell>
                                                <TableCell>{RawMaterialData.materialType}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Category Status</TableCell>
                                                <TableCell>{RawMaterialData.isActive ? 'Active' : 'Inactive'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Category Created At</TableCell>
                                                <TableCell>{moment(RawMaterialData.createdAt).format('YYYY-MM-DD')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Category Updated At</TableCell>
                                                <TableCell>{moment(RawMaterialData.updatedAt).format('YYYY-MM-DD')}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditRawMaterialPage