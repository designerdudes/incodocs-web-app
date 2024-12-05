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

export const ReadyforpolishCellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();
    const deleteLot = async () => {

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
                    {/* View Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./cutting/${data._id}/markcut`);
                        }}
                    >
                        <ScissorsIcon className="mr-2 h-4 w-4" />
                        send to polish
                    </DropdownMenuItem>

                    {/* View Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./${data._id}/blocks`);
                        }}
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Block Details
                    </DropdownMenuItem>

                    {/* Edit Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            // modal.title = "Edit New Lot"; // Set the title of the modal
                            // modal.children = <EditLotForm />; // Set the content of the modal
                            // modal.onOpen();
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Lot Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Product - ${data.blockNumber}`
                            GlobalModal.description = "Are you sure you want to delete this Product?"
                            GlobalModal.children = <Alert onConfirm={deleteLot} />
                            GlobalModal.onOpen()
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Product</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

 