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

const formSchema = z.object({
  teamMemberName: z.string().min(1, { message: "Name is required" }),
  organizationId: z
    .string()
    .min(1, { message: "Organization must be selected" }),
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
  contactInformation: z.object({
    contactPerson: z.string().min(1, { message: "Contact person is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    phoneNumber: z.string().min(1, { message: "Enter phone number" }),
    alternatePhone: z
      .string()
      .min(1, { message: "Enter alternate phone number" }),
  }),
});

const organizations = [
  { id: "674b0a687d4f4b21c6c980ba", name: "Organization Jabal" },
];

export default function TeamFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamMemberName: "",
      organizationId: "",
      employeeId: "",
      role: "",
      position: "",
      address: { location: "", pincode: "" },
      contactInformation: {
        contactPerson: "",
        email: "",
        phoneNumber: "",
        alternatePhone: "",
      },
    },
  });

  const router = useRouter();

  const handleSubmit = async (values:any) => {
    setIsLoading(true);
    try {
      await postData("/employers/add/", values);
      toast.success("Employee added successfully");
      router.push("./");
    } catch (error) {
      console.error("Error creating/updating employee:", error);
      toast.error("Error creating/updating employee");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Add Team Member</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
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
                    <Input
                      placeholder="Eg: 123 Main Street, New York"
                      {...field}
                    />
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
                    <Input placeholder="Eg: 100001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
            <h3 className="text-lg font-semibold md:col-span-2">
              Contact Information
            </h3>
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
                    <Input
                      type="email"
                      placeholder="Eg: jane.smith@example.com"
                      {...field}
                    />
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

          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
