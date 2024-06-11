import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function Page() {
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
            <DataTable />
        </div>

    )
}

export default Page
