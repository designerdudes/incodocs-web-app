"use client"; // Ensures the component is client-side

import ForwarderForm from "@/components/forms/Forwarderdetailsform";
import { Button } from "@/components/ui/button"; // Button component
import { useGlobalModal } from "@/hooks/GlobalModal"; // Zustand store hook

// AddFactoryButton Component
export default function AddForwarderButton() {
  const { onOpen, setTitle, setChildren } = useGlobalModal((state) => ({
    onOpen: state.onOpen,
    setTitle: state.setTitle,
    setChildren: state.setChildren,
  }));

  // Function to open the modal and set content
  const openForwarderForm = () => {
    setTitle("Enter Forwarder Details"); // Set the title of the modal
    setChildren(<ForwarderForm/>); // Set the form (or any component) as modal content
    onOpen(); // Open the modal
  };

  return (
    <Button
      className="mt-3 px-4 py-3 primary"
      onClick={openForwarderForm} // Trigger modal open
    >
Add forwarder details    </Button>
  );
}
