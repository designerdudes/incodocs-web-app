"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { fetchData, putData } from "@/axiosUtility/api";
import { FileUploadField } from "../../../shipment/createnew/components/FileUploadField";


export const formSchema = z.object({
  cbname: z.object({
    cbName: z.string().min(1, { message: "Customs Broker Name is required" }),
    gstNumber: z.string().optional(),
    panNumber: z.string().optional(),
    tanNumber: z.string().optional(),
    addmsme: z.string().optional(),
    panfile: z.string().optional(),
    tanfile: z.string().optional(),
    additional: z.string().optional(),
    gstfile: z.string().optional(),
    cbCode: z.string().min(1, { message: "Customs Broker Code is required" }),
    portCode: z.string().min(1, { message: "Port Code is required" }),
    email: z
      .string()
      .optional()
      .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
        message: "Enter a valid email",
      }),
    mobileNo: z
      .union([z.string(), z.number()])
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const strVal = val.toString();
          return strVal.length >= 10 && /^\d+$/.test(strVal);
        },
        {
          message:
            "Mobile number must be at least 10 digits and contain only numbers",
        }
      ),
    address: z.string().optional(),
    organizationId: z.string().optional(),

    documents: z
      .array(
        z.object({
          fileName: z.string().min(1, { message: "File name is required" }),
          fileUrl: z.string().optional(),
          date: z.string().min(1, { message: "Date is required" }),
          review: z.string().optional(),
        })
      )
      .optional(),

    // Optional: add if used in form for display or update
    createdBy: z
      .object({
        fullName: z.string().optional(),
        employeeId: z.string().optional(),
        email: z.string().optional(),
        mobileNumber: z.number().optional(),
        designation: z.string().optional(),
        contactPerson: z.string().optional(),
      })
      .optional(),
  }),
});

interface EditCBNameFormProps {
  params: {
    cbData?: string;
    onSuccess: (updatedBrokerId: string) => void;
  };
}

