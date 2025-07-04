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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import { postData } from "@/axiosUtility/api";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

const formSchema = z.object({
  cbName: z.string().min(1, { message: "Customs Broker Name is required" }),
   gstNumber: z.string().optional(),
    panNumber: z.string().optional(),
    tanNumber: z.string().optional(),
    addmsme: z.string().optional(),
    panfile: z.string().optional(),
    tanfile: z.string().optional(),
    additional: z.string().optional(),
    gstfile: z.string().optional(),
  cbCode: z.string().optional(),
  portCode: z.string().optional(),
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
  documents: z.array(
    z.object({
      fileName: z.string().optional(),
      fileUrl: z.string().optional(),
      uploadedBy: z.string().optional(),
      date: z.string().datetime({ message: "Invalid date format" }).optional(),
      review: z.string().optional(),
    })
  ),
  numberOfDocuments: z.number().optional(),
  organizationId: z.string().optional(),
  createdBy: z.string().optional(),
});

interface CustomBrokerFormProps {
  onSuccess?: () => void;
  orgId?: string;
  currentUser?: string;
}

export default function CustomBrokerForm({
  onSuccess,
  orgId,
  currentUser,
}: CustomBrokerFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const GlobalModal = useGlobalModal();
  const orgid = orgId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cbName: "",
      gstNumber: "",
      panNumber: "",
      tanNumber: "",
      addmsme: "",
      panfile: "",
      tanfile: "",
      additional: "",
      gstfile: "",
      cbCode: "",
      portCode: "",
      email: "",
      mobileNo: "",
      address: "",
      organizationId: orgid,
      documents: [],
      createdBy: currentUser || "",
    },
  });

  const handleCertificateCountChange = (count: string) => {
    const numericCount = parseInt(count, 10);
    const newDocuments = Array.from({ length: numericCount }, (_, index) => ({
      fileName: "",
      fileUrl: "",
      date: "",
      review: "",
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
        organizationId: orgid,
      };
      const response = await postData("shipment/cbname/add", {
        ...values,
        organizationId: orgid,
      });
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("CustomsBroker Name created successfully");
      window.location.reload();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating CustomsBroker Name:", error);
      setIsLoading(false);
      toast.error("Error creating CustomsBroker Name");
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
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
              name="gstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GST Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PAN Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter TAN Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addmsme"
              render={() => (
                <FormItem>
                  <FormLabel>MSME Certificate</FormLabel>
                  <FormControl>
                    <FileUploadField name="addmsme" storageKey="addmsme" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="panfile"
              render={() => (
                <FormItem>
                  <FormLabel>PAN File</FormLabel>
                  <FormControl>
                    <FileUploadField name="panfile" storageKey="panfile" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanfile"
              render={() => (
                <FormItem>
                  <FormLabel>TAN File</FormLabel>
                  <FormControl>
                    <FileUploadField name="panfile" storageKey="panfile" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gstfile"
              render={() => (
                <FormItem>
                  <FormLabel>GST File</FormLabel>
                  <FormControl>
                    <FileUploadField name="gstfile" storageKey="gstfile" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additional"
              render={() => (
                <FormItem>
                  <FormLabel>Additional Documents</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="additional"
                      storageKey="additional"
                    />
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
                      value={(field.value as any) || ""}
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
            </div>
          <div className="grid grid-cols-4 gap-4 w-full ">
            <div className="col-span-4 overflow-x-auto mt-4">

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>File URL</TableHead>
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
                        name={`documents.${index}.fileUrl`}
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <FileUploadField
                                name={`documents.${index}.fileUrl`}
                                storageKey="documents_fileUrl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        control={form.control}
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
                                      ? format(
                                          new Date(field.value as any),
                                          "PPPP"
                                        )
                                      : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <CalendarComponent
                                  selected={
                                    field.value
                                      ? new Date(field.value as any)
                                      : undefined
                                  }
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
          </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
