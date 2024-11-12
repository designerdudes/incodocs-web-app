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
    materialName: z.string().min(3, { message: "Material name must be at least 3 characters long" }),
    materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
    quantity: z.string().min(1, { message: "Quantity must be a positive number" }).refine(val => parseFloat(val) > 0, {
        message: "Quantity must be greater than zero"
    }),
    weight: z.object({
        value: z.string().min(1, { message: "Weight must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Weight must be greater than zero"
        }),
        unit: z.string().optional(),
    }),
    length: z.object({
        value: z.string().min(1, { message: "Length must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Length must be greater than zero"
        }),
        unit: z.string().optional(),
    }),
    breadth: z.object({
        value: z.string().min(1, { message: "Breadth must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Breadth must be greater than zero"
        }),
        unit: z.string().optional(),
    }),
    height: z.object({
        value: z.string().min(1, { message: "Height must be a positive number" }).refine(val => parseFloat(val) > 0, {
            message: "Height must be greater than zero"
        }),
        unit: z.string().optional(),
    })
});

interface NewFormProps extends React.HTMLAttributes<HTMLDivElement> {
    gap: number;
}

function RawMaterialCreateNewForm({ className, gap }: NewFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
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
                        name="materialName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Material Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: Blackyard"
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="materialType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Material Type</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: TypeABC"
                                        type="text"
                                        {...field} />
                                </FormControl>
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
                                        placeholder="Eg: 12"
                                        type="number"
                                        step="any"
                                        min="0"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="weight.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 10.5"
                                        type="number"
                                        step="any"
                                        min="0"
                                        {...field} />
                                </FormControl>
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
                                        placeholder="Eg: 10.5"
                                        type="number"
                                        step="any"
                                        min="0"
                                        {...field} />
                                </FormControl>
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
                                        placeholder="Eg: 3.2"
                                        type="number"
                                        step="any"
                                        min="0"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="height.value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Height</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Eg: 54"
                                        type="number"
                                        step="any"
                                        min="0"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className={`${gap === 2 ? 'w-full' : 'grid gap-3 grid-cols-3'}`}>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default RawMaterialCreateNewForm