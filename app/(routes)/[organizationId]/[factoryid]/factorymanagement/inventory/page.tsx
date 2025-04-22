import StatsCard from '@/components/statsCard'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { InventoryCards } from '@/lib/constants'

interface Props {
  params: {
    factoryid: string;
  }
}

function Page({ params }: Props) {

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
          <Heading className="leading-tight" title="Inventory" />
          <p className="mt-2">
            Effectively oversee your factory&apos;s Inventory and processing goods inventory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {
          InventoryCards?.map((card, index) => {
            // Ensure that the href is prefixed with the factoryid
            const updatedButtonUrl = `/${params.factoryid}${card.buttonUrl}`;

            return (
              <StatsCard
                key={index}
                title={card.title}
                stat={card.value}
                icon={card.icon}
                desc=""
                href={updatedButtonUrl} // Corrected href with factoryid
                factoryId={params.factoryid}
              />
            );
          })
        }
      </div>
    </div>
  );
}

export default Page;
