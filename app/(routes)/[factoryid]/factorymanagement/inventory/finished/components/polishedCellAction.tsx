"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, EyeIcon, MoreHorizontal, ScissorsIcon, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from 'react-hot-toast';
import { deleteData } from '@/axiosUtility/api';
// import CardWithForm from "./editTrimValues";
export type Slab = {
    _id: string;
    slabNumber: number;
    blockId: string | null;
    blockNumber: number;
    blockLotName?: string;
    factoryId: string;
    materialType?: string;
    productName: string;
    quantity: number;
    dimensions: {
        thickness: {
            value: number;
            units: string;
        };
        length: {
            value: number;
            units: string;
        };
        breadth: {
            value: number;
            units: string;
        };
        height: {
            value: number;
            units: string;
        };
    };
    trim: {
        length: {
            units: string;
        };
        height: {
            units: string;
        };
    };
    isActive?: boolean;
    weight?: string;
    height?: string;
    breadth?: string;
    length?: string;
    volume?: string;
    status: string;
    inStock: boolean;
    createdAt: string;
    updatedAt: string;
};


interface Props {
    data: Slab;
}

export const PolishedCellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();
    const deleteSlab = async () => {

        try {
            const result = await deleteData(`/factory-management/inventory/finished/delete/${data._id}`); // Replace 'your-delete-endpoint' with the actual DELETE endpoint

            toast.success('Slab Deleted Successfully')
            GlobalModal.onClose()
            window.location.reload()
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }


    return (
        <div>
            {/* Dropdown Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="gap-2" align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* <DropdownMenuItem
                        // onSelect={() => {
                        //     router.push(`./polishing/${data._id}/markpolish`);
                        // }}
                        onSelect={() => {
                            GlobalModal.title = `Edit triming Values`
                            GlobalModal.children = <CardWithForm params={{
                                id: data._id
                            }} />
                            GlobalModal.onOpen()
                        }}
                        
                    >
                        <ScissorsIcon className="mr-2 h-4 w-4" />
                        Edit Trim Values
                    </DropdownMenuItem> */}

                    {/* View Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./processing/slabs/view/${data._id}`);
                        }}
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Slab Details
                    </DropdownMenuItem>



                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default PolishedCellAction;