export default function EditCBNameForm({ params }: EditCBNameFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  const GlobalModal = useGlobalModal();
  const CustomBrokerId = params.cbData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cbname: {
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
        organizationId: "",
        documents: []
      }
    }
  });

  const { control, watch, setValue, getValues, reset } = form;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "cbname.documents"
  });

  const formValues = watch();

  useEffect(() => {
    if (formValues) saveProgress(formValues);
  }, [formValues]);

  useEffect(() => {
    const fetchcbnameData = async () => {
      if (!CustomBrokerId) {
        setFetchError("No Customs Broker ID provided.");
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        setFetchError(null);
        const data = await fetchData(`/shipment/cbname/get/${CustomBrokerId}`);

        const formData = {
          cbname: {
            cbName: data?.cbname?.cbName || "",
            gstNumber: data?.cbname?.gstNumber || "",
            panNumber: data?.cbname?.panNumber || "",
            tanNumber: data?.cbname?.tanNumber || "",
            addmsme: data?.cbname?.addmsme || "",
            panfile: data?.cbname?.panfile || "",
            tanfile: data?.cbname?.tanfile || "",
            additional: data?.cbname?.additional || "",
            gstfile: data?.cbname?.gstfile || "",
            cbCode: data?.cbname?.cbCode || "",
            portCode: data?.cbname?.portCode || "",
            email: data?.cbname?.email || "",
            mobileNo: data?.cbname?.mobileNo ? String(data.cbname.mobileNo) : "",
            address: data?.cbname?.address || "",
            organizationId: data?.cbname?.organizationId || "",
            documents: Array.isArray(data?.cbname?.documents)
              ? data.cbname.documents.map((doc: any) => ({
                fileName: doc.fileName || "",
                fileUrl: doc.fileUrl || "",
                date: doc.date || new Date().toISOString(),
                review: doc.review || ""
              }))
              : []
          }
        };

        reset(formData);
        replace(formData.cbname.documents);
      } catch (error) {
        console.error("Error fetching broker:", error);
        setFetchError("Failed to load custom broker details. Please try again.");
        toast.error("Failed to fetch custom broker data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchcbnameData();
  }, [CustomBrokerId, reset, replace]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Customs Broker Update";
    GlobalModal.description = "Are you sure you want to update this customs broker?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>CB Name: {values.cbname.cbName}</p>
        <p>CB Code: {values.cbname.cbCode}</p>
        <p>Port Code: {values.cbname.portCode}</p>
        <p>Email: {values.cbname.email || "N/A"}</p>
        <p>Mobile No: {values.cbname.mobileNo || "N/A"}</p>
        <p>Address: {values.cbname.address || "N/A"}</p>
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
          <Button variant="outline" onClick={() => GlobalModal.onClose()} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await putData(`/shipment/cbname/put/${CustomBrokerId}`, values.cbname);
                toast.success("Customs Broker updated successfully");
                GlobalModal.onClose();
                params.onSuccess(CustomBrokerId!);
                reset();
              } catch (error: any) {
                console.error("Update error:", error);
                toast.error(error.message || "Update failed");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
    GlobalModal.onOpen();
  };

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
          body: formData
        }
      );
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setValue(`cbname.documents.${index}.fileUrl`, data.storageLink, { shouldDirty: true });
      setValue(`cbname.documents.${index}.fileName`, file.name, { shouldDirty: true });
      toast.success("File uploaded successfully!");
      saveProgress(getValues());
      return data.storageLink;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplaceDocument = (index: number) => {
    setSelectedDocIndex(index);
    setNewFile(null);
    setIsReplaceModalOpen(true);
  };

  const handleReplaceSubmit = async () => {
    if (selectedDocIndex === null || !newFile) {
      toast.error("Select a file to upload.");
      return;
    }
    try {
      setIsLoading(true);
      const fileUrl = await handleFileUpload(newFile, selectedDocIndex);
      if (fileUrl) {
        toast.success("Document replaced. Submit to save.");
        setIsReplaceModalOpen(false);
        saveProgress(getValues());
      }
    } catch (error) {
      console.error("Replace error:", error);
      toast.error("Failed to replace document");
    } finally {
      setIsLoading(false);
      setNewFile(null);
      setSelectedDocIndex(null);
    }
  };

  const saveProgress = (data: any) => {
    try {
      localStorage.setItem("cbFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (isFetching) {
    return <div className="text-center text-gray-500">Loading Customs Broker Data...</div>;
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
      <h2 className="text-lg font-semibold mb-4">Edit Customs Broker</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="cbname.cbName"
              control={form.control}
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
              name="cbname.gstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GST Number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbname.panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PAN Number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbname.tanNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter TAN Number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbname.addmsme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MSME Certificate</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="addmsme"
                      storageKey="addmsme"
                      onChange={(value: string | null) => {
                        if (value) {
                          setValue("cbname.addmsme", value, { shouldDirty: true });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbname.panfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN File</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="panfile"
                      storageKey="panfile"
                      onChange={(value: string | null) => {
                        if (value) {
                          setValue("cbname.panfile", value, { shouldDirty: true });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbname.tanfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TAN File</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="tanfile"
                      storageKey="tanfile"
                      onChange={(value: string | null) => {
                        if (value) {
                          setValue("cbname.tanfile", value, { shouldDirty: true });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbname.gstfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST File</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="gstfile"
                      storageKey="gstfile"
                      onChange={(value: string | null) => {
                        if (value) {
                          setValue("cbname.gstfile", value, { shouldDirty: true });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cbname.additional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Documents</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="additional"
                      storageKey="additional"
                      onChange={(value: string | null) => {
                        if (value) {
                          setValue("cbname.additional", value, { shouldDirty: true });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="cbname.cbCode"
              control={form.control}
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
            <Controller
              name="cbname.portCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ABCD123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="cbname.email"
              control={form.control}
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
            <Controller
              name="cbname.mobileNo"
              control={form.control}
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
            <Controller
              name="cbname.address"
              control={form.control}
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
                            name={`cbname.documents.${index}.fileName`}
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
                            name={`cbname.documents.${index}.fileUrl`}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <FileUploadField
                                  name={`documents.${index}.fileUrl`}
                                  storageKey={`documents.${index}.fileUrl`}
                                  onChange={async (value: string | null) => {
                                    if (value) {
                                      setValue(`cbname.documents.${index}.fileUrl`, value, { shouldDirty: true });
                                      saveProgress(getValues());
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
                            name={`cbname.documents.${index}.date`}
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
                            name={`cbname.documents.${index}.review`}
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
          </div>
        </form>
      </Form>
    </div>
  );
}