"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { useRouter } from "next/navigation";
import ShippingLineButton from "./buttons/ShippingLineButton";
import ForwarderButton from "./buttons/ForwarderButton";
import TransporterButton from "./buttons/TransporterButton";
import Supplierform from "./forms/SupplierForm";
import ConsigneeButton from "./buttons/ConsigneeButton";
import CbnameButton from "./buttons/CbnameButton";
import ShippingLineForm from "./forms/ShippingLineForm";

interface PartiesDropdownProps {
  organizationId: string;
  onSuccess?: () => void;
  currentUser?: string;
}

export default function PartiesDropdown({
  organizationId, onSuccess, currentUser
}: PartiesDropdownProps) {
  const { onOpen, setTitle, setChildren, } = useGlobalModal();
  const router = useRouter();
  const GlobalModal = useGlobalModal();

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
        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Enter Shippingline Details`;
            GlobalModal.children = (
              <ShippingLineForm onSuccess={onSuccess} orgId={organizationId} currentUser={currentUser} />
            );
            GlobalModal.onOpen();
          }}>
          Shipping Line
          {/* <ShippingLineButton onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ForwarderButton onSuccess={handleSuccess} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <TransporterButton onSuccess={handleSuccess} />
        <DropdownMenuSeparator />

        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-gray-100"
          onClick={openSupplierForm}
        >
          Supplier
        </Button>
        <DropdownMenuSeparator />

        <ConsigneeButton onSuccess={handleSuccess} />
        <DropdownMenuSeparator />

        <CbnameButton orgId={organizationId} onSuccess={handleSuccess} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
