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
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";


const formSchema = z.object({
    lotName: z.string().min(3, { message: "Lot name must be at least 3 characters long" }).optional(),
    materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }).optional(),
});

interface Props {
    params: {
        _id: string;
    }
}

export default function EditLotForm({ params }: Props) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter();
    const lotId = params._id

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
                        onClick={async () => {
                            try {
                                await putData(`/factory-management/inventory/lot/update/${lotId}`, {
                                    ...values,
                                });
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.success("Factory updated successfully");
                                // router.push("./dashboard");
                            } catch (error) {
                                console.error("Error updating Factory:", error);
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.error("Error updating Factory");
                            }
                            window.location.reload();
                        }
                        }
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
                    <FormField
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
                    />
                    <FormField
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
                    />
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
                    />
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
                    /> */}
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


