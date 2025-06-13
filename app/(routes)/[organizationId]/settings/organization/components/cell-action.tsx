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
import { Edit, EyeIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { Organization } from "../page";
import EditOrganizationForm from "./editOrganizationForm";

interface Props {
  data: Organization;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();

  const handleOtpSubmit = async () => {
    try {
      await deleteData(`/organizations/delete/${data._id}`);
      toast.success("otp sent successfully, please verify to continue");
    } catch (error) {
      toast.error("error sending otp");
      console.error("Error sending OTP:", error);
    }
  };

  const OtpInput = () => {
    const [otp, setOtp] = React.useState("");

    const handleSubmit = async () => {
      if (otp.length !== 6) {
        toast.error("Please enter a 6-digit OTP");
        return;
      }
      try {
        await deleteData(`/organizations/verifyotp-anddelete/${data._id}`, {
          data: { otp: parseInt(otp) },
        });
        toast.success("Organization deleted successfully");
        GlobalModal.onClose();
        router.push("/dashboard");
      } catch (error) {
        console.error("Error deleting data:", error);
        toast.error("Failed to delete organization");
      }
    };

    return (
      <div className="w-full space-y-4">
        <input
          type="text"
          max={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="● ● ● ● ● ●"
          className="w-full rounded px-4 py-2 text-center text-xl"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Confirm Delete
        </button>
      </div>
    );
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
              GlobalModal.title = "Edit Organization Details"; // Set modal title
              GlobalModal.children = (
                <EditOrganizationForm params={{ _id: data._id }} />
              ); // Render Edit Form
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Organization Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={async () => {
              GlobalModal.title = `Confirm OTP`;
              GlobalModal.description =
                "Enter the OTP to delete this organization";
              GlobalModal.children = (() => {
                handleOtpSubmit();
                return <OtpInput />;
              })();
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            Delete Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
