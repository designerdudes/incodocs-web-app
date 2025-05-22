"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
import { useGlobalModal } from "@/hooks/GlobalModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CalendarComponent from "@/components/CalendarComponent";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  cbName: z.string().min(1, { message: "Customs Broker Name is required" }),
  cbCode: z.string().min(1, { message: "Customs Broker Code is required" }),
  portCode: z.string().min(1, { message: "Port Code is required" }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Enter a valid email",
    }),
  mobileNo: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return val.length >= 10 && /^\d+$/.test(val);
      },
      {
        message:
          "Mobile number must be at least 10 digits and contain only numbers",
      }
    ),
  address: z.string().optional(),
   documents: z
        .array(
          z.object({
            fileName: z.string().optional(),
            fileUrl: z.string().optional(),
            uploadedBy: z.string().optional(),
            date: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            review: z.string().optional()
          })
        ),
numberOfDocuments:z.number(),
  organizationId: z.string().optional(),
  upload: z.any().optional(),
});

interface CBNameFormProps {
  orgId?: string;
  onSuccess: (newBrokerId: string) => void;
}

export default function CBNameForm({ orgId, onSuccess }: CBNameFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const GlobalModal = useGlobalModal();
  console.log("CBNameForm - orgId:", orgId); // Log orgId

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cbName: "",
      cbCode: "",
      portCode: "",
      email: "",
      mobileNo: "",
      address: "",
      organizationId: orgId,
    },
  });

  
  const handleCertificateCountChange = (count: string) => {
    const numericCount = parseInt(count, 10);
    const newDocuments = Array.from({ length: numericCount }, (_, index) => ({
      fileName: "",
      fileUrl: "",
      uploadedBy: "",
      date: "",
      review: ""
    }));
    form.setValue("documents", newDocuments);
  };


function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}


  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        cbName: values.cbName,
        cbCode: values.cbCode,
        portCode: values.portCode,
        email: values.email,
        mobileNo: values.mobileNo ? Number(values.mobileNo) : undefined,
        address: values.address,
        organizationId: orgId,
      };
      const token =
        document.cookie?.replace(
          /(?:(?:^|.*;\s*)AccessToken\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        ) || "";
      console.log(
        "POST URL:",
        "https://incodocs-server.onrender.com/shipment/cbname/add"
      );
      console.log("Payload:", payload);
      console.log("Token:", token);
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipment/cbname/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", response.status, errorData);
        throw new Error(
          `Failed to create customs broker: ${errorData.message || response.statusText
          }`
        );
      }
      const result = await response.json();
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Customs Broker created successfully");
      form.reset();
      onSuccess(result._id);
    } catch (error: any) {
      console.error("Error creating customs broker:", error);
      setIsLoading(false);
      toast.error(error.message || "Failed to create customs broker");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="cbName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Broker </FormLabel>
              <FormControl>
                <Input placeholder="e.g., XYZ Clearing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cbCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Broker Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., CB123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., PORt123" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g., cbxyz@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobileNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 9876543210" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 45 Shipping Lane" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<FormField
        control={form.control}
        name="numberOfDocuments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Documents</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of documents"
                value={field.value as any || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(1);
                    handleCertificateCountChange("1");
                    return;
                  }
                  const numericValue = Number(value);
                  field.onChange(numericValue);
                  handleCertificateCountChange(numericValue.toString());
                }}
                min={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />  
        
         <Table>
  <TableHeader>
    <TableRow>
      <TableHead colSpan={5} className="text-center text-lg font-semibold">
        Upload Documents
      </TableHead>
    </TableRow>
    <TableRow>
      <TableHead>#</TableHead>
      <TableHead>File Name</TableHead>
      <TableHead>File URL</TableHead>
      <TableHead>Uploaded By</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Review</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {form.watch("documents")?.map((_, index) => (       
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>

        <TableCell>
          <FormField
            control={form.control}
            name={`documents.${index}.fileName`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., coo"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(form.getValues());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </TableCell>
         <TableCell>
          <FormField
            control={form.control}
            name={`documents.${index}.fileUrl`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., https://example.com/file.pdf"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(form.getValues());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </TableCell>
         <TableCell>
          <FormField
            control={form.control}
            name={`documents.${index}.uploadedBy`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g., Ahmed"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(form.getValues());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </TableCell>
         <TableCell>
          <FormField
                      control={form.control}
                      name={`documents.${index}.date`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className="w-full">
                                  {field.value
                                    ? format(new Date(field.value as any), "PPPP")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                selected={field.value ? new Date(field.value as any) : undefined}
                                onSelect={(date: Date | undefined) => {
                                  field.onChange(date?.toISOString());
                                  saveProgressSilently(form.getValues());
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

        </TableCell>
         <TableCell>
          <FormField
            control={form.control}
            name={`documents.${index}.review`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="review your docs"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      saveProgressSilently(form.getValues());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </TableCell>

      </TableRow>
    ))}
  </TableBody>
</Table>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
