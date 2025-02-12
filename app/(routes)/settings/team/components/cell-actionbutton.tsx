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
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import EditTeamMember from "./EditTeamMember";
import { Employee } from "../page";


interface Props {
    data: Employee;
}

export const CellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();

    const deleteEmployee = async () => {
        try {
            const result = await deleteData(
                `/employers/delete/${data._id}`
            );
            toast.success("Employee Deleted Successfully");
            GlobalModal.onClose();
            router.back();
            window.location.reload();
        } catch (error) {
            console.error("Error deleting data:", error);
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
                    {/* Edit TeamMember Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = "Edit TeamMember Details"; // Set modal title
                            GlobalModal.children = <EditTeamMember params={{ _id: data._id }} />; // Render Edit Form
                            GlobalModal.onOpen();
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit TeamMember Details
                    </DropdownMenuItem>

                    {/* Delete factory */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Member - ${data.teamMemberName}`;
                            GlobalModal.description =
                                "Are you sure you want to delete this member?";
                            GlobalModal.children = (
                                <Alert onConfirm={deleteEmployee} actionType={"delete"} />
                            );
                            GlobalModal.onOpen();
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Member
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellAction;
