"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "../ui/heading";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Icons } from "../ui/icons";
import { Separator } from "../ui/separator";
import axios from "axios";
import { useRouter } from "next/navigation";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";

// const formSchema = z.object({
//     bookingDetails: z.object({
//       containerNumber: z.string().min(3, { message: "Container Number must be at least 3 characters long" }),
//       portOfLoading: z.string().min(3, { message: "Required name" }),
//       destinationPort: z.string().min(3, { message: "Required name" }),
//       vesselSailingDate: z.date(),
//       vesselArrivingDate: z.date(),
//       truckNumber: z.string().min(10, { message: "Number should be 10 characters long" }),
//       truckDriverNumber: z.string().min(10, { message: "Truck driver number should be 10 characters long" }),
//     }),

//     shippingDetails: z.object({
//       shippingLine: z.string().min(3, { message: "Required name" }),
//       forwarder: z.string().min(3, { message: "Name must be at least 3 characters long" }),
//       forwarderInvoice: z.string().optional(),
//       valueOfForwarderInvoice: z.string().min(1, { message: "Required value" }),
//       transporter: z.string().min(3, { message: "Required name" }),
//       transporterInvoice: z.string().optional(),
//       valueOfTransporterInvoice: z.string().min(1, { message: "Required value" }),
//     }),

//     shippingBillDetails: z.object({
//       shippingBillNumber: z.string().min(1, { message: "Shipping bill number is required" }),
//       shippingBillDate: z.date(),
//       uploadShippingBill: z.string().min(1, { message: "Attach bill" }),
//     }),

//     supplierDetails: z.object({
//       supplierName: z.string().min(3, { message: "Required name" }),
//       actualSupplierName: z.string().min(3, { message: "Required name" }),
//       supplierGSTIN: z.string().min(3, { message: "Required GSTIN" }),
//       supplierInvoiceNumber: z.string().min(10, { message: "Number should be 10 characters long" }),
//       supplierInvoiceDate: z.date(),
//       supplierInvoiceValueWithOutGST: z.string().min(1, { message: "Enter some value" }),
//       supplierInvoiceValueWithGST: z.string().min(1, { message: "Enter some value" }),
//       uploadSupplierInvoice: z.string().min(1, { message: "Upload required" }),
//       actualSupplierInvoice: z.string().min(1, { message: "Required" }),
//       actualSupplierInvoiceValue: z.string().min(1, { message: "Enter some value" }),
//     }),

//     saleInvoiceDetails: z.object({
//       commercialInvoiceNumber: z.string().min(3, { message: "Number must be at least 3 characters long" }),
//       commercialInvoiceDate: z.date(),
//       consigneeDetails: z.string().min(1, { message: "Enter some details" }),
//       actualBuyer: z.string().min(3, { message: "Required name" }),
//     }),

//     blDetails: z.object({
//       blNumber: z.string().min(3, { message: "Number must be at least 3 characters long" }),
//       blDate: z.date(),
//       telexDate: z.date(),
//       uploadBL: z.string().min(1, { message: "Upload bill" }),
//     }),

//   });

const formSchema = z.object({
  bookingDetails: z.object({
    containerNumber: z
      .string()
      .min(3, {
        message: "Container Number must be at least 3 characters long",
      })
      .optional(),
    portOfLoading: z.string().min(3, { message: "Required name" }).optional(),
    destinationPort: z.string().min(3, { message: "Required name" }).optional(),
    vesselSailingDate: z.date().optional(),
    vesselArrivingDate: z.date().optional(),
    truckNumber: z
      .string()
      .min(10, { message: "Number should be 10 characters long" })
      .optional(),
    truckDriverNumber: z
      .string()
      .min(10, { message: "Truck driver number should be 10 characters long" })
      .optional(),
  }),

  shippingDetails: z.object({
    shippingLine: z.string().min(3, { message: "Required name" }).optional(),
    forwarder: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .optional(),
    forwarderInvoice: z
      .any()
      .refine((file) => file instanceof File, { message: "Upload required" })
      .optional(),
    valueOfForwarderInvoice: z
      .string()
      .min(1, { message: "Required value" })
      .optional(),
    transporter: z.string().min(3, { message: "Required name" }).optional(),
    transporterInvoice: z
      .any()
      .refine((file) => file instanceof File, { message: "Upload required" })
      .optional(),
    valueOfTransporterInvoice: z
      .string()
      .min(1, { message: "Required value" })
      .optional(),
  }),

  shippingBillDetails: z.object({
    shippingBillNumber: z
      .string()
      .min(1, { message: "Shipping bill number is required" })
      .optional(),
    shippingBillDate: z.date().optional(),
    uploadShippingBill: z
      .any()
      .refine((file) => file instanceof File, { message: "Upload required" })
      .optional(),
  }),

  supplierDetails: z.object({
    supplierName: z.string().min(3, { message: "Required name" }).optional(),
    actualSupplierName: z
      .string()
      .min(3, { message: "Required name" })
      .optional(),
    supplierGSTIN: z.string().min(3, { message: "Required GSTIN" }).optional(),
    supplierInvoiceNumber: z
      .string()
      .min(10, { message: "Number should be 10 characters long" })
      .optional(),
    supplierInvoiceDate: z.date().optional(),
    supplierInvoiceValueWithOutGST: z
      .string()
      .min(1, { message: "Enter some value" })
      .optional(),
    supplierInvoiceValueWithGST: z
      .string()
      .min(1, { message: "Enter some value" })
      .optional(),
    uploadSupplierInvoice: z
      .any()
      .refine((file) => file instanceof File, { message: "Upload required" })
      .optional(),
    actualSupplierInvoice: z
      .any()
      .refine((file) => file instanceof File, { message: "Upload required" })
      .optional(),
    actualSupplierInvoiceValue: z
      .string()
      .min(1, { message: "Enter some value" })
      .optional(),
  }),

  saleInvoiceDetails: z.object({
    commercialInvoiceNumber: z
      .string()
      .min(3, { message: "Number must be at least 3 characters long" })
      .optional(),
    commercialInvoiceDate: z.date().optional(),
    consigneeDetails: z
      .string()
      .min(1, { message: "Enter some details" })
      .optional(),
    actualBuyer: z.string().min(3, { message: "Required name" }).optional(),
  }),

  blDetails: z.object({
    blNumber: z
      .string()
      .min(3, { message: "Number must be at least 3 characters long" })
      .optional(),
    blDate: z.date().optional(),
    telexDate: z.date().optional(),
    uploadBL: z
      .any()
      .refine((file) => file instanceof File, { message: "Upload required" })
      .optional(),
  }),
});

