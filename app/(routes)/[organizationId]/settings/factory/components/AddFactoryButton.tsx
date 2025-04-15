"use client"; // Ensures the component is client-side

import { Button } from "@/components/ui/button"; // Button component
import { useGlobalModal } from "@/hooks/GlobalModal"; // Zustand store hook
import FactoryForm from "@/components/forms/AddFactoryForm"; // Factory form component

// AddFactoryButton Component
export default function AddFactoryButton() {
  const { onOpen, setTitle, setChildren } = useGlobalModal((state) => ({
    onOpen: state.onOpen,
    setTitle: state.setTitle,
    setChildren: state.setChildren,
  }));

  // Function to open the modal and set content
  const openFactoryForm = () => {
    setTitle("Enter Factory Details"); // Set the title of the modal
    setChildren(<FactoryForm />); // Set the form (or any component) as modal content
    onOpen(); // Open the modal
  };

  return (
    <Button
      className="mt-3 px-4 py-3 default"
      onClick={openFactoryForm} // Trigger modal open
    >
      Add Factory
    </Button>
  );
}
