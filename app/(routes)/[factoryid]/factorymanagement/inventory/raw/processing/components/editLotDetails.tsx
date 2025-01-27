"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Plus } from 'lucide-react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

const formSchema = z.object({
    trim: z.object({
        length: z.object({
            value: z
                .number()
                .min(0.1, { message: "Length must be greater than zero" }),
            units: z.literal("inch").default("inch"),
        }),
        height: z.object({
            value: z
                .number()
                .min(0.1, { message: "Height must be greater than zero" }),
            units: z.literal("inch").default("inch"),
        }),
    }),
});

interface Props {
    params: { id: string };
}

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
      <h2 className="text-lg  mb-4">Edit Number of slabs of blockNumber</h2>
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
