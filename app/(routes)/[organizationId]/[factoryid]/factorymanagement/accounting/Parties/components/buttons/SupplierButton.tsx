"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import SupplierForm from "../forms/AddSupplierForm";

interface AddSupplierButtonProps {
  onSuccess?: () => void;
}

export default function SupplierButton({ onSuccess }: AddSupplierButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openSupplierForm = () => {
    setTitle("Enter Supplier Details");
    setChildren(<SupplierForm onSuccess={onSuccess} />);
    onOpen();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-100"
      onClick={openSupplierForm}
    >
      Supplier
    </Button>
  );
}
