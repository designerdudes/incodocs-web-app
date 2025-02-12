"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import StatsCard from "@/components/statsCard";
import { documentationCards, FactoryCards } from "@/lib/constants";
import { useParams } from "next/navigation";

function FactoryManagementPage() {
    const params = useParams();
    const factoryId = params.factoryid as string; // Extract factory ID from route

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <Link href={`/${factoryId}/dashboard`}>
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className="leading-tight" title="Documentation" />
                    <p className="mt-2 text-gray-600">
                        Oversee your organisation details efficiently.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* {documentationCards.map((card, index) => (
                    <StatsCard
                        key={index}
                        title={card.title}
                        stat={card.value}
                        icon={card.icon}
                        desc="Detailed insights and analytics"
                        href={card.buttonUrl}
                        factoryId="" // Pass dynamic factory ID
                    />
                ))} */}
            </div>
        </div>
    );
}

export default FactoryManagementPage;
