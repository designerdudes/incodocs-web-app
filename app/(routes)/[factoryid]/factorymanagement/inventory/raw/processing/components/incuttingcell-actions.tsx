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
import { Alert } from "@/components/forms/Alert";
import toast from 'react-hot-toast';
import { deleteData } from '@/axiosUtility/api';
import { Block } from "./incuttingcolumns";

interface Props {
    data: Block;
}

const        IncuttingCellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();
    const deleteLot = async () => {

        try {
            const result = await deleteData(`/factory-management/inventory/raw/delete/${data._id}`); // Replace 'your-delete-endpoint' with the actual DELETE endpoint

            toast.success('Slab Deleted Successfully')
            GlobalModal.onClose()
            window.location.reload()
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    console.log("this is id", data._id)

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
                    {/* Mark cut */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./processing/cutting/${data._id}/markcut`);
                        }}
                    >
                        <ScissorsIcon className="mr-2 h-4 w-4" />
                        Mark Cut
                    </DropdownMenuItem>

                    {/* View Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./processing/blocks/view/${data._id}`);
                        }}
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Block Details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default IncuttingCellAction;