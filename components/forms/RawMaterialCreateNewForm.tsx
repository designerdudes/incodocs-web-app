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
            weight: z.number().min(0.1, { message: "Weight must be greater than zero" }),
            length: z.number().min(0.1, { message: "Length must be greater than zero" }),
            breadth: z.number().min(0.1, { message: "Breadth must be greater than zero" }),
            height: z.number().min(0.1, { message: "Height must be greater than zero" }),
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
    const [applyWeightToAll, setApplyWeightToAll] = React.useState<boolean>(false);
    const [applyLengthToAll, setApplyLengthToAll] = React.useState<boolean>(false);
    const [applyBreadthToAll, setApplyBreadthToAll] = React.useState<boolean>(false);
    const [applyHeightToAll, setApplyHeightToAll] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function handleBlocksInputChange(value: string) {
        const count = parseInt(value, 10);

        if (!isNaN(count) && count > 0) {
            const newBlocks = Array.from({ length: count }, (_, index) => ({
                blockNumber: index + 1,
                weight: 0,
                length: 0,
                breadth: 0,
                height: 0,
            }));

            setBlocks(newBlocks);
            form.setValue("blocks", newBlocks);
        } else {
            setBlocks([]);
            form.setValue("blocks", []);
        }
    }

    function calculateVolume(length: number, breadth: number, height: number): string {
        if (length && breadth && height) {
            const volume = length * breadth * height;
            return volume.toFixed(2);
        }
        return "";
    }

    function applyIndividualGlobalDataToAllRows() {
        const updatedBlocks = blocks.map((entry) => ({
            ...entry,
            weight: applyWeightToAll ? parseFloat(globalWeight) || entry.weight : entry.weight,
            length: applyLengthToAll ? parseFloat(globalLength) || entry.length : entry.length,
            breadth: applyBreadthToAll ? parseFloat(globalBreadth) || entry.breadth : entry.breadth,
            height: applyHeightToAll ? parseFloat(globalHeight) || entry.height : entry.height,
        }));
        setBlocks(updatedBlocks);
        form.setValue("blocks", updatedBlocks);
    }

    React.useEffect(() => {
        applyIndividualGlobalDataToAllRows();
    }, [applyWeightToAll, applyLengthToAll, applyBreadthToAll, applyHeightToAll, globalWeight, globalLength, globalBreadth, globalHeight]);

    React.useEffect(() => {
        form.setValue("noOfBlocks", blocks.length.toString());
    }, [blocks, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await postData("/factory-management/inventory/addlotandblocks", {
                ...values,
                status: "active",
            });
            setIsLoading(false);
            toast.success("Lot created/updated successfully");
            router.push("./factorymanagement/inventory/raw/lots");
        } catch (error) {
            console.error("Error creating/updating Lot:", error);
            setIsLoading(false);
            toast.error("Error creating/updating Lot");
        }
        router.refresh();
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

                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <Input
                                value={globalWeight}
                                onChange={(e) => setGlobalWeight(e.target.value)}
                                placeholder="Weight (tons)"
                                type="number"
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <input
                                    type="checkbox"
                                    checked={applyWeightToAll}
                                    onChange={(e) => setApplyWeightToAll(e.target.checked)}
                                />{" "}
                                Apply Weight to all rows
                            </label>
                        </div>
                        <div>
                            <Input
                                value={globalLength}
                                onChange={(e) => setGlobalLength(e.target.value)}
                                placeholder="Length (inch)"
                                type="number"
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <input
                                    type="checkbox"
                                    checked={applyLengthToAll}
                                    onChange={(e) => setApplyLengthToAll(e.target.checked)}
                                />{" "}
                                Apply Length to all rows
                            </label>
                        </div>
                        <div>
                            <Input
                                value={globalBreadth}
                                onChange={(e) => setGlobalBreadth(e.target.value)}
                                placeholder="Breadth (inch)"
                                type="number"
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <input
                                    type="checkbox"
                                    checked={applyBreadthToAll}
                                    onChange={(e) => setApplyBreadthToAll(e.target.checked)}
                                />{" "}
                                Apply Breadth to all rows
                            </label>
                        </div>
                        <div>
                            <Input
                                value={globalHeight}
                                onChange={(e) => setGlobalHeight(e.target.value)}
                                placeholder="Height (inch)"
                                type="number"
                                disabled={isLoading}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                <input
                                    type="checkbox"
                                    checked={applyHeightToAll}
                                    onChange={(e) => setApplyHeightToAll(e.target.checked)}
                                />{" "}
                                Apply Height to all rows
                            </label>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Weight(tons)</TableHead>
                                <TableHead>Length(inch)</TableHead>
                                <TableHead>Breadth(inch)</TableHead>
                                <TableHead>Height(inch)</TableHead>
                                <TableHead>Volume(in³)</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blocks.map((block, index) => (
                                <TableRow key={index}>
                                    <TableCell>{block.blockNumber}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={block.weight}
                                            onChange={(e) => {
                                                const updatedBlocks = [...blocks];
                                                updatedBlocks[index].weight = parseFloat(e.target.value) || 0;
                                                setBlocks(updatedBlocks);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={block.length}
                                            onChange={(e) => {
                                                const updatedBlocks = [...blocks];
                                                updatedBlocks[index].length = parseFloat(e.target.value) || 0;
                                                setBlocks(updatedBlocks);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={block.breadth}
                                            onChange={(e) => {
                                                const updatedBlocks = [...blocks];
                                                updatedBlocks[index].breadth = parseFloat(e.target.value) || 0;
                                                setBlocks(updatedBlocks);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={block.height}
                                            onChange={(e) => {
                                                const updatedBlocks = [...blocks];
                                                updatedBlocks[index].height = parseFloat(e.target.value) || 0;
                                                setBlocks(updatedBlocks);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {calculateVolume(block.length, block.breadth, block.height)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                const updatedBlocks = blocks.filter((_, i) => i !== index);
                                                setBlocks(updatedBlocks);
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button type="submit" disabled={isLoading} >
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}
