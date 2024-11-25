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

interface MarkCutAndCreateSlabsFormProps extends React.HTMLAttributes<HTMLDivElement> {
    gap: number;
    BlockData: any;
}

const formSchema = z.object({
    _id: z.string().optional(),
    blockLotName: z.string().min(3, { message: "Lot name must be at least 3 characters long" }),
    blockNumber: z.number().min(1, { message: "Block number is required" }),
    numberofSlabs: z.string().optional(),
    slabs: z
        .array(
            z.object({
                length: z.string()
                    .min(1, { message: "Length must be a positive number" })
                    .refine((val) => parseFloat(val) > 0, { message: "Length must be greater than zero" }),
                height: z.string()
                    .min(1, { message: "Height must be a positive number" })
                    .refine((val) => parseFloat(val) > 0, { message: "Height must be greater than zero" })
            })
        )
        .optional(),
});

export function MarkCutAndCreateSlabsForm({
    className,
    BlockData,
    gap,
    ...props
}: MarkCutAndCreateSlabsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [slabsCount, setSlabsCount] = React.useState<number>(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: BlockData?._id || "",
            blockLotName: BlockData?.blockLotName || "",
            blockNumber: BlockData?.blockNumber || "",
            numberofSlabs: BlockData?.numberofSlabs || "",
            slabs: [],
        },
    });

    function handleSlabsInputChange(value: string) {
        const count = parseInt(value, 10);
        if (!isNaN(count) && count > 0) {
            setSlabsCount(count);
            form.setValue(
                "slabs",
                Array.from({ length: count }, () => ({ length: "", height: "" }))
            );
        } else {
            setSlabsCount(0);
            form.setValue("slabs", []);
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Add your update logic here
        toast.success("Block data updated successfully");
        setIsLoading(false);

        // Navigate or handle further logic
        router.refresh(); // Refresh the current page
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Input Fields */}
                    <div className={`grid grid-cols-${gap} gap-3`}>
                        {/* Lot Name */}
                        <FormField
                            name="blockLotName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lot Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Lot 1" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Block Number */}
                        <FormField
                            name="blockNumber"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Block Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 12345"
                                            disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Number of Slabs */}
                        <FormField
                            name="numberofSlabs"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Slabs</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter number of slabs"
                                            type="number"
                                            disabled={isLoading}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleSlabsInputChange(e.target.value);
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Table for Slabs */}
                    {slabsCount > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Slab #</TableHead>
                                    <TableHead>Length (in inches)</TableHead>
                                    <TableHead>Height (in inches)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: slabsCount }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <FormField
                                                name={`slabs.${index}.length`}
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g. 54"
                                                                type="number"
                                                                disabled={isLoading}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                name={`slabs.${index}.height`}
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g. 32"
                                                                type="number"
                                                                disabled={isLoading}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total Slabs: {slabsCount}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <span className="mr-2 spinner"></span>}
                        Update
                    </Button>
                </form>
            </Form>
        </div>
    );
}
