"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";

interface AlertProps {
    onConfirm: () => void;
    actionType: "cut" | "delete"; // Add an actionType prop
}

export const Alert: React.FC<AlertProps> = ({ onConfirm, actionType }) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const GlobalModal = useGlobalModal();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }

    return (
        <div className={cn("flex gap-2 justify-end")}>
            <Button
                onClick={() => {
                    GlobalModal.onClose();
                }}
                variant="outline"
            >
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                className={cn(
                    actionType === "cut" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}
            >
                {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {actionType === "cut" ? "Yes, Cut" : "Yes, Delete"}
            </Button>
        </div>
    );
};
