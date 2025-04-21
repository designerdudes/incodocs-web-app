
"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BookingDetails } from "./components/BookingDetails";
import { ShippingBillDetails } from "./components/ShippingBillDetails";
import { ShippingDetails } from "./components/ShippingDetails";
import { SupplierDetails } from "./components/SupplierDetails";
import { SaleInvoiceDetails } from "./components/SaleInvoiceDetails";
import { BillOfLadingDetails } from "./components/BillOfLadingDetails";
import { OtherDetails } from "./components/OtherDetails";
import ProgressBar from "./components/ProgressBar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Type for backend ShippingBill data
type BackendShippingBill = {
  shippingBillUrl?: string;
  uploadShippingBill?: string;
  shippingBillNumber?: string;
  shippingBillDate?: string;
  drawbackValue?: string;
  rodtepValue?: string;
  _id?: string;
};

// Type for backend addProductDetails
type BackendProductDetails = {
  productCategory?: string;
  graniteAndMarble?: string;
  tiles?: {
    noOfBoxes?: number;
    noOfPiecesPerBoxes?: number;
    sizePerTile?: {
      length?: { value?: number; units?: "inch" | "cm" };
      breadth?: { value?: number; units?: "inch" | "cm" };
    };
  };
  slabs?: {
    noOfBundles?: number;
    noOfSlabsPerBundle?: number;
    uploadMeasurementSheetUrl?: string;
    totalSQMTRorSQFTwithAllowance?: string;
    totalSQMTRorSMFTwithoutAllowance?: string;
  };
};

