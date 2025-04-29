"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import ProgressBar from "./components/ProgressBar";
import { BookingDetails } from "./components/BookingDetails";
import { ShippingDetails } from "./components/ShippingDetails";
import { ShippingBillDetails } from "./components/ShippingBillDetails";
import { SupplierDetails } from "./components/SupplierDetails";
import { SaleInvoiceDetails } from "./components/SaleInvoiceDetails";
import { BillOfLadingDetails } from "./components/BillOfLadingDetails";
import { OtherDetails } from "./components/OtherDetails";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { putData } from "@/axiosUtility/api";
import { useRouter, useParams } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { debounce } from "lodash";

interface ShipmentApiResponse {
  _id?: string;
  shipmentId?: string;
  organizationId?: { _id: string } | string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  saleInvoiceDetails?: {
    review?: string;
    consignee?: { _id: string; name: string } | string;
    actualBuyer?: string;
    numberOfSalesInvoices?: number;
    commercialInvoices?: {
      commercialInvoiceNumber?: string;
      clearanceCommercialInvoiceUrl?: string;
      actualCommercialInvoiceUrl?: string;
      saberInvoiceUrl?: string;
      addProductDetails?: any[];
      _id?: string;
    }[];
    _id?: string;
  };
  bookingDetails?: {
    review?: string;
    invoiceNumber?: string;
    bookingNumber?: string;
    portOfLoading?: string;
    destinationPort?: string;
    vesselSailingDate?: string;
    vesselArrivingDate?: string;
    numberOfContainer?: number;
    containers?: any[];
    _id?: string;
  };
  shippingDetails?: {
    review?: string;
    transporterName?: string;
    noOftransportinvoices?: number;
    transporterInvoices?: any[];
    forwarderName?: string;
    noOfForwarderinvoices?: number;
    forwarderInvoices?: any[];
    _id?: string;
  };
  shippingBillDetails?: {
    review?: string;
    portCode?: string;
    cbName?: string;
    cbCode?: string;
    numberOFShippingBill?: number;
    ShippingBills?: any[];
    _id?: string;
  };
  supplierDetails?: {
    review?: string;
    clearance?: any;
    actual?: any;
    _id?: string;
  };
  blDetails?: {
    review?: string;
    shippingLineName?: string;
    noOfBl?: number;
    Bl?: any[];
    _id?: string;
  };
  otherDetails?: any[];
}

// Type for backend ShippingBill data
type BackendShippingBill = {
  shippingBillUrl?: string;
  shippingBillNumber?: string;
  shippingBillDate?: string;
  drawbackValue?: string;
  rodtepValue?: string;
  _id?: string;
};

// Type for backend Bl data
type BackendBl = {
  blNumber?: string;
  blDate?: string;
  telexDate?: string;
  uploadBLUrl?: string;
  _id?: string;
};

