"use client"; // Ensures the component is client-side

import { useGlobalModal } from "@/hooks/GlobalModal"; // Zustand store hook
import ShippinglineForm from "@/components/forms/Addshippinglineform";

// AddFactoryButton Component
export default function AddshippinglineButton() {
  const { onOpen, setTitle, setChildren } = useGlobalModal((state) => ({
    onOpen: state.onOpen,
    setTitle: state.setTitle,
    setChildren: state.setChildren,
  }));

  // Function to open the modal and set content
  const openConsigneeForm = () => {
    setTitle("Enter Shippingline Details"); // Set the title of the modal
    setChildren(<ShippinglineForm />); // Set the form (or any component) as modal content
    onOpen(); // Open the modal
  };

  return (
    <button
      onClick={openConsigneeForm} // Trigger modal open
    >
      + Add shipping line    </button>
  );
}
