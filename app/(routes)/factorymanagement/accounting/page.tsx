import StatsCard from '@/components/statsCard'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { InventoryCards } from '@/lib/constants'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div className="flex  flex-col p-6">
      <div className="flex justify-between items-center gap-2">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className='leading-tight ' title='Accounting' />
          <p className='mt-2'>Effectively oversee your factory&apos;s Sales, Expenses, and other financial transactions.</p>
        </div>
        {/* <Link href={`/shipments/new`}>
                    <Button className="bg-primary text-white">New Button</Button>
                </Link> */}
      </div>

      <div className="flex flex-row gap-4 mt-10 ">
        {
          InventoryCards?.map((card, index) => (
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