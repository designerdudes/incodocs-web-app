"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, UploadCloud, Trash, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import { Separator } from "@/components/ui/separator";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ForwarderForm from "@/components/forms/Forwarderdetailsform";
import TransporterForm from "@/components/forms/Addtransporterform";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/ui/icons";
import CalendarComponent from "@/components/CalendarComponent";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FileUploadField } from "../../../createnew/components/FileUploadField";

interface ShippingDetailsProps {
  shipmentId: string;
  orgId?: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
  currentUser: string;
}

export function ShippingDetails({
  shipmentId,
  orgId,
  currentUser,
  saveProgress,
  onSectionSubmit,
}: ShippingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [forwarders, setForwarders] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const orgid = orgId;

  const {
    fields: forwarderFields,
    append: appendForwarder,
    remove: removeForwarder,
  } = useFieldArray({
    control,
    name: "shippingDetails.forwarderInvoices",
  });

  const {
    fields: transporterFields,
    append: appendTransporter,
    remove: removeTransporter,
  } = useFieldArray({
    control,
    name: "shippingDetails.transporterInvoices",
  });

  // Watch form values
  const formValues = watch("shippingDetails");

  // Autosave form data when shippingDetails changes
  useEffect(() => {
    saveProgress({ shippingDetails: formValues });
  }, [formValues, saveProgress]);

  // Handle Count Changes
  const handleForwarderCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("shippingDetails.noOfForwarderinvoices", value, {
      shouldDirty: true,
    });
    const currentInvoices = formValues.forwarderInvoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length)
        .fill(null)
        .map(() => ({
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: undefined,
          valueWithGst: undefined,
          valueWithoutGst: undefined,
        }));
      appendForwarder(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        removeForwarder(i);
      }
    }
  };

  const handleTransporterCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("shippingDetails.noOftransportinvoices", value, {
      shouldDirty: true,
    });
    const currentInvoices = formValues.transporterInvoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length)
        .fill(null)
        .map(() => ({
          invoiceNumber: "",
          uploadInvoiceUrl: "",
          date: undefined,
          valueWithGst: undefined,
          valueWithoutGst: undefined,
        }));
      appendTransporter(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        removeTransporter(i);
      }
    }
  };

  // Handle File Upload with Authorization
  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only PDF, JPEG, or PNG files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const token = Cookies.get("AccessToken");
      if (!token) {
        toast.error("Please log in to upload files");
        router.push("/login");
        return;
      }

      const isValidJwt = token.split(".").length === 3;
      if (!isValidJwt) {
        toast.error("Invalid authentication token. Please log in again.");
        Cookies.remove("AccessToken");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const response = await fetch(
        "https://incodocs-server.onrender.com/shipmentdocsfile/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log("Raw API response text:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || "Unknown error" };
        }

        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
          Cookies.remove("AccessToken");
          router.push("/login");
          return;
        }

        throw new Error(
          `File upload failed: ${errorData.message || response.statusText
          } (Status: ${response.status})`
        );
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid JSON response from server: " + responseText);
      }

      console.log("Parsed API response:", data);

      const fileUrl =
        data.storageLink ||
        data.url ||
        data.fileUrl ||
        data.link ||
        data.file ||
        (data.file && data.file.url) ||
        null;

      console.log("Extracted file URL:", fileUrl);

      if (
        !fileUrl ||
        typeof fileUrl !== "string" ||
        !fileUrl.startsWith("http")
      ) {
        console.warn(
          "Possible URL fields in response:",
          Object.keys(data).join(", ")
        );
        throw new Error(
          `No valid file URL found in API response. Available fields: ${Object.keys(
            data
          ).join(", ")}`
        );
      }

      setValue(fieldName, fileUrl, { shouldDirty: true });
      console.log("Form state after upload:", watch(fieldName));
      toast.success(`File uploaded successfully: ${file.name}`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Fetch Forwarders and Transporters with Authorization
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("AccessToken");
        if (!token) {
          toast.error("Please log in to view shipping details");
          router.push("/login");
          return;
        }

        const isValidJwt = token.split(".").length === 3;
        if (!isValidJwt) {
          toast.error("Invalid authentication token. Please log in again.");
          Cookies.remove("AccessToken");
          router.push("/login");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        if (!orgId) {
          toast.error("Organization ID is required");
          return;
        }

        // Fetch Forwarders
        const forwarderResponse = await fetch(
          `https://incodocs-server.onrender.com/shipment/forwarder/getbyorg/${orgId}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!forwarderResponse.ok) {
          const errorData = await forwarderResponse.json();
          if (forwarderResponse.status === 401) {
            toast.error("Session expired. Please log in again.");
            Cookies.remove("AccessToken");
            router.push("/login");
            return;
          }
          throw new Error(
            errorData.message ||
            `Failed to fetch forwarders: ${forwarderResponse.status}`
          );
        }

        const forwarderData = await forwarderResponse.json();
        setForwarders(Array.isArray(forwarderData) ? forwarderData : []);

        // Fetch Transporters
        const transporterResponse = await fetch(
          `https://incodocs-server.onrender.com/shipment/transporter/getbyorg/${orgId}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!transporterResponse.ok) {
          const errorData = await transporterResponse.json();
          if (transporterResponse.status === 401) {
            toast.error("Session expired. Please log in again.");
            Cookies.remove("AccessToken");
            router.push("/login");
            return;
          }
          throw new Error(
            errorData.message ||
            `Failed to fetch transporters: ${transporterResponse.status}`
          );
        }
        const transporterData = await transporterResponse.json();
        setTransporters(Array.isArray(transporterData) ? transporterData : []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [orgId, router]);

  const openForwarderForm = () => {
    GlobalModal.title = "Add New Forwarder";
    GlobalModal.children = (
      <ForwarderForm
        currentUser={currentUser}
        orgId={orgId}
        onSuccess={() => {
          const token = Cookies.get("AccessToken");
          if (!token) {
            toast.error("Please log in to add forwarders");
            router.push("/login");
            return;
          }

          fetch(
            `https://incodocs-server.onrender.com/shipment/forwarder/getbyorg/${orgId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((res) => {
              if (!res.ok) {
                if (res.status === 401) {
                  toast.error("Session expired. Please log in again.");
                  Cookies.remove("AccessToken");
                  router.push("/login");
                }
                throw new Error(`Failed to fetch forwarders: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => setForwarders(Array.isArray(data) ? data : []))
            .catch((error) => {
              console.error("Error refreshing forwarders:", error);
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  const openTransporterForm = () => {
    GlobalModal.title = "Add New Transporter";
    GlobalModal.children = (
      <TransporterForm
        currentUser={currentUser}
        orgId={orgId}
        onSuccess={() => {
          const token = Cookies.get("AccessToken");
          if (!token) {
            toast.error("Please log in to add transporters");
            router.push("/login");
            return;
          }

          fetch(
            `https://incodocs-server.onrender.com/shipment/transporter/getbyorg/${orgId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((res) => {
              if (!res.ok) {
                if (res.status === 401) {
                  toast.error("Session expired. Please log in again.");
                  Cookies.remove("AccessToken");
                  router.push("/login");
                }
                throw new Error(`Failed to fetch transporters: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => setTransporters(Array.isArray(data) ? data : []))
            .catch((error) => {
              console.error("Error refreshing transporters:", error);
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  // Handle section submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSectionSubmit();
    } catch (error) {
      console.error("Error submitting Shipping Details:", error);
      toast.error("Failed to submit Shipping Details");
    } finally {
      setIsLoading(false);
    }
  };

  function saveProgressSilently(arg0: FieldValues): void {
    saveProgress({ shippingDetails: getValues().shippingDetails });
  }

  return (
    <div>
      <div className="text-xl font-bold my-3">
        <h2>Forwarder Details</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Select Forwarder Name */}
        <FormField
          control={control}
          name="shippingDetails.forwarderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Forwarder</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={forwarders}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                  displayProperty="forwarderName"
                  placeholder="Select a Forwarder"
                  valueProperty="_id"
                   onAddNew={() => {
                    window.open(
                      `/${orgId}/documentation/parties/add-parties/forwarder`,
                      "_blank"
                    );
                  }}
                  multiple={true}
                  // onAddNew={openForwarderForm}
                  addNewLabel="Add New Forwarder"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Forwarder Invoices */}
        <FormField
          control={control}
          name="shippingDetails.noOfForwarderinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Forwarder Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                    handleForwarderCountChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Forwarder Invoices Table */}
        {forwarderFields.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forwarderFields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].invoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Eg: 123456898"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={
                          `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl` as any
                        }
                        render={({ field }) => (
                          <FileUploadField
                            name={
                              `shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl` as any
                            }
                            storageKey={`shippingDetails.forwarderInvoices[${index}].uploadInvoiceUrl`}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].date`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline">
                                    {field.value
                                      ? format(new Date(field.value), "PPPP")
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
                                    saveProgressSilently(getValues());
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
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.forwarderInvoices[${index}].valueWithoutGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => removeForwarder(index)}
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
      </div>

      <Separator className="mt-3" />
      <div className="text-xl font-bold my-2">
        <h2>Transporter Details</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Select Transporter Name */}
        <FormField
          control={control}
          name="shippingDetails.transporterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Transporter</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={transporters}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                  displayProperty="transporterName"
                  placeholder="Select a Transporter"
                  valueProperty="_id"
                   onAddNew={() => {
                    window.open(
                      `/${orgId}/documentation/parties/add-parties/transporter`,
                      "_blank"
                    );
                  }}
                  multiple={true}
                  // onAddNew={openTransporterForm}
                  addNewLabel="Add New Transporter"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Transporter Invoices */}
        <FormField
          control={control}
          name="shippingDetails.noOftransportinvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Transporter Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                    handleTransporterCountChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transporter Invoices Table */}
        {transporterFields.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transporterFields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].invoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Eg: 123456898"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={
                          `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl` as any
                        }
                        render={({ field }) => (
                          <FileUploadField
                            name={
                              `shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl` as any
                            }
                            storageKey={`shippingDetails.transporterInvoices[${index}].uploadInvoiceUrl`}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].date`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline">
                                    {field.value
                                      ? format(new Date(field.value), "PPPP")
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
                                    saveProgressSilently(getValues());
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
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].valueWithGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`shippingDetails.transporterInvoices[${index}].valueWithoutGst`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="eg. 11800"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => removeTransporter(index)}
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
      </div>

      {/* Review */}
      <FormField
        control={control}
        name="shippingDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment"
                {...field}
                value={field.value ?? ""}
                onBlur={() => getValues()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
