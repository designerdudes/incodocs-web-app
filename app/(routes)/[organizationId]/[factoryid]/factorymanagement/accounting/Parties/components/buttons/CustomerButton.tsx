"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import CustomerForm from "../forms/AddCustomerForm";

interface AddCustomerButtonProps {
  onSuccess?: () => void;
}

export default function CustomerButton({ onSuccess }: AddCustomerButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openCustomerForm = () => {
    setTitle("Enter Customer Details");
    setChildren(<CustomerForm onSuccess={onSuccess} />);
    onOpen();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-100"
      onClick={openCustomerForm}
    >
      Customer
    </Button>
  );
}
