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
import EditSupplierForm from "./EditSupplier";

interface Supplier {
  _id: string;
  supplierName: string;
  address: string;
  responsiblePerson: string;
  mobileNumber: string;
  state: string;
  factoryAddress: string;
}

interface Props {
  data: Supplier;
}

const SupplierCellActions: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.organizationId as string;
  const GlobalModal = useGlobalModal();

  const deleteSupplier = async () => {
    try {
      const result = await deleteData(
        `https://incodocs-server.onrender.com/shipment/supplier/delete/${data._id}`
      );
      toast.success("Supplier Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Error deleting supplier");
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
              router.push(
                `/${organizationId}/documentation/parties/edit-parties/supplier?supplierId=${data._id}`
              );
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Supplier
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/${organizationId}/documentation/parties/supplier/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Supplier
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Supplier - ${data.supplierName}`;
              GlobalModal.description =
                "Are you sure you want to delete this supplier?";
              GlobalModal.children = (
                <Alert onConfirm={deleteSupplier} actionType={"delete"} />
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

export default SupplierCellActions;