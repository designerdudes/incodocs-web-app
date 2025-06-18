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
import { EyeIcon, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { deleteData } from "@/axiosUtility/api";
import { Alert } from "@/components/forms/Alert";
import toast from "react-hot-toast";
import { Row } from "@tanstack/react-table"; // Ensure this import exists
import { Shipment } from "../data/schema";
import { ShipmentLogs } from "@/components/shipmentLogs";

interface props {
  row: Row<Shipment>;
}

export function DataTableCellActions({ row }: props) {
  const router = useRouter();
  const GlobalModal = useGlobalModal();

  const shipmentData = row.original; // Extract row data
  const shipmentId = shipmentData._id; // Ensure ID is available

  // Delete shipment function
  const deleteShipment = async () => {
    if (!shipmentId) {
      console.error("Error: Shipment ID is undefined.");
      toast.error("Error: Shipment ID is missing.");
      return;
    }

    try {
      console.log(`Deleting shipment with ID: ${shipmentId}`);
      const result = await deleteData(`/shipment/delete/${shipmentId}`);
      console.log("Delete response:", result);
      toast.success("Shipment Deleted Successfully");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Failed to delete shipment");
    }
  };

  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={() => setOpen(!open)}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="gap-2" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View Shipment */}
          <DropdownMenuItem
            onClick={() => router.push(`./shipment/view/${shipmentId}`)}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Shipment
          </DropdownMenuItem>

          {/* Edit Shipment */}
          {/* <DropdownMenuItem
            onClick={() => router.push(`./shipment/edit/${shipmentId}`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Shipment
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <a
              href={`./shipment/edit/${shipmentId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Shipment
            </a>
          </DropdownMenuItem>

          {/* <DropdownMenuItem
          onSelect={() => {
            setOpen(false)
          }}
          > */}

          <ShipmentLogs isView={false} logs={row.original.shipmentLogs} />
          {/* </DropdownMenuItem> */}

          {/* Delete Shipment */}
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = "Delete shipment";
              GlobalModal.description =
                "Are you sure you want to delete this Shipment?";
              GlobalModal.children = (
                <Alert onConfirm={deleteShipment} actionType={"delete"} />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Shipment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
