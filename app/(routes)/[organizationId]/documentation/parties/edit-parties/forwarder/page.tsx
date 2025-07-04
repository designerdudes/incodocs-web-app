"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Forwarderdetailsform from "@/components/forms/Forwarderdetailsform";
import { useSearchParams } from "next/navigation";
import EditForwarderForm from "../../components/EditForwarderForm";


interface PageProps {
  params: {
    organizationId: string;
  };
}

export default function EditForwarderPage({ params }: PageProps) {
        const searchParams = useSearchParams();
  const { organizationId } = params;
const forwarderid = searchParams.get("forwarderId") || "";


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
            title="Edit Forwarder Details"
          />
          <p className="text-muted-foreground text-sm">
            Update the form below to edit this Forwarder.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <EditForwarderForm params={{ _id: forwarderid }} />
      </div>
    </div>
  );
}