export function NewShipmentForm() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const organization = "674b0a687d4f4b21c6c980ba";

  const totalSteps = 6;

  const stepNames = [
    {
      index: 1,
      title: "Booking Details",
    },

    {
      index: 2,
      title: "Shipping Details",
    },

    {
      index: 3,
      title: "Shipping Bill Details",
    },

    {
      index: 4,
      title: "Supplier Details",
    },

    {
      index: 5,
      title: "Sale Invoice Details",
    },

    {
      index: 6,
      title: "Bill Of Landing Details",
    },
  ];

  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      bookingDetails: {
        containerNumber: "",
        portOfLoading: "",
        destinationPort: "",
        vesselSailingDate: new Date(),
        vesselArrivingDate: new Date(),
        truckNumber: "",
        truckDriverNumber: "",
      },
      shippingDetails: {
        shippingLine: "",
        forwarder: "",
        forwarderInvoice: "",
        valueOfForwarderInvoice: "",
        transporter: "",
        transporterInvoice: "",
        valueOfTransporterInvoice: "",
      },
      shippingBillDetails: {
        shippingBillNumber: "",
        shippingBillDate: new Date(),
        uploadShippingBill: "",
      },
      supplierDetails: {
        supplierName: "",
        actualSupplierName: "",
        supplierGSTIN: "",
        supplierInvoiceNumber: "",
        supplierInvoiceDate: new Date(),
        supplierInvoiceValueWithOutGST: "",
        supplierInvoiceValueWithGST: "",
        uploadSupplierInvoice: "",
        actualSupplierInvoice: "",
        actualSupplierInvoiceValue: "",
      },
      saleInvoiceDetails: {
        commercialInvoiceNumber: "",
        commercialInvoiceDate: new Date(),
        consigneeDetails: "",
        actualBuyer: "",
      },
      blDetails: {
        blNumber: "",
        blDate: new Date(),
        telexDate: new Date(),
        uploadBL: "",
      },
    },
  });

  console.log("form values:", form.getValues());

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Form submitted with values:", values);

    try {
      const res = await postData("/shipment/add", {
        ...values,
        organization,
        status: "active",
      });
      console.log("Response:", res);
      setIsLoading(false);
      toast.success("Shipment created successfully");
      router.push("/shipment");
    } catch (error) {
      console.error("Error creating shipment:", error);
      setIsLoading(false);
      toast.error("Error creating shipment");
    }
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full p-3"
      >
        <div className="flex justify-between">
          <Heading
            className="text-xl"
            title={stepNames.map((step) => {
              if (step.index === currentStep) {
                return step.title.toString();
              }
            })}
          />
          <p className=" text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
        <Separator className="my-2" orientation="horizontal" />

        {currentStep === 1 && (
          // Booking Details
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="bookingDetails.containerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. MRKU6998040"
                      className=" uppercase"
                      type="string"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingDetails.portOfLoading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port Of Loading</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. CHENNAI"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingDetails.destinationPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Port</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. UMM QASAR"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingDetails.vesselSailingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Vessel Sailing Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          size={"lg"}
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value as Date, "PPPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingDetails.vesselArrivingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Vessel Arriving Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button size={"lg"} variant={"outline"}>
                          {field.value ? (
                            format(field.value as Date, "PPPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingDetails.truckNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Truck Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. TN01BQ2509"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookingDetails.truckDriverNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Truck Driver Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="tel"
                      placeholder="eg. TN01BQ2509"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {currentStep === 2 && (
          // SHIPPING DETAILS
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="shippingDetails.shippingLine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Line</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. MAERSK"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingDetails.forwarder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forwarder Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. VTRANS"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingDetails.forwarderInvoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forwarder Invoice</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        className="cursor-pointer"
                        type="file"
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                        value={field.value}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                    >
                      <UploadCloud className="w-5 h-10 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingDetails.valueOfForwarderInvoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value Of Forwarder Invoice</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        maximumFractionDigits: 0,
                        currency: "INR",
                      }).format(122394)}`}
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingDetails.transporter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. VS TRANS"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingDetails.transporterInvoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter Invoice</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        className="cursor-pointer "
                        type="file"
                        disabled={isLoading}
                        onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                        value={field.value}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                    >
                      <UploadCloud className="w-5 h-10 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingDetails.valueOfTransporterInvoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value Of Transporter Invoice</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        maximumFractionDigits: 0,
                        currency: "INR",
                      }).format(123000)}`}
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {currentStep === 3 && (
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="shippingBillDetails.uploadShippingBill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Shipping Bill</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        className="cursor-pointer"
                        type="file"
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                        value={field.value}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                    >
                      <UploadCloud className="w-5 h-5 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shippingBillDetails.shippingBillNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Bill Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. 5151992"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingBillDetails.shippingBillDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Shipping Bill Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button size={"lg"} variant={"outline"}>
                          {field.value ? (
                            format(field.value as Date, "PPPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="cbName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CB Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. VTRANS"
                      className=" uppercase"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        )}
        {currentStep === 4 && (
          // SUPPLIER DETAILS
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="supplierDetails.supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. VTRANS"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierDetails.actualSupplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Supplier Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. VTRANS"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierDetails.supplierGSTIN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier GSTIN</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. 33AAACV1234A1ZV"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierDetails.supplierInvoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. 5151992"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierDetails.supplierInvoiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Supplier Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button size={"lg"} variant={"outline"}>
                          {field.value ? (
                            format(field.value as Date, "PPPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierDetails.supplierInvoiceValueWithOutGST"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Invoice Value Without GST</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        maximumFractionDigits: 0,
                        currency: "INR",
                      }).format(123000)}`}
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierDetails.supplierInvoiceValueWithGST"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Invoice Value With GST</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        maximumFractionDigits: 0,
                        currency: "INR",
                      }).format(123000)}`}
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierDetails.uploadSupplierInvoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Supplier Invoice</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        className="cursor-pointer"
                        type="file"
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                        value={field.value}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                    >
                      <UploadCloud className="w-5 h-5 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierDetails.actualSupplierInvoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Supplier Invoice</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="file"
                        onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                        value={field.value}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                    >
                      <UploadCloud className="w-5 h-5 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierDetails.actualSupplierInvoiceValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Supplier Invoice Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg : 123456"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {currentStep === 5 && (
          // SALE INVOICE DETAILS
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="saleInvoiceDetails.commercialInvoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commercial Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. 5151992"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="saleInvoiceDetails.commercialInvoiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Commercial Invoice Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button size={"lg"} variant={"outline"}>
                          {field.value ? (
                            format(field.value as Date, "PPPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="saleInvoiceDetails.consigneeDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consignee Details</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. VTRANS"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="saleInvoiceDetails.actualBuyer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Buyer</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. VTRANS"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {currentStep === 6 && (
          // BL DETAILS
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="blDetails.blNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BL Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="eg. 5151992"
                      className=" uppercase"
                      onChange={(e) => field.onChange(e.target.value)} // Remove parseFloat
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blDetails.blDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>BL Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button size={"lg"} variant={"outline"}>
                          {field.value ? (
                            format(field.value as Date, "PPPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blDetails.telexDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Telex Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button size={"lg"} variant={"outline"}>
                          {field.value ? (
                            format(field.value as Date, "PPPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blDetails.uploadBL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload BL</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        className="cursor-pointer"
                        type="file"
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-white bg-blue-500 hover:bg-blue-600"
                    >
                      <UploadCloud className="w-5 h-5 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="grid grid-cols-4 gap-2">
          {currentStep > 1 && (
            <Button
              disabled={isLoading}
              type="button"
              size={"lg"}
              variant="outline"
              onClick={() => {
                setCurrentStep(currentStep - 1);
              }}
            >
              {" "}
              Back{" "}
              {isLoading && (
                <Icons.spinner className="ml-2 w-4 animate-spin" />
              )}{" "}
            </Button>
          )}
          {currentStep < totalSteps && (
            <Button
              size={"lg"}
              disabled={isLoading}
              type="button"
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
            >
              Next{" "}
              {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}{" "}
            </Button>
          )}
          {currentStep === totalSteps && (
            <Button size={"lg"} disabled={isLoading} type="submit">
              Submit
              {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
