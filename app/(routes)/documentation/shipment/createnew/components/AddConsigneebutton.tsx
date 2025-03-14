"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";

interface AddConsigneeButtonProps {
  onSuccess?: () => void;
}

export default function AddConsigneeButton({ onSuccess }: AddConsigneeButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openConsigneeForm = () => {
    setTitle("Enter Consignee Details");
    setChildren(<AddConsigneeForm onSuccess={onSuccess} />);
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