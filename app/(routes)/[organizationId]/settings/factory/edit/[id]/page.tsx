'use client';
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    factoryName: z.string().min(1, { message: "Factory Name is required" }),
    gstNo: z.string().min(1, { message: "GST Number is required" }),
    address: z.object({
        location: z.string().min(1, { message: "Location is required" }),
        pincode: z
            .string()
            .min(6, { message: "Pincode must be at least 6 characters" }),
    }),
    createdAt: z.number().min(0, { message: "date should be number" }),
    workersCuttingPay: z.string().min(0, { message: "Pay must be positive" }),
    workersPolishingPay: z.string().min(0, { message: "Pay must be positive" }),
});

export default function EditFactoryPage({ params }: { params: { id: string } }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            factoryName: "",
            gstNo: "",
            address: {
                location: "",
                pincode: "",
            },
            createdAt: 0,
            workersCuttingPay: "",
            workersPolishingPay: "",
        },
    });

    return (
        <div className='w-full space-y-2 h-full flex p-6 flex-col'>
            <div className="topbar w-full flex items-center justify-between">
                <Link href="../">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading className='leading-tight' title='Edit Factory  Detail' />
                    <p className='text-muted-foreground text-sm'>Fill in the form below to edit the factory details</p>
                </div>
            </div>
            <Separator orientation='horizontal' />
            <div className="container mx-auto">
                <Form {...form}>
                    <div className="space-y-4">
                        {/* Factory Name */}
                        <FormField
                            name="factoryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-gray-700">
                                        Factory Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            // defaultValue={Data.factoryName}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="gstNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-gray-700">
                                        GST Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            // defaultValue={Data.gstNo}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Address Fields */}
                        <FormField
                            name="address.location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-gray-700">
                                        Location
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            // defaultValue={Data.address.location}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Pincode */}
                        <FormField
                            name="address.pincode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-gray-700">
                                        Pincode
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            // defaultValue={Data.address.pincode}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="createdAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-gray-700">
                                        Created Date
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                            // defaultValue={Data.createdAt}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="flex mt-5">
                        <div className=" mr-10">
                            <FormField
                                name="workersCuttingPay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-700">
                                            Workers Cutting Pay
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                            type="string"
                                                className=" px-14 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                disabled={isLoading}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseFloat(value) : undefined);
                                                  }}
                                                  value={field.value}
                                                // defaultValue={Data.workersCuttingPay}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                name="workersPolishingPay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium text-gray-700">
                                            Workers Polish Pay
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                            type="string"
                                                className="px-14 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                disabled={isLoading}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value ? parseFloat(value) : undefined);
                                                  }}
                                                  value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-4 mt-10"></div>
                    {/* Update Button */}
                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className=" bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-300"
                        >
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
