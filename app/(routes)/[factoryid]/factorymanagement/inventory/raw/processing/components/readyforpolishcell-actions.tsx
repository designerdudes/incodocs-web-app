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
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Block } from "././incuttingcolumns";
import SendForPolish from "./sendForPolsih";
interface Slab {
  _id: string;
  slabNumber: number;
  status: string;
  blockId: string;
  createdAt: string;
  updatedAt: string;
}
interface Props {
  data: Block;
}

export const ReadyforpolishCellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();
  const readyForPolishSlabs = data.SlabsId.filter((slab: Slab) => slab.status === "readyForPolish");


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
              GlobalModal.title = `Send Slabs for Polishing of Block: ${data.blockNumber}`;
              GlobalModal.description = `There are ${readyForPolishSlabs.length} slabs in this block. Select the number of slabs you want to send for polishing.`;
              GlobalModal.children = (
                <SendForPolish
                  blockId={data._id}
                  // totalSlabs={data.SlabsId.length}
                  onConfirm={(selectedSlabs) => {
                    console.log(
                      `Sending ${selectedSlabs} slabs for polishing.`
                    );
                  }}
                />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-green-500 focus:text-destructive-foreground"
          >
            <ScissorsIcon className="mr-2 h-4 w-4" />
            Send For Polish
          </DropdownMenuItem>

          {/* View Lot Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(`./processing/blocks/view/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Block Details
          </DropdownMenuItem>

          {/* Edit Lot Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(`./processing/edit/${data._id}`);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Block Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
