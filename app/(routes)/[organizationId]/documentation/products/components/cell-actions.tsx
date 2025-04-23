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
import {
    Edit,
    EyeIcon,
    MoreHorizontal,
    Scissors,
    ScissorsIcon,
    Trash,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { Alert } from "@/components/forms/Alert";
import { Product } from "../page";



interface Props {
    data: Product;
}

const CellActions: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();

    const deleteConsignee = async () => {
        try {
            const result = await deleteData(
                `https://incodocs-server.onrender.com/shipment/consignee/delete/${data.code}` // Placeholder endpoint
            );
            toast.success("Consignee Deleted Successfully");
            GlobalModal.onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error deleting consignee:", error);
            toast.error("Error deleting consignee");
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
                    
                    <DropdownMenuItem
                                onClick={() => router.push(`./products/Edit/${data._id}`)}
                                className="focus:bg-green-500 focus:text-destructive-foreground"
                              >
                                <Scissors className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Consignee - ${data.code}`;
                            GlobalModal.description =
                                "Are you sure you want to delete this consignee?";
                            GlobalModal.children = (
                                <Alert onConfirm={deleteConsignee} actionType={"delete"} />
                            );
                            GlobalModal.onOpen();
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellActions;