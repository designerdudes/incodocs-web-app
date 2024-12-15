"use client"

import * as React from "react";
import { cn } from "@/lib/utils";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { Label } from "@/components/ui/label"; // Assuming you have a Label component

interface SendForPolishProps {
    onConfirm: (selectedSlabs: number) => void;
    totalSlabs: number; // Pass total slabs available in the block
}

export const SendForPolish: React.FC<SendForPolishProps> = ({ onConfirm, totalSlabs }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [selectedSlabs, setSelectedSlabs] = React.useState<number>(0);
    const GlobalModal = useGlobalModal();

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (selectedSlabs <= 0 || selectedSlabs > totalSlabs) {
            alert("Please select a valid number of slabs.");
            return;
        }

        setIsLoading(true);

        try {
            await onConfirm(selectedSlabs); // Call the onConfirm with the selected slabs
            GlobalModal.onClose();
        } catch (error) {
            console.error("Error sending slabs for polishing:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            {/* Show total slabs */}
            <div className="space-y-2">
                <Label>Total Slabs in Block</Label>
                <p className="text-gray-600">{totalSlabs}</p>
            </div>

            {/* Input for selecting slabs */}
            <div className="space-y-2">
                <Label htmlFor="slabsToSend">Select Slabs to Send for Polishing</Label>
                <Input
                    id="slabsToSend"
                    type="number"
                    value={selectedSlabs}
                    onChange={(e) => setSelectedSlabs(Number(e.target.value))}
                    placeholder="Enter number of slabs"
                    min={1}
                    max={totalSlabs}
                />
            </div>

            {/* Action buttons */}
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
