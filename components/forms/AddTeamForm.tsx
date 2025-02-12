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
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// TeamMember Form Schema
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


const organizations = [
    { id: "674b0a687d4f4b21c6c980ba", name: "Organization Jabal" },
];

export default function TeamForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamMemberName: "",
            contactInformation: {
                email: "",
                phoneNumber: "",
                alternatePhone: "",
                contactPerson: "",
            },
            role: "",
            position: "",
            employeeId: "",
            organizationId: "",
            address: {
                location: "",
                pincode: "",
            },
        },
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter();

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        GlobalModal.title = "Confirm Team Members Details";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>
                    <strong>Employee Name:</strong> {values.teamMemberName}
                </p>
                <p>
                    <strong>Email:</strong> {values.contactInformation.email}
                </p>
                <p>
                    <strong>Phone Number:</strong> {values.contactInformation.phoneNumber}
                </p>
                <p>
                    <strong>Alternate Phone:</strong> {values.contactInformation.alternatePhone}
                </p>
                <p>
                    <strong>Employee ID:</strong> {values.employeeId}
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
                        onClick={async () => {
                            try {
                                await postData("/employers/add/", {
                                    ...values,
                                });
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.success(" Employee added successfully");
                                console.log(values);
                            } catch (error) {
                                console.error("Error creating/updating employee:", error);
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.error("Error creating/updating employee");
                            }
                            window.location.reload();
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="grid gap-4">
                    {/* Team Member Name */}
                    <FormField
                        control={form.control}
                        name="teamMemberName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Member Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: John Doe" {...field} />
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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

                    {/* Employee ID */}
                    <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employee ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: EMP1234" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Role */}
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: Developer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Right Column */}
                <div className="grid gap-4">
                    {/* Position */}
                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: Software Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address - Location */}
                    <FormField
                        control={form.control}
                        name="address.location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: 123 Main Street, New York" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address - Pincode */}
                    <FormField
                        control={form.control}
                        name="address.pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: 100001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Full-width Contact Information Section */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
                    <h3 className="text-lg font-semibold md:col-span-2">Contact Information</h3>

                    {/* Contact Person */}
                    <FormField
                        control={form.control}
                        name="contactInformation.contactPerson"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Person</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: Jane Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="contactInformation.email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Eg: jane.smith@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone Number */}
                    <FormField
                        control={form.control}
                        name="contactInformation.phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: 9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Alternate Phone Number */}
                    <FormField
                        control={form.control}
                        name="contactInformation.alternatePhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alternate Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Eg: 9123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Submit Button (Full Width) */}
                <div className="md:col-span-2">
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </div>
            </form>
        </Form>

    );
}

