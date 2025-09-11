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
import { EyeIcon, MoreHorizontal, ScissorsIcon, TrashIcon, } from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import MarkSplitForm from "@/components/forms/MarkSplitForm";

interface Props {
    data: any;
}

const InSplittingCellAction: React.FC<Props> = ({ data }) => {
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
                    {/* Mark cut */}
                     <DropdownMenuItem
                                onSelect={() => {
                                  GlobalModal.title = `Mark Split - ${data.blockNumber}`;
                                  GlobalModal.children = (
                                    <MarkSplitForm
                                      parentBlockId={data._id}
                                      blockNumber={data.blockNumber}
                                      factoryId={data.factoryId}
                                      onSubmit={() => GlobalModal.onClose()}
                                      originalBlockVolume={0}
                                    />
                                  );
                                  GlobalModal.onOpen();
                                }}
                              >
                                <ScissorsIcon className="mr-2 h-4 w-4 rotate-45" />
                                Mark Split
                              </DropdownMenuItem>
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

export default InSplittingCellAction;