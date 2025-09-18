"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchData, putData } from "@/axiosUtility/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface SendForPolishProps {
    blockId: string;
    onConfirm: (selectedSlabs: number[]) => void;
}

const SendForPolish: React.FC<SendForPolishProps> = ({ blockId, onConfirm }) => {
    const GlobalModal = useGlobalModal();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [BlockData, setBlockData] = useState<any>(null);
    const [selectedSlabs, setSelectedSlabs] = useState<number[]>([]);
    const [readyForPolishSlabs, setReadyForPolishSlabs] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState(false); // Track Select All state

    useEffect(() => {
        const fetchSlabData = async () => {
            try {
                const GetData = await fetchData(`/factory-management/inventory/slabsbyblock/get/${blockId}`);
                setBlockData(GetData);
                // console.log("All Slabs:sssssss", GetData);
                if (Array.isArray(GetData?.SlabsId)) {

                    const filteredSlabs = GetData.SlabsId.filter(
                        (slab: { status?: string }) => slab.status === "readyForPolish"
                    );
                    setReadyForPolishSlabs(filteredSlabs);
                } else {
                    console.warn("SlabsId is not an array or is undefined");
                    setReadyForPolishSlabs([]); // Fallback to empty array
                }
            } catch (error) {
                console.error("Error fetching slab data:", error);
            }
        };

        if (blockId) {
            fetchSlabData();
        }
    }, [blockId]);

    useEffect(() => {
        // Sync the selected slabs with selectAll state
        if (selectAll) {
            setSelectedSlabs(readyForPolishSlabs.map((slab) => slab.slabNumber));
        } else {
            setSelectedSlabs([]);
        }
    }, [selectAll, readyForPolishSlabs]);

    const toggleSlabSelection = (slabNumber: number) => {
        setSelectedSlabs((prev) =>
            prev.includes(slabNumber)
                ? prev.filter((num) => num !== slabNumber) // Deselect slab
                : [...prev, slabNumber] // Select slab
        );
    };

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if (selectedSlabs.length === 0) {
            toast.error("Please select at least one slab.");
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                slabNumbers: selectedSlabs,
                status: "inPolishing",
            };

            const response = await putData(
                "/factory-management/inventory/updatemultipleslabs",
                payload
            );

            // console.log("Response:", response);
            // console.log("Payload", payload);
            setIsLoading(false);
            GlobalModal.onClose();
            toast.success("Slabs updated successfully.");

            GlobalModal.onClose();
        } catch (error: any) {
            console.error("Error sending slabs for polishing:", error);

            if (error.response?.data?.message) {
                toast.error(`Failed to update slab status: ${error.response.data.message}`);
            } else {
                toast.error("Failed to update slab status. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
        window.location.reload();
    };

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
  <div className="space-y-2">
    <Label>Total Slabs in Block</Label>
    <p className="text-gray-600">{BlockData?.length || 0}</p>
  </div>

            {/* Display slabs with checkboxes */}
            <div className="space-y-2">
                <Label>Select Slabs to Send for Polishing</Label>

    {/* Select All checkbox */}
    {Array.isArray(readyForPolishSlabs) && readyForPolishSlabs.length > 0 && (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="select-all"
          checked={selectAll}
          onChange={() => setSelectAll(!selectAll)} // Toggle selectAll state
        />
        <label htmlFor="select-all" className="font-medium">
          Select All Slabs
        </label>
      </div>
    )}

    {Array.isArray(readyForPolishSlabs) && readyForPolishSlabs.length > 0 ? (
      readyForPolishSlabs.map((slab, index) => (
        <div key={slab._id ?? index} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`slab-${index}`}
            checked={selectedSlabs.includes(slab.slabNumber ?? index + 1)}
            onChange={() => toggleSlabSelection(slab.slabNumber ?? index + 1)}
          />
          <label htmlFor={`slab-${index}`}>
            Slab {slab.slabNumber ?? index + 1}
          </label>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No slabs are ready for polishing.</p>
    )}
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
