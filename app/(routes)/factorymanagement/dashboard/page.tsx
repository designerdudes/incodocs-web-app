"use client"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Page() {
    const [shipmentData, setShipmentData] = useState()


    // useEffect(() => {
    //     const getShipmentData = async () => {
    //         const data = await fetchData('/shipment/getAll')
    //         setShipmentData(data)
    //         console.log(shipmentData)
    //         console.log(data)
    //     }
    //     getShipmentData()
    // },);

    return (
        <div className="flex  flex-col p-6">
            <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col ">
                    <Heading className="text-3xl" title="Factory Management" />
                    <p className='mt-2'>Centralized control over your factory&apos;s inventory and accounting operations.</p>
                </div>
                <Link href={`/shipments/new`}>
                    <Button className="bg-primary text-white">New Button (Easily add new lots, blocks, or slabs to streamline your workflow.

                        )</Button>
                </Link>
            </div>
            <Separator className="my-2" />
            {/* <DataTable searchKey='' data={data as any} columns={columns} /> */}
            <div className="flex flex-row gap-4 mt-10">
                <Link href="/factorymanagement/inventory/dashboard" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inventory</CardTitle>
                                <CardDescription>Comprehensive tools to manage raw materials and track production processes.

                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Keep tabs on stock levels, cutting, polishing, and finished goods with detailed analytics.</p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>
                <Link href="/accounts/dashboard" passHref>
                    <div className="cursor-pointer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Accounts</CardTitle>
                                <CardDescription>Manage expenses, payments, and financial records effortlessly.

                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Track worker payments, operational costs, and profits with a clear financial overview.

                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </Link>
            </div>
        </div>

    )
}


