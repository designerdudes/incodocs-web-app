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
import { Edit, EyeIcon, MoreHorizontal, ScissorsIcon, TrashIcon } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from 'react-hot-toast';
import { deleteData } from '@/axiosUtility/api';
import MarkDressForm from "@/components/forms/MarkDressForm";
import { Alert } from "@/components/forms/Alert";

interface Props {
  data: any;
}

const InDressingCellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();

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

          {/* ✅ Mark Dressed */}
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Mark Dressed - ${data.blockNumber}`;
              GlobalModal.children = (
                <MarkDressForm
                  parentBlockId={data._id}
                  netDimensions={data.netDimensions}
                  blockNumber={data.blockNumber}
                  // factoryId={data.factoryId}
                  onSubmit={() => GlobalModal.onClose()}
                  originalBlockVolume={0}
                />
              );
              GlobalModal.onOpen();
            }}
          >
            <ScissorsIcon className="mr-2 h-4 w-4" />
            Mark Dressed
          </DropdownMenuItem>

          {/* ✅ View Block Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(`./processing/blocks/view/${data._id}`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Block Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InDressingCellAction;