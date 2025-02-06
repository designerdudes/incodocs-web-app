"use client";
import React, { useEffect, useState } from "react";
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
    factoryName: z.string().min(1, { message: "Factory Name is required" }),
    gstNo: z.string().min(1, { message: "GST Number is required" }),
    address: z.object({
        location: z.string().min(1, { message: "Location is required" }),
        pincode: z
            .string()
            .min(6, { message: "Pincode must be at least 6 characters" }),
    }),
    createdAt: z.string().min(0, { message: "date should be number" }).optional(),
    workersCuttingPay: z.number().min(0, { message: "Pay must be positive" }),
    workersPolishingPay: z.number().min(0, { message: "Pay must be positive" }),
});


interface Props {
    params: {
        _id: string; // Lot ID
    };
}

export default function EditFactoryForm({ params }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const GlobalModal = useGlobalModal();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            factoryName: "",
            gstNo: "",
            address: {
                location: "",
                pincode: "",
            },
            createdAt: "",
            workersCuttingPay: 0,
            workersPolishingPay: 0,
        },
    });

    const factoryId = params._id;

    // Fetch existing lot data and reset form values
    useEffect(() => {
        async function fetchLotData() {
            try {
                setIsFetching(true);
                const response = await fetch(
                    `http://localhost:4080/factory/getSingle/${factoryId}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch lot data");
                }
                const data = await response.json();

                // Reset form with fetched values
                form.reset({
                    factoryName: data.factoryName || "",
                    gstNo: data.gstNo || "",
                    address: {
                        location: data.address.location || "",
                        pincode: data.address.pincode || "",
                    },
                    createdAt: data.createdAt || 0,
                    workersCuttingPay: data.workersCuttingPay || 0,
                    workersPolishingPay: data.workersPolishingPay || 0,
                });
            } catch (error) {
                console.error("Error fetching Factory data:", error);
                toast.error("Failed to fetch Factory data");
            } finally {
                setIsFetching(false);
            }
        }

        fetchLotData();
    }, [factoryId, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        GlobalModal.title = "Confirm Factory Update";
        GlobalModal.description = "Are you sure you want to update this Factory?";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>Factory Name: {values.factoryName}</p>
                <p>GST No Type: {values.gstNo}</p>
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
                                await putData(
                                    `/factory/put/${factoryId}`,
                                    values
                                );
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.success("Factory updated successfully");

                                window.location.reload();
                            } catch (error) {
                                console.error("Error updating lot:", error);
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.error("Error updating lot");
                            }
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        );
        GlobalModal.onOpen();
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-60">
                <Icons.spinner className="h-6 w-6 animate-spin" />
                <p className="ml-2 text-gray-500">Loading Fatory details...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="factoryName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Factory Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: Lot ABC" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gstNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GST No</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: XYZ123"
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
                        name="address.location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: Bangalore"
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
                        name="address.pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 560001"
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
                        name="createdAt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Created At</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 2022"
                                        type="string"
                                        disabled={isLoading}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value ? parseFloat(value) : undefined);
                                        }}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="workersCuttingPay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Workers Cutting Pay</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 100"
                                        type="number"
                                        disabled={isLoading}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value ? parseFloat(value) : undefined);
                                        }}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="workersPolishingPay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Workers Polishing Pay</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 200"
                                        type="number"
                                        disabled={isLoading}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value ? parseFloat(value) : undefined);
                                        }}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                </Button>
            </form>
        </Form>
    );
}
