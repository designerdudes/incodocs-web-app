"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchData, putData } from "@/axiosUtility/api";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import EntityCombobox from "@/components/ui/EntityCombobox";

interface SendForPolishProps {
  blockId: string;
  onConfirm: (selectedSlabs: string[]) => void;
}
interface Slab {
  _id: string;
  slabNumber?: number;
  status?: string;
}

const SendForPolish: React.FC<SendForPolishProps> = ({
  blockId,
  onConfirm,
}) => {
  const GlobalModal = useGlobalModal();
  const [isLoading, setIsLoading] = useState(false);
  const [BlockData, setBlockData] = useState<any>(null);
  const [selectedSlabs, setSelectedSlabs] = useState<string[]>([]);
  const [readyForPolishSlabs, setReadyForPolishSlabs] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const params = useParams();
  const { organizationId, factoryid } = params;

  // ✅ New state for machine + inTime
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const [inTime, setInTime] = useState(
    new Date().toISOString().slice(0, 16) // default current datetime
  );

  // Fetch slabs by block
  useEffect(() => {
    const fetchSlabData = async () => {
      try {
        const GetData = await fetchData(
          `/factory-management/inventory/slabsbyblock/get/${blockId}`
        );
        setBlockData(GetData);
        if (Array.isArray(GetData?.SlabsId)) {
          const filteredSlabs = GetData.SlabsId.filter(
            (slab: { status?: string }) => slab.status === "readyForPolish"
          );
          setReadyForPolishSlabs(filteredSlabs);
        } else {
          console.warn("SlabsId is not an array or is undefined");
          setReadyForPolishSlabs([]);
        }
      } catch (error) {
        console.error("Error fetching slab data:", error);
      }
    };

    if (blockId) fetchSlabData();
  }, [blockId]);

  // ✅ Fetch machines
  useEffect(() => {
  const fetchPolishingMachines = async () => {
    const res = await fetchData(`/machine/getbyfactory/${factoryid}`, {
      data: {
        status: "idle",
      },
    });
      
    const allowedTypes = ["Auto Polishing", "Line Polishing", "Hand Polishing"];

    const response = res
      .filter((e: any) => allowedTypes.includes(e.typePolish))
      .map((e: any) => ({
        label: `${e.machineName} - ${e.typePolish} - ${e.status}`,
        value: e._id,
        typePolish: e.typePolish,
        disabled: e.status === "busy",
      }));

    setMachines(response);
  };

  fetchPolishingMachines();
}, [factoryid]);


  // Handle Select All state
  useEffect(() => {
    if (selectAll && BlockData?.length > 0) {
      setSelectedSlabs(BlockData.map((slab: { _id: any }) => slab._id));
    } else {
      setSelectedSlabs([]);
    }
  }, [selectAll, BlockData]);

  // Toggle individual slab selection
  const toggleSlabSelection = (slabId: string) => {
    setSelectedSlabs((prev) =>
      prev.includes(slabId)
        ? prev.filter((id) => id !== slabId)
        : [...prev, slabId]
    );
  };

  // Submit
  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (selectedSlabs.length === 0) {
      toast.error("Please select at least one slab.");
      return;
    }

    if (!selectedMachineId) {
      toast.error("Please select a machine.");
      return;
    }

    setIsLoading(true);

    try {
      for (const slabId of selectedSlabs) {
        const payload = {
          slabIds: [slabId],
          machineId: selectedMachineId,
          inTime: new Date(inTime).toISOString(),
          status: "inPolishing",
        };

        await putData(
          `/factory-management/inventory/finished/sendmultipleslabsforpolishing`,
          payload
        );
      }

      toast.success("Slabs sent for polishing successfully.");
      onConfirm(selectedSlabs);
      GlobalModal.onClose();
    } catch (error: any) {
      console.error("Error sending slabs for polishing:", error);
      if (error.response?.data?.message) {
        toast.error(`Failed: ${error.response.data.message}`);
      } else {
        toast.error("Failed to send slabs. Please try again.");
      }
    } finally {
      setIsLoading(false);
       window.location.reload();
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Total slabs */}
      <div className="space-y-2">
        <Label>Total Slabs in Block</Label>
        <p className="text-gray-600">{BlockData?.length || 0}</p>
      </div>

      {/* Slab selection */}
      <div className="space-y-2">
        <Label>Select Slabs to Send for Polishing</Label>

        {/* Select All */}
        {BlockData?.length > 0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              onChange={() => setSelectAll(!selectAll)}
            />
            <label htmlFor="select-all" className="font-medium">
              Select All Slabs
            </label>
          </div>
        )}

        {/* Slab checkboxes */}
        {BlockData?.length > 0 ? (
          BlockData?.map(
            (
              slab: { _id: string; slabNumber: any; status: string },
              index: number
            ) => (
              <div key={slab._id ?? index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`slab-${slab._id}`}
                  checked={selectedSlabs.includes(slab._id)}
                  onChange={() => toggleSlabSelection(slab._id)}
                />
                <label htmlFor={`slab-${slab._id}`}>
                  Slab {slab.slabNumber ?? index + 1} ({slab.status})
                </label>
              </div>
            )
          )
        ) : (
          <p className="text-gray-500">No slabs are ready for polishing.</p>
        )}
      </div>

      {/* ✅ Machine & In Time */}
      <div className="border p-3 rounded-lg bg-white space-y-3">
        <div>
          <Label>Machine</Label>
          <EntityCombobox
            entities={machines}
            multiple={false}
            value={selectedMachineId}
            onChange={(value) => setSelectedMachineId(value as string)}
            displayProperty="label"
            valueProperty="value"
            placeholder="Select Machine"
            onAddNew={() =>
              window.open(
                `/${organizationId}/${factoryid}/factorymanagement/machines/createnew`
              )
            }
            addNewLabel={"Add New"}
          />
        </div>

        <div>
          <Label>In Time (Date & Time)</Label>
          <Input
            type="datetime-local"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
          />
        </div>
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
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white"
        >
          {isLoading ? "Processing..." : "Send for Polishing"}
        </Button>
      </div>
    </form>
  );
};

export default SendForPolish;
