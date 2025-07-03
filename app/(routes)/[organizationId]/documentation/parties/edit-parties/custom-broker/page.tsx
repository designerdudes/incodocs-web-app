"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import EditCBNameForm from "../../components/forms/EditCbNameForm";


interface PageProps {
  params: {
    organizationId: string;
  };
}

export default function EditForwarderPage({ params }: PageProps) {
        const searchParams = useSearchParams();
  const { organizationId } = params;
const custombrokerid = searchParams.get("custombrokerId") || "";


  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href={`/${organizationId}/documentation/parties`}>
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title="Edit Custom-Broker Details"
          />
          <p className="text-muted-foreground text-sm">
            Update the form below to edit this Custom Broker.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <EditCBNameForm   params={{ cbData: custombrokerid, onSuccess: () => {} }}
 />
      </div>
    </div>
  );
}
