"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Eye, Trash, UploadCloud } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { fetchData } from "@/axiosUtility/api"; // Import fetchData for API calls
import EntityCombobox from "@/components/ui/EntityCombobox";
import { useGlobalModal } from "@/hooks/GlobalModal";
import CalendarComponent from "@/components/CalendarComponent";
import CustomBrokerForm from "@/components/forms/CustomBrokerForm";
import { FileUploadField } from "../../../createnew/components/FileUploadField";

interface ShippingBillDetailsProps {
  shipmentId: string;
  orgId?: string;

  currentUser: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
}

export function ShippingBillDetails({
  shipmentId,
  orgId,
  currentUser,
  saveProgress,
  onSectionSubmit,
}: ShippingBillDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [customsBrokers, setCustomsBrokers] = useState<
    { _id: string; name: string; cbCode: string }[]
  >([]);
  const GlobalModal = useGlobalModal();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "shippingBillDetails.bills",
  });

  const formValues = watch("shippingBillDetails") || {};
  const numberOfShippingBills = formValues.numberOFShippingBill || 0;

  // Debug logs
  useEffect(() => {
    console.log("ShippingBillDetails formValues:", formValues);
    console.log("ShippingBillDetails fields:", fields);
    console.log(
      "ShippingBillDetails numberOfShippingBills:",
      numberOfShippingBills
    );
    console.log("ShippingBillDetails customsBrokers:", customsBrokers);
  }, [formValues, fields, numberOfShippingBills, customsBrokers]);

  // Autosave form data
  useEffect(() => {
    if (formValues) {
      saveProgress({ shippingBillDetails: formValues });
    }
  }, [formValues, saveProgress]);

  // Fetch customs brokers using fetchData
  const fetchCustomsBrokers = async (organizationId: string) => {
    try {
      const data = await fetchData(
        `/shipment/cbname/getbyorg/${organizationId}`
      );
      const brokers = Array.isArray(data)
        ? data.map((broker: any) => ({
            _id: broker._id,
            name: broker.cbName,
            cbCode: broker.cbCode || "",
          }))
        : [];
      setCustomsBrokers(brokers);
      console.log("API response data:", data);
      console.log("Mapped customs brokers:", brokers);
      return brokers;
    } catch (error) {
      console.error("Error fetching customs brokers:", error);
      toast.error("Failed to load customs brokers");
      return [];
    }
  };

  // Fetch customs brokers on mount
  useEffect(() => {
    const orgIdToUse = orgId || "674b0a687d4f4b21c6c980ba";
    fetchCustomsBrokers(orgIdToUse);
  }, [orgId]);

  // Auto-set cbCode when cbName changes
  useEffect(() => {
    if (!customsBrokers.length) {
      console.log("No customs brokers loaded yet");
      return;
    }
    const cbId = formValues.cbName;
    if (cbId) {
      const selectedBroker = customsBrokers.find(
        (broker) => broker._id === cbId
      );
      if (selectedBroker) {
        setValue("shippingBillDetails.cbCode", selectedBroker.cbCode, {
          shouldDirty: true,
        });
        console.log("Updated cbCode:", selectedBroker.cbCode);
      } else {
        setValue("shippingBillDetails.cbCode", "", { shouldDirty: true });
        console.log("Cleared cbCode: No matching broker found for ID", cbId);
      }
    }
  }, [formValues.cbName, customsBrokers, setValue]);

  // Log cbName changes for debugging
  useEffect(() => {
    console.log("cbName changed to:", formValues.cbName);
  }, [formValues.cbName]);

  // Sync fields with numberOFShippingBill
  useEffect(() => {
    const currentBills = getValues("shippingBillDetails.bills") || [];
    if (numberOfShippingBills === 0 && fields.length > 0) {
      replace([]);
    } else if (
      numberOfShippingBills > currentBills.length &&
      currentBills.length === 0
    ) {
      append(
        Array(numberOfShippingBills - currentBills.length)
          .fill(null)
          .map(() => ({
            uploadShippingBill: "",
            shippingBillNumber: "",
            shippingBillDate: undefined,
            drawbackValue: undefined,
            rodtepValue: undefined,
            ConversionRateInDollars: undefined,
          }))
      );
    } else if (numberOfShippingBills < fields.length) {
      for (let i = fields.length - 1; i >= numberOfShippingBills; i--) {
        remove(i);
      }
    }
  }, [
    numberOfShippingBills,
    fields.length,
    append,
    remove,
    replace,
    getValues,
  ]);

  // Handle Number of Shipping Bills Change
  const handleShippingBillCountChange = (value: number | undefined) => {
    if (value === undefined || isNaN(value) || value < 0) {
      setValue("shippingBillDetails.numberOFShippingBill", 0, {
        shouldDirty: true,
      });
      setValue("shippingBillDetails.bills", [], { shouldDirty: true });
      replace([]);
      return;
    }

    setValue("shippingBillDetails.numberOFShippingBill", value, {
      shouldDirty: true,
    });

    const currentBills = getValues("shippingBillDetails.bills") || [];
    if (value > currentBills.length) {
      append(
        Array(value - currentBills.length)
          .fill(null)
          .map(() => ({
            uploadShippingBill: "",
            shippingBillNumber: "",
            shippingBillDate: undefined,
            drawbackValue: undefined,
            rodtepValue: undefined,
            ConversionRateInDollars: undefined,
          }))
      );
    } else if (value < currentBills.length) {
      for (let i = currentBills.length - 1; i >= value; i--) {
        remove(i);
      }
    }
  };

  // Handle File Upload
  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
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
      setValue(fieldName, data.storageLink, { shouldDirty: true });
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const openCustomsBrokerForm = () => {
    GlobalModal.title = "Add New Customs Broker";
    GlobalModal.children = (
      <CustomBrokerForm
        orgId={orgId}
        currentUser={currentUser}
        onSuccess={async () => {
          try {
            const res = await fetchData(`/shipment/cbname/getbyorg/${orgId}`);
            const data = await res;
            const mappedCBNames = data.map((cbData: any) => ({
              _id: cbData._id,
              name: cbData.cbName,
              cbCode: cbData.cbCode,
            }));
            setCBNames(mappedCBNames);
            saveProgressSilently(getValues());
          } catch (error) {
            console.error("Error refreshing CB names:", error);
          }
          GlobalModal.onClose();
        }}
      />
    );
    GlobalModal.onOpen();
  };

  // Modified saveProgressSilently to match the first code's behavior
  function saveProgressSilently(data: FieldValues): void {
    try {
      localStorage.setItem("shipmentFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
      saveProgress({ shippingBillDetails: getValues().shippingBillDetails });
    } catch (error) {
      console.error("Failed to save progress to localStorage:", error);
    }
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      <FormField
        control={control}
        name="shippingBillDetails.cbName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom Broker</FormLabel>
            <FormControl>
              <EntityCombobox
                key={customsBrokers.length}
                entities={customsBrokers}
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
                displayProperty="name"
                placeholder="Select a Customs Broker"
                onAddNew={openCustomsBrokerForm}
                addNewLabel="Add New Customs Broker"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shippingBillDetails.cbCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom Broker Code</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. CB123"
                className="uppercase"
                {...field}
                value={field.value ?? ""}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shippingBillDetails.portCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port Code</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. SB101"
                className="uppercase"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="shippingBillDetails.numberOFShippingBill"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Shipping Bills</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined;
                  field.onChange(value);
                  handleShippingBillCountChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {fields.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Upload Shipping Bill</TableHead>
                <TableHead>Shipping Bill Number</TableHead>
                <TableHead>Shipping Bill Date</TableHead>
                <TableHead>Drawback Value</TableHead>
                <TableHead>Rodtep Value</TableHead>
                <TableHead>Conversion Rate In Dollars</TableHead>
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
                      name={
                        `shippingBillDetails.bills[${index}].uploadShippingBill` as any
                      }
                      render={({ field }) => (
                        <FileUploadField
                          name={
                            `shippingBillDetails.bills[${index}].uploadShippingBill` as any
                          }
                          storageKey={`shippingBillDetails.bills[${index}].uploadShippingBill`}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.bills[${index}].shippingBillNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. 34583"
                              className="uppercase"
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
                      name={`shippingBillDetails.bills[${index}].shippingBillDate`}
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
                      name={`shippingBillDetails.bills[${index}].drawbackValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 2394"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.bills[${index}].rodtepValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 446656"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.bills[${index}].ConversionRateInDollars`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 446656"
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
                      onClick={() => {
                        remove(index);
                        setValue(
                          "shippingBillDetails.numberOFShippingBill",
                          fields.length - 1 || 0,
                          { shouldDirty: true }
                        );
                      }}
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
  );
}

function setCBNames(mappedCBNames: any) {
  throw new Error("Function not implemented.");
}
