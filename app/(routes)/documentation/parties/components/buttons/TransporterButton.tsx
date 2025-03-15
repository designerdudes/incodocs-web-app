"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import Transporterform from "../forms/TransporterForm";


interface AddTransporterButtonProps {
  onSuccess?: () => void;
}

export default function TransporterButton({ onSuccess }: AddTransporterButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openTransporterForm = () => {
    setTitle("Enter Transporter Details");
    setChildren(<Transporterform onSuccess={onSuccess} />);
    onOpen();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-100"
      onClick={openTransporterForm}
    >
      Transporter
    </Button>
  );
}