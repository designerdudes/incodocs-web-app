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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import CalendarComponent from "@/components/CalendarComponent";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { FileUploadField } from "../../shipment/createnew/components/FileUploadField";

// Schema for Shipping Line form

const formSchema = z.object({
  shippingLineName: z.string().min(3, {
    message: "Shipping line name must be at least 3 characters long",
  }),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  tanNumber: z.string().optional(),
  addmsme:z.string().optional(),
  panfile:z.string().optional(),
  tanfile:z.string().optional(),
  additional:z.string().optional(),
  gstfile:z.string().optional(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  responsiblePerson: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .or(z.literal("")),
  mobileNo: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number must contain only numbers" }),
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
type FormSchemaType = z.infer<typeof formSchema>;

interface Props {
  params: {
    _id: string;
  };
}

export default function EditShippingLineForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const shippingLineId = params._id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingLineName: "",
       gstNumber: "",
      panNumber: "",
      tanNumber: "",
      addmsme: "",
      panfile: "",
      tanfile: "",
      additional: "",
      gstfile: "",
      address: "",
      responsiblePerson: "",
      email: "",
      mobileNo: "",
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

  // Fetch Shipping Line data
  useEffect(() => {
    const fetchShippingLineData = async () => {
      try {
        setIsFetching(true);
        setFetchError(null);
        const data = await fetchData(
          `/shipment/shippingline/getone/${shippingLineId}`
        );
        console.log("Fetched shipping line data:", data);

        const shippingLine = data?.shipmentLine;

        if (!shippingLine) {
          throw new Error("Shipping line data not found in response");
        }

        const formData = {
          shippingLineName: shippingLine?.shippingLineName || "",
          address: shippingLine?.address || "",
          responsiblePerson: shippingLine?.responsiblePerson || "",
          email: shippingLine?.email || "",
          mobileNo: shippingLine?.mobileNo || "",

          gstNumber: shippingLine?.gstNumber || "",
          panNumber: shippingLine?.panNumber || "",
          tanNumber: shippingLine?.tanNumber || "",
          addmsme: shippingLine?.addmsme || "",
          panfile: shippingLine?.panfile || "",
          tanfile: shippingLine?.tanfile || "",
          additional: shippingLine?.additional || "",
          gstfile: shippingLine?.gstfile || "",

          documents:
            shippingLine?.documents?.map((doc: any) => ({
              fileName: doc.fileName,
              fileUrl: doc.fileUrl,
              date: doc.date,
              review: doc.review || "",
            })) || [],
        };

        form.reset(formData);
      } catch (error) {
        console.error("Error fetching shipping line data:", error);
        setFetchError(
          "Failed to load shipping line details. Please try again."
        );
        toast.error("Failed to fetch shipping line data");
      } finally {
        setIsFetching(false);
      }
    };

    if (shippingLineId) {
      fetchShippingLineData();
    }
  }, [shippingLineId, form]);

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
      setValue(`documents.${index}.fileUrl`, data.storageLink, {
        shouldDirty: true,
      });
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
        toast.success(
          "Document replaced successfully. Submit the form to save changes."
        );
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
      localStorage.setItem("shippingLineFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Shipping Line Update";
    GlobalModal.description =
      "Are you sure you want to update this shipping line?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Shipping Line Name: {values.shippingLineName}</p>
        <p>Address: {values.address}</p>
        <p>Responsible Person: {values.responsiblePerson || "N/A"}</p>
        <p>Email: {values.email || "N/A"}</p>
        <p>Mobile No: {values.mobileNo}</p>
        {fields.length > 0 && (
          <div>
            <p className="font-semibold">Documents:</p>
            {fields.map((field, index) => {
              const doc = form.getValues().documents[index];
              return (
                <div key={field.id}>
                  <p>File Name: {doc?.fileName}</p>
                  <p>File URL: {doc?.fileUrl || "N/A"}</p>
                  <p>Date: {formatDate(doc?.date)}</p>
                  <p>Review: {doc?.review || "N/A"}</p>
                </div>
              );
            })}
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
                  shippingLineName: values.shippingLineName,
                  address: values.address,
                  responsiblePerson: values.responsiblePerson,
                  email: values.email,
                  mobileNo: values.mobileNo,
                  gstNumber: values.gstNumber,
                  panNumber: values.panNumber,
                  tanNumber: values.tanNumber,
                  addmsme: values?.addmsme,
                  panfile: values?.panfile,
                  tanfile: values?.tanfile,
                  additional: values?.additional,
                  gstfile: values?.gstfile,
                  documents: values.documents.map((doc: any) => ({
                    fileName: doc.fileName,
                    fileUrl: doc.fileUrl,
                    date: doc.date,
                    review: doc.review,
                  })),
                };

                await putData(
                  `/shipment/shippingline/put/${shippingLineId}`,
                  payload
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Shipping line updated successfully");
                router.refresh();
              } catch (error: any) {
                console.error("Error updating shipping line:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error(error.message || "Error updating shipping line");
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
        <p className="ml-2 text-gray-500">Loading shipping line details...</p>
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
    <div className="sp  ace-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="shippingLineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Line Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Noor" type="text" {...field} />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: 303, Ahmed khan manzil"
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
              name="responsiblePerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsible Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Khaja" type="text" {...field} />
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
                      placeholder="Eg: example@gmail.com"
                      type="email"
                      {...field}
                    />
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
                    />
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
          </div>
          <div className="grid grid-cols-4 gap-4 w-full ">
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
                                          ? format(
                                              new Date(field.value),
                                              "PPPP"
                                            )
                                          : "Pick a date"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent align="start">
                                    <CalendarComponent
                                      selected={
                                        field.value
                                          ? new Date(field.value)
                                          : undefined
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
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
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
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium"
              >
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
                <p className="text-sm text-gray-500">
                  Selected: {newFile.name}
                </p>
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
