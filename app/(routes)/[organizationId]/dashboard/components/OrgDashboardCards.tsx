"use client";
import StatsCard from "@/components/statsCard";
import { Factory, Ship } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Params {
  organizationId: string;
}

export function OrgDashboardCards({ organizationId }: Params) {
  const [activeFactory, setActiveFactory] = useState("");

  useEffect(() => {
    // Runs only in browser
    const storedFactoryId = localStorage.getItem("activeFactoryId") || "";
    setActiveFactory(storedFactoryId);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Shipments"
        stat={0}
        statPrefix=""
        href="/documentation/shipment"
        factoryId={organizationId}
        desc="Total shipments for your organization till date"
        icon={<Ship className="h-6 w-6 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Factories"
        stat={0}
        statPrefix=""
        href={`/${activeFactory || organizationId}/factorymanagement`}
        factoryId={organizationId}
        desc="Total factories for your organization till date"
        icon={<Factory className="h-6 w-6 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Consignees"
        stat={0}
        statPrefix=""
        href="/documentation/parties"
        factoryId={organizationId}
        desc="Total consignees for your organization till date"
        icon={<Ship className="h-6 w-6 text-muted-foreground" />}
      />
      <StatsCard
        title="Total Suppliers"
        stat={0}
        statPrefix=""
        href="/documentation/parties"
        factoryId={organizationId}
        desc="Total suppliers for your organization till date"
        icon={<Ship className="h-6 w-6 text-muted-foreground" />}
      />
    </div>
  );
}

export default OrgDashboardCards;
