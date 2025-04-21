"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import CBNameForm from "../forms/CbnameForm"; // adjust the path if needed

interface CBNameButtonProps {
  onSuccess?: () => void;
}

export default function CBNameButton({ onSuccess }: CBNameButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openCBNameForm = () => {
    setTitle("Enter CB Name Details");
    setChildren(<CBNameForm onSuccess={onSuccess} />);
    onOpen();
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start hover:bg-gray-100"
      onClick={openCBNameForm}
    >
      CB Name
    </Button>
  );
}
