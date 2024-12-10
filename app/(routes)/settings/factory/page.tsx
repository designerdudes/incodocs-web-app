"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";

// Factory Form Schema
const formSchema = z.object({
  factoryName: z.string().min(1, { message: "Factory Name is required" }),
  organizationId: z
    .string()
    .min(1, { message: "Organization must be selected" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
});

function FactoryForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      factoryName: "",
      organizationId: "",
      address: {
        location: "",
        pincode: "",
      },
    },
  });

  const Data = {
    _id: "674aed27789669ed4a672cd0",
    factoryName: "OGfactory",
    organizationId: "674b0a687d4f4b21c6c980ba",
    gstNo: "3213568796545",
    userId: ["674b02414761e56e10a9a475"],
    address: {
      coordinates: {
        type: "Point",
        coordinates: [40.7128, -74.006],
      },
      location: "343 Example Street",
      pincode: "500008",
      _id: "674aed27789669ed4a672cd1",
    },
    lotId: [
      "67540b6d065f3deb256868a6",
      "6757fc2c4de9022bb87cd0ce",
      "675803bd065f3deb256868e9",
    ],
    SlabsId: [
      "674b11e65876bbcd611069a4",
      "674b19b0f05b5214616704e9",
      "6757fd1d4de9022bb87cd12a",
      "6757fd5a4de9022bb87cd134",
    ],
    BlocksId: [
      "675803bd065f3deb256868ec",
      "675803bd065f3deb256868ed",
      "675803bd065f3deb256868ee",
    ],
    createdAt: "2024-11-30",
    updatedAt: "2024-12-10",
    __v: 0,
    workersCuttingPay: 3.75,
    workersPolishingPay: 11,
  };

  return (
    <div className="max-w-2xl mx-10 p-6  ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Factory Details
        </h1>
        <p className="text-sm text-gray-600">
          Fill in the form below to edit the factory details
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          {/* Factory Name */}
          <FormField
            name="factoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Factory Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={Data.factoryName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="gstNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  GST Number
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={Data.gstNo}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Address Fields */}
          <FormField
            name="address.location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={Data.address.location}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pincode */}
          <FormField
            name="address.pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Pincode
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={Data.address.pincode}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="createdAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Created Date
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={Data.createdAt}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex mt-5">
        <div className="mr-10">
            {" "}
            <FormField
              name="TotalBlocks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Total Blocks
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=" cursor-not-allowed px-14 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={Data.BlocksId} readOnly 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mr-10">
            {" "}
            <FormField
              name="TotalLots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Total Lots
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=" cursor-not-allowed px-14 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={Data.lotId} readOnly
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="TotalSlabs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Total Slabs
                  </FormLabel>
                  <FormControl>
                    <Input
                      className=" cursor-not-allowed px-14 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={Data.SlabsId} readOnly
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex mt-5">
          <div className=" mr-10">
            <FormField
              name="workersCuttingPay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Workers Cutting Pay
                  </FormLabel>

                  <FormControl>
                    <Input
                      className=" px-14 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={Data.workersCuttingPay}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="workersPolishingPay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Workers Polish Pay
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="px-14 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={Data.workersPolishingPay}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-4 mt-10"></div>
        {/* Update Button */}
        <div className="mt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className=" bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-300"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default FactoryForm;
