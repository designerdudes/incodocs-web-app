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
import { Block } from "./incuttingcolumns";

const data: Block = {
    _id: "65f8fb0fc4417ea5a14fbd82",
    blockNumber: "12345",
    slabID: "SLAB-123",
    blockLotName: "LOT 1",
    materialType: "Granite",
    isActive: true,
    createdAt: "2024-03-19T02:40:15.954Z",
    updatedAt: "",
    height: "54",
    length: "4.2",
    status: "Ready For Polish",
    numberofSlabs: "12",
    weight: "2",
    breadth: "4",
    volume: "23",
    lotId: {
        _id: "",
        lotName: ""
    }
};

const formSchema = z.object({
    height: z
        .string()
        .min(1, { message: "Height must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Height must be greater than zero" }),
    length: z
        .string()
        .min(1, { message: "Length must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Length must be greater than zero" }),
});

function CardWithForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            height: "", // Provide initial value
            length: "",
        },
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter();

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        GlobalModal.title = "Confirm Details";
        GlobalModal.description = "Please review the entered details:";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>
                    <strong>Slab ID:</strong> {data.slabID}
                </p>
                <p>
                    <strong>Block Number:</strong> {data.blockNumber}
                </p>
                <p>
                    <strong>Height (inches):</strong> {values.height}
                </p>
                <p>
                    <strong>Length (inches):</strong> {values.length}
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
                            console.log("Trim Values Submitted:", values);

                            GlobalModal.onClose();
                            router.push("./processing");
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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

export default CardWithForm;
