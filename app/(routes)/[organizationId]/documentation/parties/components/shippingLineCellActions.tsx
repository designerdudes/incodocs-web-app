"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useParams } from "next/navigation";
import {
  Edit,
  EyeIcon,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { ShippingLine } from "./shippingLineColumn";
import { Alert } from "@/components/forms/Alert";
import EditShippingLineForm from "./EditShippingLine";

interface Props {
  data: ShippingLine;
}

const ShippingLineCellActions: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const params = useParams(); // Get dynamic route parameters
  const organizationId = params.organizationId as string; // Extract organizationId from the current URL
  const GlobalModal = useGlobalModal();

  const deleteShippingLine = async () => {
    try {
      const result = await deleteData(
        `https://incodocs-server.onrender.com/shipment/shippingline/delete/${data._id}`
      );
      toast.success("Shipping Line Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Error deleting shipping line");
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              router.push(
                `/${organizationId}/documentation/parties/edit-parties/shipping-line?shippinglineId=${data._id}`
              );
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Shipping-Line
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              // Navigate to the Shipping Line view page, including organizationId
              router.push(`/${organizationId}/documentation/parties/shippingline/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Shipping Line
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Shipping Line - ${data.shippingLineName}`;
              GlobalModal.description =
                "Are you sure you want to delete this shipping line?";
              GlobalModal.children = (
                <Alert onConfirm={deleteShippingLine} actionType={"delete"} />
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

export default ShippingLineCellActions;