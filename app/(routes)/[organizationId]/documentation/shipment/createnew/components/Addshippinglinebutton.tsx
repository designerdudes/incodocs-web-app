"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ShippinglineForm from "@/components/forms/Addshippinglineform";

interface AddShippinglineButtonProps {
  onSuccess?: () => void;
}

export default function AddshippinglineButton({ onSuccess }: AddShippinglineButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openShippinglineForm = () => {
    setTitle("Enter Shippingline Details");
    setChildren(<ShippinglineForm onSuccess={onSuccess} />);
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