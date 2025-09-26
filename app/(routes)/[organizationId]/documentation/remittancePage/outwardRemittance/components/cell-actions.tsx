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
import { Remittance } from "../data/schema";

interface Props {
  row: Row<Remittance>;
}

export function DataTableCellActions({ row }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const GlobalModal = useGlobalModal();


  const data = row.original as any;
  const id = data._id; // Use the same ID for draft or shipment

  const deleteEntity = async () => {
    if (!id) return toast.error("ID is missing");
    try {
      const endpoint = `/remittance/delete/${id}`;
      await deleteData(endpoint);
      toast.success(`Remittance deleted successfully`);

    } catch {
      toast.error(`Failed to delete Remittance`);
    }
  };

  const viewPath = `./outwardRemittance/view/${data?.consigneeId?._id}`;
  const editPath = `./outwardRemittance/edit/${id}`;

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
        {!pathname.includes('outwardRemittance/view') &&
          <DropdownMenuItem asChild>
            <a href={viewPath}>
              <EyeIcon className="mr-2 h-4 w-4" />
              {"View All Consignee Remittances"}
            </a>
          </DropdownMenuItem>}

        <DropdownMenuItem asChild>
          <a href={editPath} target="_blank" rel="noopener noreferrer">
            <Pencil className="mr-2 h-4 w-4" />
            {"Edit Remittance"}
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            GlobalModal.title = `Delete Remittance`;
            GlobalModal.description = `Are you sure you want to delete this Remittance`;
            GlobalModal.children = <Alert onConfirm={deleteEntity} actionType="delete" />;
            GlobalModal.onOpen();
          }}
          className="focus:bg-destructive focus:text-destructive-foreground"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Remittance
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
