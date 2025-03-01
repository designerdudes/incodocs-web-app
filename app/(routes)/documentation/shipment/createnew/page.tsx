"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
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
import { debounce } from "lodash";

// Save progress functions
const saveProgressSilently = (data: any) => {
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
};

const saveProgressWithFeedback = (data: any) => {
    saveProgressSilently(data);
    toast.success("Progress saved!");
};

// Updated Zod Schema with all fields optional
const formSchema = z.object({
    bookingDetails: z.object({
        review: z.string().optional(),
        bookingNumber: z.string().optional(),
        portOfLoading: z.string().optional(),
        destinationPort: z.string().optional(),
        vesselSailingDate: z.string().datetime({ message: "Invalid date format" }).optional(),
        vesselArrivingDate: z.string().datetime({ message: "Invalid date format" }).optional(),
        containers: z.array(
            z.object({
                containerNumber: z.string().optional(),
                truckNumber: z.string().optional(),
                trukDriverContactNumber: z.number().optional(),
                addProductDetails: z.object({
                    productCategory: z.string().optional(),
                    graniteAndMarble: z.string().optional(),
                    tiles: z.object({
                        noOfBoxes: z.number().optional(),
                        noOfPiecesPerBoxes: z.number().optional(),
                        sizePerTile: z.object({
                            length: z.object({
                                value: z.number().optional(),
                                units: z.string().optional(),
                            }).optional(),
                            breadth: z.object({
                                value: z.number().optional(),
                                units: z.string().optional(),
                            }).optional(),
                        }).optional(),
                    }).optional(),
                }).optional(),
            })
        ).optional(),
    }).optional(),
    shippingDetails: z.object({
        review: z.string().optional(),
        shippingLineName: z.string().optional(),
        noOfShipmentinvoices: z.number().optional(),
        shippingLineInvoices: z.array(
            z.object({
                invoiceNumber: z.string().optional(),
                uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
                date: z.string().datetime({ message: "Invalid date format" }).optional(),
                valueWithGst: z.number().optional(),
                valueWithoutGst: z.number().optional(),
            })
        ).optional(),
        transporterName: z.string().optional(),
        noOftransportinvoices: z.number().optional(),
        transporterInvoices: z.array(
            z.object({
                invoiceNumber: z.string().optional(),
                uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
                date: z.string().datetime({ message: "Invalid date format" }).optional(),
                valueWithGst: z.number().optional(),
                valueWithoutGst: z.number().optional(),
            })
        ).optional(),
        forwarderName: z.string().optional(),
        noOfForwarderinvoices: z.number().optional(),
        forwarderInvoices: z.array(
            z.object({
                invoiceNumber: z.string().optional(),
                uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
                date: z.string().datetime({ message: "Invalid date format" }).optional(),
                valueWithGst: z.number().optional(),
                valueWithoutGst: z.number().optional(),
            })
        ).optional(),
    }).optional(),
    shippingBillDetails: z.object({
        review: z.string().optional(),
        portCode: z.string().optional(),
        cbName: z.string().optional(),
        cdCode: z.string().optional(),
        ShippingBills: z.object({
            shippingBillUrl: z.string().url("Invalid URL").optional(),
            shippingBillNumber: z.string().optional(),
            shippingBillDate: z.string().datetime({ message: "Invalid date format" }).optional(),
            drawbackValue: z.string().optional(),
            rodtepValue: z.string().optional(),
        }).optional(),
    }).optional(),
    supplierDetails: z.object({
        review: z.string().optional(),
        clearance: z.object({
            supplierName: z.string().optional(),
            noOfInvoices: z.number().optional(),
            invoices: z.array(
                z.object({
                    supplierGSTN: z.string().optional(),
                    supplierInvoiceNumber: z.string().optional(),
                    supplierInvoiceDate: z.string().datetime({ message: "Invalid date format" }).optional(),
                    supplierInvoiceValueWithGST: z.string().optional(),
                    supplierInvoiceValueWithOutGST: z.string().optional(),
                    clearanceSupplierInvoiceUrl: z.string().url("Invalid URL").optional(),
                })
            ).optional(),
        }).optional(),
        actual: z.object({
            actualSupplierName: z.string().optional(),
            actualSupplierInvoiceValue: z.string().optional(),
            actualSupplierInvoiceUrl: z.string().url("Invalid URL").optional(),
            shippingBillUrl: z.string().optional(),
        }).optional(),
    }).optional(),
    saleInvoiceDetails: z.object({
        review: z.string().optional(),
        consignee: z.string().optional(),
        actualBuyer: z.string().optional(),
        commercialInvoices: z.object({
            commercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoiceUrl: z.string().url("Invalid URL").optional(),
            actualCommercialInvoiceUrl: z.string().url("Invalid URL").optional(),
            saberInvoiceUrl: z.string().optional(),
        }).optional(),
    }).optional(),
    blDetails: z.object({
        review: z.string().optional(),
        blNumber: z.string().optional(),
        blDate: z.string().datetime({ message: "Invalid date format" }).optional(),
        telexDate: z.string().datetime({ message: "Invalid date format" }).optional(),
        uploadBL: z.string().url("Invalid URL").optional(),
    }).optional(),
    otherDetails: z.array(
        z.object({
            review: z.string().optional(),
            certificateName: z.string().optional(),
            certificateNumber: z.string().optional(),
            date: z.string().datetime({ message: "Invalid date format" }).optional(),
            issuerOfCertificate: z.string().optional(),
            uploadCopyOfCertificate: z.string().url("Invalid URL").optional(),
        })
    ).optional(),
    organizationId: z.string().optional(),
});

