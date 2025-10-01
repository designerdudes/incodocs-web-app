"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import CalendarComponent from "@/components/CalendarComponent";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CalendarIcon, Trash } from "lucide-react";
import { postData } from "@/axiosUtility/api";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import ConfirmationDialog from "../ConfirmationDialog";

const formSchema = z.object({
  transporterName: z.string().min(1, { message: "Forwarder Name is required" }),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  tanNumber: z.string().optional(),
  addmsme: z.string().optional(),
  panfile: z.string().optional(),
  tanfile: z.string().optional(),
  gstfile: z.string().optional(),
  address: z.string().optional(),
  responsiblePerson: z.string().optional(),
  mobileNo: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{7,}$/.test(val), {
      message: "Mobile number must be at least 7 digits",
    }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Enter a valid email address",
    }),
  numberOfDocuments: z.number().optional(),
  documents: z.array(
    z.object({
      fileName: z.string().optional(),
      fileUrl: z.string().optional(),
      uploadedBy: z.string().optional(),
      date: z.string().datetime({ message: "Invalid date format" }).optional(),
      review: z.string().optional(),
    })
  ),
  organizationId: z.string().optional(),
  createdBy: z.string().optional(),
});

interface TransporterFormProps {
  onSuccess?: () => void;
  orgId?: string;
  currentUser?: string;
}

function Transporterform({
  onSuccess,
  orgId,
  currentUser,
}: TransporterFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orgid = orgId;
  const router = useRouter();
  console.log("THi sis Org id", orgId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transporterName: "",
      gstNumber: "",
      panNumber: "",
      tanNumber: "",
      addmsme: "",
      panfile: "",
      tanfile: "",
      gstfile: "",
      address: "",
      responsiblePerson: "",
      mobileNo: "",
      email: "",
      organizationId: orgid,
      documents: [],
      createdBy: currentUser || "",
    },
  });

  const { control } = form;
  const { remove } = useFieldArray({
    control,
    name: "documents",
  });
  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log(values);
    try {
      const response = await postData("/shipment/transporter/create", {
        ...values,
        organizationId: orgid,
      });
      setIsLoading(false);
      GlobalModal.onClose();
      toast.success("Transporter created successfully");
      // window.location.reload();
      if (onSuccess) onSuccess();
      router.push(`/${orgid}/documentation/parties`);
    } catch (error) {
      console.error("Error creating Transporter:", error);
      setIsLoading(false);
      toast.error("Error creating Transporter");
    }
  };

 // States (add these if not already present)
   const [documents, setDocuments] = useState<
     { fileName: string; fileUrl: string; date: string; review: string }[]
   >([]);
   const [showDocConfirmation, setShowDocConfirmation] = useState(false);
   const [docCountToBeDeleted, setDocCountToBeDeleted] = useState<number | null>(
     null
   );
 
   // Handle certificate/document count change
   const handleCertificateCountChange = (count: string) => {
     const numericCount = parseInt(count, 10);
 
     if (numericCount < documents.length) {
       setShowDocConfirmation(true);
       setDocCountToBeDeleted(numericCount);
     } else {
       const currentCount = documents.length;
       const additionalDocs = Array.from(
         { length: numericCount - currentCount },
         () => ({
           fileName: "",
           fileUrl: "",
           date: "",
           review: "",
         })
       );
 
       const updatedDocuments = [...documents, ...additionalDocs];
       setDocuments(updatedDocuments);
       form.setValue("documents", updatedDocuments);
       form.setValue("numberOfDocuments", updatedDocuments.length); // optional
     }
   };
 
   // Confirm document count reduction
   const handleConfirmDocumentChange = () => {
     if (docCountToBeDeleted !== null) {
       const updatedDocuments = documents.slice(0, docCountToBeDeleted);
       setDocuments(updatedDocuments);
       form.setValue("documents", updatedDocuments);
       form.setValue("numberOfDocuments", updatedDocuments.length); // optional
       setDocCountToBeDeleted(null);
     }
     setShowDocConfirmation(false);
   };
 
   // Handle individual document deletion
   const handleDeleteDocument = (index: number) => {
     const updatedDocuments = documents.filter((_, i) => i !== index);
     setDocuments(updatedDocuments);
     form.setValue("documents", updatedDocuments);
     form.setValue("numberOfDocuments", updatedDocuments.length); // optional
   };

  function saveProgressSilently(data: any) {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="transporterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Name1" {...field} />
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
                    <FileUploadField name="addmsme" storageKey="addmsme" 
                    module="documentation/parties/Transporters"/>
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
                    <FileUploadField name="panfile" storageKey="panfile"
                    module="documentation/parties/Transporters" />
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
                    <FileUploadField name="panfile" storageKey="panfile"
                    module="documentation/parties/Transporters" />
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
                    <FileUploadField name="gstfile" storageKey="gstfile" 
                    module="documentation/parties/Transporters"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sanatnagar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Responsible Person */}
            <FormField
              control={form.control}
              name="responsiblePerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsible Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ahmed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobileNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., 7545345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="e.g., unknownname@123.com"
                      {...field}
                    />
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
                    <TableHead>Upload Document</TableHead>
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
                                  module="documentation/parties/Transporters"
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
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
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
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => handleDeleteDocument(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        {showDocConfirmation && (
                                    <ConfirmationDialog
                                      isOpen={showDocConfirmation}
                                      onClose={() => setShowDocConfirmation(false)}
                                      onConfirm={handleConfirmDocumentChange}
                                      title="Are you sure?"
                                      description="You are reducing the number of documents. This action cannot be undone."
                                    />
                                  )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Submit Button */}
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

export default Transporterform;
