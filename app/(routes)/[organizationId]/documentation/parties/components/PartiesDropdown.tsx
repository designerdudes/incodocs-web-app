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
import CustomBrokerForm from "@/components/forms/CustomBrokerForm";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import Addshippinglineform from "@/components/forms/Addshippinglineform";
import Forwarderdetailsform from "@/components/forms/Forwarderdetailsform";
import Addtransporterform from "@/components/forms/Addtransporterform";
import Addsupplierform from "@/components/forms/Addsupplierform";

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
    setChildren(<Addsupplierform onSuccess={handleSuccess} />);
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
              <Addshippinglineform
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
              <Forwarderdetailsform
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
              <Addtransporterform
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
              <Addsupplierform
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
              <AddConsigneeForm
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
              <CustomBrokerForm
                onSuccess={onSuccess}
                orgId={organizationId}
                currentUser={currentUser}
              />
            );
            GlobalModal.onOpen();
          }}
        >
          CustomBroker 
          {/* <CbName onSuccess={handleSuccess} /> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
