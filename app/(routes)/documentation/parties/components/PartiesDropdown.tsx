"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useRouter } from "next/navigation";
import SupplierForm from "@/components/forms/Addsupplierform";
import AddshippinglineButton from "../../shipment/createnew/components/Addshippinglinebutton";
import AddForwarderButton from "../../shipment/createnew/components/Addforwarderbutton";
import AddtransporterButton from "../../shipment/createnew/components/Addtransporterbutton";
import AddConsigneeButton from "../../shipment/createnew/components/AddConsigneebutton";

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
    setChildren(<SupplierForm onSuccess={handleSuccess} />);
    onOpen();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Parties
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 flex flex-col gap-2">
        <AddshippinglineButton onSuccess={handleSuccess} />
        <AddForwarderButton onSuccess={handleSuccess} />
        <AddtransporterButton onSuccess={handleSuccess} />
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100"
          onClick={openSupplierForm}
        >
          Supplier
        </Button>
        <AddConsigneeButton onSuccess={handleSuccess} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}