const steps = [
    { id: 1, name: "Booking Details", component: <BookingDetails saveProgress={saveProgressWithFeedback} /> },
    { id: 2, name: "Shipping Details", component: <ShippingDetails saveProgress={saveProgressWithFeedback} /> },
    { id: 3, name: "Shipping Bill Details", component: <ShippingBillDetails saveProgress={saveProgressWithFeedback} /> },
    { id: 4, name: "Supplier Details", component: <SupplierDetails saveProgress={saveProgressWithFeedback} /> },
    { id: 5, name: "Sale Invoice Details", component: <SaleInvoiceDetails saveProgress={saveProgressWithFeedback} /> },
    { id: 6, name: "Bill of Lading Details", component: <BillOfLadingDetails saveProgress={saveProgressWithFeedback} /> },
    { id: 7, name: "Other Details", component: <OtherDetails saveProgress={saveProgressWithFeedback} /> },
];

export default function CreateNewFormPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const organizationId = "674b0a687d4f4b21c6c980ba";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bookingDetails: { containers: [] },
            shippingDetails: {
                shippingLineInvoices: [],
                transporterInvoices: [],
                forwarderInvoices: [],
            },
            shippingBillDetails: { ShippingBills: {} },
            supplierDetails: { clearance: { invoices: [] }, actual: {} },
            saleInvoiceDetails: { commercialInvoices: {} },
            blDetails: {},
            otherDetails: [],
            organizationId,
        },
    });

    const watchedValues = form.watch();
    const debouncedSave = debounce(saveProgressSilently, 1000);
    useEffect(() => {
        debouncedSave(watchedValues);
        return () => debouncedSave.cancel();
    }, [watchedValues, debouncedSave]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setIsLoading(true);
        try {
            await postData("/shipment/add/", {
                ...values,
                organizationId,
                status: "active",
            });
            toast.success("Shipment created successfully");
            router.push("./");
        } catch (error) {
            console.error("Error creating shipment:", error);
            toast.error("Error creating shipment");
        } finally {
            setIsLoading(false);
        }
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
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
                    <Heading className="leading-tight" title="Create New Shipment" />
                    <p className="text-muted-foreground text-sm">
                        Complete the form below to add a new shipment.
                    </p>
                </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="w-full">
                <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
            </div>

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full p-3">
                    <div className="flex justify-between mt-4">
                        <Button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0 || isLoading}
                            className={`${currentStep === 0 ? "invisible" : ""} h-8`}
                        >
                            Previous
                        </Button>
                        {currentStep < steps.length - 1 && (
                            <Button className="h-8" type="button" onClick={nextStep} disabled={isLoading}>
                                Next
                            </Button>
                        )}
                    </div>

                    <div className="flex justify-between">
                        <Heading className="text-xl" title={steps[currentStep].name} />
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {steps.length}
                        </p>
                    </div>

                    {steps[currentStep].component}
                    <div className="flex justify-between mt-4">
                        <Button
                            type="button"
                            onClick={() => saveProgressWithFeedback(form.getValues())}
                            className="h-8"
                            disabled={isLoading}
                        >
                            Save Progress
                        </Button>
                    </div>
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