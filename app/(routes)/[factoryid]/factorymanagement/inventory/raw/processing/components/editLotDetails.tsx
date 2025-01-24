"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { Plus } from 'lucide-react';

const EditLotDetailsForm: React.FC = () => {
  const [slabs, setSlabs] = useState<number[]>([0]); 
  const [newSlabCount, setNewSlabCount] = useState<number>(1); 

 
  const addSlab = () => {
    if (newSlabCount <= 0) return;
    setSlabs((prevSlabs) => [...prevSlabs, newSlabCount]);
    setNewSlabCount(1);
  };


  const deleteSlab = (index: number) => {
    setSlabs((prevSlabs) => prevSlabs.filter((_, i) => i !== index));
  };

 
  const saveSlabs = () => {
    console.log("Updated slab numbers:", slabs);
    alert("Slab numbers updated successfully!");
  };

  return (
    <div>
      <h2 className="text-lg  mb-4">Edit or Add Number of Slabs</h2>
      <div className="space-y-4">
        {/* Display slabs */}
        {slabs.map((slab, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>Slab {index + 1}</span>
            <Button
              variant="destructive"
              onClick={() => deleteSlab(index)}
              className="text-sm"
            >
            <Trash />
            </Button>
          </div>
        ))}

        {/* Add new slab */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={newSlabCount}
            onChange={(e) => setNewSlabCount(Number(e.target.value))}
            placeholder="Enter number of slabs"
          />
          <Button onClick={addSlab}> <Plus /></Button>
        </div>

        {/* Save slabs */}
        <Button onClick={saveSlabs} className="w-half mt-4">
        Submit
        </Button>
      </div>
    </div>
  );
};

export default EditLotDetailsForm;
