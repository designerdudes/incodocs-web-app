"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { Row } from "@tanstack/react-table";
import { Shipment } from "../data/schema";
import { ShipmentLogs } from "@/components/shipmentLogs";

interface Props {
  row: Row<Shipment>;
}

export function DataTableCellActions({ row }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const GlobalModal = useGlobalModal();

  const isDraftPage = pathname.includes("/draft");
  const data = row.original;
  const id = data._id; // Use the same ID for draft or shipment

  const deleteEntity = async () => {
    if (!id) return toast.error("ID is missing");
    try {
      const endpoint = isDraftPage
        ? `/shipmentdrafts/delete/${id}`
        : `/shipment/delete/${id}`;
      await deleteData(endpoint);
      toast.success(`${isDraftPage ? "Draft" : "Shipment"} deleted successfully`);
      router.refresh();
    } catch {
      toast.error(`Failed to delete ${isDraftPage ? "draft" : "shipment"}`);
    }
  };

  const viewPath = isDraftPage
    ? `./drafts/view/${id}`
    : `./shipment/view/${id}`;
  const editPath = isDraftPage
    ? `./drafts/edit/${id}`
    : `./shipment/edit/${id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="gap-2">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(viewPath)}>
          <EyeIcon className="mr-2 h-4 w-4" />
          {isDraftPage ? "View Draft" : "View Shipment"}
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href={editPath} target="_blank" rel="noopener noreferrer">
            <Pencil className="mr-2 h-4 w-4" />
            {isDraftPage ? "Edit Draft" : "Edit Shipment"}
          </a>
        </DropdownMenuItem>

        {/* Only display logs for non-draft pages */}
        {!isDraftPage && (
          <ShipmentLogs
            isView={false}
            logs={(data as any).shipmentLogs}
          />
        )}

        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Delete ${isDraftPage ? "Draft" : "Shipment"}`;
            GlobalModal.description = `Are you sure you want to delete this ${
              isDraftPage ? "draft" : "shipment"
            }?`;
            GlobalModal.children = <Alert onConfirm={deleteEntity} actionType="delete" />;
            GlobalModal.onOpen();
          }}
          className="focus:bg-destructive focus:text-destructive-foreground"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete {isDraftPage ? "Draft" : "Shipment"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
