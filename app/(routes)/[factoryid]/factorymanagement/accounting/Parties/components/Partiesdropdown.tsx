"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useRouter } from "next/navigation";
import SupplierButton from "./buttons/SupplierButton";
import CustomerButton from "./buttons/CustomerButton";

interface PartiesDropdownProps {
  organizationId: string;
}

export default function PartiesDropdown({ organizationId }: PartiesDropdownProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh(); // Refreshes the current page, re-fetching server data
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Ledger
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 flex flex-col gap-2">
        <SupplierButton onSuccess={handleSuccess} />
        <CustomerButton onSuccess={handleSuccess} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}