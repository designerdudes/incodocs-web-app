import StatsCard from "@/components/statsCard";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { rawInventoryCards as BaseInventoryCards } from "@/lib/constants";
import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Props {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default async function Page({ params }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";

  // Fetch Lots Data
  const Lotres = await fetchWithAuth<any>(
    `/factory-management/inventory/factory-lot/get/${params.factoryid}`
  );

  // Fetch Slabs Data
  const Slabres = await fetchWithAuth<any>(
    `/factory-management/inventory/getslabsbyfactory/${params.factoryid}`
  );

  const lotsData = Array.isArray(Lotres) ? Lotres : [];
  const slabData = Array.isArray(Slabres) ? Slabres : [];

  // Compute totals
  const totalLots = lotsData.length;
  const totalBlocks = lotsData.reduce(
    (sum, lot) => sum + (lot.blocksId?.length || 0),
    0
  );
  const totalSlabs = slabData.length;

  // Update cards with specific values
  const rawInventoryCards = BaseInventoryCards.map((card) => ({
    ...card,
    value:
      card.title === "Total Lots"
        ? totalLots
        : card.title === "Total Blocks"
        ? totalBlocks
        : card.title === "Processing"
        ? totalSlabs
        : card.value,
    desc:
      card.title === "Total Lots"
        ? "Number of lots currently available in inventory."
        : card.title === "Total Blocks"
        ? "Total blocks across all lots."
        : card.title === "Processing"
        ? "Blocks And Slabs that are currently under processing."
        : "",
  }));

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
          <p className="text-muted-foreground text-sm">
            Efficiently track and manage raw materials, ensuring visibility of
            quantity, status, and progress through the production cycle.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {rawInventoryCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            stat={card.value}
            icon={card.icon}
            desc={card.desc}
            href={`/${params.factoryid}/${card.buttonUrl}`} // route with factoryid
            factoryId={params.organizationId} // keep this if StatsCard expects organizationId
          />
        ))}
      </div>
    </div>
  );
}
