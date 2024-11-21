"use client";

import * as React from "react";
import * as z from "zod";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableFooter,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface RawMaterialCreateNewFormProps {
    gap: number;
}

const formSchema = z.object({
    lotName: z.string().min(3, { message: "Material name must be at least 3 characters long" }),
    batchNumber: z.string().min(1, { message: "Batch number is required" }),
    materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
    numberOfblocks:  z
    .string()
    .min(1, { message: "Quantity must be a positive number" })
    .refine((val) => parseFloat(val) > 0, { message: "Quantity must be greater than zero" }),
    entries: z
        .array(
            z.object({
                weight: z.string().min(1, { message: "Weight is required" }),
                length: z.string().min(1, { message: "Length is required" }),
                breadth: z.string().min(1, { message: "Breadth is required" }),
                height: z.string().min(1, { message: "Height is required" }),
                volume: z.string().min(1, { message: "Volume is required" }),
            })
        )
        .optional(),
});

export function RawMaterialCreateNewForm({ gap }: RawMaterialCreateNewFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [entriesCount, setEntriesCount] = React.useState<number>(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function handleEntriesInputChange(value: string) {
        const count = parseInt(value, 10);
        if (!isNaN(count) && count > 0) {
            setEntriesCount(count);
            form.setValue(
                "entries",
                Array.from({ length: count }, () => ({
                    weight: "",
                    length: "",
                    breadth: "",
                    height: "",
                    volume: "",
                }))
            );
        } else {
            setEntriesCount(0);
            form.setValue("entries", []);
        }
    }

    function handleVolumeCalculation(index: number, field: string, value: string) {
        const entries = form.getValues("entries") || [];
        entries[index] = {
            ...entries[index],
            [field]: value,
        };

        const { length, breadth, height } = entries[index];

        if (length && breadth && height) {
            const volume = parseFloat(length) * parseFloat(breadth) * parseFloat(height);
            entries[index].volume = volume ? volume.toFixed(2) : "";
        }

        form.setValue("entries", entries);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Add your update logic here
        toast.success("Raw material data updated successfully");
        setIsLoading(false);

        router.refresh(); // Refresh the current page
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className={`grid grid-cols-${gap} gap-3`}>
                        <FormField
                            name="lotName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lot Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Xyz" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="materialType"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Material Type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Granite" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="numberOfblocks"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Blocks</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter number of blocks"
                                            type="number"
                                            disabled={isLoading}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleEntriesInputChange(e.target.value);
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {entriesCount > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Weight (kg)</TableHead>
                                    <TableHead>Length (inches)</TableHead>
                                    <TableHead>breadth (inches)</TableHead>
                                    <TableHead>Height (inches)</TableHead>
                                    <TableHead>Volume (in³)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: entriesCount }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        {["weight", "length", "breadth", "height"].map((field) => (
                                            <TableCell key={field}>
                                                <FormField
                                                    name={`entries.${index}.${field}`}
                                                    control={form.control}
                                                    render={({ field: entryField }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={`Enter ${field}`}
                                                                    disabled={isLoading}
                                                                    {...entryField}
                                                                    onChange={(e) =>
                                                                        handleVolumeCalculation(index, field, e.target.value)
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <FormField
                                                name={`entries.${index}.volume`}
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Auto-calculated" disabled {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <span className="mr-2 spinner"></span>}
                        Update
                    </Button>
                </form>
            </Form>
        </div>
    );
}
export default RawMaterialCreateNewForm;
