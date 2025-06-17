"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, Eye, Trash, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import CalendarComponent from "@/components/CalendarComponent";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { putData } from "@/axiosUtility/api";
import { FileUploadField } from "../../../shipment/createnew/components/FileUploadField";

const formSchema = z.object({
  cbName: z.string().min(1, { message: "Customs Broker Name is required" }),
  cbCode: z.string().min(1, { message: "Customs Broker Code is required" }),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Enter a valid email",
    }),
  mobileNo: z
    .union([z.string(), z.number()])
    .optional()
    .refine((val) => {
      if (!val) return true;
      const strVal = val.toString();
      return strVal.length >= 10 && /^\d+$/.test(strVal);
    }, { message: "Mobile number must be at least 10 digits and contain only numbers" }),
  address: z.string().optional(),
  organizationId: z.string().optional(),
  documents: z.array(
    z.object({
      fileName: z
        .string()
        .min(1, { message: "File name must be at least 1 character long" }),
      fileUrl: z.string().optional(),
      date: z.string().min(1, { message: "Date is required" }),
      review: z.string().optional(),
    })
  ),
});

interface CBData {
  _id: string;
  cbName: string;
  cbCode: string;
  email?: string;
  mobileNo?: string | number;
  address?: string;
  organizationId?: string;
  documents?: Array<{
    fileName: string;
    fileUrl?: string;
    date: string;
    review?: string;
  }>;
}

interface EditCBNameFormProps {
  cbData?: CBData;
  onSuccess: (updatedBrokerId: string) => void;
}

