"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Edit2, Eye, MoreHorizontal, Trash } from "lucide-react";
import React from "react";
import { Alert } from "@/components/forms/Alert";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { FinishedMaterial } from "../page";
import { MarkPaidForm } from "@/components/forms/MarkPaidForm";

interface Props {
  data: FinishedMaterial;
  polish?: boolean;
}

export const CellAction: React.FC<Props> = ({ data, polish }) => {
  const GlobalModal = useGlobalModal();
  const deleteSlab = async () => {
    try {
      const result = await deleteData(
        `/factory-management/inventory/finished/delete/${data._id}`
      ); // Replace 'your-delete-endpoint' with the actual DELETE endpoint
      toast.success("Slab Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const router = useRouter();
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
              router.push(`./processing/view/${data._id}`);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Product Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = "Do you want to mark this slabs as paid?";
              GlobalModal.description =
                "Are you sure you want to mark this slab as paid?";
              GlobalModal.children = (
                <MarkPaidForm
                  selectedSlabs={[{ slabId: data._id }]}
                  polish={polish}
                />
              );

              GlobalModal.onOpen();
            }}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Mark Paid
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Slab - ${data.slabNumber}`;
              GlobalModal.description =
                "Are you sure you want to delete this Slab?";
              GlobalModal.children = (
                <Alert onConfirm={deleteSlab} actionType={"delete"} />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Slab
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
