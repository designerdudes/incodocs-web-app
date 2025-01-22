"use client";
import * as React from "react";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { putData } from "@/axiosUtility/api";

interface MarkPolishFormProps extends React.HTMLAttributes<HTMLDivElement> {
    BlockData: any;
    gap: number;
}

const formSchema = z.object({
    _id: z.string().optional(),
    blockNumber: z.string().min(3, { message: "Block number is required" }),
    slabId: z.string().min(3, { message: "Slab ID is required" }),
    trimValue: z.object({
        length: z.string()
            .min(1, { message: "Length must be a positive number" })
            .refine((val) => parseFloat(val) > 0, { message: "Length must be greater than zero" }),
        height: z.string()
            .min(1, { message: "Height must be a positive number" })
            .refine((val) => parseFloat(val) > 0, { message: "Height must be greater than zero" }),
    }),
});

export function MarkPolishForm({ BlockData, className, gap, ...props }: MarkPolishFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: BlockData?._id || "",
            slabId: BlockData?.slabId || "",
            blockNumber: BlockData?.blockNumber || "",
            trimValue: { length: "", height: "" },
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await putData(`/factory-management/inventory/finished/put/${BlockData._id}`, {
                ...values,
                status: "polished",
            });
            
        
            console.log("Values", values)
          toast.success("Slab data updated successfully");
          router.push("../../");
        } catch (error) {
          toast.error("An error occurred while updating data");
        } finally {
          setIsLoading(false);
        }
      }


    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Input Fields */}
                    <div className={`grid grid-cols-${gap} gap-3`}>
                        {/* Slab ID (Disabled) */}
                        <FormField
                            name="slabId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slab ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Slab001"
                                            disabled
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Block Number (Disabled) */}
                        <FormField
                            name="blockNumber"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Block Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. 12345"
                                            disabled
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Trim Value - Length */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                name="trimValue.length"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Length (in inches)</FormLabel>
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

                            {/* Trim Value - Height */}
                            <FormField
                                name="trimValue.height"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Height (in inches)</FormLabel>
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
                        </div>
                    </div>

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
