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
  TrashIcon,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Alert } from "@/components/forms/Alert";
import { putData } from "@/axiosUtility/api";
import toast from 'react-hot-toast';



interface Props {
  data: any;
}

export const CellAction: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const GlobalModal = useGlobalModal();


  // State for controlling the drawer and managing cutting data
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [cuttingData, setCuttingData] = React.useState({
    blocks: "",
    width: "",
    height: "",
  });

  // The total number of blocks in stock in the lot (e.g., from the `data` prop)
  const availableBlocks = data?.stock || 0; // Ensure `data.stock` contains the available blocks

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Allow only numbers and check if the entered blocks are within the available stock
    if (
      id === "blocks" &&
      (parseInt(value) > availableBlocks || parseInt(value) < 0)
    ) {
      return; // Prevent entering more than available stock
    }
    setCuttingData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted Cutting Data:", cuttingData);
    // Add logic to process or save the data (e.g., update stock, etc.)
    setIsDrawerOpen(false); // Close drawer after submission
  };


  const sendForCutting = async () => {

    try {
      const result = await putData(`/factory-management/inventory/raw/put/${data._id}`,
        { status: "inCutting", });
      toast.success('Block send for cutting Successfully')
      GlobalModal.onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }


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
              GlobalModal.title = `Send Block for Cutting - ${data.blockNumber}`
              GlobalModal.description = "Are you sure you want to send this Block for cutting?"
              GlobalModal.children = <Alert onConfirm={sendForCutting} />
              GlobalModal.onOpen()
            }}
            className="focus:bg-destructive focus:text-destructive-foreground">
            <ScissorsIcon className="mr-2 h-4 w-4" />
            Send For Cutting</DropdownMenuItem>

          {/* View Lot Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(`..//block/${data._id}/slabs`);
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Block Details
          </DropdownMenuItem>

          {/* Edit Lot Details */}
          <DropdownMenuItem
            onSelect={() => {
              router.push(`./lotmanagement/edit/${data._id}`);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Block Details
          </DropdownMenuItem>
          {/* Send For Cutting */}
          <DropdownMenuItem onSelect={() => setIsDrawerOpen(true)}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Drawer for Send for Cutting */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Send Blocks for Cutting</DrawerTitle>
              <DrawerDescription>
                Enter the number of blocks for cutting (within available stock).
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="grid gap-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="blocks">Blocks in Stock</Label>
                  <div className="col-span-2 text-center text-lg font-semibold">
                    {availableBlocks} blocks
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="blocks">Blocks for Cutting</Label>
                  <Input
                    id="blocks"
                    type="number"
                    placeholder="No. of Blocks"
                    className="col-span-2 h-8"
                    value={cuttingData.blocks}
                    onChange={handleInputChange}
                    max={availableBlocks}
                    min={0}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Width (inches)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="Width"
                    className="col-span-2 h-8"
                    value={cuttingData.width}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Height"
                    className="col-span-2 h-8"
                    value={cuttingData.height}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button className="w-full" onClick={handleSubmit}>
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CellAction;
