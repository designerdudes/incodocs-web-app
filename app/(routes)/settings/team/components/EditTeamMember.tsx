"use client";
import React, { useEffect, useState } from "react";
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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Heading, Link } from "lucide-react";

// Factory Form Schema
const formSchema = z.object({
    contactPerson: z.string().min(3, { message: " Name is required" }),
       EmailId: z.string().min(1, { message: "enter email Id" }),
       phoneNumber: z.string().min(3, { message: " enter phone number" }),
       AlternatePhone: z.string().min(3, { message: " enter phone number" }),
       factoryName: z.string().min(3, { message: " Name is required" }),
       EmloyeeId: z.string().min(3, { message: " enter EmployeeID" }),
       role: z.string().min(3, { message: " enter the Organization " }),
        address: z.object({
          location: z.string().min(1, { message: "Location is required" }),
          pincode: z
            .string()
            .min(6, { message: "Pincode must be at least 6 characters" }),
        }),
  });


  interface Props {
    params: {
        _id: string; // Lot ID
    };
}

  
  export default function EditFactoryForm({ params }: Props) {
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const [isFetching, setIsFetching] = useState<boolean>(true);
      const GlobalModal = useGlobalModal();
      const router = useRouter();
  
      const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            contactPerson : "",
            EmailId : "" ,
            phoneNumber: "",
            AlternatePhone:"" ,
            factoryName: "" ,
            EmloyeeId: "" ,
            role: "" ,
            address: {
             location: "" ,
              pincode: "" ,
            },
          },
      });
  
      const factoryId = params._id;

      
      useEffect(() => {
          async function fetchLotData() {
              try {
                  setIsFetching(true);
                  const response = await fetch(
                      `http://localhost:4080/factory/getSingle/${factoryId}`
                  );
                  if (!response.ok) {
                      throw new Error("Failed to fetch lot data");
                  }
                  const data = await response.json();
  
                  // Reset form with fetched values
                  form.reset({
                    contactPerson : data.contactPerson || "",
                    EmailId : data.EmailId || "" ,
                    phoneNumber: data.phoneNumber || "",
                    AlternatePhone: data.AlternatePhone || "" ,
                    factoryName: data.actoryName || "" ,
                    EmloyeeId:data.EmloyeeId ||  "" ,
                    role: data.role || "" ,
                    address: {
                     location: data.location || "" ,
                      pincode: data.pincode ||  "" ,
                    },
                  });
              } catch (error) {
                  console.error("Error fetching Factory data:", error);
                  toast.error("Failed to fetch Factory data");
              } finally {
                  setIsFetching(false);
              }
          }
  
          fetchLotData();
      }, [factoryId, form]);
  
      const handleSubmit = (values: z.infer<typeof formSchema>) => {
          setIsLoading(true);
  
          GlobalModal.title = "Confirm Factory Update";
          GlobalModal.description = "Are you sure you want to update this Factory?";
          GlobalModal.children = (
              <div className="space-y-4">
                  <p>contactPerson: {values.contactPerson}</p>
                  <p>EmailId: {values.EmailId}</p>
                  <p>phoneNumber: {values.phoneNumber}</p>
                  <div className="flex justify-end space-x-2">
                      <Button
                          variant="outline"
                          onClick={() => {
                              GlobalModal.onClose();
                              setIsLoading(false);
                          }}
                      >
                          Cancel
                      </Button>
                      <Button
                          onClick={async () => {
                              try {
                                  await putData(
                                      `/factory/put/${factoryId}`,
                                      values
                                  );
                                  setIsLoading(false);
                                  GlobalModal.onClose();
                                  toast.success("Factory updated successfully");
  
                                  window.location.reload();
                              } catch (error) {
                                  console.error("Error updating lot:", error);
                                  setIsLoading(false);
                                  GlobalModal.onClose();
                                  toast.error("Error updating lot");
                              }
                          }}
                      >
                          Confirm
                      </Button>
                  </div>
              </div>
          );
          GlobalModal.onOpen();
      };
  
      
  
      return (
          <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="contactPerson"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>contactPerson</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Eg: Lot ABC" type="text" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="EmailId"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>EmailId</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: XYZ123@gmail.com"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>phoneNumber</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: 1234555678"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="AlternatePhone"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>AlternatePhone</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: 1234567890"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="factoryName"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>factoryName</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: jabal"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="EmloyeeId"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>EmloyeeId</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: 741852963"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>role</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: organuzation"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="address.location"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: Bangalore"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="address.pincode"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Pincode</FormLabel>
                                  <FormControl>
                                      <Input
                                          placeholder="Eg: 560001"
                                          type="text"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />

                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                      Submit
                  </Button>
              </form>
          </Form>
      );
  }
  
