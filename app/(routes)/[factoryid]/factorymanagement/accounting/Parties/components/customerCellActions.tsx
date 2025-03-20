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
import EditCustomerForm from "./forms/CustomerEditForm";

interface Supplier {
  _id: string;
  customerName: string;
  gstNo: string;
  mobileNumber: number;
  state: string;
  address: string;
}

interface Props {
  data: Supplier;
}

const Customercellactions: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();

  const deleteCustomer = async () => {
    try {
      const result = await deleteData(
        `https://incodocs-server.onrender.com/accounting//customer/delete/${data._id}` // Placeholder endpoint
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
              GlobalModal.title = `Edit Customer - ${data.customerName}`;
              GlobalModal.description =
                "Update the details of the Customer below.";
              GlobalModal.children = (
                <EditCustomerForm params={{ _id: data._id }} />
              );
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Supplier - ${data.customerName}`;
              GlobalModal.description =
                "Are you sure you want to delete this Customer?";
              GlobalModal.children = (
                <Alert onConfirm={deleteCustomer} actionType={"delete"} />
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

export default Customercellactions;
