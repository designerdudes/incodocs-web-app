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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

// Factory Form Schema
const formSchema = z.object({
    factoryName: z.string().min(1, { message: "Factory Name is required" }),
    organizationId: z.string().min(1, { message: "Organization must be selected" }),
    address: z.object({
        location: z.string().min(1, { message: "Location is required" }),
        coordinates: z.object({
            longitude: z.number({ invalid_type_error: "Must be a number" }),
            latitude: z.number({ invalid_type_error: "Must be a number" }),
        }),
        pincode: z.string().min(6, { message: "Pincode must be at least 6 characters" }),
    }),
});

const organizations = [
    { id: "6716c1bf34d6bd442d8a0e59", name: "Organization A" },
    { id: "8826c1bf34d6bd442d8b1e71", name: "Organization B" },
    { id: "9936c1bf34d6bd442d8c2f82", name: "Organization C" },
];

function FactoryForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            factoryName: "",
            organizationId: "",
            address: {
                location: "",
                coordinates: {
                    longitude: 0,
                    latitude: 0,
                },
                pincode: "",
            },
        },
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter();

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        GlobalModal.title = "Confirm Factory Details";
        GlobalModal.description = "Please review the entered details:";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>
                    <strong>Factory Name:</strong> {values.factoryName}
                </p>
                <p>
                    <strong>Organization:</strong>{" "}
                    {
                        organizations.find((org) => org.id === values.organizationId)?.name
                    }
                </p>
                <p>
                    <strong>Address:</strong> {values.address.location}
                </p>
                <p>
                    <strong>Coordinates:</strong>{" "}
                    {`Longitude: ${values.address.coordinates.longitude}, Latitude: ${values.address.coordinates.latitude}`}
                </p>
                <p>
                    <strong>Pincode:</strong> {values.address.pincode}
                </p>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            GlobalModal.onClose();
                            setIsLoading(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Factory Details Submitted:", values);
                            GlobalModal.onClose();
                            router.push("./dashboard");
                            setIsLoading(false);
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        );
        GlobalModal.onOpen();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid gap-4"
            >
                {/* Factory Name */}
                <FormField
                    control={form.control}
                    name="factoryName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Factory Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: Factory A" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Organization Dropdown */}
                <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organization</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizations.map((org) => (
                                            <SelectItem key={org.id} value={org.id}>
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Address Fields */}
                <FormField
                    control={form.control}
                    name="address.location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: 343 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Pincode */}
                <FormField
                    control={form.control}
                    name="address.pincode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: 500081" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                </Button>
            </form>
        </Form>
    );
}

export default FactoryForm;
