"use client";
import React, { useState } from "react";
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

interface BookingDetailsProps {
  shipmentId: string;
  onProductDetailsOpenChange?: (open: boolean) => void;
}

export function BookingDetails({ shipmentId, onProductDetailsOpenChange }: BookingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bookingDetails.containers",
  });

  // Watch form values
  const formValues = watch("bookingDetails");

  // Handle Container Count Change
  const handleContainerCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("bookingDetails.numberOfContainer", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const currentContainers = formValues.containers || [];
    if (value > currentContainers.length) {
      const newContainers = Array(value - currentContainers.length)
        .fill(null)
        .map(() => ({
          containerNumber: "",
          truckNumber: "",
          truckDriverContactNumber: "",
          addProductDetails: {
            productCategory: undefined,
            graniteAndMarble: "",
            tiles: {
              noOfBoxes: 0,
              noOfPiecesPerBoxes: 0,
              sizePerTile: {
                length: { value: 0, units: "" },
                breadth: { value: 0, units: "" },
              },
            },
            slabType: "",
            slabLength: { value: undefined, units: "inch" },
            slabBreadth: { value: undefined, units: "inch" },
            slabThickness: undefined,
            slabDocument: undefined,
          },
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

  // Handle edit product details
  const handleEditProductDetails = (index: number) => {
    setSelectedContainerIndex(index);
    setEditModalOpen(true);
    onProductDetailsOpenChange?.(true);
  };

  // Handle product details submission
  const handleProductDetailsSubmit = (data: any, containerIndex: number) => {
    console.log("handleProductDetailsSubmit called with data:", data, "for containerIndex:", containerIndex);
    // Get current containers
    const currentValues = getValues();
    const currentContainers = currentValues.bookingDetails?.containers || [];

    // Update only the specific container's product details
    const updatedContainers = [...currentContainers];
    updatedContainers[containerIndex] = {
      ...updatedContainers[containerIndex],
      addProductDetails: data,
    };

    // Update form state synchronously
    setValue("bookingDetails.containers", updatedContainers, {
      shouldDirty: false,
      shouldValidate: false,
      shouldTouch: false,
    });
  };

  // Prepare initial values for EditProductDetailsForm
  const getInitialValues = (index: number) => {
    const container = formValues.containers?.[index]?.addProductDetails || {};
    return {
      productCategory: container.productCategory || undefined,
      graniteAndMarble: container.graniteAndMarble || "",
      tiles: {
        noOfBoxes: container.tiles?.noOfBoxes || 0,
        noOfPiecesPerBoxes: container.tiles?.noOfPiecesPerBoxes || 0,
        sizePerTile: {
          length: {
            value: container.tiles?.sizePerTile?.length?.value || 0,
            units: container.tiles?.sizePerTile?.length?.units || "inch",
          },
          breadth: {
            value: container.tiles?.sizePerTile?.breadth?.value || 0,
            units: container.tiles?.sizePerTile?.breadth?.units || "inch",
          },
        },
      },
      slabType: container.slabType || "",
      slabLength: {
        value: container.slabLength?.value || undefined,
        units: container.slabLength?.units || "inch",
      },
      slabBreadth: {
        value: container.slabBreadth?.value || undefined,
        units: container.slabBreadth?.units || "inch",
      },
      slabThickness: container.slabThickness || undefined,
      slabDocument: container.slabDocument || undefined,
    };
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEditProductDetails(index)}
                    >
                      Edit Product Details
                    </Button>
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