export default function EditCBNameForm({ cbData, onSuccess }: EditCBNameFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const GlobalModal = useGlobalModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cbName: cbData?.cbName || "",
      cbCode: cbData?.cbCode || "",
      email: cbData?.email || "",
      mobileNo: cbData?.mobileNo ? cbData.mobileNo.toString() : "",
      address: cbData?.address || "",
      organizationId: cbData?.organizationId || "",
      documents: cbData?.documents || [],
    },
  });

  const { control, watch, setValue, getValues, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const formValues = watch();

  // Autosave form data
  useEffect(() => {
    if (formValues) {
      saveProgress(formValues);
    }
  }, [formValues]);

  // Reset form when cbData changes
  useEffect(() => {
    if (cbData) {
      reset({
        cbName: cbData.cbName || "",
        cbCode: cbData.cbCode || "",
        email: cbData.email || "",
        mobileNo: cbData.mobileNo ? cbData.mobileNo.toString() : "",
        address: cbData.address || "",
        organizationId: cbData.organizationId || "",
        documents: cbData.documents || [],
      });
    }
  }, [cbData, reset]);

  // Handle File Upload
  const handleFileUpload = async (file: File, index: number) => {
    if (!file) return null;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        "https://incodocs-server.onrender.com/shipmentdocsfile/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("File upload failed");
      const data = await response.json();
      setValue(`documents.${index}.fileUrl`, data.storageLink, { shouldDirty: true });
      setValue(`documents.${index}.fileName`, file.name, { shouldDirty: true });
      toast.success("File uploaded successfully!");
      saveProgress(getValues());
      return data.storageLink;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle File Replacement
  const handleReplaceDocument = (index: number) => {
    setSelectedDocIndex(index);
    setNewFile(null);
    setIsReplaceModalOpen(true);
  };

  const handleReplaceSubmit = async () => {
    if (selectedDocIndex === null || !newFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      setIsLoading(true);
      const fileUrl = await handleFileUpload(newFile, selectedDocIndex);
      if (fileUrl) {
        toast.success("Document replaced successfully. Submit the form to save changes.");
        setIsReplaceModalOpen(false);
        saveProgress(getValues());
      }
    } catch (error) {
      console.error("Error replacing document:", error);
      toast.error("Failed to replace document");
    } finally {
      setIsLoading(false);
      setNewFile(null);
      setSelectedDocIndex(null);
    }
  };

  // Autosave to localStorage
  const saveProgress = (data: any) => {
    try {
      localStorage.setItem("cbFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!cbData?._id) {
      toast.error("No Customs Broker ID provided");
      return;
    }

    setIsLoading(true);

    GlobalModal.title = "Confirm Customs Broker Update";
    GlobalModal.description = "Are you sure you want to update this customs broker?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>CB Name: {values.cbName}</p>
        <p>CB Code: {values.cbCode}</p>
        <p>Email: {values.email || "N/A"}</p>
        <p>Mobile No: {values.mobileNo || "N/A"}</p>
        <p>Address: {values.address || "N/A"}</p>
        <p>Organization ID: {values.organizationId || "N/A"}</p>
        {fields.length > 0 && (
          <div>
            <p className="font-semibold">Documents:</p>
            {fields.map((doc, index) => (
              <div key={doc.id}>
                <p>File Name: {doc.fileName}</p>
                <p>File URL: {doc.fileUrl || "N/A"}</p>
                <p>Date: {formatDate(doc.date)}</p>
                <p>Review: {doc.review || "N/A"}</p>
              </div>
            ))}
          </div>
        )}
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
                const payload = {
                  cbName: values.cbName,
                  cbCode: values.cbCode,
                  email: values.email,
                  mobileNo: values.mobileNo,
                  address: values.address,
                  organizationId: values.organizationId,
                  documents: values.documents.map((doc) => ({
                    fileName: doc.fileName,
                    fileUrl: doc.fileUrl,
                    date: doc.date,
                    review: doc.review,
                  })),
                };

                await putData(`/shipment/cbname/put/${cbData._id}`, payload);

                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Customs Broker updated successfully");
                reset();
                onSuccess(cbData._id);
              } catch (error: any) {
                console.error("Error updating customs broker:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error(error.message || "Failed to update customs broker");
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!cbData) {
    return <div className="text-center text-gray-500">Loading Customs Broker Data...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Edit Customs Broker</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cbName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CB Name</FormLabel>
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
                  <FormLabel>CB Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CB123" {...field} />
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
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ORG123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Documents Section */}
          {fields.length > 0 && (
            <div className="col-span-4 overflow-x-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Upload Document</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`documents.${index}.fileUrl`}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <FileUploadField
                                name={`documents.${index}.fileUrl`}
                                storageKey={`documents.${index}.fileUrl`}
                                onFileChange={async (file: File) => {
                                  if (file) {
                                    await handleFileUpload(file, index);
                                  }
                                }}
                              />
                              {field.value && (
                                <a
                                  href={field.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  <Eye className="h-4 w-4 cursor-pointer" />
                                </a>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => handleReplaceDocument(index)}
                              >
                                <UploadCloud className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.fileName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Document.pdf"
                                  {...field}
                                  value={field.value ?? ""}
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
                            <FormItem>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant="outline">
                                      {field.value &&
                                      !isNaN(new Date(field.value).getTime())
                                        ? format(new Date(field.value), "PPPP")
                                        : "Pick a date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                  <CalendarComponent
                                    selected={
                                      field.value ? new Date(field.value) : undefined
                                    }
                                    onSelect={(date: any) => {
                                      field.onChange(date?.toISOString());
                                      saveProgress(getValues());
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
                                  placeholder="e.g. Reviewed"
                                  {...field}
                                  value={field.value ?? ""}
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
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                fileName: "",
                fileUrl: "",
                date: new Date().toISOString(),
                review: "",
              })
            }
            className="mt-4"
          >
            Add Document
          </Button>

          <Button type="submit" disabled={isLoading} className="w-full mt-4">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
        </form>
      </Form>

      {/* Replace Document Modal */}
      <Dialog open={isReplaceModalOpen} onOpenChange={setIsReplaceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium">
                Upload New File
              </label>
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setNewFile(e.target.files[0]);
                  }
                }}
                className="mt-1"
              />
              {newFile && (
                <p className="text-sm text-gray-500">Selected: {newFile.name}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReplaceModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReplaceSubmit}
                disabled={isLoading || !newFile}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}