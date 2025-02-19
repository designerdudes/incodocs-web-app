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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// Transporter Form Schema
const formSchema = z.object({
  Address: z.string().min(1, { message: "Address is required" }),
  ResponsiblePerson: z.string().min(1, { message: "Responsible Person is required" }),
  MobileNumber: z.string().min(10, { message: "Enter a valid Mobile Number" }),
  Email: z.string().email({ message: "Enter a valid Email" }),
});

function TransporterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Address: "",
      ResponsiblePerson: "",
      MobileNumber: "",
      Email: "",
    },
  });

  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    GlobalModal.title = "Confirm Transporter Details";
    GlobalModal.description = "Please review the entered details:";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>
          <strong>Address:</strong> {values.Address}
        </p>
        <p>
          <strong>Responsible Person:</strong> {values.ResponsiblePerson}
        </p>
        <p>
          <strong>Mobile Number:</strong> {values.MobileNumber}
        </p>
        <p>
          <strong>Email:</strong> {values.Email}
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
                await postData("/Transporter/add", {
                  ...values,
                  status: "active",
                });
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Transporter created/updated successfully");
              } catch (error) {
                console.error("Error creating/updating:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error creating/updating");
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        {/* Address */}
        <FormField
          control={form.control}
          name="Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Responsible Person */}
        <FormField
          control={form.control}
          name="ResponsiblePerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsible Person</FormLabel>
              <FormControl>
                <Input placeholder="Enter Responsible Person Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Mobile Number */}
        <FormField
          control={form.control}
          name="MobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter Mobile Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email */}
        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default TransporterForm;
