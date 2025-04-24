import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Factory, FactoryIcon, Ship } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import StatsCard from '@/components/statsCard';
import StatsOverviewCard from '@/components/dashboard/statsOverviewCard';
import { FinancialCard } from '@/components/dashboard/FinancialCard';
import { FactoriesCard } from '@/components/dashboard/factoriesCards';


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
  factoryName: string;
  address: Address;
  organization: string;
  gstNo: string;
  BlocksId: string[];
  SlabsId: string[];
  lotId: string[];
  workerCuttingPay: number;
  workerPolishingPay: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface Params {
  organizationId: string;
}

export default async function DashboardPage({ params }: { params: Params }) {
  const { organizationId } = params;
  const cookieStore = cookies();
  const token = cookieStore.get('AccessToken')?.value;

  console.log("orgId", organizationId);

  try {


    // Fetch all factories for the organization
    const factoriesRes = await fetch(
      `https://incodocs-server.onrender.com/factory/getbyorg/${organizationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );



    const factories: Factory[] = await factoriesRes.json();

    console.log('factories', factories);

    return (
      <main className="flex  flex-col p-10 gap-4 bg-gradient-to-r from-gray-100 to-white">
        <div className="gap-3">
          <Heading
            className="text-3xl"
            title="Dashboard"
          />
          <p className="text-sm  text-gray-600">
            View all factories for your organization.
          </p>
        </div>
        <Separator />

        {/* stats cards  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title='Total Shipments'
            stat={0}
            statPrefix=''
            href='/documentation/shipment'
            factoryId={organizationId}
            desc='Total shipments for your organization till date'
            icon={<Ship className="h-6 w-6 text-muted-foreground" />}
          />
          <StatsCard
            title='Total Factories'
            stat={0}
            statPrefix=''
            href='/shipment'
            factoryId={organizationId}
            desc='Total factories for your organization till date'
            icon={<FactoryIcon className="h-6 w-6 text-muted-foreground" />}
          />
          <StatsCard
            title='Total Consignees'
            stat={0}
            statPrefix=''
            href='/documentation/shipment'
            factoryId={organizationId}
            desc='Total consignees for your organization till date'
            icon={<Ship className="h-6 w-6 text-muted-foreground" />}
          />
          <StatsCard
            title='Total Supliers'
            stat={0}
            statPrefix=''
            href='/documentation/shipment'
            factoryId={organizationId}
            desc='Total suppliers for your organization till date'
            icon={<Ship className="h-6 w-6 text-muted-foreground" />}
          />
        </div>

        <div className="gap-3">
          <Heading
            className="text-3xl"
            title="Invoices, Quotations and Purchase Orders"
          />
          <p className="text-sm  text-gray-600">
            Overview of all invoices, quotations and purchase orders for your organization.
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsOverviewCard
            type='invoices'
            totalCount={10}
            totalValue={379404}
            pendingCount={3}
            pendingValue={10000}
            paidCount={7}
            paidValue={369404}
            factoryId='1'
          />
          <StatsOverviewCard
            type='quotes'
            totalCount={10}
            totalValue={379404}
            pendingCount={3}
            pendingValue={10000}
            paidCount={7}
            paidValue={369404}
            factoryId='1'
          />
          <StatsOverviewCard
            type='purchase-orders'
            totalCount={10}

            totalValue={379404}
            pendingCount={3}
            pendingValue={10000}
            paidCount={7}
            paidValue={369404}
            factoryId='1'
          />
        </div>
        <Separator />
        <div className="gap-3">
          <Heading
            className="text-3xl"
            title="Factories"
          />
          <p className="text-sm  text-gray-600">
            Overview of your organization 
          </p>
        </div>
        <Separator />

        {/* Factories List */}
        {factories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {factories.map((factory) => (
              <FactoriesCard
                key={factory._id}
                factoryId={factory._id}
                factoryName={factory.factoryName}
                factoryAddress={factory.address.location}
                factoryGSTIN={factory.gstNo}
                totalBlocks={factory.BlocksId?.length}
                totalSlabs={factory.SlabsId?.length}
                totalLots={factory.lotId?.length}
                workerCuttingPay={factory.workerCuttingPay}
                workerPolishingPay={factory.workerPolishingPay}
              />

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
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return (
      <div className="flex h-full items-center justify-center p-10 bg-gradient-to-r from-gray-100 to-white">
        <p className="text-lg text-gray-600">Failed to fetch data</p>
      </div>
    );
  }
}