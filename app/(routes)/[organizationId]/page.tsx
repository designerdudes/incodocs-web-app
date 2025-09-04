"use server";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Factory as FactoryIcon } from "lucide-react";
import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";

interface Address {
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  location: string;
  pincode: string;
  _id?: string;
}

interface Factory {
  _id: string;
  name: string;
  address: Address;
  organization: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface Params {
  factoryId: string;
}

export default async function DashboardPage({ params }: { params: Params }) {
  const { factoryId } = params;

  // 1. Get factory details
  const factory = await fetchWithAuth<Factory>(
    `https://incodocs-server.onrender.com/factory/${factoryId}`
  );
  const orgId = factory.organization;

  // 2. Get all factories for the organization
  const factories = await fetchWithAuth<Factory[]>(
    `https://incodocs-server.onrender.com/factory/getbyorg/${orgId}`
  );

  return (
    <main className="flex h-full flex-col p-10 min-h-screen bg-gradient-to-r from-gray-100 to-white">
      <div className="text-center mb-10">
        <Heading
          className="text-4xl font-bold text-gray-800"
          title="Organization Factories"
        />
        <p className="text-lg mt-4 text-gray-600">
          View all factories for your organization.
        </p>
      </div>

      {factories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {factories.map((factory: any) => (
            <Card
              key={factory._id}
              className="bg-white dark:bg-card h-full flex flex-col hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {factory.name}
                </CardTitle>
                <FactoryIcon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <CardDescription className="text-base text-gray-600">
                  Factory ID: {factory._id}
                </CardDescription>
                <p className="text-sm text-gray-700">
                  Address: {factory.address.location},{" "}
                  {factory.address.pincode}
                </p>
                <p className="text-sm text-gray-700">
                  Coordinates:{" "}
                  {factory.address.coordinates.coordinates.join(", ")}
                </p>
                <Link
                  href={`/factory/${factory._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-600">
            No factories found for this organization.
          </p>
        </div>
      )}
    </main>
  );
}
