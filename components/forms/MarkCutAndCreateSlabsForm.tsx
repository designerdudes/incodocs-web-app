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
import { Trash } from "lucide-react";

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
                    .refine((val) => parseFloat(val) > 0, { message: "Height must be greater than zero" }),
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
    const [isLoading, setIsLoading] = React.useState(false);
    const [slabsCount, setSlabsCount] = React.useState(0);
    const [globalLength, setGlobalLength] = React.useState<string>("");
    const [globalHeight, setGlobalHeight] = React.useState<string>("");
    const [applyLengthToAll, setApplyLengthToAll] = React.useState(false);
    const [applyHeightToAll, setApplyHeightToAll] = React.useState(false);

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

    React.useEffect(() => {
        if (applyLengthToAll || applyHeightToAll) {
            const updatedSlabs = form.getValues("slabs") || [];
            const newSlabs = updatedSlabs.map((slab) => ({
                length: applyLengthToAll ? globalLength : slab.length,
                height: applyHeightToAll ? globalHeight : slab.height,
            }));
            form.setValue("slabs", newSlabs);
        }
    }, [globalLength, globalHeight, applyLengthToAll, applyHeightToAll]);

    
    function calculateSqft(length: string, height: string): string {
        const lengthInFeet = parseFloat(length) / 12 || 0; // Convert length to feet
        const heightInFeet = parseFloat(height) / 12 || 0; // Convert height to feet
        const area = lengthInFeet * heightInFeet;
        return area > 0 ? area.toFixed(2) : "0.00"; // Return area as a string with 2 decimal places
    }
    
    function handleDeleteRow(index: number) {
        const updatedSlabs = [...form.getValues("slabs")];
        updatedSlabs.splice(index, 1);
        setSlabsCount(updatedSlabs.length);
        form.setValue("slabs", updatedSlabs);
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
                        <FormField
                            name="blockNumber"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Block Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 12345" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="numberofSlabs"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Slabs</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter number of slabs"
                                            disabled={isLoading}
                                            value={field.value}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleSlabsInputChange(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Global Inputs for Length and Height */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                placeholder="Length(inches)"
                                type="number"
                                value={globalLength}
                                onChange={(e) => setGlobalLength(e.target.value)}
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={applyLengthToAll}
                                    onChange={(e) => setApplyLengthToAll(e.target.checked)}
                                />
                                Apply Length to all rows
                            </label>
                        </div>
                        <div>
                            <Input
                                placeholder="Height(inches)"
                                type="number"
                                value={globalHeight}
                                onChange={(e) => setGlobalHeight(e.target.value)}
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={applyHeightToAll}
                                    onChange={(e) => setApplyHeightToAll(e.target.checked)}
                                />
                                Apply Height to all rows
                            </label>
                        </div>
                    </div>

                    {/* Table for Slabs */}
                    {slabsCount > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Length(inches)</TableHead>
                                    <TableHead>Height(inches)</TableHead>
                                    <TableHead>Area (sqft)</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {form.getValues("slabs").map((slab, index) => (
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
                                            <span>
                                                {calculateSqft(
                                                    form.getValues(`slabs.${index}.length`),
                                                    form.getValues(`slabs.${index}.height`)
                                                )}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDeleteRow(index)}
                                                disabled={isLoading}
                                            >
                                               <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={5}>Total Slabs: {slabsCount}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Update Slabs"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
