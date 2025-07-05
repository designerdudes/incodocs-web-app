import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { ChevronLeft, MountainSnow } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

function Parties({ params }: Props) {
  const organizationId = params.organizationId;
  const factoryId = params.factoryid;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href={`/${organizationId}/${factoryId}/factorymanagement`}
        >
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Parties Management" />
          <p className="mt-2 text-gray-600">
            Easily track and modify details of Parties, ensuring efficient
            coordination and up-to-date records.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link
          href={`/${organizationId}/${factoryId}/factorymanagement/parties/quarry`}
          passHref
        >
          <Card className="bg-white dark:bg-card hover:shadow-md transition cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Quarry</CardTitle>
              <MountainSnow className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-base text-gray-600">
                Monitor marble sourcing at the origin manage extraction,
                availability, and readiness
              </CardDescription>
              <p className="text-sm text-gray-700">
                Track the origin of marble shipments from quarry to destination.
                Monitor extraction status, inventory, and dispatch timelines in
                real time
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>{" "}
    </div>
  );
}

export default Parties;
