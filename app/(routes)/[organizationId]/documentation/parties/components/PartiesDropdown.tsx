"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useRouter } from "next/navigation";
import ShippingLineButton from "./buttons/ShippingLineButton";
import ForwarderButton from "./buttons/ForwarderButton";
import TransporterButton from "./buttons/TransporterButton";
import Supplierform from "./forms/SupplierForm";
import ConsigneeButton from "./buttons/ConsigneeButton";
import CbnameButton from "./buttons/CbnameButton";

interface PartiesDropdownProps {
  organizationId: string;
}

export default function PartiesDropdown({ organizationId }: PartiesDropdownProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh(); // Refreshes the current page, re-fetching server data
  };

  const openSupplierForm = () => {
    setTitle("Enter Supplier Details");
    setChildren(<Supplierform onSuccess={handleSuccess} />);
    onOpen();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          Add Parties

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 flex flex-col gap-2">
        <ShippingLineButton onSuccess={handleSuccess} />
        <ForwarderButton onSuccess={handleSuccess} />
        <TransporterButton onSuccess={handleSuccess} />
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100"
          onClick={openSupplierForm}
        >
          Supplier
        </Button>
        <ConsigneeButton onSuccess={handleSuccess} />
        <CbnameButton  onSuccess={handleSuccess}/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}