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
import { useEffect } from "react";
import { Props } from "recharts/types/cartesian/YAxis";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required" }),
  organizationId: z
    .string()
    .min(1, { message: "Organization must be selected" }),
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  designation: z.string().optional(),
  // min(1, { message: "Position is required" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
  contactPerson: z.string().optional(),
  ContactPersonMobileNumber:z.string().optional(),
  email: z.string().email({ message: "Invalid email format" }),
  mobileNumber: z.string().min(1, { message: "Enter phone number" }),
  alternateMobileNumber: z.string().optional(), // .min(1, { message: "Enter alternate phone number" }).optional(),
  password: z.string().min(6, { message: "Password is required" }),
  confirmPassword: z.string().min(6, { message: "Confirm Password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "",
  path: ["confirmPassword"],
});

interface OrgData {
  OrgData: {
    _id: string;
    name: string;
  }[];
}

export default function TeamFormPage({ OrgData }: OrgData) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Minimum 6 characters required";
    if (/\s/.test(value)) return "No spaces allowed";
    if (!/[0-9]/.test(value)) return "Include at least one number";
    if (!/[A-Z]/.test(value)) return "Include an uppercase letter";
    if (!/[a-z]/.test(value)) return "Include a lowercase letter";
    if (!/[!@#$%^&*()_+\-=\[\]{};:\\|,.<>?]/.test(value))
      return "Add one special character";
    return "";
  };

  const validateAll = () => {
    const newErrors = {
      password: validatePassword(password),
      confirmPassword:
        confirmPassword === password ? "" : "Passwords do not match",
    };
    setErrors(newErrors);
  };

  // console.log("OrgData:", OrgData); // Debugging line

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      organizationId: "",
      employeeId: "",
      designation: "",
      address: { location: "", pincode: "" },
      password: "",
      confirmPassword: "",
      contactPerson: "",
      ContactPersonMobileNumber:"",
      email: "",
      mobileNumber: "",
      alternateMobileNumber: "",
    },
  });

  const router = useRouter();

  const handleSubmit = async (values: any) => {
    console.log("Form values:", values);
    setIsLoading(true);
    try {
      await postData("/employers/add/", values);
      toast.success("Employee added successfully");
      router.push("./");
    } catch (error: any) {
      console.error("Error creating/updating employee:", error);

      if (error.response && error.response.status === 400) {
        if (
          error.response.data.message ===
          "Employee ID exists, please try a unique ID"
        ) {
          toast.error("Employee already exists, please use a unique ID.");
        } else {
          toast.error(error.response.data.message || "Bad Request");
        }
      } else {
        toast.error("Error creating/updating employee");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* <h2 className="text-2xl font-bold mb-4">Add Team Member</h2> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="fullName"
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
                        {OrgData.length > 0 ? (
                          OrgData.map((org) => (
                            <SelectItem key={org._id} value={org._id}>
                              {org.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-org">
                            No organizations available
                          </SelectItem>
                        )}
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
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
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
                    <Input placeholder="Eg: 100001" {...field} maxLength={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(e);
                        setPassword(val);
                        setErrors((prev) => ({
                          ...prev,
                          password: validatePassword(val),
                        }));
                      }}
                    />
                  </FormControl>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-enter your password"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(e);
                        setConfirmPassword(val);
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword:
                            val === password ? "" : "Passwords do not match",
                        }));
                      }}
                    />
                  </FormControl>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
            <h3 className="text-lg font-semibold md:col-span-2">
              Contact Information
            </h3>
            
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
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
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: 9876543210" {...field} maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alternate Phone Number */}
            <FormField
              control={form.control}
              name="alternateMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: 9123456789" {...field} maxLength={10}/>
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
                    <Input placeholder="Eg: Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ContactPersonMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Contact Person Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: 9123456789" {...field} maxLength={10}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <Button type="submit" disabled={isLoading}>
            Submit
          </Button> */}

          <Button
            disabled={isLoading}
            onClick={form.handleSubmit(async (values) => {
              setIsLoading(true);
              try {
                await postData("/employers/add/", {
                  ...values,
                  status: "active",
                });

                toast.success("Team member added successfully");

                router.push("./");

                //  setTimeout(() => {
                // }, 500);
              } catch (error: any) {
                console.error("Error creating team member:", error);
                if (error.response?.status === 400) {
                  toast.error(error.response.data.message || "Bad Request");
                } else {
                  toast.error("Failed to create team member");
                }
              } finally {
                setIsLoading(false);
              }
            })}
          >
            Confirm
          </Button>
        </form>
      </Form>
    </div>
  );
}
