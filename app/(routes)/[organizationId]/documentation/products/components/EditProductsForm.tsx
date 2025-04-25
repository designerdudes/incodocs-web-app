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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

const productSchema = z.object({
    code: z.string().min(1, { message: "Code is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    unit: z.string().min(1, { message: "Unit of Measurement is required" }),
    countryOfOrigin: z.string().min(1, { message: "Select a country" }),
    hsCode: z.string().min(1, { message: "HS Code is required" }),
    prices: z.array(
        z.object({
            variantName: z.string().min(1, { message: "Variant name is required" }),
            variantType: z.string().min(1, { message: "Variant type is required" }),
            sellPrice: z.number().min(0),
            buyPrice: z.number().min(0),
        })
    ),
    netWeight: z.number().min(0),
    grossWeight: z.number().min(0),
    cubicMeasurement: z.number().min(0),
});


const organizations = [
    { id: "674b0a687d4f4b21c6c980ba", name: "Organization Jabal" },
];



export default function ProductFormPage() {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            code: "",
            description: "",
            unit: "",
            countryOfOrigin: "",
            hsCode: "",
            prices: [
                {
                    variantName: "",
                    variantType: "",
                    sellPrice: 0,
                    buyPrice: 0,
                },
            ],
            netWeight: 0,
            grossWeight: 0,
            cubicMeasurement: 0,
        },
    });


    const router = useRouter();

    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        try {
            await postData("/employers/add/", values);
            toast.success("Employee added successfully");
            router.push("./");
        } catch (error: any) {
            console.error("Error creating/updating employee:", error);

            if (error.response && error.response.status === 400) {
                if (error.response.data.message === "Employee ID exists, please try a unique ID") {
                    toast.error("Employee already exists, please use a unique ID.");
                } else {
                    toast.error(error.response.data.message || "Bad Request");
                }
            } else {
                toast.error("Error creating/updating employee");
            }
        }
        setIsLoading(false);
    };


    return (
        <div className="space-y-6">
            {/* <h2 className="text-2xl font-bold mb-4">Add Team Member</h2> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl><Input placeholder="Eg: PROD-001" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Input placeholder="Eg: Premium Marble Slab" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit of Measurement</FormLabel>
                                    <FormControl><Input placeholder="Eg: Sq. Ft" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="countryOfOrigin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country of Origin</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="India">India</SelectItem>
                                            <SelectItem value="China">China</SelectItem>
                                            <SelectItem value="Turkey">Turkey</SelectItem>
                                            {/* Add more countries as needed */}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="hsCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>HS Code</FormLabel>
                                    <FormControl><Input placeholder="Eg: 25151200" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                        <h3 className="text-lg font-semibold col-span-3">Price Variant</h3>
                        {form.watch("prices").map((_, index) => (
                            <React.Fragment key={index}>
                                <FormField
                                    control={form.control}
                                    name={`prices.${index}.variantName`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Name</FormLabel>
                                            <FormControl><Input placeholder="Eg: Retail" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`prices.${index}.variantType`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Type</FormLabel>
                                            <FormControl><Input placeholder="Eg: Whole" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`prices.${index}.sellPrice`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sell Price</FormLabel>
                                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`prices.${index}.buyPrice`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Buy Price</FormLabel>
                                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="netWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Net Weight (Kg)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="grossWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gross Weight (Kg)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cubicMeasurement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cubic Measurement (m³)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Submit "}
                    </Button>
                </form>
            </Form>

        </div>
    );
}