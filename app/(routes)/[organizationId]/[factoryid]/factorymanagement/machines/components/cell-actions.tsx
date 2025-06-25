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
import { Machine } from "../page";



interface Props {
    data: Machine;
}

const CellActions: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();
    const deleteMachine = async () => {
        try {
            const result = await deleteData(
                `https://incodocs-server.onrender.com/machine/delete/${data._id}` // Placeholder endpoint
            );
            toast.success("Machine Deleted Successfully");
            window.location.reload();
            GlobalModal.onClose();
        } catch (error) {
            toast.error("Error deleting Machine");
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
                        onClick={() => router.push(`./machines/AddLogMaintenance/${data._id}`)}
                        className="focus:bg-green-500 focus:text-destructive-foreground"
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Add Log Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`./machines/Edit/${data._id}`)}
                        className="focus:bg-green-500 focus:text-destructive-foreground"
                    >
                        <Scissors className="mr-2 h-4 w-4" />
                        Edit Machine
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`./machines/View/${data._id}`)}
                        className="focus:bg-green-500 focus:text-destructive-foreground"
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Machine
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Machine - ${data?.machineName}`;
                            GlobalModal.description =
                                "Are you sure you want to delete this machine?";
                            GlobalModal.children = (
                                <Alert onConfirm={deleteMachine} actionType={"delete"} />
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