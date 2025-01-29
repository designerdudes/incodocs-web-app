"use client";
import React, { useState } from "react";
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
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { postData } from "@/axiosUtility/api";


const formSchema = z.object({
    dimensions: z.object({
        weight: z.object({
            value: z
                .number()
                .min(0.1, { message: "Weight must be greater than zero" }),
            units: z.literal("tons").default("tons"),
        }),
        length: z.object({
            value: z
                .number()
                .min(0.1, { message: "Length must be greater than zero" }),
            units: z.literal("inch").default("inch"),
        }),
        breadth: z.object({
            value: z
                .number()
                .min(0.1, { message: "Breadth must be greater than zero" }),
            units: z.literal("inch").default("inch"),
        }),
        height: z.object({
            value: z
                .number()
                .min(0.1, { message: "Height must be greater than zero" }),
            units: z.literal("inch").default("inch"),
        }),
    }),
    inStock: z.boolean().optional(),
    SlabsId: z.array(z.string()).optional(),
});

interface Props {
    params: {
        _id: string;
    }
}

function AddBlockForm({ params }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0); // State for calculated volume
    const factoryId = useParams().factoryid;
    const lotId = params._id

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dimensions: {
                weight: { value: 0, units: "tons" as "tons" },
                length: { value: 0, units: "inch" as "inch" },
                breadth: { value: 0, units: "inch" as "inch" },
                height: { value: 0, units: "inch" as "inch" },
            },
        },
    });



    const GlobalModal = useGlobalModal();
    const router = useRouter();

    // Function to calculate volume
    const calculateVolume = (values: {
        dimensions: {
            length: { value: number | string };
            breadth: { value: number | string };
            height: { value: number | string };
        };
    }) => {
        const length = parseFloat(values.dimensions.length.value as string) || 0;
        const breadth = parseFloat(values.dimensions.breadth.value as string) || 0;
        const height = parseFloat(values.dimensions.height.value as string) || 0;

        const volume = length * breadth * height;
        setVolume(volume);
    };




    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        GlobalModal.title = "Confirm Details";
        GlobalModal.description = "Please review the entered details:";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>
                    <strong>Height (inches):</strong> {values.dimensions.height.value}
                </p>
                <p>
                    <strong>Length (inches):</strong> {values.dimensions.length.value}
                </p>
                <p>
                    <strong>Breadth (inches):</strong> {values.dimensions.breadth.value}
                </p>
                <p>
                    <strong>Weight (tons):</strong> {values.dimensions.weight.value}
                </p>
                <p>
                    <strong>Volume (cubic inches):</strong> {volume.toFixed(2)}
                </p>
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
                                await postData("/factory-management/inventory/raw/add", {
                                    ...values,
                                    factoryId,
                                    lotId,
                                    status: "inStock",
                                });
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.success("Factory created successfully");
                                // router.push("./dashboard");
                            } catch (error) {
                                console.error("Error creating Factory:", error);
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.error("Error creating Factory");
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
                        name="dimensions.height.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height (inches)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 5"
                                        type="number"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const numericValue = parseFloat(e.target.value) || 0; // Convert to number
                                            field.onChange(numericValue); // Update field value as number
                                            calculateVolume({
                                                dimensions: {
                                                    ...form.getValues().dimensions,
                                                    height: { value: numericValue },
                                                },
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="dimensions.length.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Length (inches)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 5"
                                        type="number"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const numericValue = parseFloat(e.target.value) || 0; // Convert to number
                                            field.onChange(numericValue); // Update field value as number
                                            calculateVolume({
                                                dimensions: {
                                                    ...form.getValues().dimensions,
                                                    length: { value: numericValue },
                                                },
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Breadth */}
                    <FormField
                        control={form.control}
                        name="dimensions.breadth.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Breadth (inches)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 5"
                                        type="number"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const numericValue = parseFloat(e.target.value) || 0; // Convert to number
                                            field.onChange(numericValue); // Update field value as number
                                            calculateVolume({
                                                dimensions: {
                                                    ...form.getValues().dimensions,
                                                    breadth: { value: numericValue },
                                                },
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Weight */}
                    <FormField
                        control={form.control}
                        name="dimensions.weight.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight (tons)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 1.5"
                                        type="number"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            const numericValue = parseFloat(e.target.value) || 0; // Convert to number
                                            field.onChange(numericValue); // Update field value as number
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                <div>
                    <FormLabel>Volume (in³):</FormLabel>
                    <p className="text-gray-700">{volume.toFixed(2)}</p>
                </div>
                {/* Submit Button */}
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

export default AddBlockForm;
