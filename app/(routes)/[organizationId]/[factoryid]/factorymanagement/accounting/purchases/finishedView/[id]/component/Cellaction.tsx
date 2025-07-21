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
  TrashIcon,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import EditFinishedBlock from "./EditFinishedBlock";

interface Props {
  data: any;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();
//   console.log("ssssaaa",data)
  const deleteSlab = async () => {
    try {
      await deleteData(`/factory-management/inventory/finished/delete/${data._id}`);
      toast.success("Slab Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
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
          {/* View Lot Details */}
          {/* <DropdownMenuItem
            onSelect={() => {
              router.push(`..//block/${data._id}/slabs`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Block Details
          </DropdownMenuItem> */}
          {/* Edit Lot Details */}
            <DropdownMenuItem
              onSelect={() => {
                GlobalModal.title = "Edit Slab Details"; // Set modal title
                GlobalModal.children = (
                  <EditFinishedBlock params={{ _id: data._id }} />
                ); // Render Edit Form
                GlobalModal.onOpen();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Slab Details
            </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Slab - ${data.slabNumber}`;
              GlobalModal.description =
                "Are you sure you want to delete this Slab?";
              GlobalModal.children = (
                <Alert
                  onConfirm={deleteSlab}
                  actionType="delete" // Pass the action type
                />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
