"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchData, putData } from "@/axiosUtility/api";
import { useState, useEffect } from "react";

interface SendForPolishProps {
    blockId: string;
    onConfirm: (selectedSlabs: string[]) => void;
}

const SendForPolish: React.FC<SendForPolishProps> = ({ blockId, onConfirm }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [slabData, setSlabData] = useState<any>(null);
    const [selectedSlabs, setSelectedSlabs] = useState<string[]>([]);
    const GlobalModal = useGlobalModal();

    useEffect(() => {
        const fetchSlabData = async () => {
            try {
                const GetData = await fetchData(`/factory-management/inventory/raw/get/${blockId}`);
                setSlabData(GetData);
                // console.log("This is Block data", GetData);
            } catch (error) {
                console.error("Error fetching slab data:", error);
            }
        };

        if (blockId) {
            fetchSlabData();
        }
    }, [blockId]);

    const toggleSlabSelection = (slabId: string) => {
        setSelectedSlabs((prev) =>
            prev.includes(slabId)
                ? prev.filter((id) => id !== slabId) // Deselect slab
                : [...prev, slabId] // Select slab
        );
    };

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (selectedSlabs.length === 0) {
            alert("Please select at least one slab.");
            return;
        }

        setIsLoading(true);

        try {
            // Use putData to update the slab status
            const response = await putData(
                "/factory-management/inventory/updatemultipleslabs",
                {
                    slabNumbers: selectedSlabs,
                    status: "polished",
                }
            );

            console.log("Response:", response);
            alert(response.message || "Slabs updated successfully.");

            // Notify the parent component
            await onConfirm(selectedSlabs);
            GlobalModal.onClose();
        } catch (error: any) {
            console.error("Error sending slabs for polishing:", error);

            // Provide detailed error messages if available
            if (error.response?.data?.message) {
                alert(`Failed to update slab status: ${error.response.data.message}`);
            } else {
                alert("Failed to update slab status. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
                <Label>Total Slabs in Block</Label>
                <p className="text-gray-600">{slabData?.SlabsId.length || 0}</p>
            </div>

            {/* Display slabs with checkboxes */}
            <div className="space-y-2">
                <Label>Select Slabs to Send for Polishing</Label>
                {slabData?.SlabsId.map((slabId: string, index: number) => (
                    <div key={slabId} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`slab-${slabId}`}
                            checked={selectedSlabs.includes(slabId)}
                            onChange={() => toggleSlabSelection(slabId)}
                        />
                        {/* Replace slabId with a user-friendly slab number */}
                        <label htmlFor={`slab-${slabId}`}>Slab {index + 1}</label>
                    </div>
                ))}
            </div>

            <div className={cn("flex gap-2 justify-end")}>
                <Button
                    variant="secondary"
                    onClick={GlobalModal.onClose}
                    type="button"
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-500 text-white">
                    {isLoading ? "Processing..." : "Send for Polishing"}
                </Button>
            </div>
        </form>
    );
};

export default SendForPolish;
