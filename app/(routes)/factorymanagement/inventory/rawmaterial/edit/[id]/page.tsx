// import { Button } from '@/components/ui/button';
// import { ChevronLeft } from 'lucide-react';
// import Link from 'next/link';
// import React from 'react'
// import { IconPencil } from "@tabler/icons-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import moment from 'moment';
// import { RawMaterial } from '../../components/columns';




"use client"
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import RawMaterialCreateNewForm from "@/components/forms/RawMaterialCreateNewForm"
import { Separator } from "@/components/ui/separator"


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



export default function CreateNewFormPage() {

    return (
        <div className='w-full space-y-2 h-full flex p-6 flex-col'>
            <div className="topbar w-full flex items-center justify-between">
                <Link href="../">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className='leading-tight' title='Edit Raw Material' />
                    <p className='text-muted-foreground text-sm'>Edit Raw Material</p>
                </div>
            </div>
            <Separator orientation='horizontal' />
            <div className="container mx-auto">
                <RawMaterialCreateNewForm gap={3} />
            </div>
        </div>
    )
}
