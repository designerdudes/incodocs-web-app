import StatsCard from '@/components/statsCard'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { rawInventoryCards as BaseInventoryCards } from '@/lib/constants'
import { cookies } from 'next/headers'

interface Props {
    params: {
        factoryid: string
    }
}

export default async function page({ params }: Props) {
    const cookieStore = cookies()
    const token = cookieStore.get('AccessToken')?.value || ''

    // Fetch Lots Data
    const Lotres = await fetch(`http://localhost:4080/factory-management/inventory/factory-lot/get/${params?.factoryid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    }).then((response) => response.json())

    // Fetch Slabs Data
    const Slabres = await fetch(`http://localhost:4080/factory-management/inventory/getslabsbyfactory/${params?.factoryid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    }).then((response) => response.json())

    const lotsData = Lotres
    const slabData = Slabres

    // Update cards with specific values
    const rawInventoryCards = BaseInventoryCards.map((card) => {
        if (card.title === 'Total Lots') {
            return {
                ...card,
                value: lotsData.length, // Set lots count
                buttonUrl: `/${params.factoryid}${card.buttonUrl}`,
            }
        } else if (card.title === 'Slabs in Processing') {
            return {
                ...card,
                value: slabData.length, // Set slabs count
                buttonUrl: `/${params.factoryid}${card.buttonUrl}`,
            }
        }
        return card
    })

<<<<<<< HEAD
    let lotsData
    lotsData = res

    const rawInventoryCards = BaseInventoryCards.map((card) => ({
        ...card,
        value: lotsData.length || 0,
        buttonUrl: `/${params.factoryid}${card.buttonUrl}`, // Prepend factoryId to the URL
    }));

=======
>>>>>>> d99a601e321ef434b787645055b9bc11194ed785
    return (
        <div className="flex flex-col p-6">
            <div className="flex justify-between items-center gap-2">
                <Link href="./">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Raw Material Inventory" />
                    <p className="text-muted-foreground text-sm">Raw Material Data</p>
                </div>
            </div>
            <div className="flex flex-row gap-4 mt-10">
                {rawInventoryCards?.map((card, index) => (
                    <StatsCard
                        key={index}
                        title={card.title}
                        stat={card.value}
                        icon={card.icon}
                        desc=""
                        href={card.buttonUrl}
                    />
                ))}
            </div>
        </div>
    )
}
