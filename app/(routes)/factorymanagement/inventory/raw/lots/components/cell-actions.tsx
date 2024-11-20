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
import { Edit, EyeIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import toast from 'react-hot-toast';
import { deleteData } from '@/axiosUtility/api';
import { LotManagement } from "./columns";
import EditLotForm from "./editLotForm";

interface Props {
    data: LotManagement;
}

export const CellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();
    const modal = useGlobalModal();

    const deleteLot = async () => {
        try {
            const result = await deleteData(`/categories/v1/category/${data._id}`);
            toast.success('Lot Deleted Successfully');
            GlobalModal.onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const addBlock = () => {
        modal.title = "Add New Lot"; // Set the modal title
        modal.children = (
            <div>
                {/* Replace this with your Add Lot form */}
                <p>Add Lot form goes here</p>
            </div>
        );
        modal.onOpen();
    };

    return (
        <div>
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

                    {/* Add Lot */}
                    <DropdownMenuItem
                        onSelect={addBlock} // Trigger add lot modal
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Block
                    </DropdownMenuItem>

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
                            modal.title = "Edit Lot Details"; // Set modal title
                            modal.children = <EditLotForm />; // Render Edit Form
                            modal.onOpen();
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Lot Details
                    </DropdownMenuItem>

                    {/* Delete Lot */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Product - ${data.lotname}`;
                            GlobalModal.description =
                                "Are you sure you want to delete this Product?";
                            GlobalModal.children = <Alert onConfirm={deleteLot} />;
                            GlobalModal.onOpen();
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Product
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellAction;
