"use client";
import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  EyeIcon,
  MoreHorizontal,
  ScissorsIcon,
  TrashIcon,
} from "lucide-react";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import { deleteData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import SendForCuttingForm from "@/components/forms/SendForCuttingForm";
import DressingBlockForm from "@/components/forms/dressingBlockForm";
import MarkDressForm from "@/components/forms/MarkDressForm";
import EditBlockForm from "./editBlockForm";
import Link from "next/link";
import MarkSplitForm from "@/components/forms/MarkSplitForm";
import SplitBlockForm from "@/components/forms/SplitBlockForm";

interface Props {
  data: any;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();
  const params = useParams();
  const { organizationId, factoryid } = params;

  const deleteLot = async () => {
    try {
      await deleteData(`/factory-management/inventory/raw/delete/${data._id}`);
      toast.success("Block Deleted Successfully");
      GlobalModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // ---- Workflow Map ----
  const workflowMap: Record<string, string[]> = {
    inStock: [
      "sendForDressing",
      "sendForSplitting",
      "sendForCutting",
      "edit",
      "view",
      "delete",
    ],
    inDressing: [
      "markDressed",
      "view",
      "delete",
    ],
    dressed: [
      "sendForSplitting",
      "sendForCutting",
      "edit",
      "view",
      "delete",
    ],
    inSplitting: [
      "markSplit",
      "view",
      "delete",
    ],
    split: ["sendForCutting", "edit", "view", "delete"],
    inCutting: ["markCut", "view", "delete"],
    cut: ["view", "delete"],
  };

  const allowed = workflowMap[data.status] || [];

  const canShow = (action: string) => allowed.includes(action);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="gap-2" align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        {/* Send For Dressing */}
        {canShow("sendForDressing") && (
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Send For Dressing - ${data.blockNumber}`;
              GlobalModal.children = (
                <DressingBlockForm
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
            Send For Dressing
          </DropdownMenuItem>
        )}

        {/* Mark Dressed */}
        {canShow("markDressed") && (
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Mark Dressed - ${data.blockNumber}`;
              GlobalModal.children = (
                <MarkDressForm
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
            Mark Dressed
          </DropdownMenuItem>
        )}

        {/* Send For Splitting */}
        {canShow("sendForSplitting") && (
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Send For Splitting - ${data.blockNumber}`;
              GlobalModal.children = (
                <SplitBlockForm
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
            Send For Splitting
          </DropdownMenuItem>
        )}

        {/* Mark Split */}
        {canShow("markSplit") && (
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
        )}

        {/* Send For Cutting */}
        {canShow("sendForCutting") && (
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Send For Cutting - ${data.blockNumber}`;
              GlobalModal.children = <SendForCuttingForm params={{ data }} />;
              GlobalModal.onOpen();
            }}
          >
            <ScissorsIcon className="mr-2 h-4 w-4 rotate-45" />
            Send For Cutting
          </DropdownMenuItem>
        )}

        {/* Mark Cut */}
        {canShow("markCut") && (
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Mark Cut - ${data.blockNumber}`;
              // GlobalModal.children = (
              //   <MarkCutForm
              //     parentBlockId={data._id}
              //     blockNumber={data.blockNumber}
              //     factoryId={data.factoryId}
              //     onSubmit={() => GlobalModal.onClose()}
              //     originalBlockVolume={0}
              //   />
              // );
              GlobalModal.onOpen();
            }}
          >
            <ScissorsIcon className="mr-2 h-4 w-4 rotate-45" />
            Mark Cut
          </DropdownMenuItem>
        )}

        {/* View */}
        {canShow("view") && (
          <DropdownMenuItem asChild>
            <Link
              href={`/${organizationId}/${factoryid}/factorymanagement/inventory/raw/lots/block/${data._id}/slabs`}
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              View Block Details
            </Link>
          </DropdownMenuItem>
        )}

        {/* Edit */}
        {canShow("edit") && (
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = "Edit Block Details";
              GlobalModal.children = <EditBlockForm params={{ _id: data._id }} />;
              GlobalModal.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Block Details
          </DropdownMenuItem>
        )}

        {/* Delete */}
        {canShow("delete") && (
          <DropdownMenuItem
            onSelect={() => {
              GlobalModal.title = `Delete Block - ${data.blockNumber}`;
              GlobalModal.children = (
                <Alert onConfirm={deleteLot} actionType="delete" />
              );
              GlobalModal.onOpen();
            }}
            className="focus:bg-destructive focus:text-destructive-foreground"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;
