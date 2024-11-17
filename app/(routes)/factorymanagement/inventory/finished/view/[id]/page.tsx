import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { IconPencil } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import moment from 'moment';


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
function ViewFinishedPage({ params }: Props) {
    const FinishedMaterialID = params.id;
    const FinishedMaterial = params
    console.log(FinishedMaterial)
    return (
        <div>
            <div className='w-full h-full flex flex-col p-8'>
                <div className="flex items-center justify-between mb-4">
                    <div className="topbar flex items-center justify-between w-full">
                        <Link href="/factorymanagement/inventory/finishedmaterial/">
                            <Button variant="outline" size="icon" className="h-7 w-7">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Back</span>
                            </Button>
                        </Link>
                        <h1 className="ml-4 flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                            View and Manage Finished Material details
                        </h1>
                        <div className="hidden items-center gap-2 md:ml-auto md:flex">
                            <Link href={`/factorymanagement/inventory/finishedmaterial/edit/${FinishedMaterialID}`}>
                                <Button variant='default'>Edit Finished Material Details<IconPencil className='w-4 ml-2' /></Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* New parent div to hold both sections */}
                <div className="flex flex-col md:flex-row gap-10 lg:gap-8 w-full">
                    <div className="flex-1">
                        <div className="grid-cols-2 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                            <Card x-chunk="dashboard-07-chunk-0">
                                <CardHeader>
                                    <CardTitle>Finished Material Details</CardTitle>
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
                                                <TableCell className="whitespace-nowrap">Product Name</TableCell>
                                                <TableCell>{FinishedMaterial.materialName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Type</TableCell>
                                                <TableCell>{FinishedMaterial.materialType}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Weight</TableCell>
                                                <TableCell>{FinishedMaterial.weight}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Height</TableCell>
                                                <TableCell>{FinishedMaterial.height}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Length</TableCell>
                                                <TableCell>{FinishedMaterial.length}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Breadth</TableCell>
                                                <TableCell>{FinishedMaterial.breadth}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Volume</TableCell>
                                                <TableCell>{FinishedMaterial.volume}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Quantity</TableCell>
                                                <TableCell>{FinishedMaterial.quantity}</TableCell>
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
                                                <TableCell>{FinishedMaterial.isActive ? 'Active' : 'Inactive'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Category Created At</TableCell>
                                                <TableCell>{moment(FinishedMaterial.createdAt).format('YYYY-MM-DD')}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="whitespace-nowrap">Category Updated At</TableCell>
                                                <TableCell>{moment(FinishedMaterial.updatedAt).format('YYYY-MM-DD')}</TableCell>
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

export default ViewFinishedPage