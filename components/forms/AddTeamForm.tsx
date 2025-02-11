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
import { Toast } from "../ui/toast";
import toast from "react-hot-toast";

// Factory Form Schema
const formSchema = z.object({
    EmployeeName: z.string().min(1, { message: " Name is required" }),
    EmployeeEmailId: z.string().min(1, { message: "Email is required" }),
    phoneNumber: z.string().min(1, { message: " enter phone number" }),
    AlternatePhone: z.string().min(1, { message: " enter phone number" }),
    factoryName: z.string().min(1, { message: " Name is required" }),
    EmloyeeId: z.string().min(1, { message: " enter EmployeeId" }),
    organizationId: z.string().min(1, { message: "Organization must be selected" }),
    address: z.object({
        location: z.string().min(1, { message: "Location is required" }),
        pincode: z.string().min(6, { message: "Pincode must be at least 6 characters" }),
    }),
});

const organizations = [
    { id: "674b0a687d4f4b21c6c980ba", name: "Organization Jabal" },
    { id:"684c47u4nf7n48nf4h8f38fh8a", name: "organization naval"}
];

function TeamForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            EmployeeName : "",
            EmployeeEmailId : "" ,
            phoneNumber: "",
            AlternatePhone:"" ,
            factoryName: "" ,
            EmloyeeId: "" ,
            organizationId: "" ,
            address: {
             location: "" ,
              pincode: "" ,
            },
        },
    });

    const GlobalModal = useGlobalModal();
    const router = useRouter();

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        GlobalModal.title = "Confirm Factory Details";
        GlobalModal.description = "Please review the entered details:";
        GlobalModal.children = (
            <div className="space-y-4">
                <p>
                    <strong>EmployeeName:</strong> {values.EmployeeName}
                </p>
                <p>
                    <strong>EmployeeEmailId:</strong> {values.EmployeeEmailId}
                </p>
                <p>
                    <strong>phoneNumber:</strong> {values.phoneNumber}
                </p>
                <p>
                    <strong>AlternatePhone:</strong> {values.AlternatePhone}
                </p>
                <p>
                    <strong>factoryName:</strong> {values.factoryName}
                </p>
                <p>
                    <strong>EmloyeeId:</strong> {values.EmloyeeId}
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
                                await postData("/factory/add", {
                                    ...values,
                                    status: "active",
                                });
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.success(" created/updated successfully");
                                // router.push("./dashboard");
                            } catch (error) {
                                console.error("Error creating/updating member:", error);
                                setIsLoading(false);
                                GlobalModal.onClose();
                                toast.error("Error creating/updating member");
                            }
                            window.location.reload();
                        }
                        }
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
             <div className="flex">  
              <div className="pr-3">
                {/* EmployeeName */}
                <FormField
                    control={form.control}
                    name="EmployeeName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employee Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: EmployeeName ABC" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="EmployeeEmailId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employee Email Id</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: EmployeeEmailId" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: phoneNumber" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="AlternatePhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alternate Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: AlternatePhone" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              <div className="pl-3">
                <FormField
                    control={form.control}
                    name="factoryName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>FctoryName</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: factoryName" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="EmloyeeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>EmloyeeId</FormLabel>
                            <FormControl>
                                <Input placeholder="Eg: EmloyeeId" {...field} />
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
                                        <SelectValue placeholder="Select an Organization" />
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
              </div>
             </div> 
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

export default TeamForm;
