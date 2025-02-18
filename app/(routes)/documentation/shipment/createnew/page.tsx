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


const saveProgress = (data: any) => {
    console.log("Saving progress...", data);
    localStorage.setItem("shipmentFormData", JSON.stringify(data));
    alert("Progress saved!");
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
        bookingNumber: z.string().min(3, { message: "Required name" }),
        portOfLoading: z.string().min(3, { message: "Required name" }),
        destinationPort: z.string().min(3, { message: "Required name" }),
        vesselSailingDate: z.date(),
        vesselArrivingDate: z.date(),
        containers: z.array(z.object({
            containerNumber: z.string().min(3, { message: "Container Number must be at least 3 characters long" }),
            truckNumber: z.string().min(3, { message: "Truck Number must be at least 3 characters long" }),
            trukDriverContactNumber: z.string().min(10, { message: "Truck driver number should be 10 characters long" }),
            addProductDetails: z.object({
                productCategory: z.string().min(3, { message: "Required category" }),
                graniteAndMarble: z.string().min(3, { message: "Required type" }),
                tiles: z.object({
                    noOfBoxes: z.number().min(1, { message: "Required value" }),
                    noOfPiecesPerBoxes: z.number().min(1, { message: "Required value" }),
                    sizePerTile: z.object({
                        length: z.object({
                            value: z.number(),
                            units: z.string()
                        }),
                        breadth: z.object({
                            value: z.number(),
                            units: z.string()
                        })
                    })
                })
            })
        }))
    }),

    shippingDetails: z.object({
        shippingLine: z.string().min(3, { message: "Required name" }),
        noOfShipmentinvoices: z.number(),
        shippingLineInvoices: z.array(z.object({
            invoiceNumber: z.string(),
            uploadInvoiceUrl: z.string(),
            date: z.date(),
            valueWithGst: z.number(),
            valueWithoutGst: z.number()
        })),
        transporterName: z.string().min(3, { message: "Required name" }),
        noOftransportinvoices: z.number(),
        transporterInvoices: z.array(z.object({
            invoiceNumber: z.string(),
            uploadInvoiceUrl: z.string(),
            date: z.date(),
            valueWithGst: z.number(),
            valueWithoutGst: z.number()
        })),
        forwarderName: z.string().min(3, { message: "Required name" }),
        noOfForwarderinvoices: z.number(),
        forwarderInvoices: z.array(z.object({
            invoiceNumber: z.string(),
            uploadInvoiceUrl: z.string(),
            date: z.date(),
            valueWithGst: z.number(),
            valueWithoutGst: z.number()
        }))
    }),

    shippingBillDetails: z.object({
        portCode: z.string(),
        cbName: z.date(),
        cdCode: z.string(),
        ShippingBills: z.object({
            shippingBillUrl: z.string(),
            shippingBillNumber: z.string(),
            shippingBillDate: z.date(),
            drawbackValue: z.string(),
            rodtepValue: z.string()
        })
    }),

    supplierDetails: z.object({
        clearance: z.object({
            supplierName: z.string().min(3, { message: "Required name" }),
            noOfInvoices: z.number(),
            invoices: z.array(z.object({
                supplierGSTN: z.string().min(3, { message: "Required GSTIN" }),
                supplierInvoiceNumber: z.string(),
                supplierInvoiceDate: z.date(),
                supplierInvoiceValueWithGST: z.string(),
                supplierInvoiceValueWithOutGST: z.string(),
                clearanceSupplierInvoiceUrl: z.string()
            }))
        }),
        actual: z.object({
            actualSupplierName: z.string(),
            actualSupplierInvoiceValue: z.string(),
            actualSupplierInvoiceUrl: z.string(),
            shippingBillUrl: z.string()
        })
    }),

    saleInvoiceDetails: z.object({
        consignee: z.string(),
        actualBuyer: z.string(),
        commercialInvoices: z.object({
            commercialInvoiceNumber: z.string(),
            clearanceCommercialInvoiceUrl: z.string(),
            actualCommercialInvoiceUrl: z.string(),
            saberInvoiceUrl: z.string()
        })
    }),

    blDetails: z.object({
        blNumber: z.string(),
        blDate: z.date(),
        telexDate: z.date(),
        uploadBL: z.string()
    }),

    otherDetails: z.object({
        certificateOfOriginNumber: z.string(),
        date: z.date(),
        issuerOfCOO: z.string(),
        uploadCopyOfFumigationCertificate: z.string()
    }),

    organizationId: z.string()
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
            CertificateOfOrigin: {},
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
            </div>

            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((data) => console.log(data))}
                    className="flex flex-col gap-3 w-full p-3"
                >
                    {/* Buttons at the top */}
                    <div className="flex justify-between mt-4">
                        {/* "Previous" button (always on the left, but hidden on the first step) */}
                        <Button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={currentStep === 0 ? "invisible" : ""}
                        >
                            Previous
                        </Button>

                        {/* "Next" button (always on the right) */}
                        {currentStep < steps.length - 1 && (
                            <Button type="button" onClick={nextStep}>
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
                </form>
            </FormProvider>
        </div>
    );
}

