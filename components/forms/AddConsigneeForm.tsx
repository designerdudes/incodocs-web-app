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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { postData } from "@/axiosUtility/api";
import { Toast } from "../ui/toast";
import toast from "react-hot-toast";

// Factory Form Schema
const formSchema = z.object({
  ConsigneeName: z.string().min(1, { message: " Name is required" }),
  ConsigneeEmail: z.string().min(1, { message: "enter Email" }),
  ConsigneeNumber: z.string().min(1, { message: "number is required" }),
  Consigneeaddress: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
});

const consignee = [
  { id: "1", name: "consigneeNo23" },
  { id: "2", name: "consigneeNo24" },
];

function consigneeForm() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ConsigneeName: "",
      ConsigneeEmail: "",
      ConsigneeNumber: "",
      Consigneeaddress: {
        location: "",
        pincode: "",
      },
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const GlobalModal = useGlobalModal();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    GlobalModal.title = "Confirm Consignee Details";
    GlobalModal.description = "Please review the entered details:";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>
          <strong>ConsigneeName:</strong> {values.ConsigneeName}
        </p>
        <p>
          <strong>ConsigneeEmail:</strong> {values.ConsigneeEmail}
        </p>
        <p>
          <strong>ConsigneeNumber:</strong> {values.ConsigneeNumber}
        </p>
        <p>
          <strong>Consigneeaddress:</strong> {values.Consigneeaddress.location}
        </p>
        <p>
          <strong>Pincode:</strong> {values.Consigneeaddress.pincode}
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
                await postData("/Consignee/add", {
                  ...values,
                  status: "active",
                });
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("created/updated successfully");
                // router.push("./dashboard");
              } catch (error) {
                console.error("Error creating/updating :", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error creating/updating ");
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
        {/* ConsigneeName */}
        <FormField
          control={form.control}
          name="ConsigneeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ConsigneeName</FormLabel>
              <FormControl>
                <Input placeholder="Eg:  ABC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ConsigneeEmail */}
        <FormField
          control={form.control}
          name="ConsigneeEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ConsigneeEmail</FormLabel>
              <FormControl>
                <Input placeholder="Eg:  ABC123@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ConsigneeNumber */}
        <FormField
          control={form.control}
          name="ConsigneeNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ConsigneeNumber</FormLabel>
              <FormControl>
                <Input placeholder="Eg:123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*  consignee Address  */}
        <FormField
          control={form.control}
          name="Consigneeaddress.location"
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
        {/*  consignee Pincode */}
        <FormField
          control={form.control}
          name="Consigneeaddress.pincode"
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
        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default consigneeForm;
