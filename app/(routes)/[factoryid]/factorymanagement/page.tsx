"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Heading from '@/components/ui/heading';
import StatsCard from '@/components/statsCard';
import { FactoryCards } from '@/lib/constants';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { FiBriefcase, FiFileText, FiGrid } from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';

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
          <Heading className="leading-tight" title="Factory Management" />
          <p className="mt-2 text-gray-600">Oversee your factory’s Inventory and Accounting details efficiently.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href={`/${params.factoryid}/factorymanagement/inventory`} passHref>
          <Card className="cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
            <CardHeader className="flex flex-col gap-2 items-start">
              <FiGrid className="w-6 h-6 text-4xl text-indigo-500 self-end" />
              <CardTitle className="text-2xl font-semibold text-gray-800">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-gray-600">
                Your complete solution for handling inventory, tracking production, and optimizing operations.
              </CardDescription>
              <p className="text-gray-700">
                Monitor raw materials, manage blocks and slabs, and track production phases with real-time insights.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/${params.factoryid}/factorymanagement/accounting`} passHref>
          <Card className="cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
            <CardHeader className="flex flex-col gap-2 items-start">
              <MdAccountBalance className="w-6 h-6 text-4xl text-green-500 self-end" />
              <CardTitle className="text-2xl font-semibold text-gray-800">Accounting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-gray-600">
                Simplify and organize your business documentation with ease.
              </CardDescription>
              <p className="text-gray-700">
                Generate, store, and access critical documents such as invoices, export papers, and shipment details.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FactoryCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            stat={card.value}
            icon={card.icon}
            desc="Detailed insights and analytics"
            href={card.buttonUrl}
            factoryId={factoryId} // Pass dynamic factory ID
          />
        ))}
      </div> */}
    </div>
  );
}

export default FactoryManagementPage;
