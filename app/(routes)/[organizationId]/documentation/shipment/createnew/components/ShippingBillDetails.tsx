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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Eye, Trash, UploadCloud, View } from "lucide-react";
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
import CBNameForm from "../../../parties/components/forms/CBNameForm";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import toast from "react-hot-toast";
import { FileUploadField } from "./FileUploadField";

interface ShippingBillDetailsProps {
  saveProgress: (data: any) => void;
  onSectionSubmit: () => void;
  params: string | string[];
}

function saveProgressSilently(data: any) {
  try {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
}

export function ShippingBillDetails({
  saveProgress,
  onSectionSubmit,
  params,
}: ShippingBillDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const organizationId = Array.isArray(params) ? params[0] : params;
  const shippingBillsFromForm = watch("shippingBillDetails.ShippingBills") || [];
  const selectedCbName = watch("shippingBillDetails.cbName");
  const [CBNames, setCBNames] = useState<{ _id: string; name: string; cbCode: string }[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingBillCount, setPendingBillCount] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([]);
  const [uploadedStatus, setUploadedStatus] = useState<boolean[]>([]);
  const GlobalModal = useGlobalModal();

  useEffect(() => {
    const initialStatus = shippingBillsFromForm.map((bill: any) =>
      bill.shippingBillUrl ? true : false
    );
    const initialFiles = shippingBillsFromForm.map(() => null);
    setUploadedStatus(initialStatus);
    setSelectedFiles(initialFiles);
  }, [shippingBillsFromForm.length]);


  // Fetch CB Names 
  useEffect(() => {
    const fetchCBNames = async () => {
      try {
        const CBNameResponse = await fetch(
          `https://incodocs-server.onrender.com/shipment/cbname/getbyorg/${organizationId}`
        );
        const CBNameData = await CBNameResponse.json();
        const mappedCBNames = CBNameData.map((cbData: any) => ({
          _id: cbData._id,
          name: cbData.cbName,
          cbCode: cbData.cbCode,
        }));
        setCBNames(mappedCBNames);
      } catch (error) {
        console.error("Error fetching CB Names:", error);
        // toast.error("Failed to load CB names");
      }
    };
    fetchCBNames();
  }, [organizationId]);

  // Update cbCode when cbName changes
  useEffect(() => {
    if (selectedCbName) {
      const selectedCB = CBNames.find((cb) => cb._id === selectedCbName);
      if (selectedCB) {
        setValue("shippingBillDetails.cbCode", selectedCB.cbCode);
        saveProgressSilently(getValues());
      } else {
        setValue("shippingBillDetails.cbCode", "");
      }
    } else {
      setValue("shippingBillDetails.cbCode", "");
    }
  }, [selectedCbName, CBNames, setValue, getValues]);

  const handleShippingBillCountChange = (value: string) => {
    handleDynamicArrayCountChange({
      value,
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
      isDataFilled: (item) =>
        !!item.shippingBillUrl ||
        !!item.shippingBillNumber ||
        !!item.shippingBillDate ||
        !!item.drawbackValue ||
        !!item.rodtepValue,
      onRequireConfirmation: (pendingItems) => {
        setShowConfirmation(true);
        setPendingBillCount(pendingItems.length);
      },
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
    GlobalModal.title = "Add New CB Name";
    GlobalModal.children = (
      <CBNameForm
        orgId={organizationId}
        onSuccess={async () => {
          try {
            const res = await fetch(
              `https://incodocs-server.onrender.com/shipment/cbname/getbyorg/${organizationId}`
            );
            const data = await res.json();
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

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* CB Name */}
      <FormField
        control={control}
        name="shippingBillDetails.cbName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CB Name</FormLabel>
            <FormControl>
              <EntityCombobox
                entities={CBNames}
                value={field.value || ""}
                onChange={(value) => {
                  field.onChange(value);
                  saveProgressSilently(getValues());
                }}
                displayProperty="name"
                placeholder="Select a CB Name"
                onAddNew={openCBNameForm}
                addNewLabel="Add New CB Name"
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
            <FormLabel>CB Code</FormLabel>
            <FormControl>
              <Input
                value={field.value || ""}
                readOnly
                placeholder="Select a CB Name to auto-fill"
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
                placeholder="e.g., SB101"
                className="uppercase"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
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
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || parseInt(value, 10) < 0) return;
                  field.onChange(parseInt(value, 10));
                  handleShippingBillCountChange(value);
                }}
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
                <TableHead>Upload Shipping Bill</TableHead>
                <TableHead>Shipping Bill Number</TableHead>
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
                      name={`shippingBillDetails.ShippingBills[${index}].shippingBillUrl`}
                      render={({ field }) => (
                        <FileUploadField
                          name={`shippingBillDetails.ShippingBills[${index}].shippingBillUrl`}
                          storageKey={`shippingBill_${index}`}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`shippingBillDetails.ShippingBills[${index}].shippingBillNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 34583"
                              className="uppercase"
                              {...field}
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
                      name={`shippingBillDetails.ShippingBills[${index}].shippingBillDate`}
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
                              <Calendar
                                mode="single"
                                selected={
                                  field.value ? new Date(field.value) : undefined
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
                      name={`shippingBillDetails.ShippingBills[${index}].drawbackValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 2394"
                              {...field}
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
                      name={`shippingBillDetails.ShippingBills[${index}].rodtepValue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 8934"
                              {...field}
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
                {...field}
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
