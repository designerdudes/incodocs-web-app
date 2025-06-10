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
import { Edit, EyeIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { Organization } from "../page"
import EditOrganizationForm from "./editOrganizationForm";

interface Props {
    data: Organization;
}

export const CellAction: React.FC<Props> = ({ data }) => {
    const router = useRouter();
    const GlobalModal = useGlobalModal();

    const deleteOrganization = async () => {
        try {
            const result = await deleteData(
                `organizations/delete/${data._id}`
            );
            toast.success("organization Deleted Successfully");
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
                    {/* Edit organization Details */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = "Edit Organization Details"; // Set modal title
                            GlobalModal.children = <EditOrganizationForm params={{ _id: data._id }} />; // Render Edit Form
                            GlobalModal.onOpen();
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Organization Details
                    </DropdownMenuItem>

                    {/* Delete organization */}
                    <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Organization - ${data.organizationName}`;
                            GlobalModal.description =
                                "Are you sure you want to delete this organization?";
                            GlobalModal.children = (
                                <Alert onConfirm={deleteOrganization} actionType={"delete"} />
                            );
                            GlobalModal.onOpen();
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Organization
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CellAction;
