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
import EditTransporterForm from "./EditTransporterForm"; // Import the EditTransporterForm component

interface Transporter {
  _id: string;
  transporterName: string;
  address: string;
  responsiblePerson: string;
  email: string;
  mobileNo: string;
}

interface Props {
  data: Transporter;
}

const TransporterCellActions: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();

  const deleteTransporter = async () => {
    try {
      const result = await deleteData(
        `https://incodocs-server.onrender.com/shipment/transporter/delete/${data._id}`
      );
      toast.success("Transporter Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting transporter:", error);
      toast.error("Error deleting transporter");
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
              GlobalModal.title = `Edit Transporter - ${data.transporterName}`;
              GlobalModal.description = "Update the details of the transporter below.";
              GlobalModal.children = (
                <EditTransporterForm params={{ _id: data._id }} />
              );
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Transporter
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Transporter - ${data.transporterName}`;
              GlobalModal.description =
                "Are you sure you want to delete this transporter?";
              GlobalModal.children = (
                <Alert onConfirm={deleteTransporter} actionType={"delete"} />
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

export default TransporterCellActions;