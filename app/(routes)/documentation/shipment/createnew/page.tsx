"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
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
import { OtherDetails } from "./components/OtherDetails";
import toast from "react-hot-toast";
import { postData } from "@/axiosUtility/api";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";


const saveProgress = (data: any) => {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    toast.success("Progress saved!");
};


const steps = [
    { id: 1, name: "Booking Details", component: <BookingDetails saveProgress={saveProgress} /> },
    { id: 2, name: "Shipping Details", component: <ShippingDetails saveProgress={saveProgress} /> },
    { id: 3, name: "Shipping Bill Details", component: <ShippingBillDetails saveProgress={saveProgress} /> },
    { id: 4, name: "Supplier Details", component: <SupplierDetails saveProgress={saveProgress} /> },
    { id: 5, name: "Sale Invoice Details", component: <SaleInvoiceDetails saveProgress={saveProgress} /> },
    { id: 6, name: "Bill of Lading Details", component: <BillOfLadingDetails saveProgress={saveProgress} /> },
    { id: 7, name: "Other Details", component: <OtherDetails saveProgress={saveProgress} /> },
];


const formSchema = z.object({
    bookingDetails: z.object({
        bookingNumber: z.string().min(3, { message: "Required name" }).optional(),
        portOfLoading: z.string().min(3, { message: "Required name" }).optional(),
        destinationPort: z.string().min(3, { message: "Required name" }).optional(),
        vesselSailingDate: z.date().optional(),
        vesselArrivingDate: z.date().optional(),
        containers: z.array(z.object({
            containerNumber: z.string().min(3, { message: "Container Number must be at least 3 characters long" }).optional(),
            truckNumber: z.string().min(3, { message: "Truck Number must be at least 3 characters long" }).optional(),
            trukDriverContactNumber: z.string().min(10, { message: "Truck driver number should be 10 characters long" }).optional(),
            addProductDetails: z.object({
                productCategory: z.string().min(3, { message: "Required category" }).optional(),
                graniteAndMarble: z.string().min(3, { message: "Required type" }).optional(),
                tiles: z.object({
                    noOfBoxes: z.number().min(1, { message: "Required value" }).optional(),
                    noOfPiecesPerBoxes: z.number().min(1, { message: "Required value" }).optional(),
                    sizePerTile: z.object({
                        length: z.object({
                            value: z.number().optional(),
                            units: z.string().optional()
                        }).optional(),
                        breadth: z.object({
                            value: z.number().optional(),
                            units: z.string().optional()
                        }).optional()
                    }).optional()
                }).optional()
            }).optional()
        })).optional()
    }).optional(),

    shippingDetails: z.object({
        shippingLine: z.string().min(3, { message: "Required name" }).optional(),
        noOfShipmentinvoices: z.number().optional(),
        shippingLineInvoices: z.array(z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().optional(),
            date: z.date().optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional()
        })).optional(),
        transporterName: z.string().min(3, { message: "Required name" }).optional(),
        noOftransportinvoices: z.number().optional(),
        transporterInvoices: z.array(z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().optional(),
            date: z.date().optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional()
        })).optional(),
        forwarderName: z.string().min(3, { message: "Required name" }).optional(),
        noOfForwarderinvoices: z.number().optional(),
        forwarderInvoices: z.array(z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().optional(),
            date: z.date().optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional()
        })).optional()
    }).optional(),

    shippingBillDetails: z.object({
        portCode: z.string().optional(),
        cbName: z.string().optional(),
        cdCode: z.string().optional(),
        ShippingBills: z.object({
            shippingBillUrl: z.string().optional(),
            shippingBillNumber: z.string().optional(),
            shippingBillDate: z.date().optional(),
            drawbackValue: z.string().optional(),
            rodtepValue: z.string().optional()
        }).optional()
    }).optional(),

    supplierDetails: z.object({
        clearance: z.object({
            supplierName: z.string().min(3, { message: "Required name" }).optional(),
            noOfInvoices: z.number().optional(),
            invoices: z.array(z.object({
                supplierGSTN: z.string().min(3, { message: "Required GSTIN" }).optional(),
                supplierInvoiceNumber: z.string().optional(),
                supplierInvoiceDate: z.date().optional(),
                supplierInvoiceValueWithGST: z.string().optional(),
                supplierInvoiceValueWithOutGST: z.string().optional(),
                clearanceSupplierInvoiceUrl: z.string().optional()
            })).optional()
        }).optional(),
        actual: z.object({
            actualSupplierName: z.string().optional(),
            actualSupplierInvoiceValue: z.string().optional(),
            actualSupplierInvoiceUrl: z.string().optional(),
            shippingBillUrl: z.string().optional()
        }).optional()
    }).optional(),

    saleInvoiceDetails: z.object({
        consignee: z.string().optional(),
        actualBuyer: z.string().optional(),
        commercialInvoices: z.object({
            commercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoiceUrl: z.string().optional(),
            actualCommercialInvoiceUrl: z.string().optional(),
            saberInvoiceUrl: z.string().optional()
        }).optional()
    }).optional(),

    blDetails: z.object({
        blNumber: z.string().optional(),
        blDate: z.date().optional(),
        telexDate: z.date().optional(),
        uploadBL: z.string().optional()
    }).optional(),

    otherDetails: z.object({
        certificateOfOriginNumber: z.string().optional(),
        date: z.date().optional(),
        issuerOfCOO: z.string().optional(),
        uploadCopyOfFumigationCertificate: z.string().optional()
    }).optional(),

    organizationId: z.string().optional()
});


export default function CreateNewFormPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const organizationId = "674b0a687d4f4b21c6c980ba";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });



    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setIsLoading(true);
        try {
            await postData("/shipment/add/", {
                ...values,
                organizationId,
                status: "active",
            });
            setIsLoading(false);
            toast.success("shipment created/updated successfully");
            router.push("./");
        } catch (error) {
            console.error("Error creating/updating shipment:", error);
            setIsLoading(false);
            toast.error("Error creating/updating shipment");
        }
        router.refresh();
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };
    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

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
            </div>

            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3 w-full p-3"
                >
                    {/* Buttons at the top */}
                    <div className="flex justify-between mt-4">
                        {/* "Previous" button (always on the left, but hidden on the first step) */}
                        <Button

                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`${currentStep === 0 ? "invisible" : ""} h-8`}
                        >
                            Previous
                        </Button>

                        {/* "Next" button (always on the right) */}
                        {currentStep < steps.length - 1 && (
                            <Button
                                className="h-8"
                                type="button" onClick={nextStep}>
                                Next
                            </Button>
                        )}
                    </div>

                    {/* Step heading */}
                    <div className="flex justify-between">
                        <Heading
                            className="text-xl"
                            title={steps.find((step) => step.id === currentStep + 1)?.name || "Step"}
                        />
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {steps.length}
                        </p>
                    </div>

                    {/* Step Content */}
                    {steps[currentStep].component}
                    <div className="mt-4">
                        {currentStep === steps.length - 1 && (
                            <Button size="lg" disabled={isLoading} type="submit">
                                Submit
                                {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
                            </Button>
                        )}
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

