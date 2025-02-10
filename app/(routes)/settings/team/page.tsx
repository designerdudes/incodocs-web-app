"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Heading from "@/components/ui/heading";

// Factory Form Schema
const formSchema = z.object({
  factoryName: z.string().min(1, { message: "Factory Name is required" }),
  organizationId: z
    .string()
    .min(1, { message: "Organization must be selected" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
});

function FactoryForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      factoryName: "",
      organizationId: "",
      address: {
        location: "",
        pincode: "",
      },
    },
  });

  return (
    <div className="w-[700px] mx-5 p-6  ">
      <div className="topbar w-full flex items-center justify-between mb-2">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1 mb-3">
          <Heading className="leading-tight" title="Team Member Management" />
          <p className="text-muted-foreground text-sm">
            Fill in the form below to edit a team memeber details.
          </p>
        </div>
      </div>

      <Form {...form}>
       <div className="space-y-4 mt-10">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Person */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Contact Person
              </label>
              <input
                type="text"
                placeholder="Enter contact person's name"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Alternate Phone Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Alternate Phone
              </label>
              <input
                type="tel"
                placeholder="Enter alternate phone number"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {/* Factory Name */}
          <FormField
            name="factoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Eg: Factory A"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="address.location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Emloyee Id
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Eslo123"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Organization Dropdown */}
          <FormField
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Role
                </FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                  </Select>
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
                  Position
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Eg: 343 Main Street"
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
                    placeholder="Eg: 500081"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
      {/* Submit Button */}
      <div className="mt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-300"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
    </div>
  );
}

export default FactoryForm;
