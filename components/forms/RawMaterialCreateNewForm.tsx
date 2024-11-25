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
    batchNumber: z.string().min(1, { message: "Batch number is required" }),
    materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
    numberOfblocks: z
        .string()
        .min(1, { message: "Quantity must be a positive number" })
        .refine((val) => parseFloat(val) > 0, { message: "Quantity must be greater than zero" }),
    entries: z.array(
        z.object({
            weight: z.string().min(1, { message: "Weight must be a positive number" }),
            length: z.string().min(1, { message: "Length must be a positive number" }),
            breadth: z.string().min(1, { message: "Breadth must be a positive number" }),
            height: z.string().min(1, { message: "Height must be a positive number" }),
            volume: z.string().min(1, { message: "Volume is required" }),
        })
    ),
});

export function RawMaterialCreateNewForm({ gap }: RawMaterialCreateNewFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [entries, setEntries] = React.useState<any[]>([]);
    const [globalWeight, setGlobalWeight] = React.useState<string>("");
    const [globalLength, setGlobalLength] = React.useState<string>("");
    const [globalBreadth, setGlobalBreadth] = React.useState<string>("");
    const [globalHeight, setGlobalHeight] = React.useState<string>("");
    const [applyToAll, setApplyToAll] = React.useState<boolean>(false); // Track if user wants to apply to all rows

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function handleEntriesInputChange(value: string) {
        const count = parseInt(value, 10);
        if (!isNaN(count) && count > 0) {
            const newEntries = Array.from({ length: count }, () => ({
                weight: "",
                length: "",
                breadth: "",
                height: "",
                volume: "",
            }));
            setEntries(newEntries);
            form.setValue("entries", newEntries);
        } else {
            setEntries([]);
            form.setValue("entries", []);
        }
    }

    function handleVolumeCalculation(index: number, field: string, value: string) {
        const updatedEntries = [...entries];
        updatedEntries[index] = {
            ...updatedEntries[index],
            [field]: value,
        };

        const { length, breadth, height } = updatedEntries[index];

        if (length && breadth && height) {
            const volume = parseFloat(length) * parseFloat(breadth) * parseFloat(height);
            updatedEntries[index].volume = volume ? volume.toFixed(2) : "";
        }

        setEntries(updatedEntries);
        form.setValue("entries", updatedEntries);
    }

    // Apply the global data to all rows
    function applyGlobalDataToAllRows() {
        if (applyToAll) {
            const updatedEntries = entries.map((entry) => ({
                ...entry,
                weight: globalWeight,
                length: globalLength,
                breadth: globalBreadth,
                height: globalHeight,
                volume: calculateVolume(globalLength, globalBreadth, globalHeight),
            }));
            setEntries(updatedEntries);
            form.setValue("entries", updatedEntries);
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
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
        form.setValue("entries", updatedEntries);

        // After deleting a row, update the number of blocks
        form.setValue("numberOfblocks", updatedEntries.length.toString());
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
        applyGlobalDataToAllRows(); // Apply global data to all rows when the option is checked
    }, [applyToAll, globalWeight, globalLength, globalBreadth, globalHeight]);

    React.useEffect(() => {
        // Automatically update the "numberOfblocks" field when entries are added or deleted
        form.setValue("numberOfblocks", entries.length.toString());
    }, [entries, form]);

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

                    {/* Global Inputs */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-3">
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
                            {entries.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell> {/* Serial Number */}
                                    <TableCell>
                                        <Input
                                            value={entry.weight}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "weight", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={entry.length}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "length", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={entry.breadth}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "breadth", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={entry.height}
                                            type="number"
                                            onChange={(e) =>
                                                handleVolumeCalculation(index, "height", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{entry.volume}</TableCell>
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
