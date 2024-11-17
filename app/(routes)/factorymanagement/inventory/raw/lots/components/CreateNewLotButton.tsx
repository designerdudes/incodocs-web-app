"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddLotForm from "./addLotForm"; // Import the AddLotForm component for the modal
import { useGlobalModal } from "@/hooks/GlobalModal";

export default function CreateNewLotButton() {
    // const [isModalOpen, setIsModalOpen] = useState(false); // Client-side state for the modal visibility
    const modal = useGlobalModal(); // Global modal hook
    return (
        <div>
            <Button onClick={() => {
                modal.title = "Create New Lot"; // Set the title of the modal
                modal.children = <AddLotForm />; // Set the content of the modal
                modal.onOpen(); // Open the modal
            }}>Create New Lot</Button>
        </div>
    );
}
