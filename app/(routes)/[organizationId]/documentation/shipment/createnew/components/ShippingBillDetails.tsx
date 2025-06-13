"use client";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { useGlobalModal } from "@/hooks/GlobalModal";

import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import toast from "react-hot-toast";
import { FileUploadField } from "./FileUploadField";
import { Path } from "react-hook-form";

import CalendarComponent from "@/components/CalendarComponent";
import { fetchData } from "@/axiosUtility/api";
import CustomBrokerForm from "@/components/forms/CustomBrokerForm";

interface ShippingBill {
  shippingBillUrl: string;
  shippingBillNumber: string;
  shippingBillDate: string;
  drawbackValue: number;
  rodtepValue: number;
}

interface FormData {
  shippingBillDetails: {
    cbName: string;
    cbCode: string;
    portCode: string;
    noOfShippingBills: number;
    ShippingBills: ShippingBill[];
    review: string;
  };
}

interface ShippingBillDetailsProps {
  saveProgress: (data: any) => void;
  onSectionSubmit: () => void;
  params: string | string[];
  onSuccess?: () => void;
  currentUser?: string;
}

function saveProgressSilently(data: any) {
  try {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
}

// Helper function to generate type-safe field names
const getFieldName = <T extends FormData>(
  index: number,
  field: keyof ShippingBill
): Path<T> => `shippingBillDetails.ShippingBills[${index}].${field}` as Path<T>;

export function ShippingBillDetails({
  saveProgress,
  onSectionSubmit,
  currentUser,
  params,
}: ShippingBillDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext<FormData>();
  const organizationId = Array.isArray(params) ? params[0] : params;
  const shippingBillsFromForm = watch("shippingBillDetails.ShippingBills") || [];
  const selectedCustomBorker = watch("shippingBillDetails.cbName");
  const [CustomBrokers, setCustomBrokers] = useState<{ _id: string; name: string; cbCode: string; portCode: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingBillCount, setPendingBillCount] = useState<number | null>(null);
  const GlobalModal = useGlobalModal();

  // Debug confirmation state changes
  useEffect(() => {
    console.log("Confirmation state:", { showConfirmation, pendingBillCount, shippingBillsFromForm });
  }, [showConfirmation, pendingBillCount, shippingBillsFromForm]);

  // Fetch CB Names
  useEffect(() => {
    const fetchCustomBroker = async () => {
      try {
        const CustomBrokerResponse = await fetchData(
          `/shipment/cbname/getbyorg/${organizationId}`
        );
        const CustomBrokersData = await CustomBrokerResponse;
        const mappedCBNames = CustomBrokersData.map((cbData: any) => ({
          _id: cbData._id,
          name: cbData.cbName,
          cbCode: cbData.cbCode,
          portCode: cbData.portCode,
        }));
        setCustomBrokers(mappedCBNames);
      } catch (error) {
        console.error("Error fetching Custom Brokers:", error);
        toast.error("Failed to load Custom Brokers");
      }
    };
    fetchCustomBroker();
  }, [organizationId]);

  // Update cbCode when cbName changes
  useEffect(() => {
    if (selectedCustomBorker) {
      const selectedCB = CustomBrokers.find((cb) => cb._id === selectedCustomBorker);
      if (selectedCB) {
        setValue("shippingBillDetails.cbCode", selectedCB.cbCode);
        setValue("shippingBillDetails.portCode", selectedCB.portCode);
        saveProgressSilently(getValues());
      } else {
        setValue("shippingBillDetails.cbCode", "");
        setValue("shippingBillDetails.portCode", "");
      }
    } else {
      setValue("shippingBillDetails.cbCode", "");
      setValue("shippingBillDetails.portCode", "");
    }
  }, [selectedCustomBorker, CustomBrokers, setValue, getValues]);

  const handleShippingBillCountChange = (value: string) => {
    console.log("handleShippingBillCountChange called with value:", value);
    const newCount = value === "" ? 1 : Number(value) || 1;
    if (newCount < 1) return;

    if (newCount < shippingBillsFromForm.length) {
      console.log("Reducing shipping bill count from", shippingBillsFromForm.length, "to", newCount);
      setShowConfirmation(true);
      setPendingBillCount(newCount);
      return;
    }

    handleDynamicArrayCountChange({
      value: newCount.toString(),
      watch,
      setValue,
      getValues,
      fieldName: "shippingBillDetails.ShippingBills",
      createNewItem: () => ({
        shippingBillUrl: "",
        shippingBillNumber: "",
        shippingBillDate: "",
        drawbackValue: "",
        rodtepValue: "",
      }),
      customFieldSetters: {
        "shippingBillDetails.ShippingBills": (items, setValue) => {
          setValue("shippingBillDetails.noOfShippingBills", items.length);
        },
      },
      saveCallback: saveProgressSilently,
    });
  };

  const handleDeleteBill = (index: number) => {
    const updatedShippingBills = shippingBillsFromForm.filter(
      (_: any, i: number) => i !== index
    );
    setValue("shippingBillDetails.ShippingBills", updatedShippingBills);
    setValue("shippingBillDetails.noOfShippingBills", updatedShippingBills.length);
    saveProgressSilently(getValues());
  };

  const handleConfirmChange = () => {
    console.log("handleConfirmChange called with pendingBillCount:", pendingBillCount);
    if (pendingBillCount !== null) {
      const updatedShippingBills = shippingBillsFromForm.slice(0, pendingBillCount);
      setValue("shippingBillDetails.ShippingBills", updatedShippingBills);
      setValue("shippingBillDetails.noOfShippingBills", updatedShippingBills.length);
      saveProgressSilently(getValues());
      setPendingBillCount(null);
    }
    setShowConfirmation(false);
  };

  const openCBNameForm = () => {
    GlobalModal.title = "Add New Custom Broker";
    GlobalModal.children = (
      <CustomBrokerForm
        orgId={organizationId}
        currentUser={currentUser}
        onSuccess={async () => {
          try {
            const res = await fetchData(
              `/shipment/cbname/getbyorg/${organizationId}`
            );
            const data = await res;
            const mappedCBNames = data.map((cbData: any) => ({
              _id: cbData._id,
              name: cbData.cbName,
              cbCode: cbData.cbCode,
              portCode: cbData.portCode,
            }));
            setCustomBrokers(mappedCBNames);
            saveProgressSilently(getValues());
          } catch (error) {
            console.error("Error refreshing Custom Brokers:", error);
            toast.error("Failed to refresh Custom Brokers");
          }
          GlobalModal.onClose();
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* CB Name */}
      <FormField
        control={control}
        name="shippingBillDetails.cbName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom Broker</FormLabel>
            <FormControl>
              <EntityCombobox
                entities={CustomBrokers}
                value={field.value || ""}
                onChange={(value) => {
                  field.onChange(value);
                  saveProgressSilently(getValues());
                }}
                displayProperty="name"
                placeholder="Select a Custom Broker"
                onAddNew={openCBNameForm}
                addNewLabel="Add New Custom Broker"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* CB Code */}
      <FormField
        control={control}
        name="shippingBillDetails.cbCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom Broker Code</FormLabel>
            <FormControl>
              <Input
                value={field.value || ""}
                readOnly
                placeholder="Select a Custom Broker to auto-fill"
                className="uppercase bg-gray-100 cursor-not-allowed"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Port Code */}
      <FormField
        control={control}
        name="shippingBillDetails.portCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port Code</FormLabel>
            <FormControl>
              <Input
                value={field.value || ""}
                readOnly
                tabIndex={-1}
                className="uppercase bg-gray-100 cursor-not-allowed caret-transparent"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Number of Shipping Bills */}
      <FormField
        control={control}
        name="shippingBillDetails.noOfShippingBills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Shipping Bills</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number"
                value={field.value ?? 1}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(1);
                    handleShippingBillCountChange("1");
                    return;
                  }
                  const numericValue = Number(value);
                  field.onChange(numericValue);
                  handleShippingBillCountChange(value);
                }}
                min={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {shippingBillsFromForm.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Shipping Bill Number</TableHead>
                <TableHead>Upload Shipping Bill</TableHead>
                <TableHead>Shipping Bill Date</TableHead>
                <TableHead>Drawback Value</TableHead>
                <TableHead>RODTEP Value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingBillsFromForm.map((_: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={getFieldName(index, "shippingBillNumber")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 34583"
                              className="uppercase"
                              value={(field.value as any) || ""}
                              onChange={field.onChange}
                              onBlur={() => saveProgressSilently(getValues())}
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
                      name={getFieldName(index, "shippingBillUrl")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={getFieldName(index, "shippingBillUrl")}
                              storageKey={`shippingBillUrl`}
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
                      name={getFieldName(index, "shippingBillDate")}
                      render={({ field }) => (
                        <FormItem>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value
                                    ? format(new Date(field.value as any), "PPPP")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                selected={ 
                                  field.value ? new Date(field.value as any) : undefined
                                }
                                onSelect={(date) => {
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
                      name={getFieldName(index, "drawbackValue")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="e.g., 2394"
                              value={(field.value as any) || ""}
                              onChange={field.onChange}
                              onBlur={() => saveProgressSilently(getValues())}
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
                      name={getFieldName(index, "rodtepValue")}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="e.g., 8934"
                              value={(field.value as any) || ""}
                              onChange={field.onChange}
                              onBlur={() => saveProgressSilently(getValues())}
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
                      onClick={() => handleDeleteBill(index)}
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
      {/* Review */}
      <FormField
        control={control}
        name="shippingBillDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingBillCount(null);
        }}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of shipping bills. This action cannot be undone."
      />
    </div>
  );
}