"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";  
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Addshippinglineform from "@/components/forms/Addshippinglineform";
import { useSearchParams } from "next/navigation";

interface AddPartiesProps {
  organizationId?: string;
  onSuccess?: () => void;
  currentUser?: string;
}

export default function AddShippingLinePage({
  organizationId: propOrganizationId,
  onSuccess,
  currentUser: propCurrentUser,
}: AddPartiesProps) {
  const searchParams = useSearchParams();
//   console.log("dasaaaaaaaaaa",searchParams)
  
  // Fallback to search params if props are undefined
  const organizationId = propOrganizationId || searchParams.get("organizationId") || "";
  const currentUser = propCurrentUser || searchParams.get("currentUser") || "";

//   console.log("zzzzzzzzzzzzzzzzz", organizationId);
//   console.log("zzzzzzzzssssszzzzzzzzz", currentUser);

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
            title="Add Shipping Line Details"
          />
          <p className="text-muted-foreground text-sm">
            Complete the form below to add a new Shipping-line.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="container mx-auto">
        <Addshippinglineform
          onSuccess={onSuccess}
          orgId={organizationId}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}