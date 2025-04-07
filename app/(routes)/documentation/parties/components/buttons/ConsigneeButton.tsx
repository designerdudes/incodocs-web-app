"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import ConsigneeForm from "../forms/ConsigneeForm";

interface AddConsigneeButtonProps {
  onSuccess?: () => void;
}

export default function ConsigneeButton({ onSuccess }: AddConsigneeButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openConsigneeForm = () => {
    setTitle("Enter Consignee Details");
    setChildren(<ConsigneeForm onSuccess={onSuccess} />);
    onOpen();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-100"
      onClick={openConsigneeForm}
    >
      Consignee
    </Button>
  );
}