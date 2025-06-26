"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useParams } from "next/navigation";
import {
  Edit,
  EyeIcon,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { Alert } from "@/components/forms/Alert";
import { Machine } from "./MachineDetailsColumns";

interface Props {
    data: Machine;
}

const MachineDetailsCellAction: React.FC<Props> = ({ data }) => {
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
          {/* <DropdownMenuItem
            onSelect={() => {
              // Open the EditShippingLine form in a modal
              GlobalModal.title = `Edit Shipping Line - ${data.shippingLineName}`;
              GlobalModal.description = "Update the details of the shipping line below.";
              GlobalModal.children = (
                <EditShippingLineForm params={{ _id: data._id }} />
              );
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Shipping Line
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem
            onSelect={() => {
              // Navigate to the Shipping Line view page, including organizationId
              router.push(`/${organizationId}/documentation/parties/shippingline/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Shipping Line
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Shipping Line - ${data.machineName}`;
              GlobalModal.description =
                "Are you sure you want to delete this shipping line?";
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

export default MachineDetailsCellAction;