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
import { Alert } from "@/components/forms/Alert";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import EditTeamMemberForm from "./EditTeamMemberForm";
import { Employee } from "./columns";


interface Props {
  data: Employee;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();


  const deleteEmployee = async () => {
    try {
      const result = await deleteData(`/employers/delete/${data._id}`);
      toast.success("Employee Deleted Successfully");
      GlobalModal.onClose();
      router.back();
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

          {/* View  Details */}
          <DropdownMenuItem
            onClick={() => router.push(`./teamManagement/view/${data._id}`)}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Team Details
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onSelect={() => {
              // router.push(`./dashboard/view/${data._id}`);
              <EmployeeViewPage params={{ _id: data._id }}
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Team Details
          </DropdownMenuItem> */}

          {/* Edit  Details */}
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = "Edit Team Member Details"; // Set modal title
              GlobalModal.children = (
                <EditTeamMemberForm params={{ _id: data._id }} />
              ); // Render Edit Form
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Team Member Details
          </DropdownMenuItem>

          {/* Delete  */}
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Member - ${data.fullName}`;
              GlobalModal.description =
                "Are you sure you want to delete this member?";
              GlobalModal.children = (
                <Alert onConfirm={deleteEmployee} actionType={"delete"} />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
