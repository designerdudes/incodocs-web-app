"use client";
import React, { useEffect, useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// Form Schema
const formSchema = z.object({
    teamMemberName: z.string().min(1, { message: "Name is required" }),
    organizationId: z.string().min(1, { message: "Organization must be selected" }),
    employeeId: z.string().min(1, { message: "Employee ID is required" }),
    role: z.string().min(1, { message: "Role is required" }),
    position: z.string().min(1, { message: "Position is required" }),
    address: z.object({
        location: z.string().min(1, { message: "Location is required" }),
        pincode: z.string().min(6, { message: "Pincode must be at least 6 characters" }),
    }),
    contactInformation: z.object({
        contactPerson: z.string().min(1, { message: "Contact person is required" }),
        email: z.string().email({ message: "Invalid email format" }),
        phoneNumber: z.string().min(1, { message: "Enter phone number" }),
        alternatePhone: z.string().min(1, { message: "Enter alternate phone number" }),
    }),
});

interface Props {
    params: {
        _id: string;
    };
}

export default function EditFactoryForm({ params }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false); // New state for confirmation
    const router = useRouter();
    const EmployeeId = params._id;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamMemberName: "",
            organizationId: "",
            employeeId: "",
            role: "",
            position: "",
            address: {
                location: "",
                pincode: "",
            },
            contactInformation: {
                contactPerson: "",
                email: "",
                phoneNumber: "",
                alternatePhone: "",
            },
        },
    });

    useEffect(() => {
        async function fetchEmployeeData() {
            try {
                setIsFetching(true);
                const response = await fetch(
                    `http://localhost:4080/employers/getone/${EmployeeId}`
                );
                if (!response.ok) throw new Error("Failed to fetch Employee data");
                const data = await response.json();

                form.reset({
                    teamMemberName: data.teamMemberName,
                    organizationId: data.organizationId,
                    employeeId: data.employeeId,
                    role: data.role,
                    position: data.position,
                    address: {
                        location: data.address.location,
                        pincode: data.address.pincode || "",
                    },
                    contactInformation: {
                        contactPerson: data.contactInformation.contactPerson,
                        email: data.contactInformation.email,
                        phoneNumber: data.contactInformation.phoneNumber,
                        alternatePhone: data.contactInformation.alternatePhone,
                    },
                });
            } catch (error) {
                console.error("Error fetching Employee data:", error);
                toast.error("Failed to fetch Employee data");
            } finally {
                setIsFetching(false);
            }
        }
        fetchEmployeeData();
    }, [EmployeeId, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!isConfirming) {
            setIsConfirming(true);
            toast("Click submit again to confirm.", { icon: "⚠️" });
            return;
        }

        setIsLoading(true);
        try {
            await putData(`/employers/put/${EmployeeId}`, values);
            toast.success("Employee Details updated successfully");
            router.push("/employees"); // Redirect after successful update
        } catch (error) {
            console.error("Error updating Employee Details:", error);
            toast.error("Error updating Employee Details");
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Employee Details</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="teamMemberName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactInformation.email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactInformation.phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="EMP1234" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Developer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address.location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bangalore" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address.pincode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pincode</FormLabel>
                                    <FormControl>
                                        <Input placeholder="560001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
