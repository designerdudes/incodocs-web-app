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
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { FileUploadField } from "../../documentation/shipment/createnew/components/FileUploadField";

// TeamMember Form Schema
const formSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required" }),
  organizationId: z.string(),
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  designation: z.string().optional(),
  address: z.object({
    location: z.string().optional(),
    pincode: z.string().optional(),
  }),
  contactPerson: z.string().optional(),
  teamMemberPhoto: z.string().optional(),
  email: z.string().email({ message: "Invalid email format" }),
  mobileNumber: z.union([z.string(), z.number()]).default(""),
  alternateMobileNumber: z.union([z.string(), z.number()]).default(""),
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
  console.log("EditTeamMemberForm params:", params);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      organizationId: "",
      employeeId: "",
      designation: "",
      address: { location: "", pincode: "" },
      contactPerson: "",
      teamMemberPhoto: "",
      email: "",
      mobileNumber: "",
      alternateMobileNumber: "",
    },
  });

  const EmployeeId = params._id;

  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        setIsFetching(true);
        const response = await fetchData(`/user/populate/${EmployeeId}`);

        const data = response;
        console.log("Fetched Employee data:", data);
        // Reset form with fetched values
        form.reset({
          fullName: data?.fullName,
          organizationId: data?.memberInOrganizations?.[0]?._id || "",
          employeeId: data?.employeeId,
          designation: data?.designation,
          address: {
            location: data?.address.location,
            pincode: data?.address.pincode || "",
          },
          contactPerson: data?.contactPerson,
          teamMemberPhoto: data?.teamMemberPhoto,
          email: data?.email,
          mobileNumber: data?.mobileNumber,
          alternateMobileNumber: data?.alternateMobileNumber,
        });
        console.log("Form reset with fetched data:", form.getValues());
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
    setIsLoading(true);
    console.log("Submitting form with values:", values);
    try {
      await putData(`/employers/put/${EmployeeId}`, values);
      toast.success("Team Member details updated successfully");
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update Team Member details");
    } finally {
      setIsLoading(false);
    }
    GlobalModal.onClose();
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
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Naveen" type="text" {...field} />
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
                  <Input
                    placeholder="Eg: 1234555678"
                    type="text"
                    {...field}
                   onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      field.onChange(value);
                    }
                  }}
                    maxLength={10}
                    minLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Naveen" type="text" {...field} />
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
                  <Input
                    placeholder="Eg: 1234567890"
                    type="text"
                    {...field}
                   onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      field.onChange(value);
                    }
                  }}
                    maxLength={10}
                    minLength={10}
                  />
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
                  <Input placeholder="Eg: 741852963" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamMemberPhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Machine Photo</FormLabel>
                <FormControl>
                  <FileUploadField
                    name={field.name}
                    storageKey="teamMemberPhoto"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Eg: Developer" type="text" {...field} />
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
                  <Input
                    placeholder="Eg: 560001"
                    type="text"
                    {...field}
                    onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      field.onChange(value);
                    }
                  }}
                    maxLength={6}
                    minLength={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
}
