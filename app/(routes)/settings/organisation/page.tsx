"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, X } from "lucide-react";
import Link from "next/link";
import Heading from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Icons } from "@/components/ui/icons";

// Define schema for form validation
const organizationFormSchema = z.object({
  name: z.string().min(1, { message: "Organization name is required" }),
  description: z.string().optional(),
  address: z.object({
    location: z.string().min(1, { message: "Address is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" })
      .max(10, { message: "Pincode cannot exceed 10 characters" }),
  }),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

// Organization data type based on API response
interface Organization {
  _id: string;
  name: string;
  description: string;
  address: {
    location: string;
    pincode: string;
  };
  owner: {
    fullName: string;
    email: string;
    mobileNumber: number;
  };
  teams: string[];
  employees: string[];
  createdAt: string;
  updatedAt: string;
}

export default function OrganizationSettingPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: {
        location: "",
        pincode: "",
      },
    },
  });

  // Fetch organization details on mount
  useEffect(() => {
    const fetchOrganization = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://incodocs-server.onrender.com/organizations/get/674b0a687d4f4b21c6c980ba"
        );
        if (!response.ok) throw new Error("Failed to fetch organization");
        const data = await response.json();
        setOrganization(data);
        // Set form values
        form.reset({
          name: data.name,
          description: data.description,
          address: {
            location: data.address.location,
            pincode: data.address.pincode,
          },
        });
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast.error("Failed to load organization details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganization();
  }, [form]);

  // Handle form submission
  const onSubmit = async (values: OrganizationFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://incodocs-server.onrender.com/organizations/update/674b0a687d4f4b21c6c980ba",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) throw new Error("Failed to update organization");
      const updatedData = await response.json();
      setOrganization(updatedData);
      setIsEditing(false);
      toast.success("Organization updated successfully");
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("Failed to update organization");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && organization) {
      // Reset form to current organization values when entering edit mode
      form.reset({
        name: organization.name,
        description: organization.description,
        address: {
          location: organization.address.location,
          pincode: organization.address.pincode,
        },
      });
    }
  };

  return (
    <div className="space-y-6 ml-7">
      {/* Top Bar */}
      <div className="topbar w-full flex items-center justify-between mb-2">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Organization Settings" />
          <p className="text-muted-foreground text-sm">
            View and manage your organization details.
          </p>
        </div>
      </div>
      <Separator />

      {/* Organization Details */}
      <div className="space-y-4 mr-6">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Organization Details</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditToggle}
              disabled={isLoading}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jabal" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Textarea
                            placeholder="e.g., This is a sample organization"
                            {...field}
                          />
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
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 343 Example Street" {...field} />
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
                          <Input placeholder="e.g., 500008" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditToggle}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{organization?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>{organization?.description || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell>{organization?.address.location || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pincode</TableCell>
                    <TableCell>{organization?.address.pincode || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Owner Name</TableCell>
                    <TableCell>{organization?.owner.fullName || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Owner Email</TableCell>
                    <TableCell>{organization?.owner.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Owner Contact</TableCell>
                    <TableCell>{organization?.owner.mobileNumber || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Teams</TableCell>
                    <TableCell>{organization?.teams.length || 0} team(s)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Employees</TableCell>
                    <TableCell>{organization?.employees.length || 0} employee(s)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}