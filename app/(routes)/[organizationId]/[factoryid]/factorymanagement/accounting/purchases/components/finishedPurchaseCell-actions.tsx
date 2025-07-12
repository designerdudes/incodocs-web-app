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
import { Edit, EyeIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { FinishedPurchased } from "../page";
import EditFinishedForm from "./EditFinishedPurchase";

interface Props {
  data: FinishedPurchased;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.organizationId as string;
  const GlobalModal = useGlobalModal();
  const factoryId = useParams().factoryid as string;

  const deleteLot = async () => {
    try {
      const result = await deleteData(
        `/transaction/purchase/deleteslab/${data._id}`
      );
      toast.success("Slab Deleted Successfully");
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
              router.push(`./purchases/finishedView/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Purchase Details
          </DropdownMenuItem>

          <DropdownMenuItem
  onSelect={() => {
    router.push(
      `/${organizationId}/${factoryId}/factorymanagement/accounting/purchases/EditPurchases/FinishedPurchases?FinishedPurchaseId=${data._id}`
    );
  }}
>
  <Edit className="mr-2 h-4 w-4" />
  Edit Purchase Details
</DropdownMenuItem>


          {/* Delete Lot */}
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Purchase details - ${data.supplierId?.supplierName}`;
              GlobalModal.description =
                "Are you sure you want to delete Supplier ?";
              GlobalModal.children = (
                <Alert onConfirm={deleteLot} actionType={"delete"} />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Purchase details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
