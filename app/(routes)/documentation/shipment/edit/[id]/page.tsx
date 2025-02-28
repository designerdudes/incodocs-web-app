"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BookingDetails } from "./components/BookingDetails";
import { ShippingBillDetails } from "./components/ShippingBillDetails";
import { ShippingDetails } from "./components/ShippingDetails";
import { SupplierDetails } from "./components/SupplierDetails";
import { SaleInvoiceDetails } from "./components/SaleInvoiceDetails";
import { BillOfLadingDetails } from "./components/BillOfLadingDetails";
import { OtherDetails } from "./components/OtherDetails";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO } from "date-fns";

// Define the schema
const formSchema = z.object({
  bookingDetails: z
    .object({
      bookingNumber: z.string().min(3, { message: "Required name" }).optional(),
      portOfLoading: z.string().min(3, { message: "Required name" }).optional(),
      destinationPort: z.string().min(3, { message: "Required name" }).optional(),
      vesselSailingDate: z.date().optional(),
      vesselArrivingDate: z.date().optional(),
      numberOfContainer: z.number().optional(),
      containers: z
        .array(
          z.object({
            containerNumber: z.string().min(3, { message: "Container Number must be at least 3 characters long" }).optional(),
            truckNumber: z.string().min(3, { message: "Truck Number must be at least 3 characters long" }).optional(),
            truckDriverContactNumber: z.string().min(10, { message: "Truck driver number should be 10 characters long" }).optional(),
          })
        )
        .optional(),
    })
    .optional(),
  shippingBillDetails: z
    .object({
      portCode: z.string().optional(),
      cbName: z.string().optional(),
      cbCode: z.string().optional(),
      numberOFShippingBill: z.number().optional(),
      bills: z
        .array(
          z.object({
            uploadShippingBill: z.any().optional(),
            shippingBillNumber: z.string().optional(),
            shippingBillDate: z.date().optional(),
            drawbackValue: z.string().optional(),
            rodtepValue: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  shippingDetails: z
    .object({
      shippingLine: z.string().optional(),
      numberOfShippingLineInvoices: z.number().optional(),
      shippingLineInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadShippingLineInvoice: z.any().optional(),
            date: z.date().optional(),
            valueWithGST: z.string().optional(),
            valueWithoutGST: z.string().optional(),
          })
        )
        .optional(),
      forwarderName: z.string().optional(),
      numberOfForwarderInvoices: z.number().optional(),
      forwarderInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadForwarderInvoice: z.any().optional(),
            date: z.date().optional(),
            valueWithGST: z.string().optional(),
            valueWithoutGST: z.string().optional(),
          })
        )
        .optional(),
      transporterName: z.string().optional(),
      numberOfTransporterInvoices: z.number().optional(),
      transporterInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadTransporterInvoice: z.any().optional(),
            date: z.date().optional(),
            valueWithGST: z.string().optional(),
            valueWithoutGST: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  supplierDetails: z
    .object({
      clearance: z
        .object({
          supplierName: z.string().optional(),
          noOfInvoices: z.number().optional(),
          invoices: z
            .array(
              z.object({
                supplierGSTN: z.string().optional(),
                supplierInvoiceNumber: z.string().optional(),
                supplierInvoiceDate: z.date().optional(),
                supplierInvoiceValueWithGST: z.string().optional(),
                supplierInvoiceValueWithOutGST: z.string().optional(),
                clearanceSupplierInvoiceUrl: z.any().optional(),
              })
            )
            .optional(),
        })
        .optional(),
      actual: z
        .object({
          actualSupplierName: z.string().optional(),
          actualSupplierInvoiceValue: z.string().optional(),
          actualSupplierInvoiceUrl: z.any().optional(),
          shippingBillUrl: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  saleInvoiceDetails: z
    .object({
      consignee: z.string().optional(),
      actualBuyer: z.string().optional(),
      numberOfSalesInvoices: z.number().optional(),
      invoice: z
        .array(
          z.object({
            commercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoice: z.string().optional(),
            actualCommercialInvoice: z.string().optional(),
            saberInvoice: z.string().optional(),
            addProductDetails: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  blDetails: z
    .object({
      blNumber: z.string().optional(),
      blDate: z.date().optional(),
      telexDate: z.date().optional(),
      uploadBL: z.any().optional(),
    })
    .optional(),
  otherDetails: z
    .array(
      z.object({
        review: z.string().optional(),
        certificateName: z.string().optional(),
        certificateNumber: z.string().optional(),
        date: z.date().optional(),
        issuerOfCertificate: z.string().optional(),
        uploadCopyOfCertificate: z.any().optional(),
      })
    )
    .optional(),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

interface Props {
  params: {
    id: string;
  };
}

export default function CreateNewFormPage({ params }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingDetails: {
        bookingNumber: "",
        portOfLoading: "",
        destinationPort: "",
        vesselSailingDate: undefined,
        vesselArrivingDate: undefined,
        numberOfContainer: 0,
        containers: [],
      },
      shippingBillDetails: {
        portCode: "",
        cbName: "",
        cbCode: "",
        numberOFShippingBill: 0,
        bills: [],
      },
      shippingDetails: {
        shippingLine: "",
        numberOfShippingLineInvoices: 0,
        shippingLineInvoices: [],
        forwarderName: "",
        numberOfForwarderInvoices: 0,
        forwarderInvoices: [],
        transporterName: "",
        numberOfTransporterInvoices: 0,
        transporterInvoices: [],
      },
      supplierDetails: {
        clearance: {
          supplierName: "",
          noOfInvoices: 0,
          invoices: [],
        },
        actual: {
          actualSupplierName: "",
          actualSupplierInvoiceValue: "",
          actualSupplierInvoiceUrl: "",
          shippingBillUrl: "",
        },
      },
      saleInvoiceDetails: {
        consignee: "",
        actualBuyer: "",
        numberOfSalesInvoices: 0,
        invoice: [],
      },
      blDetails: {
        blNumber: "",
        blDate: undefined,
        telexDate: undefined,
        uploadBL: "",
      },
      otherDetails: [
        {
          review: "",
          certificateName: "",
          certificateNumber: "",
          date: undefined,
          issuerOfCertificate: "",
          uploadCopyOfCertificate: "",
        },
      ],
    },
  });

  const steps = [
    { id: 1, name: "Booking Details", component: <BookingDetails shipmentId={params.id} /> },
    { id: 2, name: "Shipping Bill Details", component: <ShippingBillDetails shipmentId={params.id} /> },
    { id: 3, name: "Shipping Details", component: <ShippingDetails shipmentId={params.id} /> },
    { id: 4, name: "Supplier Details", component: <SupplierDetails shipmentId={params.id} /> },
    { id: 5, name: "Sale Invoice Details", component: <SaleInvoiceDetails shipmentId={params.id} /> },
    { id: 6, name: "Bill of Lading Details", component: <BillOfLadingDetails shipmentId={params.id} /> },
    { id: 7, name: "Other Details", component: <OtherDetails shipmentId={params.id} /> },
  ];

  const totalSteps = steps.length;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    async function fetchShipmentData() {
      try {
        setIsFetching(true);
        const response = await fetch(`http://localhost:4080/shipment/getbyid/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch shipment data");

        const data = await response.json();
        console.log("Fetched Data:", JSON.stringify(data, null, 2));

        const updatedValues: FormValues = {
          bookingDetails: {
            bookingNumber: data.bookingDetails?.bookingNumber || "",
            portOfLoading: data.bookingDetails?.portOfLoading || "",
            destinationPort: data.bookingDetails?.destinationPort || "",
            vesselSailingDate: data.bookingDetails?.vesselSailingDate
              ? parseISO(data.bookingDetails.vesselSailingDate)
              : undefined,
            vesselArrivingDate: data.bookingDetails?.vesselArrivingDate
              ? parseISO(data.bookingDetails.vesselArrivingDate)
              : undefined,
            numberOfContainer: data.bookingDetails?.containers?.length || 0,
            containers: data.bookingDetails?.containers?.map((container: any) => ({
              containerNumber: container.containerNumber || "",
              truckNumber: container.truckNumber || "",
              truckDriverContactNumber: container.truckDriverContactNumber || container.trukDriverContactNumber || "",
            })) || [],
          },
          shippingBillDetails: {
            portCode: data.shippingBillDetails?.portCode || "",
            cbName: data.shippingBillDetails?.cbName || "",
            cbCode: data.shippingBillDetails?.cbCode || "",
            numberOFShippingBill: data.shippingBillDetails?.bills?.length || 0,
            bills: data.shippingBillDetails?.bills?.map((bill: any) => ({
              uploadShippingBill: bill.uploadShippingBill || "",
              shippingBillNumber: bill.shippingBillNumber || "",
              shippingBillDate: bill.shippingBillDate ? parseISO(bill.shippingBillDate) : undefined,
              drawbackValue: bill.drawbackValue || "",
              rodtepValue: bill.rodtepValue || "",
            })) || [],
          },
          shippingDetails: {
            shippingLine: typeof data.shippingDetails?.shippingLine === "object"
              ? data.shippingDetails?.shippingLine?._id || ""
              : data.shippingDetails?.shippingLine || "",
            numberOfShippingLineInvoices: data.shippingDetails?.shippingLineInvoices?.length || 0,
            shippingLineInvoices: data.shippingDetails?.shippingLineInvoices?.map((invoice: any) => ({
              invoiceNumber: invoice.invoiceNumber || "",
              uploadShippingLineInvoice: invoice.uploadShippingLineInvoice || "",
              date: invoice.date ? parseISO(invoice.date) : undefined,
              valueWithGST: invoice.valueWithGST || "",
              valueWithoutGST: invoice.valueWithoutGST || "",
            })) || [],
            forwarderName: typeof data.shippingDetails?.forwarderName === "object"
              ? data.shippingDetails?.forwarderName?._id || ""
              : data.shippingDetails?.forwarderName || "",
            numberOfForwarderInvoices: data.shippingDetails?.forwarderInvoices?.length || 0,
            forwarderInvoices: data.shippingDetails?.forwarderInvoices?.map((invoice: any) => ({
              invoiceNumber: invoice.invoiceNumber || "",
              uploadForwarderInvoice: invoice.uploadForwarderInvoice || "",
              date: invoice.date ? parseISO(invoice.date) : undefined,
              valueWithGST: invoice.valueWithGST || "",
              valueWithoutGST: invoice.valueWithoutGST || "",
            })) || [],
            transporterName: typeof data.shippingDetails?.transporterName === "object"
              ? data.shippingDetails?.transporterName?._id || ""
              : data.shippingDetails?.transporterName || "",
            numberOfTransporterInvoices: data.shippingDetails?.transporterInvoices?.length || 0,
            transporterInvoices: data.shippingDetails?.transporterInvoices?.map((invoice: any) => ({
              invoiceNumber: invoice.invoiceNumber || "",
              uploadTransporterInvoice: invoice.uploadTransporterInvoice || "",
              date: invoice.date ? parseISO(invoice.date) : undefined,
              valueWithGST: invoice.valueWithGST || "",
              valueWithoutGST: invoice.valueWithoutGST || "",
            })) || [],
          },
          supplierDetails: {
            clearance: {
              supplierName: data.supplierDetails?.clearance?.supplierName ?? "",
              noOfInvoices: data.supplierDetails?.clearance?.invoices?.length || 0,
              invoices: data.supplierDetails?.clearance?.invoices?.map((invoice: any) => ({
                supplierGSTN: invoice.supplierGSTN || "",
                supplierInvoiceNumber: invoice.supplierInvoiceNumber || "",
                supplierInvoiceDate: invoice.supplierInvoiceDate ? parseISO(invoice.supplierInvoiceDate) : undefined,
                supplierInvoiceValueWithGST: invoice.supplierInvoiceValueWithGST || "",
                supplierInvoiceValueWithOutGST: invoice.supplierInvoiceValueWithOutGST || "",
                clearanceSupplierInvoiceUrl: invoice.clearanceSupplierInvoiceUrl || "",
              })) || [],
            },
            actual: {
              actualSupplierName: data.supplierDetails?.actual?.actualSupplierName || "",
              actualSupplierInvoiceValue: data.supplierDetails?.actual?.actualSupplierInvoiceValue || "",
              actualSupplierInvoiceUrl: data.supplierDetails?.actual?.actualSupplierInvoiceUrl || "",
              shippingBillUrl: data.supplierDetails?.actual?.shippingBillUrl || "",
            },
          },
          saleInvoiceDetails: {
            consignee: typeof data.saleInvoiceDetails?.consignee === "object"
              ? data.saleInvoiceDetails?.consignee?._id || ""
              : data.saleInvoiceDetails?.consignee || "",
            actualBuyer: data.saleInvoiceDetails?.actualBuyer || "",
            numberOfSalesInvoices: data.saleInvoiceDetails?.invoice?.length || 0,
            invoice: data.saleInvoiceDetails?.invoice?.map((inv: any) => ({
              commercialInvoiceNumber: inv.commercialInvoiceNumber || "",
              clearanceCommercialInvoice: inv.clearanceCommercialInvoice || "",
              actualCommercialInvoice: inv.actualCommercialInvoice || "",
              saberInvoice: inv.saberInvoice || "",
              addProductDetails: inv.addProductDetails || "",
            })) || [],
          },
          blDetails: {
            blNumber: data.blDetails?.blNumber || "",
            blDate: data.blDetails?.blDate ? parseISO(data.blDetails.blDate) : undefined,
            telexDate: data.blDetails?.telexDate ? parseISO(data.blDetails.telexDate) : undefined,
            uploadBL: data.blDetails?.uploadBL || "",
          },
          otherDetails: data.otherDetails?.length > 0
            ? data.otherDetails.map((item: any) => ({
              review: item.review || "",
              certificateName: item.certificateName || "",
              certificateNumber: item.certificateNumber || "",
              date: item.date ? parseISO(item.date) : undefined,
              issuerOfCertificate: item.issuerOfCertificate || "",
              uploadCopyOfCertificate: item.uploadCopyOfCertificate || "",
            }))
            : [
              {
                review: "",
                certificateName: "",
                certificateNumber: "",
                date: undefined,
                issuerOfCertificate: "",
                uploadCopyOfCertificate: "",
              },
            ],
        };

        methods.reset(updatedValues);
        console.log("Form Values After Reset:", methods.getValues());
      } catch (error) {
        console.error("Error fetching shipment data:", error);
      } finally {
        setIsFetching(false);
      }
    }

    fetchShipmentData();
  }, [params.id, methods]);

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center justify-between">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className="leading-tight" title="Edit Shipment Details" />
          <p className="text-muted-foreground text-sm">
            Complete the form below to Edit shipment details.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className={currentStep === 0 ? "invisible" : ""}
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 && (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        )}
      </div>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit((data) => console.log("Parent Form Submitted:", data))}
            className="flex flex-col gap-3 w-full p-3"
          >
            <div className="flex justify-between">
              <Heading
                className="text-xl"
                title={steps[currentStep]?.name || "Step"}
              />
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            {steps[currentStep].component}
          </form>
        </FormProvider>
      )}
    </div>
  );
}