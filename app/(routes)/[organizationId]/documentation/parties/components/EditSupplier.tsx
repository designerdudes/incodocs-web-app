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

// Zod Schema
const formSchema = z.object({
  supplierName: z
    .string()
    .min(3, { message: "Supplier name must be at least 3 characters long" }),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  tanNumber: z.string().optional(),
  addmsme: z.string().optional(),
  panfile: z.string().optional(),
  tanfile: z.string().optional(),
  additional: z.string().optional(),
  gstfile: z.string().optional(),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
  responsiblePerson: z.string().min(3, {
    message: "Responsible person must be at least 3 characters long",
  }),
  mobileNumber: z.union([z.string(), z.number()]).refine(
    (val) => {
      const strVal = val.toString();
      return strVal.length >= 10 && /^\d+$/.test(strVal);
    },
    {
      message:
        "Mobile number must be at least 10 digits and contain only numbers",
    }
  ),
  state: z
    .string()
    .min(2, { message: "State must be at least 2 characters long" }),
  factoryAddress: z
    .string()
    .min(5, { message: "Factory address must be at least 5 characters long" }),
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
    _id: string; // Supplier ID
  };
}

export default function EditSupplierForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const supplierId = params._id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierName: "",
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
      mobileNumber: "",
      state: "",
      factoryAddress: "",
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

  // Fetch Supplier data
  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setIsFetching(true);
        setFetchError(null);
        const response = await fetchData(
          `/shipment/supplier/getbyid/${supplierId}`
        );
        console.log("Fetched supplier data:", response);

        const supplier = response?.findsupplier;

        if (!supplier) {
          throw new Error("Supplier data not found in response");
        }

        const formData = {
          supplierName: supplier?.supplierName?.toString() || "",
          gstNumber: supplier?.gstNumber || "",
          panNumber: supplier?.panNumber || "",
          tanNumber: supplier?.tanNumber || "",
          addmsme: supplier?.addmsme || "",
          panfile: supplier?.panfile || "",
          tanfile: supplier?.tanfile || "",
          additional: supplier?.additional || "",
          gstfile: supplier?.gstfile || "",
          address: supplier?.address?.toString() || "",
          responsiblePerson: supplier?.responsiblePerson?.toString() || "",
          mobileNumber: supplier?.mobileNumber?.toString() || "",
          state: supplier?.state?.toString() || "",
          factoryAddress: supplier?.factoryAddress?.toString() || "",
          documents:
            supplier?.documents?.map((doc: any) => ({
              fileName: doc.fileName,
              fileUrl: doc.fileUrl,
              date: doc.date,
              review: doc.review || "",
            })) || [],
        };

        form.reset(formData);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        setFetchError("Failed to load supplier details. Please try again.");
        toast.error("Failed to fetch supplier data");
      } finally {
        setIsFetching(false);
      }
    };

    if (supplierId) {
      fetchSupplierData();
    }
  }, [supplierId, form]);

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
      localStorage.setItem("supplierFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  };

  // Handle Submit
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Supplier Update";
    GlobalModal.description = "Are you sure you want to update this supplier?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Supplier Name: {values.supplierName}</p>
        <p>Address: {values.address}</p>
        <p>Responsible Person: {values.responsiblePerson}</p>
        <p>Mobile No: {values.mobileNumber}</p>
        <p>State: {values.state}</p>
        <p>Factory Address: {values.factoryAddress}</p>
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
                  supplierName: values.supplierName,
                  gstNumber: values.gstNumber,
                  panNumber: values.panNumber,
                  tanNumber: values.tanNumber,
                  addmsme: values?.addmsme,
                  panfile: values?.panfile,
                  tanfile: values?.tanfile,
                  additional: values?.additional,
                  gstfile: values?.gstfile,
                  address: values.address,
                  responsiblePerson: values.responsiblePerson,
                  mobileNumber: values.mobileNumber,
                  state: values.state,
                  factoryAddress: values.factoryAddress,
                  documents: values.documents.map((doc) => ({
                    fileName: doc.fileName,
                    fileUrl: doc.fileUrl,
                    date: doc.date,
                    review: doc.review,
                  })),
                };
                await putData(
                  `/shipment/supplier/update/${supplierId}`,
                  payload
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Supplier updated successfully");
                router.refresh();
              } catch (error: any) {
                console.error("Error updating supplier:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error(error.message || "Error updating supplier");
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
        <p className="ml-2 text-gray-500">Loading supplier details...</p>
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
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Khaja" type="text" {...field} />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: 303, Ahmed khan manzil, Chanda Naga"
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
                    <Input placeholder="Eg: Ahmed" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Telangana" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factoryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Factory Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: 303, Ahmed khan manzil, Chanda Naga"
                      type="text"
                      {...field}
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
                      <TableHead>File Name</TableHead>
                      <TableHead>Upload Document</TableHead>
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
                              </div>
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
    </div>
  );
}
