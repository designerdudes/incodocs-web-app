"use client"

import React from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"

interface ModalProps {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    isDismissable?: boolean
    children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children,
    isDismissable
}) => {
    const onChange = (open: boolean) => {
        if (isDismissable && !open) {
            onClose();
        }
    }

    return (
        <Dialog

            open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-sm ">{description}</DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
            <DialogClose disabled={isDismissable} className="absolute top-0 right-0 p-2" />
        </Dialog>
    )
}