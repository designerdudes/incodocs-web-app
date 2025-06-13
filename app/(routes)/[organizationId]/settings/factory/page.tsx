import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";
import { cookies } from "next/headers";
import CellAction from "./components/cell-actions";
import AddFactoryButton from "./components/AddFactoryButton";
import { Separator } from "@/components/ui/separator";

export interface Factory {
  _id: string;
  factoryName: string;
  gstNo: string;
  address: {
    location: string;
    pincode: string;
  };
  createdAt: string;
  workersCuttingPay?: number;
  workersPolishingPay?: number;
}

interface FactoryPageProps {
  params: {
    organizationId: string;
}; 
}

export default async function FactoryPage({ params  }: FactoryPageProps, ) {
  const cookieStore = cookies();
  const token = cookieStore.get("AccessToken")?.value || "";
  let factories: Factory[] = [];
  if (params?.organizationId && token) {
    try {
      const res = await fetch(`https://incodocs-server.onrender.com/factory/getbyorg/${params?.organizationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Ensure fresh data in server component
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch factories: ${res.statusText}`);
      }
      factories = await res.json();
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  } else {
    console.error("Missing organizationId or token");
  }

  return (
    <div className="space-y-6 ml-7">
      <div className="topbar w-full flex items-center justify-between">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Factory Settings" />
          <p className="text-muted-foreground text-sm">
            Adjust your factory-related settings here.
          </p>
        </div>
      </div>
      <div>
        <Separator />
      </div>

      <div className="space-y-4 mr-6">
        {factories.length > 0 ? (
          factories.map((factory) => (
            <div
              key={factory._id}
              className="flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md"
            >
              <div>
                <h2 className="text-lg font-medium">{factory.factoryName}</h2>
                <p className="text-gray-500 text-sm">{factory.address.location}</p>
              </div>
              <div className="flex gap-3">
                <CellAction data={factory} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No factories available.</p>
        )}
      </div>

      <div>
        
<AddFactoryButton
  organizationId={params.organizationId}
  token={token}
/>
        
      </div>
    </div>
  );
}