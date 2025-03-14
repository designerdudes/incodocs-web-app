"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ForwarderForm from "@/components/forms/Forwarderdetailsform";

interface AddForwarderButtonProps {
  onSuccess?: () => void;
}

export default function AddForwarderButton({ onSuccess }: AddForwarderButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openForwarderForm = () => {
    setTitle("Enter Forwarder Details");
    setChildren(<ForwarderForm onSuccess={onSuccess} />);
    onOpen();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-100"
      onClick={openForwarderForm}
    >
      Forwarder
    </Button>
  );
}