
"use client";
import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import EditProductDetailsForm from "@/components/forms/EditProductDetails";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/ui/icons";

// Define AddProductDetails type inline
interface AddProductDetails {
  code: string;
  HScode: string;
  dscription: string;
  unitOfMeasurements?: string;
  countryOfOrigin?: string;
  variantName?: string;
  varianntType?: string;
  sellPrice?: number;
  buyPrice?: number;
  netWeight?: number;
  grossWeight?: number;
  cubicMeasurement?: number;
}

interface BookingDetailsProps {
  shipmentId: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
  onProductDetailsOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export function BookingDetails({
  shipmentId,
  saveProgress,
  onSectionSubmit,
  onProductDetailsOpenChange,
}: BookingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bookingDetails.containers",
  });

  // Watch form values with fallback
  const formValues = watch("bookingDetails") || {};
  const containers = formValues.containers || [];

  // Debug: Log containers state
  useEffect(() => {
    console.log("Current containers state:", containers);
  }, [containers]);

  // Autosave form data when bookingDetails changes
  useEffect(() => {
    if (formValues) {
      saveProgress({ bookingDetails: formValues });
    }
  }, [formValues, saveProgress]);

  // Handle Container Count Change
  const handleContainerCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("bookingDetails.numberOfContainer", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const currentContainers = containers || [];
    if (value > currentContainers.length) {
      const newContainers = Array(value - currentContainers.length)
        .fill(null)
        .map(() => ({
          containerNumber: "",
          truckNumber: "",
          truckDriverContactNumber: undefined,
          addProductDetails: [],
        }));
      append(newContainers);
    } else if (value < currentContainers.length) {
      setValue("bookingDetails.containers", currentContainers.slice(0, value), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Handle delete container
  const handleDelete = (index: number) => {
    remove(index);
    setValue("bookingDetails.numberOfContainer", fields.length - 1, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Handle clear product details
  const handleClearProductDetails = (index: number) => {
    const currentValues = getValues();
    const updatedContainers = [...(currentValues.bookingDetails?.containers || [])];
    updatedContainers[index] = {
      ...updatedContainers[index],
      addProductDetails: [],
    };
    setValue("bookingDetails.containers", updatedContainers, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Handle edit product details
  const handleEditProductDetails = (index: number) => {
    setSelectedContainerIndex(index);
    setEditModalOpen(true);
    onProductDetailsOpenChange?.(true);
  };

  // Handle product details submission
  const handleProductDetailsSubmit = (
    data: AddProductDetails,
    containerIndex: number
  ) => {
    // Validate required fields before saving
    if (!data.code.trim() || !data.HScode.trim() || !data.dscription.trim()) {
      console.log("Invalid product details, skipping save:", data);
      return;
    }

    console.log(
      "handleProductDetailsSubmit called with data:",
      data,
      "for containerIndex:",
      containerIndex
    );
    const currentValues = getValues();
    const currentContainers = currentValues.bookingDetails?.containers || [];

    const updatedContainers = [...currentContainers];
    updatedContainers[containerIndex] = {
      ...updatedContainers[containerIndex],
      addProductDetails: [data], // Single product details per container
    };

    setValue("bookingDetails.containers", updatedContainers, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Handle section submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSectionSubmit();
    } catch (error) {
      console.error("Error submitting Booking Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare initial values for EditProductDetailsForm
  const getInitialValues = (index: number): AddProductDetails => {
    const container = containers?.[index]?.addProductDetails?.[0] || {};
    const initial = {
      code: container.code || "",
      HScode: container.HScode || "",
      dscription: container.dscription || "",
      unitOfMeasurements: container.unitOfMeasurements || "",
      countryOfOrigin: container.countryOfOrigin || "",
      variantName: container.variantName || "",
      varianntType: container.varianntType || "",
      sellPrice: container.sellPrice ?? 0,
      buyPrice: container.buyPrice ?? 0,
      netWeight: container.netWeight ?? 0,
      grossWeight: container.grossWeight ?? 0,
      cubicMeasurement: container.cubicMeasurement ?? 0,
    };
    console.log("getInitialValues for container", index, ":", initial);
    return initial;
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      <FormField
        control={control}
        name="bookingDetails.invoiceNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice Number</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 99808541234"
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
        name="bookingDetails.bookingNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Booking Number</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., MRKU6998040"
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
        name="bookingDetails.portOfLoading"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port of Loading</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., CHENNAI"
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
        name="bookingDetails.destinationPort"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination Port</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., UMM QASAR"
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
        name="bookingDetails.vesselSailingDate"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Vessel Sailing Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className="w-full">
                    {field.value ? (
                      format(new Date(field.value), "PPPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString())}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bookingDetails.vesselArrivingDate"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Vessel Arriving Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className="w-full">
                    {field.value ? (
                      format(new Date(field.value), "PPPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString())}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bookingDetails.numberOfContainer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Containers</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of containers"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(undefined);
                    handleContainerCountChange(0);
                    return;
                  }
                  const numericValue = Math.max(0, Number(value));
                  field.onChange(numericValue);
                  handleContainerCountChange(numericValue);
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
                <TableHead>Container Number</TableHead>
                <TableHead>Truck Number</TableHead>
                <TableHead>Truck Driver Contact</TableHead>
                <TableHead>Product Details</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].containerNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 7858784698986"
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
                      name={`bookingDetails.containers[${index}].truckNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., BH 08 5280"
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
                      name={`bookingDetails.containers[${index}].truckDriverContactNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="e.g., 7702791728"
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
                    {containers?.[index]?.addProductDetails?.[0] ? (
                      <div className="space-y-1">
                        <p className="text-sm">
                          <strong>Code:</strong>{" "}
                          {containers[index].addProductDetails[0].code || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>HS Code:</strong>{" "}
                          {containers[index].addProductDetails[0].HScode || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Description:</strong>{" "}
                          {containers[index].addProductDetails[0].dscription || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Unit of Measurement:</strong>{" "}
                          {containers[index].addProductDetails[0].unitOfMeasurements || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Country of Origin:</strong>{" "}
                          {containers[index].addProductDetails[0].countryOfOrigin || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Variant Name:</strong>{" "}
                          {containers[index].addProductDetails[0].variantName || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Variant Type:</strong>{" "}
                          {containers[index].addProductDetails[0].varianntType || "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Sell Price:</strong>{" "}
                          {containers[index].addProductDetails[0].sellPrice ?? "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Buy Price:</strong>{" "}
                          {containers[index].addProductDetails[0].buyPrice ?? "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Net Weight:</strong>{" "}
                          {containers[index].addProductDetails[0].netWeight ?? "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Gross Weight:</strong>{" "}
                          {containers[index].addProductDetails[0].grossWeight ?? "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Cubic Measurement:</strong>{" "}
                          {containers[index].addProductDetails[0].cubicMeasurement ?? "N/A"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No product details
                      </p>
                    )}
                    <div className="mt-2 space-x-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleEditProductDetails(index)}
                      >
                        Edit Product Details
                      </Button>
                      {containers?.[index]?.addProductDetails?.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleClearProductDetails(index)}
                        >
                          Clear Product Details
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedContainerIndex !== null && (
        <EditProductDetailsForm
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open);
            onProductDetailsOpenChange?.(open);
            if (!open) setSelectedContainerIndex(null);
          }}
          containerIndex={selectedContainerIndex}
          initialValues={getInitialValues(selectedContainerIndex)}
          onSubmit={handleProductDetailsSubmit}
        />
      )}
    </div>
  );
}
