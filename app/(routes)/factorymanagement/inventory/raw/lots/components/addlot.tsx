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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";

const formSchema = z.object({
    lotName: z.string().min(3, { message: "Lot name must be at least 3 characters long" }),
    materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
    quantity: z
        .string()
        .min(1, { message: "Quantity must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Quantity must be greater than zero" }),
});
import { useRouter } from "next/navigation"; // Import useRouter for navigation

function CardWithForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter(); // Router instance for navigation

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        // Display the modal for confirmation
        GlobalModal.title = "Confirm Lot Creation";
        GlobalModal.description = "Are you sure you want to create this lot?";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>Lot Name: {values.lotName}</p>
                <p>Material Type: {values.materialType}</p>
                <p>Quantity: {values.quantity}</p>
                <div className="flex justify-end space-x-2">
                    {/* Cancel Button */}
                    <Button
                        variant="outline"
                        onClick={() => {
                            GlobalModal.onClose();
                            setIsLoading(false); // Reset loading state
                        }}
                    >
                        Cancel
                    </Button>
                    {/* Confirm Button */}
                    <Button
                        onClick={() => {
                            // Simulate lot creation or call an API here
                            console.log("Lot Created:", values);

                            // Close the modal
                            GlobalModal.onClose();

                            // Navigate back to the base page (Lot Management page)
                            router.push("./lots");

                            setIsLoading(false); // Reset loading state
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
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Add New Lot</CardTitle>
                <CardDescription>
                    A form to input raw material data including lot details, blocks, and dimensions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="grid gap-4"
                    >
                        {/* Lot Name Field */}
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
                        {/* Material Type Field */}
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
                        {/* Quantity Field */}
                        <FormField
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
            </CardContent>
        </Card>
    );
}

export default CardWithForm;
