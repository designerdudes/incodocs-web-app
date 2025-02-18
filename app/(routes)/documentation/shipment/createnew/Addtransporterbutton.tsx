"use client"; // Ensures the component is client-side

import TransporterForm from "@/components/forms/Addtransporterform";
import { Button } from "@/components/ui/button"; // Button component
import { useGlobalModal } from "@/hooks/GlobalModal"; // Zustand store hook

// AddFactoryButton Component
export default function AddtransporterButton() {
  const { onOpen, setTitle, setChildren } = useGlobalModal((state) => ({
    onOpen: state.onOpen,
    setTitle: state.setTitle,
    setChildren: state.setChildren,
  }));

  // Function to open the modal and set content
  const openForwarderForm = () => {
    setTitle("Enter Transporter Details"); // Set the title of the modal
    setChildren(<TransporterForm/>); // Set the form (or any component) as modal content
    onOpen(); // Open the modal
  };

  return (
    <Button
      className="mt-3 px-4 py-3 primary"
      onClick={openForwarderForm} // Trigger modal open
    >
Add Transporter details    </Button>
  );
}
