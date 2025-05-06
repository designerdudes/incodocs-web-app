// components/buttons/CbnameButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import CBNameForm from "../forms/CBNameForm";

interface CBNameButtonProps {
  orgId: string; // Add orgId as a required prop
  onSuccess?: () => void; // Update onSuccess to a more specific type
}

export default function CBNameButton({ orgId, onSuccess }: CBNameButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal();

  const openCBNameForm = () => {
    setTitle("Enter CB Name Details");
    setChildren(
      <CBNameForm orgId={orgId} onSuccess={onSuccess || (() => {})} />
    ); // Pass orgId to CBNameForm
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
