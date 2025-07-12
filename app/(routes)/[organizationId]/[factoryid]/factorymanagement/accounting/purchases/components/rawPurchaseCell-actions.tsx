"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, EyeIcon, MoreHorizontal, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { RawPurchased } from "../page";

interface Props {
  data: RawPurchased;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();
  const params = useParams();

  const organizationId = params.organizationId as string;
  
  // ✅ Fallback: If factoryId not in URL, try from data
  const factoryId = useParams().factoryid as string;

  const deleteBlock = async () => {
    try {
      await deleteData(`/transaction/purchase/deleteraw/${data._id}`);
      toast.success("Purchase Deleted Successfully");
      GlobalModal.onClose();
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

          {/* View Lot Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(`./purchases/rawView/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Purchase Details
          </DropdownMenuItem>

          {/* Edit Lot Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(
                `/${organizationId}/${factoryId}/factorymanagement/accounting/purchases/EditPurchases/RawPurchases?RawPurchasesId=${data._id}`
              );
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Purchase Details
          </DropdownMenuItem>

          {/* Delete Lot */}
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Purchase Details - ${data?.supplierId?.supplierName}`;
              GlobalModal.description =
                "Are you sure you want to delete this Supplier?";
              GlobalModal.children = (
                <Alert onConfirm={deleteBlock} actionType={"delete"} />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Purchase Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
