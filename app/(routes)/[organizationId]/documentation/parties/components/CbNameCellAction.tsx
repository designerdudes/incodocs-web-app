"use client";
import * as React from "react";
import { useRouter, useParams } from "next/navigation";
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
  Trash,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { Alert } from "@/components/forms/Alert";
import EditCBNameForm from "./forms/EditCbNameForm";

interface CbName {
  _id: string;
  cbName: string;
  cbCode: string;
  address: string;
  mobileNo: number;
  email: string;
  organizationId: string;
  portCode: string; // Added missing property
}

interface Props {
  data: CbName;
}

const CbNameCellActions: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.organizationId as string;
  const GlobalModal = useGlobalModal();

  const deleteCbName = async () => {
    try {
      await deleteData(
        `https://incodocs-server.onrender.com/shipment/cbname/delete/${data._id}`
      );
      toast.success("CbName Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting Cb Name:", error);
      toast.error("Error deleting Cb Name");
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
              GlobalModal.title = `Edit Cb Name - ${data.cbName}`;
              GlobalModal.description = "Update the details of the Cb Name below.";
              GlobalModal.children = (
                <EditCBNameForm
                  cbData={data}
                  onSuccess={() => {
                    GlobalModal.onClose();
                  }}
                />
              );
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Cb Name
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/${organizationId}/documentation/parties/cbname/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Cb Name
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Cb Name - ${data.cbName}`;
              GlobalModal.description = "Are you sure you want to delete this Cb Name?";
              GlobalModal.children = (
                <Alert onConfirm={deleteCbName} actionType={"delete"} />
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

export default CbNameCellActions;
