"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ShippinglineForm from "@/components/forms/Addshippinglineform";
import ShippingLineForm from "../forms/ShippingLineForm";

interface AddShippinglineButtonProps {
  onSuccess?: () => void;
}

export default function ShippingLineButton({ onSuccess }: AddShippinglineButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openShippinglineForm = () => {
    setTitle("Enter Shippingline Details");
    setChildren(<ShippingLineForm onSuccess={onSuccess} />);
    onOpen();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-100"
      onClick={openShippinglineForm}
    >
      Shipping Line
    </Button>
  );
}