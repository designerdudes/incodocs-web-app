"use client"
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
import { postData } from "@/axiosUtility/api";

interface RawMaterialCreateNewFormProps {
    gap: number;
}

const formSchema = z.object({
    lotName: z.string().min(3, { message: "Material name must be at least 3 characters long" }),
    materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
    noOfBlocks: z
        .string()
        .min(1, { message: "Quantity must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Quantity must be greater than zero" }),
    blocks: z.array(
        z.object({
            blockNumber: z.number().min(1, { message: "Block number is required" }),
            materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
            dimensions: z.object({
                weight: z.number().min(0.1, { message: "Weight must be greater than zero" }),
                length: z.number().min(0.1, { message: "Length must be greater than zero" }),
                breadth: z.number().min(0.1, { message: "Breadth must be greater than zero" }),
                height: z.number().min(0.1, { message: "Height must be greater than zero" }),
            }),
        })
    ).min(1, { message: "At least one block is required" }),
});

export function RawMaterialCreateNewForm({ gap }: RawMaterialCreateNewFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [blocks, setBlocks] = React.useState<any[]>([]);
    const [globalWeight, setGlobalWeight] = React.useState<string>("");
    const [globalLength, setGlobalLength] = React.useState<string>("");
    const [globalBreadth, setGlobalBreadth] = React.useState<string>("");
    const [globalHeight, setGlobalHeight] = React.useState<string>("");
    const [applyToAll, setApplyToAll] = React.useState<boolean>(false); // Track if user wants to apply to all rows

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function handleBlocksInputChange(value: string) {
        const count = parseInt(value, 10);

        if (!isNaN(count) && count > 0) {
            const newBlocks = Array.from({ length: count }, (_, index) => ({
                blockNumber: index + 1, // Assign a sequential block number starting from 1
                materialType: "", // Initialize material type as an empty string
                dimensions: {
                    weight: 0, // Default weight to 0
                    length: 0, // Default length to 0
                    breadth: 0, // Default breadth to 0
                    height: 0, // Default height to 0
                },
            }));

            setBlocks(newBlocks);
            form.setValue("blocks", newBlocks);
        } else {
            setBlocks([]);
            form.setValue("blocks", []);
        }
    }


    function handleVolumeCalculation(index: number, field: string, value: string) {
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = {
            ...updatedBlocks[index],
            [field]: value,
        };

        const { length, breadth, height } = updatedBlocks[index];

        if (length && breadth && height) {
            const volume = parseFloat(length) * parseFloat(breadth) * parseFloat(height);
            updatedBlocks[index].volume = volume ? volume.toFixed(2) : "";
        }

        setBlocks(updatedBlocks);
        form.setValue("blocks", updatedBlocks);
    }

    // Apply the global data to all rows
    function applyGlobalDataToAllRows() {
        if (applyToAll) {
            const updatedBlocks = blocks.map((entry) => ({
                ...entry,
                weight: globalWeight,
                length: globalLength,
                breadth: globalBreadth,
                height: globalHeight,
                volume: calculateVolume(globalLength, globalBreadth, globalHeight),
            }));
            setBlocks(updatedBlocks);
            form.setValue("blocks", updatedBlocks);
        }
    }

    function calculateVolume(length: string, breadth: string, height: string): string {
        if (length && breadth && height) {
            const volume = parseFloat(length) * parseFloat(breadth) * parseFloat(height);
            return volume ? volume.toFixed(2) : "";
        }
        return "";
    }

    function handleDeleteRow(index: number) {
        const updatedBlocks = blocks.filter((_, i) => i !== index);
        setBlocks(updatedBlocks);
        form.setValue("blocks", updatedBlocks);

        // After deleting a row, update the number of blocks
        form.setValue("noOfBlocks", updatedBlocks.length.toString());
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log("Form errors:", form.formState.errors);
        console.log("Form values:", values);

        try {
            const response = await postData("/factory-management/inventory/addlotandblocks", {
                ...values,
                status: "active",
            });
            // const apiLink = `/offer/v1/${response._id}`;
            // After form submission, handle file upload
            setIsLoading(false);
            toast.success("Lot created/updated successfully");
            router.push("./factorymanahement/inventory/raw/lots");
        } catch (error) {
            console.error("Error creating/updating Lot:", error);
            setIsLoading(false);
            toast.error("Error creating/updating Lot");
        }

        router.refresh(); // Refresh the current page
    }

    React.useEffect(() => {
        if (applyToAll) applyGlobalDataToAllRows(); // Apply global data to all rows when the option is checked
    }, [applyToAll, globalWeight, globalLength, globalBreadth, globalHeight]);

    React.useEffect(() => {
        // Automatically update the "numberOfblocks" field when entries are added or deleted
        form.setValue("noOfBlocks", blocks.length.toString());
    }, [blocks, form]);

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
                            name="noOfBlocks"
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
                                                handleBlocksInputChange(e.target.value);
                                            }}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Global Inputs */}
                    <div className="space-y-3 ">
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            <Input
                                value={globalWeight}
                                onChange={(e) => setGlobalWeight(e.target.value)}
                                placeholder="Weight (tons)"
                                type="number"
                                disabled={isLoading}
                            />
                            <Input
                                value={globalLength}
                                onChange={(e) => setGlobalLength(e.target.value)}
                                placeholder="Length"
                                type="number"
                                disabled={isLoading}
                            />
                            <Input
                                value={globalBreadth}
                                onChange={(e) => setGlobalBreadth(e.target.value)}
                                placeholder="Breadth"
                                type="number"
                                disabled={isLoading}
                            />
                            <Input
                                value={globalHeight}
                                onChange={(e) => setGlobalHeight(e.target.value)}
                                placeholder="Height"
                                type="number"
                                disabled={isLoading}
                            />
                        </div>
                        <label>
                            <input
                                type="checkbox"
                                checked={applyToAll}
                                onChange={(e) => setApplyToAll(e.target.checked)}
                            />{" "}
                            Apply to all rows
                        </label>
                    </div>

                    {/* Table for Entries */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Serial No.</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Length</TableHead>
                                <TableHead>Breadth</TableHead>
                                <TableHead>Height</TableHead>
                                <TableHead>Volume</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blocks.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell> {/* Serial Number */}
                                    <TableCell>
                                        <Input
                                            value={entry.weight || ""}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "weight", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={entry.length || ""}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "length", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={entry.breadth || ""}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "breadth", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={entry.height || ""}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "height", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{entry.volume || ""}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleDeleteRow(index)} variant="destructive">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-end">
                        <Button disabled={isLoading} type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
