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
  ScissorsIcon,
  Trash,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { Alert } from "@/components/forms/Alert";
import EditForwarderForm from "./EditForwarderForm"; // Import the EditForwarderForm component

interface Forwarder {
  _id: string;
  forwarderName: string;
  address: string;
  responsiblePerson: string;
  email: string;
  mobileNo: string;
}

interface Props {
  data: Forwarder;
}

const ForwarderCellActions: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();

  const deleteForwarder = async () => {
    try {
      const result = await deleteData(
        `http://localhost:4080/shipment/forwarder/delete/${data._id}`
      );
      toast.success("Forwarder Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting forwarder:", error);
      toast.error("Error deleting forwarder");
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
            onSelect={() => {
              GlobalModal.title = `Edit Forwarder - ${data.forwarderName}`;
              GlobalModal.description = "Update the details of the forwarder below.";
              GlobalModal.children = (
                <EditForwarderForm params={{ _id: data._id }} />
              );
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Forwarder
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Forwarder - ${data.forwarderName}`;
              GlobalModal.description =
                "Are you sure you want to delete this forwarder?";
              GlobalModal.children = (
                <Alert onConfirm={deleteForwarder} actionType={"delete"} />
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

export default ForwarderCellActions;