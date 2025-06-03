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
import Forwarderform from "./forms/ForwarderForm";
import Transporterform from "./forms/TransporterForm";
import ConsigneeForm from "./forms/ConsigneeForm";
import CBNameForm from "./forms/CBNameForm";

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
  const { onOpen, setTitle, setChildren } = useGlobalModal();
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
              <ShippingLineForm
                onSuccess={onSuccess}
                orgId={organizationId}
                currentUser={currentUser}
              />
            );
            GlobalModal.onOpen();
          }}
        >
          Shipping Line
          {/* <ShippingLineButton onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Enter Forwarder Details`;
            GlobalModal.children = (
              <Forwarderform
                onSuccess={onSuccess}
                orgId={organizationId}
                currentUser={currentUser}
              />
            );
            GlobalModal.onOpen();
          }}
        >
          Forwarder
          {/* <ForwarderButton onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Enter Transporter Details`;
            GlobalModal.children = (
              <Transporterform
                onSuccess={onSuccess}
                orgId={organizationId}
                currentUser={currentUser}
              />
            );
            GlobalModal.onOpen();
          }}
        >
          Transporter
          {/* <TransporterButton onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Enter Supplier Details`;
            GlobalModal.children = (
              <Supplierform
                onSuccess={onSuccess}
                orgId={organizationId}
                currentUser={currentUser}
              />
            );
            GlobalModal.onOpen();
          }}
        >
          Supplier
          {/* <SupplierButton onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Enter Consignee Details`;
            GlobalModal.children = (
              <ConsigneeForm
                onSuccess={onSuccess}
                orgId={organizationId}
                currentUser={currentUser}
              />
            );
            GlobalModal.onOpen();
          }}
        >
          Consignee
          {/* <ConsigneeButton onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Enter CustomBroker Name Details`;
            GlobalModal.children = (
              <CBNameForm
                onSuccess={onSuccess}
                orgId={organizationId}
                currentUser={currentUser}
              />
            );
            GlobalModal.onOpen();
          }}
        >
          CustomBroker Name
          {/* <CbName onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