const formSchema = z.object({
  shipmentId: z.string().optional(),
  organizationId: z.string().optional(),
  bookingDetails: z
    .object({
      invoiceNumber: z.string().optional(),
      bookingNumber: z.string().optional(),
      portOfLoading: z.string().optional(),
      destinationPort: z.string().optional(),
      vesselSailingDate: z.any().optional(),
      vesselArrivingDate: z.any().optional(),
      numberOfContainer: z.number().min(0).optional(),
      containers: z
        .array(
          z.object({
            type: z.string().optional(),
            containerNumber: z.string().optional(),
            truckNumber: z.string().optional(),
            truckDriverContactNumber: z.number().optional(),
            addProductDetails: z
              .object({
                productCategory: z.string().optional(),
                graniteAndMarble: z.string().optional(),
                tiles: z
                  .object({
                    noOfBoxes: z.number().optional(),
                    noOfPiecesPerBoxes: z.number().optional(),
                    sizePerTile: z
                      .object({
                        length: z
                          .object({
                            value: z.number().optional(),
                            units: z.enum(["inch", "cm"]).optional(),
                          })
                          .optional(),
                        breadth: z
                          .object({
                            value: z.number().optional(),
                            units: z.enum(["inch", "cm"]).optional(),
                          })
                          .optional(),
                      })
                      .optional(),
                  })
                  .optional(),
                slabs: z
                  .object({
                    noOfBundles: z.number().optional(),
                    noOfSlabsPerBundle: z.number().optional(),
                    uploadMeasurementSheetUrl: z.string().optional(),
                    totalSQMTRorSQFTwithAllowance: z.string().optional(),
                    totalSQMTRorSMFTwithoutAllowance: z.string().optional(),
                  })
                  .optional(),
              })
              .optional(),
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
            shippingBillDate: z.any().optional(),
            drawbackValue: z.string().optional(),
            rodtepValue: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  shippingDetails: z
    .object({
      review: z.string().optional(),
      transporterName: z
        .any()
        .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
          message: "transporterName must be a valid ObjectId or empty",
        })
        .optional(),
      noOftransportinvoices: z.number().optional(),
      transporterInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUr: z.any().optional(),
            date: z.any().optional(),
            valueWithGst: z
              .union([
                z.string().transform((val) => (val ? parseFloat(val) : undefined)),
                z.number().transform((val) => (isNaN(val) ? undefined : val)),
              ])
              .optional(),
            valueWithoutGst: z
              .union([
                z.string().transform((val) => (val ? parseFloat(val) : undefined)),
                z.number().transform((val) => (isNaN(val) ? undefined : val)),
              ])
              .optional(),
          })
        )
        .optional(),
      forwarderName: z
        .any()
        .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
          message: "forwarderName must be a valid ObjectId or empty",
        })
        .optional(),
      noOfForwarderinvoices: z.number().optional(),
      forwarderInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUr: z.any().optional(),
            date: z.any().optional(),
            valueWithGst: z
              .union([
                z.string().transform((val) => (val ? parseFloat(val) : undefined)),
                z.number().transform((val) => (isNaN(val) ? undefined : val)),
              ])
              .optional(),
            valueWithoutGst: z
              .union([
                z.string().transform((val) => (val ? parseFloat(val) : undefined)),
                z.number().transform((val) => (isNaN(val) ? undefined : val)),
              ])
              .optional(),
          })
        )
        .optional(),
    })
    .optional(),
  supplierDetails: z
    .object({
      clearance: z
        .object({
          supplierName: z
            .any()
            .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
              message: "supplierName must be a valid ObjectId or empty",
            })
            .optional(),
          noOfInvoices: z.number().optional(),
          invoices: z
            .array(
              z.object({
                supplierGSTN: z.string().optional(),
                supplierInvoiceNumber: z.string().optional(),
                supplierInvoiceDate: z.any().optional(),
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
      consignee: z.any().optional(),
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
      blDate: z.any().optional(),
      telexDate: z.any().optional(),
      uploadBL: z.any().optional(),
    })
    .optional(),
  otherDetails: z
    .array(
      z.object({
        review: z.string().optional(),
        certificateName: z.string().optional(),
        certificateNumber: z.string().optional(),
        date: z.any().optional(),
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

export default function EditShipmentPage({ params }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [organizationId] = useState("674b0a687d4f4b21c6c980ba"); // Replace with dynamic value
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipmentId: "",
      organizationId: "",
      bookingDetails: {
        invoiceNumber: "",
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
        review: "",
        transporterName: null,
        noOftransportinvoices: 0,
        transporterInvoices: [],
        forwarderName: null,
        noOfForwarderinvoices: 0,
        forwarderInvoices: [],
      },
      supplierDetails: {
        clearance: {
          supplierName: null,
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
  const {
    watch,
    formState: { errors },
  } = methods;
  const invoiceNumber = watch("bookingDetails.invoiceNumber");

  const steps = useMemo(
    () => [
      {
        id: 1,
        name: "Booking Details",
        component: (
          <BookingDetails
            shipmentId={params.id}
            onProductDetailsOpenChange={setIsProductDetailsOpen}
          />
        ),
        field: "bookingDetails" as keyof FormValues,
      },
      {
        id: 2,
        name: "Shipping Details",
        component: <ShippingDetails shipmentId={params.id} />,
        field: "shippingDetails" as keyof FormValues,
      },
      {
        id: 3,
        name: "Shipping Bill Details",
        component: <ShippingBillDetails shipmentId={params.id} />,
        field: "shippingBillDetails" as keyof FormValues,
      },
      {
        id: 4,
        name: "Supplier Details",
        component: <SupplierDetails shipmentId={params.id} />,
        field: "supplierDetails" as keyof FormValues,
      },
      {
        id: 5,
        name: "Commercial Invoices",
        component: <SaleInvoiceDetails shipmentId={params.id} />,
        field: "saleInvoiceDetails" as keyof FormValues,
      },
      {
        id: 6,
        name: "Bill of Lading Details",
        component: <BillOfLadingDetails shipmentId={params.id} />,
        field: "blDetails" as keyof FormValues,
      },
      {
        id: 7,
        name: "Other Details",
        component: <OtherDetails shipmentId={params.id} />,
        field: "otherDetails" as keyof FormValues,
      },
    ],
    [params.id]
  );

  const handleUpdateAndNext = async (
    data: FormValues,
    isIntentional: boolean
  ) => {
    if (isProductDetailsOpen || !isIntentional) {
      console.log(
        "handleUpdateAndNext blocked: isProductDetailsOpen =",
        isProductDetailsOpen,
        "isIntentional =",
        isIntentional
      );
      return;
    }
    console.log(
      "handleUpdateAndNext called with data:",
      JSON.stringify(data, null, 2)
    );
    console.trace("handleUpdateAndNext call stack");
    const currentField = steps[currentStep].field;
    console.log("Current field:", currentField);

    try {
      console.log("Starting validation for:", currentField);
      const isValid = await methods.trigger(currentField, {
        shouldFocus: true,
      });
      console.log("Validation result:", isValid);
      console.log("Form errors:", JSON.stringify(errors, null, 2));

      if (!isValid) {
        let errorMessage = "Please fix errors in the form";
        if (errors[currentField as keyof FormValues]) {
          const fieldErrors = errors[currentField as keyof FormValues] as any;
          errorMessage =
            fieldErrors?.message ||
            fieldErrors?.[Object.keys(fieldErrors)[0]]?.message ||
            errorMessage;
        }
        toast.error(
          `Validation failed for ${steps[currentStep].name}: ${errorMessage}`
        );
        return;
      }

      console.log("Validation passed, proceeding to API call");

      const apiEndpoints: Record<keyof FormValues, string> = {
        bookingDetails:
          "https://incodocs-server.onrender.com/shipment/booking-details",
        shippingDetails:
          "https://incodocs-server.onrender.com/shipment/shipping-details",
        shippingBillDetails:
          "https://incodocs-server.onrender.com/shipment/shipping-bill-details",
        supplierDetails:
          "https://incodocs-server.onrender.com/shipment/supplier-details",
        saleInvoiceDetails:
          "https://incodocs-server.onrender.com/shipment/sale-invoice-details",
        blDetails: "https://incodocs-server.onrender.com/shipment/bl-details",
        otherDetails:
          "https://incodocs-server.onrender.com/shipment/other-details",
        shipmentId: "",
        organizationId: "",
      };

      let payload: any = {
        shipmentId: params.id,
        organizationId,
        [currentField]: data[currentField],
      };

      if (currentField === "bookingDetails") {
        payload.bookingDetails = {
          ...data.bookingDetails,
          containers:
            data.bookingDetails?.containers?.map((container) => ({
              ...container,
              truckDriverContactNumber: container.truckDriverContactNumber || undefined,
              trukDriverContactNumber: undefined,
              addProductDetails: container.addProductDetails ? [container.addProductDetails] : [],
            })) || [],
        };
      } else if (currentField === "shippingDetails") {
        payload.shippingDetails = {
          ...data.shippingDetails,
          transporterName:
            data.shippingDetails?.transporterName &&
            /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.transporterName)
              ? data.shippingDetails.transporterName
              : null,
          forwarderName:
            data.shippingDetails?.forwarderName &&
            /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.forwarderName)
              ? data.shippingDetails.forwarderName
              : null,
          transporterInvoices:
            data.shippingDetails?.transporterInvoices?.map((invoice) => ({
              ...invoice,
              valueWithGst: invoice.valueWithGst ? parseFloat(invoice.valueWithGst.toString()) : undefined,
              valueWithoutGst: invoice.valueWithoutGst ? parseFloat(invoice.valueWithoutGst.toString()) : undefined,
            })) || [],
          forwarderInvoices:
            data.shippingDetails?.forwarderInvoices?.map((invoice) => ({
              ...invoice,
              valueWithGst: invoice.valueWithGst ? parseFloat(invoice.valueWithGst.toString()) : undefined,
              valueWithoutGst: invoice.valueWithoutGst ? parseFloat(invoice.valueWithoutGst.toString()) : undefined,
            })) || [],
        };
      } else if (currentField === "shippingBillDetails") {
        payload.shippingBillDetails = {
          ...data.shippingBillDetails,
          bills:
            data.shippingBillDetails?.bills?.map((bill) => ({
              ...bill,
              uploadShippingBill: bill.uploadShippingBill || "",
              shippingBillDate:
                bill.shippingBillDate instanceof Date
                  ? bill.shippingBillDate.toISOString()
                  : bill.shippingBillDate,
            })) || [],
        };
      } else if (currentField === "supplierDetails") {
        payload.supplierDetails = {
          ...data.supplierDetails,
          clearance: {
            ...data.supplierDetails?.clearance,
            supplierName:
              data.supplierDetails?.clearance?.supplierName &&
              /^[0-9a-fA-F]{24}$/.test(data.supplierDetails.clearance.supplierName)
                ? data.supplierDetails.clearance.supplierName
                : null,
          },
          actual: {
            ...data.supplierDetails?.actual,
            actualSupplierName: data.supplierDetails?.actual?.actualSupplierName || "",
          },
        };
        console.log("SupplierDetails payload:", JSON.stringify(payload.supplierDetails, null, 2));
      }

      const apiUrl = apiEndpoints[currentField as keyof FormValues];
      console.log(
        `Calling API: ${apiUrl} with payload:`,
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${errorText || response.statusText}`);
      }

      const updatedData = await response.json();
      console.log("API response:", updatedData);

      if (updatedData[currentField]) {
        let updatedSectionData: any;

        if (
          currentField !== "otherDetails" &&
          currentField !== "shipmentId" &&
          currentField !== "organizationId"
        ) {
          updatedSectionData = {
            ...(data[currentField] as object),
            ...(updatedData[currentField] as object),
          };

          if (currentField === "bookingDetails") {
            updatedSectionData.vesselSailingDate = updatedData.bookingDetails
              .vesselSailingDate
              ? parseISO(updatedData.bookingDetails.vesselSailingDate)
              : undefined;
            updatedSectionData.vesselArrivingDate = updatedData.bookingDetails
              .vesselArrivingDate
              ? parseISO(updatedData.bookingDetails.vesselArrivingDate)
              : undefined;
            updatedSectionData.containers =
              updatedData.bookingDetails.containers?.map((container: any) => ({
                ...container,
                truckDriverContactNumber:
                  container.truckDriverContactNumber || container.trukDriverContactNumber || undefined,
                trukDriverContactNumber: undefined,
                addProductDetails: Array.isArray(container.addProductDetails)
                  ? container.addProductDetails[0] || {
                      productCategory: "",
                      graniteAndMarble: "",
                      tiles: {
                        noOfBoxes: 0,
                        noOfPiecesPerBoxes: 0,
                        sizePerTile: {
                          length: { value: 0, units: "" },
                          breadth: { value: 0, units: "" },
                        },
                      },
                      slabs: {
                        noOfBundles: 0,
                        noOfSlabsPerBundle: 0,
                        uploadMeasurementSheetUrl: "",
                        totalSQMTRorSQFTwithAllowance: "",
                        totalSQMTRorSMFTwithoutAllowance: "",
                      },
                    }
                  : container.addProductDetails || {
                      productCategory: "",
                      graniteAndMarble: "",
                      tiles: {
                        noOfBoxes: 0,
                        noOfPiecesPerBoxes: 0,
                        sizePerTile: {
                          length: { value: 0, units: "" },
                          breadth: { value: 0, units: "" },
                        },
                      },
                      slabs: {
                        noOfBundles: 0,
                        noOfSlabsPerBundle: 0,
                        uploadMeasurementSheetUrl: "",
                        totalSQMTRorSQFTwithAllowance: "",
                        totalSQMTRorSMFTwithoutAllowance: "",
                      },
                    },
              })) || [];
          } else if (currentField === "shippingBillDetails") {
            updatedSectionData.bills = updatedData.shippingBillDetails.bills?.map((bill: any) => ({
              ...bill,
              shippingBillDate: bill.shippingBillDate ? parseISO(bill.shippingBillDate) : undefined,
              uploadShippingBill: bill.uploadShippingBill || bill.shippingBillUrl || "",
            })) || [];
          } else if (currentField === "shippingDetails") {
            updatedSectionData.transporterInvoices =
              updatedData.shippingDetails.transporterInvoices?.map(
                (invoice: any) => ({
                  ...invoice,
                  date: invoice.date ? parseISO(invoice.date) : undefined,
                  valueWithGst: invoice.valueWithGst != null ? invoice.valueWithGst.toString() : "",
                  valueWithoutGst: invoice.valueWithoutGst != null ? invoice.valueWithoutGst.toString() : "",
                })
              ) || [];
            updatedSectionData.forwarderInvoices =
              updatedData.shippingDetails.forwarderInvoices?.map(
                (invoice: any) => ({
                  ...invoice,
                  date: invoice.date ? parseISO(invoice.date) : undefined,
                  valueWithGst: invoice.valueWithGst != null ? invoice.valueWithGst.toString() : "",
                  valueWithoutGst: invoice.valueWithoutGst != null ? invoice.valueWithoutGst.toString() : "",
                })
              ) || [];
          } else if (currentField === "supplierDetails") {
            updatedSectionData.clearance.invoices =
              updatedData.supplierDetails.clearance.invoices?.map(
                (invoice: any) => ({
                  ...invoice,
                  supplierInvoiceDate: invoice.supplierInvoiceDate
                    ? parseISO(invoice.supplierInvoiceDate)
                    : undefined,
                })
              ) || [];
            updatedSectionData.clearance.supplierName =
              typeof updatedData.supplierDetails?.clearance?.supplierName === "object"
                ? updatedData.supplierDetails?.clearance?.supplierName?._id || null
                : updatedData.supplierDetails?.clearance?.supplierName &&
                  /^[0-9a-fA-F]{24}$/.test(updatedData.supplierDetails.clearance.supplierName)
                ? updatedData.supplierDetails.clearance.supplierName
                : null;
            updatedSectionData.actual.actualSupplierName =
              updatedData.supplierDetails?.actual?.actualSupplierName || "";
          } else if (currentField === "blDetails") {
            updatedSectionData.blDate = updatedData.blDetails.blDate
              ? parseISO(updatedData.blDetails.blDate)
              : undefined;
            updatedSectionData.telexDate = updatedData.blDetails.telexDate
              ? parseISO(updatedData.blDetails.telexDate)
              : undefined;
          }
        } else if (currentField === "otherDetails") {
          updatedSectionData =
            updatedData.otherDetails?.map((item: any) => ({
              ...item,
              date: item.date ? parseISO(item.date) : undefined,
            })) || [];
        } else {
          updatedSectionData = updatedData[currentField];
        }

        methods.setValue(currentField as keyof FormValues, updatedSectionData);
      }

      toast.success(`${steps[currentStep].name} updated successfully!`);

      if (currentStep < steps.length - 1) {
        console.log("Navigating to step:", currentStep + 1);
        setCurrentStep(currentStep + 1);
      } else {
        console.log("At last step, navigating to previous page");
        router.push("../");
      }
    } catch (error) {
      console.error(`Error in ${steps[currentStep].field}:`, error);
      toast.error(
        `Failed to update ${steps[currentStep].name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
        console.log("Fetching shipment data for ID:", params.id);
        const response = await fetch(
          `http://localhost:4080/shipment/getbyid/${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch shipment data");

        const data = await response.json();
        console.log("Fetched shipment data:", data);

        const updatedValues: FormValues = {
          shipmentId: data.shipmentId || "",
          organizationId: organizationId || "",
          bookingDetails: {
            invoiceNumber: data.bookingDetails?.invoiceNumber || "",
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
            containers:
              data.bookingDetails?.containers?.map((container: any) => ({
                type: container.type || "",
                containerNumber: container.containerNumber || "",
                truckNumber: container.truckNumber || "",
                truckDriverContactNumber:
                  container.truckDriverContactNumber || container.trukDriverContactNumber || undefined,
                addProductDetails: Array.isArray(container.addProductDetails)
                  ? container.addProductDetails[0] || {
                      productCategory: "",
                      graniteAndMarble: "",
                      tiles: {
                        noOfBoxes: 0,
                        noOfPiecesPerBoxes: 0,
                        sizePerTile: {
                          length: { value: 0, units: "" },
                          breadth: { value: 0, units: "" },
                        },
                      },
                      slabs: {
                        noOfBundles: 0,
                        noOfSlabsPerBundle: 0,
                        uploadMeasurementSheetUrl: "",
                        totalSQMTRorSQFTwithAllowance: "",
                        totalSQMTRorSMFTwithoutAllowance: "",
                      },
                    }
                  : container.addProductDetails || {
                      productCategory: "",
                      graniteAndMarble: "",
                      tiles: {
                        noOfBoxes: 0,
                        noOfPiecesPerBoxes: 0,
                        sizePerTile: {
                          length: { value: 0, units: "" },
                          breadth: { value: 0, units: "" },
                        },
                      },
                      slabs: {
                        noOfBundles: 0,
                        noOfSlabsPerBundle: 0,
                        uploadMeasurementSheetUrl: "",
                        totalSQMTRorSQFTwithAllowance: "",
                        totalSQMTRorSMFTwithoutAllowance: "",
                      },
                    },
              })) || [],
          },
          shippingBillDetails: {
            portCode: data.shippingBillDetails?.portCode || "",
            cbName: data.shippingBillDetails?.cbName || "",
            cbCode: data.shippingBillDetails?.cbCode || "",
            numberOFShippingBill:
              data.shippingBillDetails?.ShippingBills?.length ||
              data.shippingBillDetails?.bills?.length ||
              0,
            bills:
              (
                data.shippingBillDetails?.ShippingBills ||
                data.shippingBillDetails?.bills ||
                []
              )?.map((bill: BackendShippingBill) => ({
                uploadShippingBill:
                  bill.uploadShippingBill || bill.shippingBillUrl || "",
                shippingBillNumber: bill.shippingBillNumber || "",
                shippingBillDate: bill.shippingBillDate
                  ? parseISO(bill.shippingBillDate)
                  : undefined,
                drawbackValue: bill.drawbackValue || "",
                rodtepValue: bill.rodtepValue || "",
              })) || [],
          },
          shippingDetails: {
            review: data.shippingDetails?.review || "",
            transporterName:
              typeof data.shippingDetails?.transporterName === "object"
                ? data.shippingDetails?.transporterName?._id || null
                : data.shippingDetails?.transporterName &&
                  /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.transporterName)
                ? data.shippingDetails.transporterName
                : null,
            noOftransportinvoices:
              data.shippingDetails?.noOftransportinvoices ||
              data.shippingDetails?.transporterInvoices?.length ||
              0,
            transporterInvoices:
              data.shippingDetails?.transporterInvoices?.map(
                (invoice: any) => ({
                  invoiceNumber: invoice.invoiceNumber || "",
                  uploadInvoiceUr:
                    invoice.uploadInvoiceUr ||
                    invoice.uploadTransporterInvoice ||
                    "",
                  date: invoice.date ? parseISO(invoice.date) : undefined,
                  valueWithGst: invoice.valueWithGst != null ? invoice.valueWithGst.toString() : "",
                  valueWithoutGst: invoice.valueWithoutGst != null ? invoice.valueWithoutGst.toString() : "",
                })
              ) || [],
            forwarderName:
              typeof data.shippingDetails?.forwarderName === "object"
                ? data.shippingDetails?.forwarderName?._id || null
                : data.shippingDetails?.forwarderName &&
                  /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.forwarderName)
                ? data.shippingDetails.forwarderName
                : null,
            noOfForwarderinvoices:
              data.shippingDetails?.noOfForwarderinvoices ||
              data.shippingDetails?.forwarderInvoices?.length ||
              0,
            forwarderInvoices:
              data.shippingDetails?.forwarderInvoices?.map(
                (invoice: any) => ({
                  invoiceNumber: invoice.invoiceNumber || "",
                  uploadInvoiceUr:
                    invoice.uploadInvoiceUr ||
                    invoice.uploadForwarderInvoice ||
                    "",
                  date: invoice.date ? parseISO(invoice.date) : undefined,
                  valueWithGst: invoice.valueWithGst != null ? invoice.valueWithGst.toString() : "",
                  valueWithoutGst: invoice.valueWithoutGst != null ? invoice.valueWithoutGst.toString() : "",
                })
              ) || [],
          },
          supplierDetails: {
            clearance: {
              supplierName:
                typeof data.supplierDetails?.clearance?.supplierName === "object"
                  ? data.supplierDetails?.clearance?.supplierName?._id || null
                  : data.supplierDetails?.clearance?.supplierName &&
                    /^[0-9a-fA-F]{24}$/.test(data.supplierDetails.clearance.supplierName)
                  ? data.supplierDetails.clearance.supplierName
                  : null,
              noOfInvoices:
                data.supplierDetails?.clearance?.invoices?.length || 0,
              invoices:
                data.supplierDetails?.clearance?.invoices?.map(
                  (invoice: any) => ({
                    supplierGSTN: invoice.supplierGSTN || "",
                    supplierInvoiceNumber: invoice.supplierInvoiceNumber || "",
                    supplierInvoiceDate: invoice.supplierInvoiceDate
                      ? parseISO(invoice.supplierInvoiceDate)
                      : undefined,
                    supplierInvoiceValueWithGST:
                      invoice.supplierInvoiceValueWithGST || "",
                    supplierInvoiceValueWithOutGST:
                      invoice.supplierInvoiceValueWithOutGST || "",
                    clearanceSupplierInvoiceUrl:
                      invoice.clearanceSupplierInvoiceUrl || "",
                  })
                ) || [],
            },
            actual: {
              actualSupplierName: data.supplierDetails?.actual?.actualSupplierName || "",
              actualSupplierInvoiceValue:
                data.supplierDetails?.actual?.actualSupplierInvoiceValue || "",
              actualSupplierInvoiceUrl:
                data.supplierDetails?.actual?.actualSupplierInvoiceUrl || "",
              shippingBillUrl:
                data.supplierDetails?.actual?.shippingBillUrl || "",
            },
          },
          saleInvoiceDetails: {
            consignee:
              typeof data.saleInvoiceDetails?.consignee === "object"
                ? data.saleInvoiceDetails?.consignee?._id ||
                  data.saleInvoiceDetails?.consignee?.name ||
                  ""
                : data.saleInvoiceDetails?.consignee || "",
            actualBuyer: data.saleInvoiceDetails?.actualBuyer || "",
            numberOfSalesInvoices:
              data.saleInvoiceDetails?.invoice?.length ||
              data.saleInvoiceDetails?.commercialInvoices?.length ||
              0,
            invoice:
              (
                data.saleInvoiceDetails?.invoice ||
                data.saleInvoiceDetails?.commercialInvoices ||
                []
              )?.map((inv: any) => ({
                commercialInvoiceNumber: inv.commercialInvoiceNumber || "",
                clearanceCommercialInvoice:
                  inv.clearanceCommercialInvoice || "",
                actualCommercialInvoice: inv.actualCommercialInvoice || "",
                saberInvoice: inv.saberInvoice || "",
                addProductDetails: inv.addProductDetails || "",
              })) || [],
          },
          blDetails: {
            blNumber: data.blDetails?.blNumber || "",
            blDate: data.blDetails?.blDate
              ? parseISO(data.blDetails.blDate)
              : undefined,
            telexDate: data.blDetails?.telexDate
              ? parseISO(data.blDetails.telexDate)
              : undefined,
            uploadBL: data.blDetails?.uploadBL || "",
          },
          otherDetails:
            data.otherDetails?.length > 0
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

        console.log("Mapped form values:", JSON.stringify(updatedValues, null, 2));
        methods.reset(updatedValues);
      } catch (error) {
        console.error("Error fetching shipment data:", error);
        toast.error("Failed to load shipment data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchShipmentData();
  }, [params.id, methods, organizationId]);

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
          <Heading
            className="leading-tight"
            title={`Edit Shipment: ${invoiceNumber || "N/A"}`}
          />
          <p className="text-muted-foreground text-sm">
            Complete the form below to edit shipment details.
          </p>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full">
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      </div>
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className={currentStep === 0 ? "invisible" : ""}
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={() => {
            console.log("Update & Next button clicked");
            const supplierName = methods.getValues("supplierDetails.clearance.supplierName");
            const actualSupplierName = methods.getValues("supplierDetails.actual.actualSupplierName");
            console.log("SupplierName before submit:", supplierName);
            console.log("ActualSupplierName before submit:", actualSupplierName);
            methods.handleSubmit(
              (data) => handleUpdateAndNext(data, true),
              (err) => {
                console.log(
                  "Form submission errors:",
                  JSON.stringify(err, null, 2)
                );
                toast.error(`Please fix errors in ${steps[currentStep].name}`);
              }
            )();
          }}
        >
          {currentStep < steps.length - 1 ? "Update & Next" : "Update & Finish"}
        </Button>
      </div>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isProductDetailsOpen) {
                console.log(
                  "Parent form submission blocked: isProductDetailsOpen =",
                  isProductDetailsOpen
                );
                return;
              }
              console.log(
                "Parent form submitted via Enter key or intentional submission"
              );
              const supplierName = methods.getValues("supplierDetails.clearance.supplierName");
              const actualSupplierName = methods.getValues("supplierDetails.actual.actualSupplierName");
              console.log("SupplierName on form submit:", supplierName);
              console.log("ActualSupplierName on form submit:", actualSupplierName);
              methods.handleSubmit((data) => handleUpdateAndNext(data, true))();
            }}
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