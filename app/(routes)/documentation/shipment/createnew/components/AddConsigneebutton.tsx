"use client"; // Ensures the component is client-side

import { Button } from "@/components/ui/button"; // Button component
import { useGlobalModal } from "@/hooks/GlobalModal"; // Zustand store hook
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";

// AddFactoryButton Component
export default function AddConsigneeButton() {
  const { onOpen, setTitle, setChildren } = useGlobalModal((state) => ({
    onOpen: state.onOpen,
    setTitle: state.setTitle,
    setChildren: state.setChildren,
  }));

  // Function to open the modal and set content
  const openConsigneeForm = () => {
    setTitle("Enter Consignee Details"); // Set the title of the modal
    setChildren(<AddConsigneeForm />); // Set the form (or any component) as modal content
    onOpen(); // Open the modal
  };

  return (
    <Button
      className="mt-3 px-4 py-3 default"
      onClick={openConsigneeForm} // Trigger modal open
    >
      Add New Consignee
    </Button>
  );
}
