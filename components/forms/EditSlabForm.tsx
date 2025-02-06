// EditSlabsForm.tsx (Client Component)
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface Slab {
    _id: string;
    slabNumber: number;
    length: number;
    height: number;
}

interface EditSlabsFormProps {
    blockId: string;
    initialSlabs: Slab[];
}

const EditSlabsForm: React.FC<EditSlabsFormProps> = ({ blockId, initialSlabs }) => {
    const [slabs, setSlabs] = useState<Slab[]>(initialSlabs);

    const handleAddSlab = () => {
        const newSlab: Slab = {
            _id: Math.random().toString(36).substr(2, 9),
            slabNumber: slabs.length + 1,
            length: 0,
            height: 0,
        };
        setSlabs([...slabs, newSlab]);
    };

    const handleDeleteSlab = (id: string) => {
        setSlabs(slabs.filter(slab => slab._id !== id));
    };

    const handleChange = (id: string, field: 'length' | 'height', value: number) => {
        setSlabs(slabs.map(slab => (slab._id === id ? { ...slab, [field]: value } : slab)));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Edit Slabs</h2>
            <Separator />
            {slabs.map(slab => (
                <div key={slab._id} className="flex items-center gap-4">
                    <span className="font-semibold">Slab {slab.slabNumber}</span>
                    <Input
                        type="number"
                        value={slab.length}
                        onChange={e => handleChange(slab._id, 'length', Number(e.target.value))}
                        placeholder="Length"
                    />
                    <Input
                        type="number"
                        value={slab.height}
                        onChange={e => handleChange(slab._id, 'height', Number(e.target.value))}
                        placeholder="Height"
                    />
                    <Button onClick={() => handleDeleteSlab(slab._id)} variant="destructive">
                        Delete
                    </Button>
                </div>
            ))}
            <Button onClick={handleAddSlab} variant="default">Add Slab</Button>
        </div>
    );
};

export default EditSlabsForm;