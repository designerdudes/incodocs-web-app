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
    params: {
        id: string;
        materialName: string;
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
function ViewRawMaterialPage({ params }: Props) {

    const RawMaterialDataID = params.id;
    const RawMaterialData = params
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
                            <Link href={`/factorymanagement/inventory/rawmaterial/edit/${RawMaterialDataID}`}>
                                <Button variant='default'>Edit Raw Material Details<IconPencil className='w-4 ml-2' /></Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* New parent div to hold both sections */}
                <div className="flex flex-col md:flex-row gap-6 lg:gap-6 w-full">
                    <div className="flex-1">
                        <div className="grid-cols-2 grid auto-rows-max items-start gap-2 lg:col-span-2 lg:gap-6">
                            <Card>
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
                                                <TableCell className="whitespace-nowrap">Raw Material Name</TableCell>
                                                <TableCell>{RawMaterialData.materialName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Material Type</TableCell>
                                                <TableCell>{RawMaterialData.materialType}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Weight</TableCell>
                                                <TableCell>{RawMaterialData.weight}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Height</TableCell>
                                                <TableCell>{RawMaterialData.height}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Length</TableCell>
                                                <TableCell>{RawMaterialData.length}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Breadth</TableCell>
                                                <TableCell>{RawMaterialData.breadth}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Volume</TableCell>
                                                <TableCell>{RawMaterialData.volume}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Quantity</TableCell>
                                                <TableCell>{RawMaterialData.quantity}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Card className='mt-32'>
                                <CardContent >
                                    <Table>
                                        <TableBody>

                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Status</TableCell>
                                                <TableCell>{RawMaterialData.isActive ? 'Active' : 'Inactive'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap"> Created At</TableCell>
                                                <TableCell>{moment(RawMaterialData.createdAt).format('YYYY-MM-DD')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Updated At</TableCell>
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

export default ViewRawMaterialPage