// Zod Schema with all fields optional
const formSchema = z.object({
  shipmentId: z.string().optional(),
  organizationId: z.string().optional(),
  createdAt: z.string().datetime({ message: "Invalid date format" }).optional(),
  updatedAt: z.string().datetime({ message: "Invalid date format" }).optional(),
  createdBy: z.string().optional(),
  bookingDetails: z
    .object({
      review: z.string().optional(),
      invoiceNumber: z.string().optional(),
      bookingNumber: z.string().optional(),
      portOfLoading: z.string().optional(),
      destinationPort: z.string().optional(),
      vesselSailingDate: z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
      vesselArrivingDate: z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
      numberOfContainer: z.number().optional(),
      containers: z
        .array(
          z.object({
            containerType: z.string().optional(),
            containerNumber: z.string().optional(),
            truckNumber: z.string().optional(),
            truckDriverContactNumber: z.number().optional(),
            addProductDetails: z
              .array(
                z.object({
                  _id: z.string().optional(),
                  productId: z.string().optional(),
                  code: z.string().optional(),
                  description: z.string().optional(),
                  unitOfMeasurements: z.string().optional(),
                  countryOfOrigin: z.string().optional(),
                  HScode: z.string().optional(),
                  variantName: z.string().optional(),
                  varianntType: z.string().optional(),
                  sellPrice: z.number().optional(),
                  buyPrice: z.number().optional(),
                  netWeight: z.number().optional(),
                  grossWeight: z.number().optional(),
                  cubicMeasurement: z.number().optional(),
                  __v: z.number().optional(),
                })
              )
              .optional()
              .default([]),
            _id: z.string().optional(),
          })
        )
        .optional()
        .default([]),
      _id: z.string().optional(),
    })
    .optional(),
  shippingDetails: z
    .object({
      review: z.string().optional(),
      transporterName: z
        .string()
        .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
          message: "transporterName must be a valid ObjectId or empty",
        })
        .optional(),
      noOftransportinvoices: z.number().optional(),
      transporterInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
            date: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
            _id: z.string().optional(),
          })
        )
        .optional()
        .default([]),
      forwarderName: z
        .string()
        .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
          message: "forwarderName must be a valid ObjectId or empty",
        })
        .optional(),
      noOfForwarderinvoices: z.number().optional(),
      forwarderInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
            date: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
            _id: z.string().optional(),
          })
        )
        .optional()
        .default([]),
      _id: z.string().optional(),
    })
    .optional(),
  shippingBillDetails: z
    .object({
      review: z.string().optional(),
      portCode: z.string().optional(),
      cbName: z.string().optional(),
      cbCode: z.string().optional(),
      numberOFShippingBill: z.number().optional(),
      bills: z
        .array(
          z.object({
            uploadShippingBill: z.string().optional(),
            shippingBillNumber: z.string().optional(),
            shippingBillDate: z.string().optional(),
            drawbackValue: z.number().optional(),
            rodtepValue: z.number().optional(),
          })
        )
        .optional()
        .default([]),
      _id: z.string().optional(),
    })
    .optional(),
  supplierDetails: z
    .object({
      review: z.string().optional(),
      clearance: z
        .object({
          noOfSuppliers: z
            .number()
            .min(0, "Number of suppliers must be non-negative")
            .optional(),
          suppliers: z
            .array(
              z.object({
                supplierName: z
                  .object({
                    _id: z.string().optional(),
                    supplierName: z
                      .string()
                      .min(1, "Supplier name is required")
                      .optional(),
                  })
                  .optional(),
                noOfInvoices: z
                  .number()
                  .min(0, "Number of invoices must be non-negative")
                  .optional(),
                invoices: z
                  .array(
                    z.object({
                      supplierInvoiceNumber: z
                        .string()
                        .min(1, "Invoice number is required")
                        .optional(),
                      supplierInvoiceDate: z
                        .string()
                        .datetime({ message: "Invalid date format" })
                        .optional(),
                      supplierInvoiceValueWithGST: z
                        .string()
                        .transform((val) => (val ? parseFloat(val) : undefined))
                        .optional(),
                      supplierInvoiceValueWithOutGST: z
                        .string()
                        .transform((val) => (val ? parseFloat(val) : undefined))
                        .optional(),
                      clearanceSupplierInvoiceUrl: z
                        .string()
                        .url("Invalid URL")
                        .optional(),
                      _id: z.string().optional(),
                    })
                  )
                  .optional()
                  .default([]),
                _id: z.string().optional(),
              })
            )
            .optional()
            .default([]),
          _id: z.string().optional(),
        })
        .optional(),
      actual: z
        .object({
          actualSupplierName: z.string().optional(),
          actualSupplierInvoiceValue: z
            .string()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .optional(),
          actualSupplierInvoiceUrl: z.string().url("Invalid URL").optional(),
          shippingBillUrl: z.string().url("Invalid URL").optional(),
          _id: z.string().optional(),
        })
        .optional(),
      _id: z.string().optional(),
    })
    .optional(),
  saleInvoiceDetails: z
    .object({
      review: z.string().optional(),
      consignee: z
        .string()
        .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
          message: "consignee must be a valid ObjectId or empty",
        })
        .optional(),
      actualBuyer: z.string().optional(),
      numberOfSalesInvoices: z.number().optional(),
      invoice: z
        .array(
          z.object({
            commercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoice: z.string().optional(),
            actualCommercialInvoice: z.string().optional(),
            saberInvoice: z.string().optional(),
            addProductDetails: z.array(z.any()).optional(),
            _id: z.string().optional(),
          })
        )
        .optional()
        .default([]),
      _id: z.string().optional(),
    })
    .optional(),
  blDetails: z
    .object({
      review: z.string().optional(),
      shippingLineName: z
        .string()
        .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
          message: "shippingLineName must be a valid ObjectId or empty",
        })
        .optional(),
      noOfBl: z.number().optional(),
      Bl: z
        .array(
          z.object({
            blNumber: z.string().optional(),
            blDate: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            telexDate: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            uploadBLUrl: z.string().url("Invalid URL").optional(),
            _id: z.string().optional(),
          })
        )
        .optional()
        .default([]),
      _id: z.string().optional(),
    })
    .optional(),
  otherDetails: z
    .array(
      z.object({
        review: z.string().optional(),
        certificateName: z.string().optional(),
        certificateNumber: z.string().optional(),
        date: z
          .string()
          .datetime({ message: "Invalid date format" })
          .optional(),
        issuerOfCertificate: z.string().optional(),
        uploadCopyOfCertificate: z.string().url("Invalid URL").optional(),
        _id: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

// Infer the type from the schema
export type FormValues = z.infer<typeof formSchema>;

// Default form values
const defaultFormValues: FormValues = {
  shipmentId: undefined,
  organizationId: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  createdBy: undefined,
  bookingDetails: {
    review: undefined,
    invoiceNumber: undefined,
    bookingNumber: undefined,
    portOfLoading: undefined,
    destinationPort: undefined,
    vesselSailingDate: undefined,
    vesselArrivingDate: undefined,
    numberOfContainer: undefined,
    containers: [],
    _id: undefined,
  },
  shippingDetails: {
    review: undefined,
    transporterName: undefined,
    noOftransportinvoices: undefined,
    transporterInvoices: [],
    forwarderName: undefined,
    noOfForwarderinvoices: undefined,
    forwarderInvoices: [],
    _id: undefined,
  },
  shippingBillDetails: {
    portCode: "",
    cbName: "",
    cbCode: "",
    numberOFShippingBill: 0,
    bills: [],
    _id: undefined,
  },
  supplierDetails: {
    review: undefined,
    clearance: {
      noOfSuppliers: undefined,
      suppliers: [],
      _id: undefined,
    },
    actual: {
      actualSupplierName: undefined,
      actualSupplierInvoiceUrl: undefined,
      actualSupplierInvoiceValue: undefined,
      shippingBillUrl: undefined,
      _id: undefined,
    },
    _id: undefined,
  },
  saleInvoiceDetails: {
    review: undefined,
    consignee: undefined,
    actualBuyer: undefined,
    numberOfSalesInvoices: undefined,
    invoice: [],
    _id: undefined,
  },
  blDetails: {
    review: undefined,
    shippingLineName: undefined,
    noOfBl: undefined,
    Bl: [],
    _id: undefined,
  },
  otherDetails: [],
};

// Save progress functions
const saveProgressSilently = (data: any, shipmentId: string) => {
  localStorage.setItem(`shipmentDraft_${shipmentId}`, JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
};

const saveProgressWithFeedback = (data: any, shipmentId: string) => {
  saveProgressSilently(data, shipmentId);
  toast.success("Progress saved as draft!");
};

interface Props {
  params: {
    id: string;
  };
}

export default function EditShipmentPage({ params }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();
  const urlOrgId = useParams().organizationId as string | undefined;
  const isInitialLoad = useRef(true);

  const loadDraft = (shipmentId: string): FormValues => {
    const draft = localStorage.getItem(`shipmentDraft_${shipmentId}`);
    return draft
      ? { ...defaultFormValues, ...JSON.parse(draft) }
      : defaultFormValues;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadDraft(params.id),
  });

  const watchedValues = form.watch();
  const debouncedSave = debounce((data: any) => {
    if (!isInitialLoad.current) {
      saveProgressSilently(data, params.id);
    }
  }, 1000);

  useEffect(() => {
    debouncedSave(watchedValues);
    return () => debouncedSave.cancel();
  }, [watchedValues, debouncedSave]);

  const steps = [
    {
      id: 1,
      name: "Booking Details",
      component: (
        <BookingDetails
          shipmentId={params.id}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
          onSectionSubmit={handleSectionSubmit}
          onProductDetailsOpenChange={setIsProductDetailsOpen}
        />
      ),
    },
    {
      id: 2,
      name: "Shipping Details",
      component: (
        <ShippingDetails
          shipmentId={params.id}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 3,
      name: "Shipping Bill Details",
      component: (
        <ShippingBillDetails
          shipmentId={params.id}
          orgId={organizationId}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 4,
      name: "Supplier Details",
      component: (
        <SupplierDetails
          shipmentId={params.id}
          orgId={organizationId}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 5,
      name: "Commercial Invoice",
      component: (
        <SaleInvoiceDetails
          shipmentId={params.id}
          orgId={organizationId}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 6,
      name: "Bill of Lading Details",
      component: (
        <BillOfLadingDetails
          shipmentId={params.id}
          orgId={organizationId}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 7,
      name: "Other Details",
      component: (
        <OtherDetails
          shipmentId={params.id}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
        />
      ),
    },
  ];

  async function handleSectionSubmit() {
    if (isProductDetailsOpen) {
      console.log(
        "handleSectionSubmit blocked: isProductDetailsOpen =",
        isProductDetailsOpen
      );
      return;
    }
    setIsLoading(true);
    try {
      const values = form.getValues();
      console.log(`Saving draft for ${steps[currentStep].name}:`, values);
      saveProgressWithFeedback(values, params.id);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error(`Error saving ${steps[currentStep].name} as draft:`, error);
      toast.error(`Error saving ${steps[currentStep].name} as draft`);
    } finally {
      setIsLoading(false);
    }
  }

  const submitDraft = async () => {
    setIsLoading(true);
    try {
      const values = form.getValues();
      console.log(
        "Submitting shipment update for ID:",
        params.id,
        "Values:",
        values
      );
      const payload = {
        shipmentId: values.shipmentId || undefined,
        organizationId: values.organizationId || organizationId || undefined,
        createdAt: values.createdAt || undefined,
        updatedAt: values.updatedAt || undefined,
        createdBy: values.createdBy || undefined,
        bookingDetails: values.bookingDetails
          ? {
              review: values.bookingDetails.review || undefined,
              invoiceNumber: values.bookingDetails.invoiceNumber || undefined,
              bookingNumber: values.bookingDetails.bookingNumber || undefined,
              portOfLoading: values.bookingDetails.portOfLoading || undefined,
              destinationPort:
                values.bookingDetails.destinationPort || undefined,
              vesselSailingDate:
                values.bookingDetails.vesselSailingDate || undefined,
              vesselArrivingDate:
                values.bookingDetails.vesselArrivingDate || undefined,
              numberOfContainer:
                values.bookingDetails.numberOfContainer ||
                values.bookingDetails.containers?.length ||
                undefined,
              containers:
                values.bookingDetails.containers?.map((container) => ({
                  containerType: container.containerType || undefined,
                  containerNumber: container.containerNumber || undefined,
                  truckNumber: container.truckNumber || undefined,
                  truckDriverContactNumber:
                    container.truckDriverContactNumber || undefined,
                  addProductDetails:
                    container.addProductDetails?.map((product) => ({
                      _id: product._id || undefined,
                      productId: product.productId || undefined,
                      code: product.code || undefined,
                      description: product.description || undefined,
                      unitOfMeasurements:
                        product.unitOfMeasurements || undefined,
                      countryOfOrigin: product.countryOfOrigin || undefined,
                      HScode: product.HScode || undefined,
                      variantName: product.variantName || undefined,
                      varianntType: product.varianntType || undefined,
                      sellPrice: product.sellPrice || undefined,
                      buyPrice: product.buyPrice || undefined,
                      netWeight: product.netWeight || undefined,
                      grossWeight: product.grossWeight || undefined,
                      cubicMeasurement: product.cubicMeasurement || undefined,
                      __v: product.__v || undefined,
                    })) || [],
                  _id: container._id || undefined,
                })) || [],
              _id: values.bookingDetails._id || undefined,
            }
          : undefined,
        shippingDetails: values.shippingDetails
          ? {
              review: values.shippingDetails.review || undefined,
              transporterName:
                values.shippingDetails.transporterName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.transporterName)
                  ? values.shippingDetails.transporterName
                  : undefined,
              noOftransportinvoices:
                values.shippingDetails.noOftransportinvoices ||
                values.shippingDetails.transporterInvoices?.length ||
                undefined,
              transporterInvoices:
                values.shippingDetails.transporterInvoices?.map((invoice) => ({
                  invoiceNumber: invoice.invoiceNumber || undefined,
                  uploadInvoiceUrl: invoice.uploadInvoiceUrl || undefined,
                  date: invoice.date || undefined,
                  valueWithGst: invoice.valueWithGst || undefined,
                  valueWithoutGst: invoice.valueWithoutGst || undefined,
                  _id: invoice._id || undefined,
                })) || [],
              forwarderName:
                values.shippingDetails.forwarderName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.forwarderName)
                  ? values.shippingDetails.forwarderName
                  : undefined,
              noOfForwarderinvoices:
                values.shippingDetails.noOfForwarderinvoices ||
                values.shippingDetails.forwarderInvoices?.length ||
                undefined,
              forwarderInvoices:
                values.shippingDetails.forwarderInvoices?.map((invoice) => ({
                  invoiceNumber: invoice.invoiceNumber || undefined,
                  uploadInvoiceUrl: invoice.uploadInvoiceUrl || undefined,
                  date: invoice.date || undefined,
                  valueWithGst: invoice.valueWithGst || undefined,
                  valueWithoutGst: invoice.valueWithoutGst || undefined,
                  _id: invoice._id || undefined,
                })) || [],
              _id: values.shippingDetails._id || undefined,
            }
          : undefined,
        shippingBillDetails: values.shippingBillDetails
          ? {
              review: values.shippingBillDetails.review || undefined,
              portCode: values.shippingBillDetails.portCode || undefined,
              cbName: values.shippingBillDetails.cbName || undefined,
              cbCode: values.shippingBillDetails.cbCode || undefined,
              numberOFShippingBill:
                values.shippingBillDetails.numberOFShippingBill ||
                values.shippingBillDetails.bills?.length ||
                undefined,
              ShippingBills:
                values.shippingBillDetails.bills?.map((bill) => ({
                  shippingBillUrl: bill.uploadShippingBill || undefined,
                  shippingBillNumber: bill.shippingBillNumber || undefined,
                  shippingBillDate: bill.shippingBillDate || undefined,
                  drawbackValue: bill.drawbackValue
                    ? String(bill.drawbackValue)
                    : undefined,
                  rodtepValue: bill.rodtepValue
                    ? String(bill.rodtepValue)
                    : undefined,
                  _id: undefined,
                })) || [],
              _id: values.shippingBillDetails._id || undefined,
            }
          : undefined,
        supplierDetails: values.supplierDetails
          ? {
              review: values.supplierDetails.review || undefined,
              clearance: values.supplierDetails.clearance
                ? {
                    noOfSuppliers:
                      values.supplierDetails.clearance.noOfSuppliers ||
                      values.supplierDetails.clearance.suppliers?.length ||
                      undefined,
                    suppliers:
                      values.supplierDetails.clearance.suppliers?.map(
                        (supplier) => ({
                          supplierName: supplier.supplierName
                            ? {
                                _id: supplier.supplierName._id || undefined,
                                supplierName:
                                  supplier.supplierName.supplierName ||
                                  undefined,
                              }
                            : undefined,
                          noOfInvoices:
                            supplier.noOfInvoices ||
                            supplier.invoices?.length ||
                            undefined,
                          invoices:
                            supplier.invoices?.map((invoice) => ({
                              supplierInvoiceNumber:
                                invoice.supplierInvoiceNumber || undefined,
                              supplierInvoiceDate:
                                invoice.supplierInvoiceDate || undefined,
                              supplierInvoiceValueWithGST:
                                invoice.supplierInvoiceValueWithGST
                                  ? String(invoice.supplierInvoiceValueWithGST)
                                  : undefined,
                              supplierInvoiceValueWithOutGST:
                                invoice.supplierInvoiceValueWithOutGST
                                  ? String(
                                      invoice.supplierInvoiceValueWithOutGST
                                    )
                                  : undefined,
                              clearanceSupplierInvoiceUrl:
                                invoice.clearanceSupplierInvoiceUrl ||
                                undefined,
                              _id: invoice._id || undefined,
                            })) || [],
                          _id: supplier._id || undefined,
                        })
                      ) || [],
                    _id: values.supplierDetails.clearance._id || undefined,
                  }
                : undefined,
              actual: values.supplierDetails.actual
                ? {
                    actualSupplierName:
                      values.supplierDetails.actual.actualSupplierName ||
                      undefined,
                    actualSupplierInvoiceUrl:
                      values.supplierDetails.actual.actualSupplierInvoiceUrl ||
                      undefined,
                    actualSupplierInvoiceValue: values.supplierDetails.actual
                      .actualSupplierInvoiceValue
                      ? String(
                          values.supplierDetails.actual
                            .actualSupplierInvoiceValue
                        )
                      : undefined,
                    shippingBillUrl:
                      values.supplierDetails.actual.shippingBillUrl ||
                      undefined,
                    _id: values.supplierDetails.actual._id || undefined,
                  }
                : undefined,
              _id: values.supplierDetails._id || undefined,
            }
          : undefined,
        saleInvoiceDetails: values.saleInvoiceDetails
          ? {
              review: values.saleInvoiceDetails.review || undefined,
              consignee:
                values.saleInvoiceDetails.consignee &&
                /^[0-9a-fA-F]{24}$/.test(values.saleInvoiceDetails.consignee)
                  ? values.saleInvoiceDetails.consignee
                  : undefined,
              actualBuyer: values.saleInvoiceDetails.actualBuyer || undefined,
              numberOfSalesInvoices:
                values.saleInvoiceDetails.numberOfSalesInvoices ||
                values.saleInvoiceDetails.invoice?.length ||
                undefined,
              commercialInvoices:
                values.saleInvoiceDetails.invoice?.map((inv) => ({
                  commercialInvoiceNumber:
                    inv.commercialInvoiceNumber || undefined,
                  clearanceCommercialInvoiceUrl:
                    inv.clearanceCommercialInvoice || undefined,
                  actualCommercialInvoiceUrl:
                    inv.actualCommercialInvoice || undefined,
                  saberInvoiceUrl: inv.saberInvoice || undefined,
                  addProductDetails: inv.addProductDetails || undefined,
                  _id: inv._id || undefined,
                })) || [],
              _id: values.saleInvoiceDetails._id || undefined,
            }
          : undefined,
        blDetails: values.blDetails
          ? {
              review: values.blDetails.review || undefined,
              shippingLineName:
                values.blDetails.shippingLineName &&
                /^[0-9a-fA-F]{24}$/.test(values.blDetails.shippingLineName)
                  ? values.blDetails.shippingLineName
                  : undefined,
              noOfBl:
                values.blDetails.noOfBl ||
                values.blDetails.Bl?.length ||
                undefined,
              Bl:
                values.blDetails.Bl?.map((bl) => ({
                  blNumber: bl.blNumber || undefined,
                  blDate: bl.blDate || undefined,
                  telexDate: bl.telexDate || undefined,
                  uploadBLUrl: bl.uploadBLUrl || undefined,
                  _id: bl._id || undefined,
                })) || [],
              _id: values.blDetails._id || undefined,
            }
          : undefined,
        otherDetails:
          values.otherDetails?.map((item) => ({
            review: item.review || undefined,
            certificateName: item.certificateName || undefined,
            certificateNumber: item.certificateNumber || undefined,
            date: item.date || undefined,
            issuerOfCertificate: item.issuerOfCertificate || undefined,
            uploadCopyOfCertificate: item.uploadCopyOfCertificate || undefined,
            _id: item._id || undefined,
          })) || [],
      };

      await putData(`/shipment/update/${params.id}`, payload);
      toast.success("Shipment updated successfully!");
      router.push("../");
      setTimeout(
        () => localStorage.removeItem(`shipmentDraft_${params.id}`),
        2000
      );
      setTimeout(() => window.location.reload(), 5000);
    } catch (error: any) {
      console.error("Error submitting shipment update:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        toast.error(
          `Error updating shipment: ${
            error.response.data.message || "Server error"
          }`
        );
      } else {
        toast.error(
          "Error updating shipment: Network error or server unreachable"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchShipmentData() {
      try {
        setIsFetching(true);
        console.log("Fetching shipment data for ID:", params.id);
        const response = await fetch(
          `https://incodocs-server.onrender.com/shipment/getbyid/${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch shipment data");

        const data: ShipmentApiResponse = await response.json();
        console.log("Raw API response:", data);
        console.log("API saleInvoiceDetails:", data.saleInvoiceDetails);

        // Set organizationId from API response
        const fetchedOrgId =
          typeof data.organizationId === "object"
            ? data.organizationId?._id
            : data.organizationId;
        setOrganizationId(fetchedOrgId || urlOrgId || undefined);

        const updatedValues: FormValues = {
          shipmentId: data.shipmentId || undefined,
          organizationId: fetchedOrgId || urlOrgId || undefined,
          createdAt: data.createdAt || undefined,
          updatedAt: data.updatedAt || undefined,
          createdBy: data.createdBy || undefined,
          bookingDetails: data.bookingDetails
            ? {
                review: data.bookingDetails.review || undefined,
                invoiceNumber: data.bookingDetails.invoiceNumber || undefined,
                bookingNumber: data.bookingDetails.bookingNumber || undefined,
                portOfLoading: data.bookingDetails.portOfLoading || undefined,
                destinationPort:
                  data.bookingDetails.destinationPort || undefined,
                vesselSailingDate:
                  data.bookingDetails.vesselSailingDate || undefined,
                vesselArrivingDate:
                  data.bookingDetails.vesselArrivingDate || undefined,
                numberOfContainer:
                  data.bookingDetails.numberOfContainer ||
                  data.bookingDetails.containers?.length ||
                  undefined,
                containers: Array.isArray(data.bookingDetails?.containers)
                  ? data.bookingDetails.containers.map((container: any) => ({
                      containerType: container.containerType || undefined,
                      containerNumber: container.containerNumber || undefined,
                      truckNumber: container.truckNumber || undefined,
                      truckDriverContactNumber:
                        container.truckDriverContactNumber || undefined,
                      addProductDetails: Array.isArray(
                        container.addProductDetails
                      )
                        ? container.addProductDetails.map((product: any) => ({
                            _id: product._id || undefined,
                            productId: product._id || undefined,
                            code: product.code || undefined,
                            description: product.description || undefined,
                            unitOfMeasurements:
                              product.unitOfMeasurements || undefined,
                            countryOfOrigin:
                              product.countryOfOrigin || undefined,
                            HScode: undefined,
                            variantName: undefined,
                            varianntType: undefined,
                            sellPrice: undefined,
                            buyPrice: undefined,
                            netWeight: product.netWeight || undefined,
                            grossWeight: product.grossWeight || undefined,
                            cubicMeasurement:
                              product.cubicMeasurement || undefined,
                            __v: product.__v || undefined,
                          }))
                        : [],
                      _id: container._id || undefined,
                    }))
                  : [],
                _id: data.bookingDetails._id || undefined,
              }
            : undefined,
          shippingDetails: data.shippingDetails
            ? {
                review: data.shippingDetails.review || undefined,
                transporterName:
                  data.shippingDetails.transporterName &&
                  /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.transporterName)
                    ? data.shippingDetails.transporterName
                    : undefined,
                noOftransportinvoices:
                  data.shippingDetails.noOftransportinvoices ||
                  data.shippingDetails.transporterInvoices?.length ||
                  undefined,
                transporterInvoices: Array.isArray(
                  data.shippingDetails?.transporterInvoices
                )
                  ? data.shippingDetails.transporterInvoices.map(
                      (invoice: any) => ({
                        invoiceNumber: invoice.invoiceNumber || undefined,
                        uploadInvoiceUrl: invoice.uploadInvoiceUrl || undefined,
                        date: invoice.date || undefined,
                        valueWithGst: invoice.valueWithGst || undefined,
                        valueWithoutGst: invoice.valueWithoutGst || undefined,
                        _id: invoice._id || undefined,
                      })
                    )
                  : [],
                forwarderName:
                  data.shippingDetails.forwarderName &&
                  /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.forwarderName)
                    ? data.shippingDetails.forwarderName
                    : undefined,
                noOfForwarderinvoices:
                  data.shippingDetails.noOfForwarderinvoices ||
                  data.shippingDetails.forwarderInvoices?.length ||
                  undefined,
                forwarderInvoices: Array.isArray(
                  data.shippingDetails?.forwarderInvoices
                )
                  ? data.shippingDetails.forwarderInvoices.map(
                      (invoice: any) => ({
                        invoiceNumber: invoice.invoiceNumber || undefined,
                        uploadInvoiceUrl: invoice.uploadInvoiceUrl || undefined,
                        date: invoice.date || undefined,
                        valueWithGst: invoice.valueWithGst || undefined,
                        valueWithoutGst: invoice.valueWithoutGst || undefined,
                        _id: invoice._id || undefined,
                      })
                    )
                  : [],
                _id: data.shippingDetails._id || undefined,
              }
            : undefined,
          shippingBillDetails: data.shippingBillDetails
            ? {
                review: data.shippingBillDetails.review || undefined,
                portCode: data.shippingBillDetails.portCode || undefined,
                cbName: data.shippingBillDetails.cbName || undefined,
                cbCode: data.shippingBillDetails.cbCode || undefined,
                numberOFShippingBill:
                  data.shippingBillDetails.ShippingBills?.length || 0,
                bills: Array.isArray(data.shippingBillDetails?.ShippingBills)
                  ? data.shippingBillDetails.ShippingBills.map(
                      (bill: BackendShippingBill) => ({
                        uploadShippingBill: bill.shippingBillUrl || undefined,
                        shippingBillNumber:
                          bill.shippingBillNumber || undefined,
                        shippingBillDate: bill.shippingBillDate || undefined,
                        drawbackValue: bill.drawbackValue
                          ? Number(bill.drawbackValue)
                          : undefined,
                        rodtepValue: bill.rodtepValue
                          ? Number(bill.rodtepValue)
                          : undefined,
                        _id: bill._id || undefined,
                      })
                    )
                  : [],
                _id: data.shippingBillDetails._id || undefined,
              }
            : undefined,
          supplierDetails: data.supplierDetails
            ? {
                review: data.supplierDetails.review || undefined,
                clearance: data.supplierDetails.clearance
                  ? {
                      noOfSuppliers:
                        data.supplierDetails.clearance.noOfSuppliers ||
                        data.supplierDetails.clearance.suppliers?.length ||
                        undefined,
                      suppliers: Array.isArray(
                        data.supplierDetails.clearance?.suppliers
                      )
                        ? data.supplierDetails.clearance.suppliers.map(
                            (supplier: any) => ({
                              supplierName: supplier.supplierName
                                ? {
                                    _id: supplier.supplierName._id || undefined,
                                    supplierName:
                                      supplier.supplierName.supplierName ||
                                      undefined,
                                    gstNo:
                                      supplier.supplierName.gstNo || undefined,
                                    address:
                                      supplier.supplierName.address ||
                                      undefined,
                                    responsiblePerson:
                                      supplier.supplierName.responsiblePerson ||
                                      undefined,
                                    mobileNumber:
                                      supplier.supplierName.mobileNumber ||
                                      undefined,
                                    state:
                                      supplier.supplierName.state || undefined,
                                    factoryAddress:
                                      supplier.supplierName.factoryAddress ||
                                      undefined,
                                    organizationId:
                                      supplier.supplierName.organizationId ||
                                      undefined,
                                    createdAt:
                                      supplier.supplierName.createdAt ||
                                      undefined,
                                    updatedAt:
                                      supplier.supplierName.updatedAt ||
                                      undefined,
                                    __v: supplier.supplierName.__v || undefined,
                                  }
                                : undefined,
                              noOfInvoices:
                                supplier.noOfInvoices ||
                                supplier.invoices?.length ||
                                undefined,
                              invoices: Array.isArray(supplier.invoices)
                                ? supplier.invoices.map((invoice: any) => ({
                                    supplierInvoiceNumber:
                                      invoice.supplierInvoiceNumber ||
                                      undefined,
                                    supplierInvoiceDate:
                                      invoice.supplierInvoiceDate || undefined,
                                    supplierInvoiceValueWithGST:
                                      invoice.supplierInvoiceValueWithGST
                                        ? Number(
                                            invoice.supplierInvoiceValueWithGST
                                          )
                                        : undefined,
                                    supplierInvoiceValueWithOutGST:
                                      invoice.supplierInvoiceValueWithOutGST
                                        ? Number(
                                            invoice.supplierInvoiceValueWithOutGST
                                          )
                                        : undefined,
                                    clearanceSupplierInvoiceUrl:
                                      invoice.clearanceSupplierInvoiceUrl ||
                                      undefined,
                                    _id: invoice._id || undefined,
                                  }))
                                : [],
                              _id: supplier._id || undefined,
                            })
                          )
                        : [],
                      _id: data.supplierDetails.clearance._id || undefined,
                    }
                  : undefined,
                actual: data.supplierDetails.actual
                  ? {
                      actualSupplierName:
                        data.supplierDetails.actual.actualSupplierName ||
                        undefined,
                      actualSupplierInvoiceUrl:
                        data.supplierDetails.actual.actualSupplierInvoiceUrl ||
                        undefined,
                      actualSupplierInvoiceValue: data.supplierDetails.actual
                        .actualSupplierInvoiceValue
                        ? Number(
                            data.supplierDetails.actual
                              .actualSupplierInvoiceValue
                          )
                        : undefined,
                      shippingBillUrl:
                        data.supplierDetails.actual.shippingBillUrl ||
                        undefined,
                      _id: data.supplierDetails.actual._id || undefined,
                    }
                  : undefined,
                _id: data.supplierDetails._id || undefined,
              }
            : undefined,
          saleInvoiceDetails: {
            review: data.saleInvoiceDetails?.review || undefined,
            consignee:
              typeof data.saleInvoiceDetails?.consignee === "object"
                ? data.saleInvoiceDetails?.consignee?._id
                : data.saleInvoiceDetails?.consignee &&
                  /^[0-9a-fA-F]{24}$/.test(data.saleInvoiceDetails.consignee)
                ? data.saleInvoiceDetails.consignee
                : undefined,
            actualBuyer: data.saleInvoiceDetails?.actualBuyer || undefined,
            numberOfSalesInvoices:
              data.saleInvoiceDetails?.numberOfSalesInvoices ||
              data.saleInvoiceDetails?.commercialInvoices?.length ||
              0,
            invoice: Array.isArray(data.saleInvoiceDetails?.commercialInvoices)
              ? data.saleInvoiceDetails.commercialInvoices.map((inv: any) => ({
                  commercialInvoiceNumber: inv.commercialInvoiceNumber || "",
                  clearanceCommercialInvoice:
                    inv.clearanceCommercialInvoiceUrl || "",
                  actualCommercialInvoice: inv.actualCommercialInvoiceUrl || "",
                  saberInvoice: inv.saberInvoiceUrl || "",
                  addProductDetails: inv.addProductDetails || [],
                  _id: inv._id || undefined,
                }))
              : [],
            _id: data.saleInvoiceDetails?._id || undefined,
          },
          blDetails: data.blDetails
            ? {
                review: data.blDetails.review || undefined,
                shippingLineName:
                  data.blDetails.shippingLineName &&
                  /^[0-9a-fA-F]{24}$/.test(data.blDetails.shippingLineName)
                    ? data.blDetails.shippingLineName
                    : undefined,
                noOfBl:
                  data.blDetails.noOfBl ||
                  data.blDetails.Bl?.length ||
                  undefined,
                Bl: Array.isArray(data.blDetails?.Bl)
                  ? data.blDetails.Bl.map((bl: any) => ({
                      blNumber: bl.blNumber || undefined,
                      blDate: bl.blDate || undefined,
                      telexDate: bl.telexDate || undefined,
                      uploadBLUrl: bl.uploadBLUrl || undefined,
                      _id: bl._id || undefined,
                    }))
                  : [],
                _id: data.blDetails._id || undefined,
              }
            : undefined,
          otherDetails: Array.isArray(data.otherDetails)
            ? data.otherDetails.map((item: any) => ({
                review: item.review || undefined,
                certificateName: item.certificateName || undefined,
                certificateNumber: item.certificateNumber || undefined,
                date: item.date || undefined,
                issuerOfCertificate: item.issuerOfCertificate || undefined,
                uploadCopyOfCertificate:
                  item.uploadCopyOfCertificate || undefined,
                _id: item._id || undefined,
              }))
            : [],
        };

        console.log(
          "Mapped form values:",
          JSON.stringify(updatedValues, null, 2)
        );
        form.reset(updatedValues);
        isInitialLoad.current = false;
      } catch (error) {
        console.error("Error fetching shipment data:", error);
        toast.error("Failed to load shipment data");
        isInitialLoad.current = false;
      } finally {
        setIsFetching(false);
      }
    }

    fetchShipmentData();
  }, [params.id, form, urlOrgId]);

  if (isFetching || !organizationId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading shipment data...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 h-full flex p-6 flex-col">
      <div className="topbar w-full flex items-center">
        <Link href="../">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading
            className="leading-tight"
            title={`Edit Shipment: ${
              form.watch("bookingDetails.invoiceNumber") || "N/A"
            }`}
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
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          onClick={() => setCurrentStep(currentStep > 0 ? currentStep - 1 : 0)}
          disabled={currentStep === 0 || isLoading}
          className={`${currentStep === 0 ? "invisible" : ""} h-8`}
        >
          Previous
        </Button>
        <Button
          className="h-8"
          type="button"
          onClick={
            currentStep < steps.length - 1 ? handleSectionSubmit : submitDraft
          }
          disabled={isLoading || isProductDetailsOpen}
        >
          {currentStep < steps.length - 1
            ? "Update and Next"
            : "Update and Submit"}
          {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
        </Button>
      </div>

      <FormProvider {...form}>
        <form className="flex flex-col gap-3 w-full p-3">
          <div className="flex justify-between">
            <Heading className="text-xl" title={steps[currentStep].name} />
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {steps[currentStep].component}
        </form>
      </FormProvider>
    </div>
  );
}
