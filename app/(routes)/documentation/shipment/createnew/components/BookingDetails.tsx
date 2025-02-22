"use client";
import React, { useState } from "react";
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
} from "@/components/ui/table"; // ShadCN Table components
import ProductButton from "./ProductButton";





export interface SaveDetailsProps {
  saveProgress: (data: any) => void;
}

export function BookingDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue } = useFormContext();
  const [containers, setContainers] = React.useState<any[]>([]); // Store containers as an array
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const { handleSubmit } = useFormContext();

  const handleDelete = (index: number) => {
    const updatedContainers = containers.filter((_, i) => i !== index); // Remove container at the given index
    setContainers(updatedContainers);
    setValue("bookingDetails.containers", updatedContainers); // Update form value

    setValue("NumberOfContainer", updatedContainers.length);
  };

  // Function to handle change in number of containers
  const handleContainerCountChange = (value: string) => {
    const count = parseInt(value, 10);

    if (!isNaN(count) && count > 0) {
      const newContainerData = Array.from({ length: count }, (_, index) => ({
        containerNumber: "",
        truckNumber: "",
        truckDriverContactNumber: "",
        addProductDetails: "",
      }));

      setContainers(newContainerData);
      setValue("bookingDetails.containers", newContainerData); // Set containers data in the form
    } else {
      setContainers([]);
      setValue("bookingDetails.containers", []); // Clear containers data if the value is invalid
    }
  };



  return (
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
        name="NumberOfContainer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Containers</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of Containers"
                value={field.value === 0 ? "" : field.value} // Display empty string if value is 0
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);

                        if (isNaN(value) || value < 0) return; // Prevents negative values

                        field.onChange(value);

                  handleContainerCountChange(e.target.value);
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
                <TableHead>#</TableHead> {/* New Index Column */}
                <TableHead>Container Number</TableHead>
                <TableHead>Truck Number</TableHead>
                <TableHead>Truck Driver Contact Number</TableHead>
                <TableHead>Add Product Details</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {containers.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>{" "}
                    {/* Display 1-based Index */}
                    <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].containerNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input placeholder="7858784698986" {...field} />
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* Truck Number */}
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].truckNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input placeholder="BH 08 5280" {...field} />
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  {/* Truck Driver Contact Number */}
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].truckDriverContactNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+918520785200"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    {/* Add Product Details */}
                    {showProductForm ? (
                      <FormField
                        control={control}
                        name={`bookingDetails.containers[${index}].addProductDetails`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="Add Product"
                              {...field}
                              onBlur={() => setShowProductForm(false)} // Optionally close the form when blurred
                            />
                          </FormControl>
                        )}
                      />
                    ) :

                      <div>
                        <ProductButton />

                      </div>

                      // (






                      //   <Button
                      //     variant="default"
                      //     size="lg"
                      //     type="button"
                      //     // onClick={() => setShowProductForm(true)} // Commented out the onClick handler to not show the form
                      //   >
                      //     Add Product
                      //   </Button>
                      // ) 

                    }
                  </TableCell>

                  {/* Delete Action */}
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => handleDelete(index)} // Delete container row
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
      <div className="mt-8"><Button type="button" onClick={handleSubmit(saveProgress)}>
        Save Progress
      </Button></div>
      {/* Save Button */}

    </div>
  );
}
