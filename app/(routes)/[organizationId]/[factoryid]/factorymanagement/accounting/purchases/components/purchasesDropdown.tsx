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

interface AddpurchasesProps {
  factoryId: string
  organizationId: string
}

export default function AddPurchases({factoryId,organizationId}: AddpurchasesProps) {
  useGlobalModal();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    // Encode query parameters to handle special characters
    const queryParams = new URLSearchParams({
      factoryId,
      organizationId,
    }).toString();
    
    router.push(`./purchases/create-new/${path}?${queryParams}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          Create New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 flex flex-col gap-2">
        <DropdownMenuItem onSelect={() => handleNavigation("RawPurchases")}>
          Raw Purchases
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => handleNavigation("finishedPurchases")}>
          Finished Purchases
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}