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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// TeamMember Form Schema
const formSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required" }),
  organizationId: z
    .string()
    .min(1, { message: "Organization must be selected" }),
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z.string().min(6, { message: "Pincode must be at least 6 characters" }),
  }),
  contactPerson: z.string().min(1, { message: "Contact person is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  mobileNumber: z.string().min(1, { message: "Enter phone number" }),
  alternateMobileNumber: z.string().optional(),
});

interface Props {
  params: {
    _id: string; // Lot ID
  };
}

export default function EditTeamMemberForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      organizationId: "",
      employeeId: "",
      role: "",
      position: "",
      address: { location: "", pincode: "" },
      contactPerson: "",
      email: "",
      mobileNumber: "",
      alternateMobileNumber:"",
    },
  });

  const EmployeeId = params._id;
  

  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          `https://incodocs-server.onrender.com/user/populate/${EmployeeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Employee data");
        }
        const data = await response.json();
        // Reset form with fetched values
        form.reset({
          fullName: data.fullName,
          organizationId: data.organizationId,
          employeeId: data.employeeId,
          role: data.role,
          position: data.position,
          address: {
            location: data.address.location,
            pincode: data.address.pincode || "",
          },
           contactPerson: data.contactPerson,
           email: data.email,
           mobileNumber: data.mobileNumber,
           alternateMobileNumber: data.alternateMobileNumber
        });
      } catch (error) {
        console.error("Error fetching Employee data:", error);
        toast.error("Failed to fetch Employee data");
      } finally {
        setIsFetching(false);
      }
    }


    fetchData();
  }, [EmployeeId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
  setIsLoading(true);
  GlobalModal.title = "Confirm Employee Details";
  GlobalModal.description =
    "Are you sure you want to update this Employee's details?";
  GlobalModal.children = (
      <div className="space-y-4">
        <p>Contact Person: {values.fullName}</p>
        <p>Email ID: {values.email}</p>
        <p>Employee ID: {values.employeeId}</p>
    
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
        
          onSubmit={async () => {
            try {
              await putData(`/employers/put/${EmployeeId}`, values);
              setIsLoading(false);
              GlobalModal.onClose();
              toast.success("Employee details updated successfully");
              window.location.reload();
            } catch (error) {
              console.error("Error updating employee details:", error);
              setIsLoading(false);
              GlobalModal.onClose();
              toast.error("Error updating employee details");
            }
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Lot ABC" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Id</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: XYZ123@gmail.com"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: 1234555678" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alternateMobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternate Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: 1234567890" type="text" {...field} />
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
                <FormLabel>Emloyee Id</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: 741852963"  type="text" {...field} />
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
                  <Input
                    placeholder="Eg: organuzation"
                    type="text"
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Bangalore" type="text" {...field} />
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
                  <Input placeholder="Eg: 560001" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Submit
        </Button>
      </form>
    </Form>
  );
}
