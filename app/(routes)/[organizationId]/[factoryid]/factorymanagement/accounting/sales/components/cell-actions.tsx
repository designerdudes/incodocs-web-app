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
import { Sales } from "../page";
import EditSalesForm from "./editSales"


interface Props {
    data: Sales;
}

export const CellAction: React.FC<Props> = ({ data }) => {
    // console.log("dddddddddddd",data)
    const router = useRouter();
    const GlobalModal = useGlobalModal();

    const deleteSale = async () => {
        try {
            const result = await deleteData(`https://incodocs-server.onrender.com/transaction/sale/deletesale/${data._id}`);
            toast.success('Slab Deleted Successfully');
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
                            router.push(`./sales/view/${data._id}`);
                        }}
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Sale Details
                    </DropdownMenuItem>

                    {/* Edit Lot Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = "Edit Lot Details"; // Set modal title
                            GlobalModal.children = <EditSalesForm params={{ _id: data._id }} />; // Render Edit Form
                            GlobalModal.onOpen();
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Sale Details
                    </DropdownMenuItem>

                    {/* Delete Lot */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Sale Details - ${data?.customerId?.customerName}`;
                            GlobalModal.description =
                                "Are you sure you want to delete this Lot?";
                            GlobalModal.children = <Alert onConfirm={deleteSale} actionType={"delete"} />;
                            GlobalModal.onOpen();
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Sale Details
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellAction;
