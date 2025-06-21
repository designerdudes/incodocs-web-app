import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { FiGrid } from "react-icons/fi";
import { MdAccountBalance, MdFactory } from "react-icons/md";

interface Props {
  params: {
    factoryid: string;
    organisationId: string;
  };
}

function FactoryManagementPage({ params }: Props) {
 
    const organisationId = params.organisationId
    const factoryId = params.factoryid

    

  const machineCount = 12; // Replace with dynamic value if available

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link href={`/${organisationId}/dashboard`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Factory Management" />
          <p className="mt-2 text-gray-600">
            Oversee your factory’s Inventory and Accounting details efficiently.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Inventory Card */}
        <Link
          href={`/${organisationId}/${factoryId}/factorymanagement/inventory`}
          passHref
        >
          <Card className="bg-white dark:bg-card hover:shadow-md transition cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Inventory</CardTitle>
              <FiGrid className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-base text-gray-600">
                A comprehensive solution for managing inventory, monitoring
                production, and streamlining operations efficiently.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Track raw materials, oversee blocks and slabs, and monitor
                production stages with real-time data.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Accounting Card */}
        <Link
          href={`/${organisationId}/${factoryId}/factorymanagement/accounting`}
          passHref
        >
          <Card className="bg-white dark:bg-card hover:shadow-md transition cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Accounting</CardTitle>
              <MdAccountBalance className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-base text-gray-600">
                Effortlessly streamline and manage your business documents,
                ensuring accuracy and easy retrieval.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Create, store, and retrieve essential documents like invoices,
                export papers, and shipment records.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Machines Card */}
        <Link
          href={`/${organisationId}/${factoryId}/factorymanagement/machines`}
          passHref
        >
          <Card className="bg-white dark:bg-card hover:shadow-md transition cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Machines</CardTitle>
              <MdFactory className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-base text-gray-600">
                Monitor and manage factory machines in one place.
              </CardDescription>
              <p className="text-sm text-gray-700">
                Track machine performance, view specifications, and schedule
                maintenance to ensure smooth and efficient production.
              </p>
              <p className="text-sm font-medium text-primary">
                Total Machines: {machineCount}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default FactoryManagementPage;
