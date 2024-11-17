import StatsCard from '@/components/statsCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Heading from '@/components/ui/heading'
import { rawInventoryCards } from '@/lib/constants'
import Link from 'next/link'
import React from 'react'

function page() {
    return (
        <div className="flex  flex-col p-6">
            <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col ">
                    <Heading className="text-3xl" title="Raw Inventory" />
                    <p className='mt-2'>Effectively oversee your factory&apos;s raw materials and proccessing goods inventory.</p>
                </div>
                {/* <Link href={`/shipments/new`}>
                    <Button className="bg-primary text-white">New Button</Button>
                </Link> */}
            </div>
            <div className="flex flex-row gap-4 mt-10 ">
              {
                rawInventoryCards?.map((card, index) => (
                    <StatsCard key={index}
                    title={card.title}
                    stat={card.value}
                    icon={card.icon}
                    desc=""
                    href={card.buttonUrl}

                    />
                ))
              }
            </div>
        </div>

    )
}

export default page