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
import { useRouter } from "next/navigation";

const formSchema = z.object({
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
    weight: z
        .string()
        .min(1, { message: "Weight must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Weight must be greater than zero" }),
});

function CardWithForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0); // State for calculated volume

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            height: "",
            length: "",
            breadth: "",
            weight: "",
        },
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter();

    // Function to calculate volume
    const calculateVolume = (values: { length: string; breadth: string; height: string }) => {
        const length = parseFloat(values.length) || 0;
        const breadth = parseFloat(values.breadth) || 0;
        const height = parseFloat(values.height) || 0;
        setVolume(length * breadth * height);
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        GlobalModal.title = "Confirm Details";
        GlobalModal.description = "Please review the entered details:";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>
                    <strong>Height (inches):</strong> {values.height}
                </p>
                <p>
                    <strong>Length (inches):</strong> {values.length}
                </p>
                <p>
                    <strong>Breadth (inches):</strong> {values.breadth}
                </p>
                <p>
                    <strong>Weight (tons):</strong> {values.weight}
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
                        onClick={() => {
                            console.log("Block Details Submitted:", {
                                ...values,
                                volume,
                            });

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
                    {/* Height */}
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
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            calculateVolume({
                                                ...form.getValues(),
                                                height: e.target.value,
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Length */}
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
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            calculateVolume({
                                                ...form.getValues(),
                                                length: e.target.value,
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
                        name="breadth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Breadth (inches)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 20"
                                        type="number"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            calculateVolume({
                                                ...form.getValues(),
                                                breadth: e.target.value,
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
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight (tons)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 1.5"
                                        type="number"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Submit Button */}
                <div>
                    <FormLabel>Volume (in³):</FormLabel>
                    <p className="text-gray-700">{volume.toFixed(2)}</p>
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

export default CardWithForm;
