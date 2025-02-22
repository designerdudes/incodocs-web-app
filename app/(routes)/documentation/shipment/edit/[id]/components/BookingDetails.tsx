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
import { Button } from "@/components/ui/button";
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


interface BookingDetailsProps {
  shipmentId: string | undefined;
}



export function BookingDetails({ shipmentId }: BookingDetailsProps) {
  const { control, setValue, handleSubmit, getValues } = useFormContext();
  const [containers, setContainers] = useState<
  { containerNumber: string; truckNumber: string; truckDriverContactNumber: string }[]
>([]);


useEffect(() => {
  if (shipmentId) {
    fetch(`http://localhost:4080/shipment/getbyid/${shipmentId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging: Check API Response

        if (data) {
          setValue("bookingDetails.bookingNumber", data.bookingNumber || "");
          setValue("bookingDetails.portOfLoading", data.portOfLoading || "");
          setValue("bookingDetails.destinationPort", data.destinationPort || "");
          setValue("bookingDetails.vesselSailingDate", data.vesselSailingDate ? new Date(data.vesselSailingDate) : null);
          setValue("noOfContainers", data.containers?.length || 0);
          
          const formattedContainers = data.containers?.map((container) => ({
            containerNumber: container.containerNumber || "",
            truckNumber: container.truckNumber || "",
            truckDriverContactNumber: container.truckDriverContactNumber || "",
          })) || [];

          setContainers(formattedContainers);
          setValue("containers", formattedContainers);
        }
      })
      .catch((error) => console.error("Error fetching shipment details:", error));
  }
}, [shipmentId, setValue]);




  const handleUpdate = async (formData: any) => {
    try {
      const response = await fetch("http://localhost:4080/shipment/booking-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Booking details updated successfully!");
      } else {
        console.error("Error updating shipment details:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating shipment details:", error);
    }
  };
  
  const handleContainerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Number(e.target.value);
    setContainers(
      Array.from({ length: count }, () => ({
        containerNumber: "",
        truckNumber: "",
        truckDriverContactNumber: "",
      }))
    );
  };
  

  
  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <div className="grid grid-cols-4 gap-3">
        {/* Booking Number */}
        <FormField
          control={control}
          name="bookingDetails.bookingNumber"
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking Number</FormLabel>
              <FormControl>
                <Input className="uppercase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Port of Loading */}
        <FormField
          control={control}
          name="bookingDetails.portOfLoading"
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port Of Loading</FormLabel>
              <FormControl>
                <Input className="uppercase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Destination Port */}
        <FormField
          control={control}
          name="bookingDetails.destinationPort"
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Port</FormLabel>
              <FormControl>
                <Input className="uppercase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vessel Sailing Date */}
        <FormField
          control={control}
          name="bookingDetails.vesselSailingDate"
          defaultValue={null}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Vessel Sailing Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full">
                      {field.value ? format(field.value, "PPPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
  control={control}
  name="noOfContainers"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Number of Containers</FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="Enter number of Containers"
          value={field.value}
          onChange={(e) => {
            field.onChange(e);
            handleContainerChange(e);
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
                  <TableHead>Container Number</TableHead>
                  <TableHead>Truck Number</TableHead>
                  <TableHead>Truck Driver Contact Number</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containers.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField control={control} name={`containers[${index}].containerNumber`} defaultValue="" render={({ field }) => <Input {...field} />} />
                    </TableCell>
                    <TableCell>
                      <FormField control={control} name={`containers[${index}].truckNumber`} defaultValue="" render={({ field }) => <Input {...field} />} />
                    </TableCell>
                    <TableCell>
                      <FormField control={control} name={`containers[${index}].truckDriverContactNumber`} defaultValue="" render={({ field }) => <Input type="tel" {...field} />} />
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" type="button" onClick={() => setContainers(containers.filter((_, i) => i !== index))}>
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
      <div className="col-span-4 flex justify-end mt-4">
        <Button type="submit">Update Booking</Button>
      </div>
    </form>
  );
}
