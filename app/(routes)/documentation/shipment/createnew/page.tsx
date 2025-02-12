"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { NewShipmentForm } from "@/components/forms/newShipmentForm";
import { useState } from "react";
import ProgressBar from "./components/ProgressBar";
import { BookingDetails } from "./components/BookingDetails";
import { ShippingDetails } from "./components/ShippingDetails";
import { ShippingBillDetails } from "./components/ShippingBillDetails";
import { SupplierDetails } from "./components/SupplierDetails";
import { SaleInvoiceDetails } from "./components/SaleInvoiceDetails";
import { BillOfLadingDetails } from "./components/BillOfLadingDetails";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const totalSteps = 6;

const steps = [
    { id: 1, name: "Booking Details", component: <BookingDetails /> },
    { id: 2, name: "Shipping Details", component: <ShippingDetails /> },
    { id: 3, name: "Shipping Bill Details", component: <ShippingBillDetails /> },
    { id: 4, name: "Supplier Details", component: <SupplierDetails /> },
    { id: 5, name: "Sale Invoice Details", component: <SaleInvoiceDetails /> },
    { id: 6, name: "Bill of Lading Details", component: <BillOfLadingDetails /> },
];

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
        commercialInvoice: z
            .any()
            .refine((file) => file instanceof File, { message: "Upload required" })
            .optional(),
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


export default function CreateNewFormPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };


    const methods = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bookingDetails: {},
            shippingDetails: {},
            shippingBillDetails: {},
            supplierDetails: {},
            saleInvoiceDetails: {},
            blDetails: {},
        },
    });

    return (
        <div className="w-full space-y-2 h-full flex p-6 flex-col">
            <div className="topbar w-full flex items-center justify-between">
                <Link href="./">
                    <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <div className="flex-1">
                    <Heading
                        className="leading-tight"
                        title="Create New Shipment"
                    />
                    <p className="text-muted-foreground text-sm">
                        Complete the form below to add a new shipment. Provide essential information like  container.no, trucks.no, invoices, and any additional details.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            {/* <div className="container mx-auto">
                <NewShipmentForm />
            </div> */}
            <div className="w-full">
                <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
                {/* <div className="p-4">{steps[currentStep].component}</div> */}

                <div className="flex justify-between mt-4">
                    <Button onClick={prevStep} disabled={currentStep === 0}>
                        Previous
                    </Button>
                    <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
                        Next
                    </Button>
                </div>

            </div>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => console.log(data))} className="flex flex-col gap-3 w-full p-3"
                >
                    <div className="flex justify-between">
                        <Heading
                            className="text-xl"
                            title={steps.find((step) => step.id === currentStep + 1)?.name || "Step"}
                        />
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {totalSteps}
                        </p>
                    </div>
                    {steps[currentStep].component} {/* Ensure this is inside the form */}
                    {/* <div className="flex justify-between mt-4">
                        <Button onClick={prevStep} disabled={currentStep === 0}>
                            Previous
                        </Button>
                        <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
                            Next
                        </Button>
                    </div> */}
                </form>
            </FormProvider>
        </div>
    );
}

