"use client"
import { fetchData } from '@/axiosUtility/api'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { columns } from './components/columns'

function Page() {
    const [shipmentData, setShipmentData] = useState()

    const getShipmentData = async () => {
        const data = await fetchData('/shipment/getAll')
        setShipmentData(data)
        console.log(shipmentData)
        console.log(data)
    }

    useEffect(() => {
        getShipmentData()
    }, []);
    return (
        <div className="flex  flex-col p-6">
            <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col ">
                    <Heading className="text-3xl" title="Shipments" />
                    <p>This is the shipments page</p>
                </div>
                <Button className="bg-primary text-white">New Shipment</Button>
            </div>
            <Separator className="my-2" />
            <DataTable searchKey='containerNo' data={shipmentData as any} columns={columns} />
        </div>

    )
}

export default Page
