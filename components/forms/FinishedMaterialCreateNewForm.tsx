"use client"
import React from 'react'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Heading from "@/components/ui/heading"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { Icons } from '../ui/icons'
// Define the schema according to the new structure
const formSchema = z.object({
    productName: z.string().min(3, { message: "Product name must be at least 3 characters long" }),
    quantity: z.string().min(1, { message: "Quantity must be a positive number" }).refine(val => parseInt(val, 10) > 0, {
        message: "Quantity must be greater than zero"
    }),
    rawInventoryId: z.string().min(1, { message: "Raw inventory ID is required" }),
    weight: z.object({
        value: z.string().min(1, { message: "Weight must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Weight must be greater than zero"
        })
    }),
    length: z.object({
        value: z.string().min(1, { message: "Length must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Length must be greater than zero"
        })
    }),
    breadth: z.object({
        value: z.string().min(1, { message: "Breadth must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Breadth must be greater than zero"
        })
    }),
    thickness: z.object({
        value: z.string().min(1, { message: "Thickness must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Thickness must be greater than zero"
        })
    })
});

interface NewFormProps extends React.HTMLAttributes<HTMLDivElement> {
    gap: number;
}

function FinishedMaterialCreateNewForm({ className, gap }: NewFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
        } catch (error) {
            console.error("Form submission error", error);
        }
    }
    return (
        <div className={cn("grid gap-6", className)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: Steps"
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Enter the name of the finished product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 10"
                                        type="number"
                                        min="1"
                                        step="any"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Enter the quantity of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Nested fields for weight, length, breadth, and thickness */}
                    <FormField
                        control={form.control}
                        name="weight.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 12"
                                        type="number"
                                        min="1"
                                        step="any"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Enter the weight of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="length.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Length</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 12"
                                        type="number"
                                        min="1"
                                        step="any"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Enter the length of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="breadth.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Breadth</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 10"
                                        type="number"
                                        min="1"
                                        step="any"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Enter the breadth of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="thickness.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thickness</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 2"
                                        type="number"
                                        min="1"
                                        step="any"
                                        {...field} />
                                </FormControl>
                                <FormDescription>Enter the thickness of the product</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className={`${gap === 2 ? 'w-full' : 'grid gap-3 grid-cols-3'}`}>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Edit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default FinishedMaterialCreateNewForm