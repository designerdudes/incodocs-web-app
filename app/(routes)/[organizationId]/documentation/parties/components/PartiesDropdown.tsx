"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useRouter } from "next/navigation";

interface AddPartiesProps {
  organizationId: string;
  onSuccess?: () => void;
  currentUser?: string;
}

export default function AddParties({
  organizationId,
  onSuccess,
  currentUser,
}: AddPartiesProps) {
  useGlobalModal();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    // Encode query parameters to handle special characters
    const queryParams = new URLSearchParams({
      organizationId,
      currentUser: currentUser || "",
    }).toString();
    
    router.push(`./parties/add-parties/${path}?${queryParams}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          Add Parties
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 flex flex-col gap-2">
        <DropdownMenuItem onSelect={() => handleNavigation("shipping-line")}>
          Shipping Line
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => handleNavigation("forwarder")}>
          Forwarder
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => handleNavigation("transporter")}>
          Transporter
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => handleNavigation("supplier")}>
          Supplier
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => handleNavigation("consignee")}>
          Consignee
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => handleNavigation("custom-broker")}>
          Custom Broker
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}