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
  TrashIcon,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import toast from "react-hot-toast";
import { deleteData } from "@/axiosUtility/api";
import { Slab } from "./inpolishingcolumns";
import CardWithForm from "./editTrimValues";
import CuttingBlockForm from "@/components/forms/CuttingBlockForm";
import { Alert } from "@/components/forms/Alert";
import EditBlockForm from "../../lots/[lotid]/blocks/editBlockForm";

interface Props {
  data: any;
}

export const SplittedCellAction: React.FC<Props> = ({ data }) => {
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

         {/* <DropdownMenuItem
                     onSelect={() => {
                       GlobalModal.title = `Send For Cutting - ${data.blockNumber}`;
                       GlobalModal.children = (
                         <CuttingBlockForm
                           parentBlockId={data._id}
                           blockNumber={data.blockNumber}
                           factoryId={data.factoryId}
                           netDimensions={data.netDimensions}
                           onSubmit={() => GlobalModal.onClose()}
                           originalBlockVolume={0}
                         />
                       );
                       GlobalModal.onOpen();
                     }}
                   >
                     <ScissorsIcon className="mr-2 h-4 w-4 rotate-45" />
                     Send For Cutting
                   </DropdownMenuItem> */}

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

export default SplittedCellAction;
