"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { deleteData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

interface Slab {
  height: string | number | readonly string[] | undefined;
  _id: string;
  slabNumber: number;
  dimensions: {
    length: {
        value:number,
    }
    height:{
        value:number,
    }
  };
}

interface EditSlabsFormProps {
  blockId: string;
  initialSlabs: Slab[];
  params: {
    id: string;
  };
}

const EditSlabsForm: React.FC<EditSlabsFormProps> = ({
  blockId,
  initialSlabs,
  params,
}) => {
  const [slabs, setSlabs] = useState<Slab[]>(initialSlabs);
  const [blockData, setBlockData] = useState<any>(null);
  const GlobalModal = useGlobalModal();


  useEffect(() => {
    const fetchBlockData = async () => {
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("AccessToken="))
          ?.split("=")[1] || "";

      try {
        const response = await fetch(
          `http://localhost:4080/factory-management/inventory/raw/get/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch block data");

        const data = await response.json();
        setBlockData(data);
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };
   

    fetchBlockData();
  }, [params.id]);

  const handleAddSlab = () => {
    const newSlab: Slab = {
        _id: Math.random().toString(36).substr(2, 9),
        slabNumber: slabs.length + 1,
        dimensions: {
            length: {
                value: 0,
            },
            height: {
                value: 0,
            },
        },
        height: undefined
    };
    setSlabs([...slabs, newSlab]);
  };

  const deleteSlab = async (id: any) => {
    try {
        const result = await deleteData(`/factory-management/inventory/finished/delete/${id}`); // Replace 'your-delete-endpoint' with the actual DELETE endpoint
        toast.success('Slab Deleted Successfully')
        GlobalModal.onClose()
        window.location.reload()
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}


  const handleChange = (
    id: string,
    field: "length" | "height",
    value: number
  ) => {
    setSlabs(
      slabs.map((slab) =>
        slab._id === id ? { ...slab, [field]: value } : slab
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Edit Slabs</h2>
      <Separator />
      {slabs.map((slab) => (
        <div key={slab._id} className="flex items-center gap-4">
          <span className="font-semibold">Slab {slab.slabNumber}</span>
          <Input
            type="number"
            value={slab.dimensions?.length?.value}
            onChange={(e) =>
              handleChange(slab._id, "length", Number(e.target.value))
            }
            placeholder="Length"
          />
          <Input
            type="number"
            value={slab.dimensions?.height?.value}
            onChange={(e) =>
              handleChange(slab._id, "height", Number(e.target.value))
            }
            placeholder="Height"
          />
          <Button
            onClick={() => deleteSlab(slab._id)}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      ))}
      <Button onClick={handleAddSlab} variant="default">
        Add Slab
      </Button>
    </div>
  );
};

export default EditSlabsForm;
