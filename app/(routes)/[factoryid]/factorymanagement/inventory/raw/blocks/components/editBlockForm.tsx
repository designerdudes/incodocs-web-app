"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    lotName: z.string().min(3, { message: "Lot name must be at least 3 characters long" }),
    materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
    quantity: z
        .string()
        .min(1, { message: "Quantity must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Quantity must be greater than zero" }),
    weight: z
        .string()
        .min(1, { message: "Weight must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Weight must be greater than zero" }),
    height: z
        .string()
        .min(1, { message: "Height must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Height must be greater than zero" }),
    length: z
        .string()
        .min(1, { message: "Length must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Length must be greater than zero" }),
    breadth: z
        .string()
        .min(1, { message: "Breadth must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Breadth must be greater than zero" }),
});

export default function EditBlockForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter();

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        GlobalModal.title = "Confirm Lot Creation";
        GlobalModal.description = "Are you sure you want to create this lot?";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>Lot Name: {values.lotName}</p>
                <p>Material Type: {values.materialType}</p>
                {/* <p>Quantity: {values.quantity}</p>
                <p>Weight (tons): {values.weight}</p>
                <p>Height (inches): {values.height}</p>
                <p>Length (inches): {values.length}</p>
                <p>Breadth (inches): {values.breadth}</p> */}
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            GlobalModal.onClose();
                            setIsLoading(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Block Created:", values);

                            GlobalModal.onClose();
                            router.push("./lots");
                            setIsLoading(false);
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        );
        GlobalModal.onOpen();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid gap-4"
            >
                
                <div className="grid grid-cols-2 gap-4">
                {/* <FormField
                    control={form.control}
                    name="lotName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lot Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Eg: Lot ABC"
                                    type="text"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                    {/* <FormField
                        control={form.control}
                        name="materialType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Material Type</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: Material ABC"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                     {/* <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 20"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight (tons)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 10.5"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height (inches)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 54"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Length (inches)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 120"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="breadth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Breadth (inches)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 60"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                </Button>
            </form>
        </Form>
    );
}


