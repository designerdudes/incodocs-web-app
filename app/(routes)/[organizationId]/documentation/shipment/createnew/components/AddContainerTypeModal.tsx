"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

// Schema for the new container type
const containerTypeSchema = z.object({
    value: z
        .string()
        .min(1, "Value is required")
        .regex(/^[a-z0-9-]+$/, "Value must be lowercase, alphanumeric, or hyphens"),
    label: z.string().min(1, "Label is required"),
    category: z.enum([
        "Dry Containers",
        "Refrigerated Containers",
        "Special Dimensioned Containers",
        "Custom Containers",
    ]),
});

export interface AddContainerTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { value: string; label: string; category: string }) => void;
}

export function AddContainerTypeModal({
    isOpen,
    onClose,
    onSubmit,
}: AddContainerTypeModalProps) {
    const form = useForm<z.infer<typeof containerTypeSchema>>({
        resolver: zodResolver(containerTypeSchema),
        defaultValues: {
            value: "",
            label: "",
            category: "Custom Containers",
        },
    });

    const handleSubmit = (data: z.infer<typeof containerTypeSchema>) => {
        onSubmit(data);
        toast.success("Container type added successfully!");
        onClose();
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Container Type</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new container type.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., custom-container"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Custom Container" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Dry Containers">Dry Containers</SelectItem>
                                            <SelectItem value="Refrigerated Containers">Refrigerated Containers</SelectItem>
                                            <SelectItem value="Special Dimensioned Containers">Special Dimensioned Containers</SelectItem>
                                            <SelectItem value="Custom Containers">Custom Containers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">Add Container Type</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}