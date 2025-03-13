"use client";
import React from "react";
import { useFormContext, useFieldArray, useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


interface BookingDetailsProps {
  shipmentId: string;
}
const formSchema = z.object({
  shipmentId: z.string().optional(),
  bookingDetails: z
    .object({
      bookingNumber: z.string().min(3, { message: "Required name" }).optional(),
      portOfLoading: z.string().min(3, { message: "Required name" }).optional(),
      destinationPort: z
        .string()
        .min(3, { message: "Required name" })
        .optional(),
      vesselSailingDate: z.date().optional(),
      vesselArrivingDate: z.date().optional(),
      numberOfContainer: z.number().optional(),
      containers: z
        .array(
          z.object({
            containerNumber: z
              .string()
              .min(3, {
                message: "Container Number must be at least 3 characters long",
              })
              .optional(),
            truckNumber: z
              .string()
              .min(3, {
                message: "Truck Number must be at least 3 characters long",
              })
              .optional(),
            truckDriverContactNumber: z
              .string()
              .min(10, {
                message: "Truck driver number should be 10 characters long",
              })
              .optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BookingDetails({ shipmentId }: BookingDetailsProps) {
  const { control, setValue, handleSubmit, watch, trigger } = useFormContext();
  const organizationId = "674b0a687d4f4b21c6c980ba";
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipmentId: "",
      bookingDetails: {
        bookingNumber: "",
        portOfLoading: "",
        destinationPort: "",
        vesselSailingDate: undefined,
        vesselArrivingDate: undefined,
        numberOfContainer: 0,
        containers: [],
      },
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bookingDetails.containers",
  });

  // Watch form values for debugging
  const formValues = watch("bookingDetails");
  // console.log("Current Booking Details Values:", formValues);

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
        }));
      setValue(
        "bookingDetails.containers",
        [...currentContainers, ...newContainers],
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );
    } else if (value < currentContainers.length) {
      setValue("bookingDetails.containers", currentContainers.slice(0, value), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Update API Call
  const onSubmit = async (data: any) => {
    // console.log("Submitting   Data:", data); // Debug before submission
    try {
      const response = await fetch(
        "http://localhost:4080/shipment/booking-details",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipmentId,
            bookingDetails: data.bookingDetails,
            organizationId,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update booking details: ${errorText}`);
      }

      toast.success("Booking details updated successfully!");
    } catch (error) {
      console.error("Error updating booking details:", error);
      toast.error("Failed to update booking details");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 gap-3">
        {/* Booking Number */}
        <FormField
          control={control}
          name="bookingDetails.bookingNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. MRKU6998040"
                  className="uppercase"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger("bookingDetails.bookingNumber");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Port of Loading */}
        <FormField
          control={control}
          name="bookingDetails.portOfLoading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port Of Loading</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. CHENNAI"
                  className="uppercase"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger("bookingDetails.portOfLoading");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Destination Port */}
        <FormField
          control={control}
          name="bookingDetails.destinationPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Port</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. UMM QASAR"
                  className="uppercase"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    trigger("bookingDetails.destinationPort");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vessel Sailing Date */}
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
                        format(field.value, "PPPP")
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
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vessel Arriving Date */}
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
                        format(field.value, "PPPP")
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
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Containers */}
        <FormField
          control={control}
          name="bookingDetails.numberOfContainer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Containers</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Containers"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                    handleContainerCountChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Containers Table */}
        {fields.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Container Number</TableHead>
                  <TableHead>Truck Number</TableHead>
                  <TableHead>Truck Driver Contact</TableHead>
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
                        name={`bookingDetails.containers.${index}.containerNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Container #"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                trigger(
                                  `bookingDetails.containers.${index}.containerNumber`
                                );
                              }}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`bookingDetails.containers.${index}.truckNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Truck #"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                trigger(
                                  `bookingDetails.containers.${index}.truckNumber`
                                );
                              }}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`bookingDetails.containers.${index}.truckDriverContactNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Contact #"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                trigger(
                                  `bookingDetails.containers.${index}.truckDriverContactNumber`
                                );
                              }}
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
      </div>
      <Button type="submit" className="mt-4">
        Update
      </Button>
    </form>
  );
}
