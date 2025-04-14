"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ProductDetailsForm from "@/components/forms/ProductdetailsForm";
import { Icons } from "@/components/ui/icons";

export interface SaveDetailsProps {
  saveProgress: (data: any) => void;
}

interface BookingDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
}

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function BookingDetails({ saveProgress, onSectionSubmit }: BookingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const containersFromForm = watch("bookingDetails.containers") || [];
  const [containers, setContainers] = React.useState(containersFromForm);
  const GlobalModal = useGlobalModal();

  const handleDelete = (index: number) => {
    const updatedContainers = containers.filter((_: any, i: number) => i !== index);
    setContainers(updatedContainers);
    setValue("bookingDetails.containers", updatedContainers);
    setValue("NumberOfContainer", updatedContainers.length);
    saveProgressSilently(getValues());
  };

  const handleContainerCountChange = (value: string) => {
    const count = parseInt(value, 10) || 0;
    const currentContainers = watch("bookingDetails.containers") || [];
    const newContainers = Array.from({ length: count }, (_, i) =>
      currentContainers[i] || {
        containerNumber: "",
        truckNumber: "",
        trukDriverContactNumber: "",
        addProductDetails: {},
      }
    );
    setContainers(newContainers);
    setValue("bookingDetails.containers", newContainers);
    saveProgressSilently(getValues());
  };

  const openProductForm = (index: number) => {
    GlobalModal.title = "Add Product Details";
    GlobalModal.description =
      "Fill in the details to add product information for this container.";
    GlobalModal.children = (
      <ProductDetailsForm
        onSubmit={(productData: any) => {
          const updatedContainers = [...containers];
          updatedContainers[index].addProductDetails = productData;
          setContainers(updatedContainers);
          setValue("bookingDetails.containers", updatedContainers);
          saveProgressSilently(getValues());
          GlobalModal.onClose();
        }}
      />
    );
    GlobalModal.onOpen();
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
                onBlur={() => saveProgressSilently(getValues())}
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
                onBlur={() => saveProgressSilently(getValues())}
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
                onBlur={() => saveProgressSilently(getValues())}
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
                onBlur={() => saveProgressSilently(getValues())}
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
                    {field.value ? format(new Date(field.value), "PPPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
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
                    {field.value ? format(new Date(field.value), "PPPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
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
      <FormField
        control={control}
        name="NumberOfContainer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Containers</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of containers"
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange("");
                    handleContainerCountChange("");
                    return;
                  }
                  const numericValue = Math.max(0, Number(value));
                  field.onChange(numericValue.toString());
                  handleContainerCountChange(numericValue.toString());
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {containers.length > 0 && (
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
              {containers.map((_: any, index: number) => (
                <TableRow key={index}>
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
                      name={`bookingDetails.containers[${index}].truckNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., BH 08 5280"
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
                      name={`bookingDetails.containers[${index}].trukDriverContactNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="e.g., 7702791728"
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={() => saveProgressSilently(getValues())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button type="button" variant="secondary" onClick={() => openProductForm(index)}>
                      Add product
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button type="button" variant="destructive" onClick={() => handleDelete(index)}>
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Submit Button */}
      <div className="flex justify-end mt-4 col-span-4">
        <Button
          type="button"
          onClick={onSectionSubmit}
          className="h-8"
        >
          Submit 
        </Button>
      </div>
    </div>
  );
}