"use client";
import React, { useState, useEffect } from "react";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
 
// Factory Form Schema
const formSchema = z.object({
  factoryName: z.string().min(1, { message: "Factory Name is required" }),
  gstNo: z.string().min(1, { message: "GST Number is required" }),
  address: z.object({
    location: z.string().min(1, { message: "Location is required" }),
    pincode: z
      .string()
      .min(6, { message: "Pincode must be at least 6 characters" }),
  }),
  createdAt: z.number().min(0, { message: "date should be number" }),
  workersCuttingPay: z.number().min(0, { message: "Pay must be positive" }),
  workersPolishingPay: z.number().min(0, { message: "Pay must be positive" }),
});

function FactoryForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      factoryName: "",
      gstNo: "",
      address: {
        location: "",
        pincode: "",
      },
      createdAt: 0,
      workersCuttingPay: 0,
      workersPolishingPay: 0,
    },
  });

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setIsFetching(true);
        const response = await fetch(
          "http://localhost:4080/factory/getSingle/674aed27789669ed4a672cd0"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        const data = await response.json();

        // Update form default values
        form.reset({
          factoryName: data.factoryName || "",
          gstNo: data.gstNo || "",
          address: {
            location: data.address.location || "",
            pincode: data.address.pincode || "",
          },
          createdAt: data.createdAt || 0,
          workersCuttingPay: data.workersCuttingPay || 0,
          workersPolishingPay: data.workersPolishingPay || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    }

    fetchData();
  }, [form]);



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
                    // defaultValue={Data.factoryName}
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
                    // defaultValue={Data.gstNo}
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
                    // defaultValue={Data.address.location}
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
                    // defaultValue={Data.address.pincode}
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
                    // defaultValue={Data.createdAt}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      // defaultValue={Data.workersCuttingPay}
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
                      // defaultValue={Data.workersPolishingPay}
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
