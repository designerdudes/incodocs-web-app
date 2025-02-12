"use client";

import AddTeamForm from "@/components/forms/AddTeamForm";
import { Button } from "@/components/ui/button"; // Button component
import { useGlobalModal } from "@/hooks/GlobalModal"; // Zustand store hook

// AddTeamButton Component
export default function AddTeamButton() {
  const { onOpen, setTitle, setChildren } = useGlobalModal((state) => ({
    onOpen: state.onOpen,
    setTitle: state.setTitle,
    setChildren: state.setChildren,
  }));

  // Function to open the modal and set content
  const openTeamForm = () => {
    setTitle("Enter Employee Details"); // Set the title of the modal
    setChildren(<AddTeamForm />); // Set the form (or any component) as modal content
    onOpen(); // Open the modal
  };

  return (
    <Button
      className="mt-3 px-4 py-3 default"
      onClick={openTeamForm} // Trigger modal open
    >
      Add Member
    </Button>
  );
}