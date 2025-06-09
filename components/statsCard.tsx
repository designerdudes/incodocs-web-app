"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatsCardProps {
  title: string;
  stat: number;
  statPrefix?: string;
  icon: React.ReactNode;
  desc?: string;
  className?: string;
  href: string;
  factoryId: string; // Factory ID is now dynamically passed
  organizationId?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  stat,
  statPrefix = "",
  icon,
  desc,
  className,
  href,
  factoryId,
  organizationId,
}) => {
  const router = useRouter();

  return (
    <Card className={`relative p-2 rounded-2xl bg-white ${className} `}>
      <div className="absolute top-5 right-5 text-gray-600">{icon}</div>
      <CardHeader className="flex flex-col space-y-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
        <Heading
          title={`${statPrefix}${stat}`}
          className="text-4xl font-extrabold text-gray-900"
        />
        <p className="opacity-80 text-sm">{desc}</p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => router.push(`/${organizationId}/${factoryId}${href}`)}
          variant="default"
          className="w-full mt-2 flex justify-center items-center space-x-2"
        >
          <span>View All</span> <ArrowRight className="w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
