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
import { expense } from "../page";

interface Props {
    data: expense
}


export const CellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();

    const deleteLot = async () => {
        try {
            const result = await deleteData(`/factory-management/inventory/lot/delete/${data._id}`);
            toast.success('Lot Deleted Successfully');
            GlobalModal.onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
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
                    {/* View Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            router.push(`./Expenses/view/${data._id}`);
                        }}
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Expense Details
                    </DropdownMenuItem>

                    {/* Edit Expense Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = "Edit Expense Details"; // Set modal title
                            // GlobalModal.children = <EditExpenseForm params={{ _id: data._id }} />; // Render Edit Form
                            GlobalModal.onOpen();
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Expense Details
                    </DropdownMenuItem>

                    {/* Delete Lot */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete expense details - ${data.expenseName}`;
                            GlobalModal.description =
                                "Are you sure you want to delete this Lot?";
                            GlobalModal.children = <Alert onConfirm={deleteLot} actionType={"delete"} />;
                            GlobalModal.onOpen();
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Expense Details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellAction;
