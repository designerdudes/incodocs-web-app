"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useGlobalModal } from '@/hooks/GlobalModal';
import { Edit, EyeIcon, MoreHorizontal, ScissorsIcon, Trash } from 'lucide-react'
import React, { useState } from 'react'
import { LotManagement } from './columns'
import { Alert } from '@/components/forms/Alert';
import { useRouter } from 'next/navigation';
import { deleteData } from '@/axiosUtility/api';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


interface Props {
    data: LotManagement
}

export const CellAction: React.FC<Props> = ({ data }) => {

    const GlobalModal = useGlobalModal();
    // const deleteLot = async () => {


    //     try {
    //         const result = await deleteData(`/categories/v1/category/${data._id}`); // Replace 'your-delete-endpoint' with the actual DELETE endpoint

    //         toast.success('Raw Material Deleted Successfully')
    //         GlobalModal.onClose()
    //         window.location.reload()
    //     } catch (error) {
    //         console.error('Error deleting data:', error);
    //     }


    // }
    const router = useRouter()


    const PopoverDemo = async () => {
        return (
            <Popover >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="hidden" // This hides the default trigger as we are manually controlling the popover
                    />
                </PopoverTrigger>
                <PopoverContent
                    className="w-80"
                    onMouseDown={(e) => e.stopPropagation()} // Prevent clicks inside the Popover from closing it
                >
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                                Send Blocks for Cutting
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Enter the number of blocks and dimensions for the cutting
                                process.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="blocks">Blocks</Label>
                                <Input
                                    id="blocks"
                                    type="number"
                                    placeholder="No. of Blocks"
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width (inches)</Label>
                                <Input
                                    id="width"
                                    type="number"
                                    placeholder="Width"
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height (inches)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    placeholder="Height"
                                    className="col-span-2 h-8"
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    console.log("Submitted Cutting Data");
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }

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
                    <DropdownMenuItem
                        onClick={PopoverDemo}
                    >
                        <ScissorsIcon className="mr-2 h-4 w-4" />
                        Send For Cutting
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={
                            () => {
                                router.push(`./lotmanagement/view/${data._id}`)
                            }
                        }
                    >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View Lot Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={
                            () => {
                                router.push(`./lotmanagement/edit/${data._id}`)
                            }
                        }
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Lot Details
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                        onSelect={() => {
                            GlobalModal.title = `Delete Lot - ${data.materialType}`
                            GlobalModal.description = "Are you sure you want to delete this Lot?"
                            // GlobalModal.children = <Alert onConfirm={deleteLot} />
                            GlobalModal.onOpen()
                        }}
                        className="focus:bg-destructive focus:text-destructive-foreground">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Lot
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default CellAction