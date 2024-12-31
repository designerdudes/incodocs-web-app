"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SendForPolishProps {
    onConfirm: (selectedSlabs: number) => void;
    totalSlabs: number;
}

export const SendForPolish: React.FC<SendForPolishProps> = ({ onConfirm, totalSlabs }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [selectedSlabs, setSelectedSlabs] = React.useState<number>(0);
    const [slabNumbers, setSlabNumbers] = React.useState<string>(""); // Input for slab numbers
    const GlobalModal = useGlobalModal();

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        const slabNumbersArray = slabNumbers
            .split(",")
            .map((num) => parseInt(num.trim()))
            .filter((num) => !isNaN(num));

        if (slabNumbersArray.length !== selectedSlabs) {
            alert("The number of slab numbers entered does not match the selected count.");
            return;
        }

        // Remove this condition if slab numbers don't need to match a range
        if (slabNumbersArray.some((num) => num < 1)) {
            alert("Please enter valid slab numbers.");
            return;
        }

        setIsLoading(true);

        try {
            // Call the API to update the status
            const response = await fetch(
                "http://localhost:4080/factory-management/inventory/updatemultipleslabs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        slabNumbers: slabNumbersArray,
                        status: "polished",
                    }),
                }
            );
            console.log(response)

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Notify the parent component
            await onConfirm(selectedSlabs);
            GlobalModal.onClose();
        } catch (error) {
            console.error("Error sending slabs for polishing:", error);
            alert("Failed to update slab status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
                <Label>Total Slabs in Block</Label>
                <p className="text-gray-600">{totalSlabs}</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="slabsToSend">Number of Slabs to Send</Label>
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

            <div className="space-y-2">
                <Label htmlFor="slabNumbers">Slab Numbers</Label>
                <Input
                    id="slabNumbers"
                    type="text"
                    value={slabNumbers}
                    onChange={(e) => setSlabNumbers(e.target.value)}
                    placeholder="Enter slab numbers (e.g., 286, 287)"
                />
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
