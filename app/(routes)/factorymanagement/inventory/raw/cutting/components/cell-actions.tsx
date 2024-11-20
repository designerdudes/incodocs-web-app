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
<<<<<<< HEAD
import { Edit, EyeIcon, MoreHorizontal, Trash } from "lucide-react";
=======
import { Edit, EyeIcon, MoreHorizontal, ScissorsIcon, Trash } from "lucide-react";
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import toast from 'react-hot-toast';
import { deleteData } from '@/axiosUtility/api';
<<<<<<< HEAD
import { LotManagement } from "../columns";
import EditLotForm from "./editLotForm";

interface Props {
    data: LotManagement;
=======
import { Block } from "./columns";

interface Props {
    data: Block;
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
}

export const CellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();
<<<<<<< HEAD
    const modal = useGlobalModal(); // Global modal hook
=======
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
    const deleteLot = async () => {

        try {
            const result = await deleteData(`/categories/v1/category/${data._id}`); // Replace 'your-delete-endpoint' with the actual DELETE endpoint

            toast.success('Lot Deleted Successfully')
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
<<<<<<< HEAD
=======
                    {/* View Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./cutting/${data._id}/markcut`);
                        }}
                    >
                        <ScissorsIcon className="mr-2 h-4 w-4" />
                        Mark Cut
                    </DropdownMenuItem>
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71

                    {/* View Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./${data._id}/blocks`);
                        }}
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Lot Details
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
<<<<<<< HEAD
                            GlobalModal.title = `Delete Product - ${data.lotname}`
=======
                            GlobalModal.title = `Delete Product - ${data.blockNumber}`
>>>>>>> 7cfcf61b7cbe42e5606d4dd9e1a4049ebfeaaf71
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

export default CellAction;
