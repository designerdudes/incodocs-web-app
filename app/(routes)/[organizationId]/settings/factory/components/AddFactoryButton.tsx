"use client";

import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import FactoryForm from "@/components/forms/AddFactoryForm";

interface AddFactoryButtonProps {
  organizationId: string;
  token: string;
  organizations?: { id: string; name: string }[];
}

export default function AddFactoryButton({
  organizationId,
  token,
  organizations = [],
}: AddFactoryButtonProps) {
  const { onOpen, setTitle, setChildren } = useGlobalModal((state) => ({
    onOpen: state.onOpen,
    setTitle: state.setTitle,
    setChildren: state.setChildren,
  }));

  const openFactoryForm = () => {
    setTitle("Enter Factory Details");
    setChildren(
      <FactoryForm
        organizationId={organizationId}
        token={token}
        organizations={organizations}
      />
    );
    onOpen();
  };

  return (
    <Button
      variant="default"
      className="mt-3 w-25 px-4 py-3 default"
      onClick={openFactoryForm}
    >
      Add Factory
    </Button>
  );
}
