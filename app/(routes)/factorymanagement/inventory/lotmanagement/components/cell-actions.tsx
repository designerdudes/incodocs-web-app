"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useGlobalModal } from '@/hooks/GlobalModal';
import { Edit2, Eye, MoreHorizontal, Trash } from 'lucide-react'
import React from 'react'
import { LotManagement } from './columns'
import { Alert } from '@/components/forms/Alert';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteData } from '@/axiosUtility/api';

interface Props {
    data: LotManagement
}

export const CellAction: React.FC<Props> = ({ data }) => {
    const GlobalModal = useGlobalModal();
    const deleteRawMaterial = async () => {


        try {
            const result = await deleteData(`/categories/v1/category/${data._id}`); // Replace 'your-delete-endpoint' with the actual DELETE endpoint

            toast.success('Raw Material Deleted Successfully')
            GlobalModal.onClose()
            window.location.reload()
        } catch (error) {
            console.error('Error deleting data:', error);
        }


    }
    const router = useRouter()
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
                        // onSelect={
                        //     () => {
                        //         router.push(`./rawmaterial/view/${data._id}`)
                        //     }
                        // }
                        >
                        {/* <Eye className="mr-2 h-4 w-4" /> */}
                        Cutting</DropdownMenuItem>
                    <DropdownMenuItem
                        // onSelect={
                        //     () => {
                        //         router.push(`./rawmaterial/edit/${data._id}`)
                        //     }
                        // }
                        >
                        {/* <Edit2 className="mr-2 h-4 w-4" /> */}
                        Trimming</DropdownMenuItem>
                    <DropdownMenuItem
                        // onSelect={() => {
                        //     GlobalModal.title = `Delete Raw Material - ${data.materialType}`
                        //     GlobalModal.description = "Are you sure you want to delete this Raw Material?"
                        //     GlobalModal.children = <Alert onConfirm={deleteRawMaterial} />
                        //     GlobalModal.onOpen()
                        // }}
                        className="focus:bg-destructive focus:text-destructive-foreground">
                        {/* <Trash className="mr-2 h-4 w-4" /> */}
                        Polishing</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default CellAction