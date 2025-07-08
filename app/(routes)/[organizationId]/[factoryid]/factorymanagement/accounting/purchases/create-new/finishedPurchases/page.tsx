"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import AddFinishedPurchases from "@/components/forms/AddFinishedPurchases";


interface PageProps {
  params: {
    factoryId: string;
  };
}
export default function AddFinishedPurchasespage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const factoryid = params.factoryId || searchParams.get("factoryId") || "";

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title="Add Finished Purchase Details"
          />
          <p className="text-muted-foreground text-sm">
            Complete the form below to add a new Finished Purchase.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <AddFinishedPurchases gap={0} />
      </div>
    </div>
  );
}