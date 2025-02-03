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
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import EditBlockForm from "./editBlockForm";

interface Props {
  data: any;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();

  const deleteLot = async () => {
    try {
      await deleteData(`/factory-management/inventory/raw/delete/${data._id}`);
      toast.success("Block Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const [cuttingData, setCuttingData] = React.useState({
    blocks: "",
    width: "",
    height: "",
  });

  const sendForCutting = async () => {
    try {
      const result = await putData(
        `/factory-management/inventory/raw/put/${data._id}`,
        { status: "inCutting" }
      );
      toast.success("Block send for cutting Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error While ssending Block send for cutting:", error);
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
          {data.status === "inStock" && (
            <DropdownMenuItem
              onSelect={() => {
                GlobalModal.title = `Send Block for Cutting - ${data.blockNumber}`;
                GlobalModal.description =
                  "Are you sure you want to send this Block for cutting?";
                GlobalModal.children = (
                  <Alert
                    onConfirm={sendForCutting}
                    actionType="cut" // Pass the action type
                  />
                );
                GlobalModal.onOpen();
              }}
              className="focus:bg-green-500 focus:text-destructive-foreground"
            >
              <ScissorsIcon className="mr-2 h-4 w-4" />
              Send For Cutting
            </DropdownMenuItem>
          )}

          {/* View Lot Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(`..//block/${data._id}/slabs`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Block Details
          </DropdownMenuItem>
          {/* Edit Lot Details */}
          {data.status !== "cut" && (
            <DropdownMenuItem
              onSelect={() => {
                GlobalModal.title = "Edit Block Details"; // Set modal title
                GlobalModal.children = (
                  <EditBlockForm params={{ _id: data._id }} />
                ); // Render Edit Form
                GlobalModal.onOpen();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Block Details
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Block - ${data.blockNumber}`;
              GlobalModal.description =
                "Are you sure you want to delete this Block?";
              GlobalModal.children = (
                <Alert
                  onConfirm={deleteLot}
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
