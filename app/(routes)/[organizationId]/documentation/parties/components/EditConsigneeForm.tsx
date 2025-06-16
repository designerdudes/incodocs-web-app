"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { FileUploadField } from "../../shipment/createnew/components/FileUploadField";

// Zod Schema
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Consignee name must be at least 3 characters long" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  mobileNo: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const strVal = val.toString();
      return strVal.length >= 10 && /^\d+$/.test(strVal);
    }, { message: "Mobile number must be at least 10 digits and contain only numbers" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
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

interface Props {
  params: {
    _id: string; // Consignee ID
  };
}

export default function EditConsigneeForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const consigneeId = params._id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      mobileNo: "",
      email: "",
      documents: [],
    },
  });

  const { control, watch, setValue, getValues } = form;
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

  // Fetch Consignee data
  useEffect(() => {
    const fetchConsigneeData = async () => {
      try {
        setIsFetching(true);
        setFetchError(null);
        const response = await fetchData(`/shipment/consignee/getone/${consigneeId}`);
        console.log("Fetched consignee data:", response);

        const consignee = response?.getConsignee;

        if (!consignee) {
          throw new Error("Consignee data not found in response");
        }

        const formData = {
          name: consignee?.name?.toString() || "",
          address: consignee?.address?.toString() || "",
          mobileNo: consignee?.mobileNo?.toString() || "",
          email: consignee?.email?.toString() || "",
          documents: consignee?.documents?.map((doc: any) => ({
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            date: doc.date,
            review: doc.review || "",
          })) || [],
        };

        form.reset(formData);
      } catch (error) {
        console.error("Error fetching consignee data:", error);
        setFetchError("Failed to load consignee details. Please try again.");
        toast.error("Failed to fetch consignee data");
      } finally {
        setIsFetching(false);
      }
    };

    if (consigneeId) {
      fetchConsigneeData();
    }
  }, [consigneeId, form]);

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
      localStorage.setItem("consigneeFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };

  // Handle Submit
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Consignee Update";
    GlobalModal.description = "Are you sure you want to update this consignee?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Consignee Name: {values.name}</p>
        <p>Address: {values.address}</p>
        <p>Mobile No: {values.mobileNo}</p>
        <p>Email: {values.email}</p>
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
                  name: values.name,
                  address: values.address,
                  mobileNo: values.mobileNo,
                  email: values.email,
                  documents: values.documents.map((doc) => ({
                    fileName: doc.fileName,
                    fileUrl: doc.fileUrl,
                    date: doc.date,
                    review: doc.review,
                  })),
                };
                await putData(`/shipment/consignee/update/${consigneeId}`, payload);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Consignee updated successfully");
                router.refresh();
              } catch (error: any) {
                console.error("Error updating consignee:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error(error.message || "Error updating consignee");
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

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Icons.spinner className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading consignee details...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-red-500">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consignee Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Ahmed" type="text" {...field} />
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
                    <Input placeholder="Eg: Hyderabad" type="text" {...field} />
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
                  <FormLabel>Mobile No</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: 7013396624"
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
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
                    <Input
                      placeholder="Eg: Ahmedkhan@gmail.com"
                      type="email"
                      {...field}
                    />
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
            Submit
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