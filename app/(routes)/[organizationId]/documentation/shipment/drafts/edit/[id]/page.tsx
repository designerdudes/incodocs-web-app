"use client";   
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { ProgressBar } from "../../../edit/[id]/components/ProgressBar";
import { BookingDetails } from "../../../edit/[id]/components/BookingDetails";
import { ShippingDetails } from "../../../edit/[id]/components/ShippingDetails";
import { ShippingBillDetails } from "../../../edit/[id]/components/ShippingBillDetails";
import { SupplierDetails } from "../../../edit/[id]/components/SupplierDetails";
import { SaleInvoiceDetails } from "../../../edit/[id]/components/SaleInvoiceDetails";
import { BillOfLadingDetails } from "../../../edit/[id]/components/BillOfLadingDetails";
import { OtherDetails } from "../../../edit/[id]/components/OtherDetails";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { fetchData, putData, postData } from "@/axiosUtility/api";
import { useRouter, useParams } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { debounce } from "lodash";
import Cookies from "js-cookie";
import React from "react";

interface DraftApiResponse {
  shipmentDraft: {
    _id?: string;
    draftId?: string;
    organizationId?: { _id: string } | string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    status?: string;
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
      transporterName?: { _id: string; name: string } | string;
      noOftransportinvoices?: number;
      transporterInvoices?: any[];
      forwarderName?: { _id: string; name: string } | string;
      noOfForwarderinvoices?: number;
      forwarderInvoices?: any[];
      _id?: string;
    };
    shippingBillDetails?: {
      review?: string;
      portCode?: string;
      cbName?: { _id: string; name: string } | string;
      cbCode?: string;
      numberOFShippingBill?: number;
      shippingBills?: any[];
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
      shippingLineName?: { _id: string; name: string } | string;
      noOfBl?: number;
      Bl?: {
        blNumber?: string;
        blDate?: string;
        telexDate?: string;
        uploadBLUrl?: string;
        _id?: string;
      }[];
      _id?: string;
    };
    otherDetails?: any[];
  };
  draftLogs: any[];
}

type BackendShippingBill = {
  shippingBillUrl?: string;
  shippingBillNumber?: string;
  shippingBillDate?: string;
  drawbackValue?: string;
  rodtepValue?: string;
  ConversionRateInDollars?: string;
  _id?: string;
};

const formSchema = z.object({
  draftId: z.string().optional(),
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
              .array(z.string().min(1, "Invalid product ID"))
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
            ConversionRateInDollars: z.number().optional(),
            _id: z.string().optional(),
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

export type FormValues = z.infer<typeof formSchema>;

const defaultFormValues: FormValues = {
  draftId: undefined,
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

const saveProgressSilently = (data: any, draftId: string) => {
  localStorage.setItem(`draft_${draftId}`, JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
};

const saveProgressWithFeedback = (data: any, draftId: string) => {
  saveProgressSilently(data, draftId);
  toast.success("Draft saved successfully!");
};

interface Props {
  params: {
    id: string;
  };
}

export default function EditDraftPage({ params }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | undefined>(
    undefined
  );
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();
  const urlOrgId = useParams().organizationId as string | undefined;
  const isInitialLoad = useRef(true);
  const [currentUser, setCurrentUser] = useState<string>("");
  const hasShownToast = useRef(false);

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const GetCurrentUser = await fetchData(`/user/currentUser`);
        const currentUserId = GetCurrentUser._id;
        setCurrentUser(currentUserId);
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const loadDraft = (draftId: string): FormValues => {
    const draft = localStorage.getItem(`draft_${draftId}`);
    return draft
      ? { ...defaultFormValues, ...JSON.parse(draft) }
      : defaultFormValues;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadDraft(params.id),
  });

  const watchedValues = form.watch();
  const debouncedSave = useRef(
    debounce((data: FormValues) => {
      if (!isInitialLoad.current) {
        saveProgressSilently(data, params.id);
      }
    }, 500)
  ).current;

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
          orgId={organizationId}
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
          orgId={organizationId}
          saveProgress={(data) => saveProgressSilently(data, params.id)}
          onSectionSubmit={handleSectionSubmit}
          currentUser={currentUser}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
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

  const saveDraft = async () => {
    setIsLoading(true);
    try {
      const values = form.getValues();
      console.log("Saving draft for ID:", params.id, "Form Values:", JSON.stringify(values, null, 2));

      // Validate critical fields
      if (!params.id || !/^[0-9a-fA-F]{24}$/.test(params.id)) {
        throw new Error("Invalid draft ID");
      }
      if (!organizationId || !/^[0-9a-fA-F]{24}$/.test(organizationId)) {
        throw new Error("Invalid organization ID");
      }

      const hasInvalidProducts = values.bookingDetails?.containers?.some(
        (container) =>
          container.addProductDetails?.some(
            (productId) => !productId || typeof productId !== "string"
          )
      );

      if (hasInvalidProducts) {
        toast.error(
          "One or more product details are invalid. Please provide at least one detail for each product."
        );
        setIsLoading(false);
        return;
      }

      // Helper function to clean payload (remove undefined fields)
      const cleanObject = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(cleanObject).filter((item: any) => item !== undefined && item !== null);
        }
        if (typeof obj !== "object" || obj === null) {
          return obj;
        }
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined && value !== null) {
            if (typeof value === "object" && !Array.isArray(value)) {
              const nested = cleanObject(value);
              if (Object.keys(nested).length > 0) {
                cleaned[key] = nested;
              }
            } else if (Array.isArray(value)) {
              const cleanedArray = cleanObject(value);
              if (cleanedArray.length > 0) {
                cleaned[key] = cleanedArray;
              }
            } else {
              cleaned[key] = value;
            }
          }
        }
        return cleaned;
      };

      const payload = cleanObject({
        draftId: params.id,
        organizationId: organizationId,
        createdAt: values.createdAt,
        updatedAt: new Date().toISOString(),
        createdBy: values.createdBy,
        bookingDetails: values.bookingDetails
          ? {
              review: values.bookingDetails.review,
              invoiceNumber: values.bookingDetails.invoiceNumber,
              bookingNumber: values.bookingDetails.bookingNumber,
              portOfLoading: values.bookingDetails.portOfLoading,
              destinationPort: values.bookingDetails.destinationPort,
              vesselSailingDate: values.bookingDetails.vesselSailingDate,
              vesselArrivingDate: values.bookingDetails.vesselArrivingDate,
              numberOfContainer:
                values.bookingDetails.numberOfContainer ||
                values.bookingDetails.containers?.length,
              containers: values.bookingDetails.containers?.map((container) => ({
                containerType: container.containerType,
                containerNumber: container.containerNumber,
                truckNumber: container.truckNumber,
                truckDriverContactNumber: container.truckDriverContactNumber,
                addProductDetails: container.addProductDetails?.filter(
                  (productId) => productId && typeof productId === "string"
                ),
                _id: container._id,
              })),
              _id: values.bookingDetails._id,
            }
          : undefined,
        shippingDetails: values.shippingDetails
          ? {
              review: values.shippingDetails.review,
              transporterName:
                values.shippingDetails.transporterName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.transporterName)
                  ? values.shippingDetails.transporterName
                  : undefined,
              noOftransportinvoices:
                values.shippingDetails.noOftransportinvoices ||
                values.shippingDetails.transporterInvoices?.length,
              transporterInvoices: values.shippingDetails.transporterInvoices?.map((invoice) => ({
                invoiceNumber: invoice.invoiceNumber,
                uploadInvoiceUrl: invoice.uploadInvoiceUrl,
                date: invoice.date,
                valueWithGst: invoice.valueWithGst,
                valueWithoutGst: invoice.valueWithoutGst,
                _id: invoice._id,
              })),
              forwarderName:
                values.shippingDetails.forwarderName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.forwarderName)
                  ? values.shippingDetails.forwarderName
                  : undefined,
              noOfForwarderinvoices:
                values.shippingDetails.noOfForwarderinvoices ||
                values.shippingDetails.forwarderInvoices?.length,
              forwarderInvoices: values.shippingDetails.forwarderInvoices?.map((invoice) => ({
                invoiceNumber: invoice.invoiceNumber,
                uploadInvoiceUrl: invoice.uploadInvoiceUrl,
                date: invoice.date,
                valueWithGst: invoice.valueWithGst,
                valueWithoutGst: invoice.valueWithoutGst,
                _id: invoice._id,
              })),
              _id: values.shippingDetails._id,
            }
          : undefined,
        shippingBillDetails: values.shippingBillDetails
          ? {
              review: values.shippingBillDetails.review,
              portCode: values.shippingBillDetails.portCode,
              cbName:
                values.shippingBillDetails.cbName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingBillDetails.cbName)
                  ? values.shippingBillDetails.cbName
                  : undefined,
              cbCode: values.shippingBillDetails.cbCode,
              numberOFShippingBill:
                values.shippingBillDetails.numberOFShippingBill ||
                values.shippingBillDetails.bills?.length,
              shippingBills: values.shippingBillDetails.bills?.map((bill) => ({
                shippingBillUrl: bill.uploadShippingBill,
                shippingBillNumber: bill.shippingBillNumber,
                shippingBillDate: bill.shippingBillDate,
                drawbackValue: bill.drawbackValue,
                rodtepValue: bill.rodtepValue,
                ConversionRateInDollars: bill.ConversionRateInDollars,
                _id: bill._id,
              })),
              _id: values.shippingBillDetails._id,
            }
          : undefined,
        supplierDetails: values.supplierDetails
          ? {
              review: values.supplierDetails.review,
              clearance: values.supplierDetails.clearance
                ? {
                    noOfSuppliers:
                      values.supplierDetails.clearance.noOfSuppliers ||
                      values.supplierDetails.clearance.suppliers?.length,
                    suppliers: values.supplierDetails.clearance.suppliers?.map(
                      (supplier) => ({
                        supplierName: supplier.supplierName
                          ? {
                              _id: supplier.supplierName._id,
                              supplierName: supplier.supplierName.supplierName,
                            }
                          : undefined,
                        noOfInvoices:
                          supplier.noOfInvoices || supplier.invoices?.length,
                        invoices: supplier.invoices?.map((invoice) => ({
                          supplierInvoiceNumber: invoice.supplierInvoiceNumber,
                          supplierInvoiceDate: invoice.supplierInvoiceDate,
                          supplierInvoiceValueWithGST: invoice.supplierInvoiceValueWithGST,
                          supplierInvoiceValueWithOutGST: invoice.supplierInvoiceValueWithOutGST,
                          clearanceSupplierInvoiceUrl: invoice.clearanceSupplierInvoiceUrl,
                          _id: invoice._id,
                        })),
                        _id: supplier._id,
                      })
                    ),
                    _id: values.supplierDetails.clearance._id,
                  }
                : undefined,
              actual: values.supplierDetails.actual
                ? {
                    actualSupplierName: values.supplierDetails.actual.actualSupplierName,
                    actualSupplierInvoiceUrl: values.supplierDetails.actual.actualSupplierInvoiceUrl,
                    actualSupplierInvoiceValue: values.supplierDetails.actual.actualSupplierInvoiceValue,
                    shippingBillUrl: values.supplierDetails.actual.shippingBillUrl,
                    _id: values.supplierDetails.actual._id,
                  }
                : undefined,
              _id: values.supplierDetails._id,
            }
          : undefined,
        saleInvoiceDetails: values.saleInvoiceDetails
          ? {
              review: values.saleInvoiceDetails.review,
              consignee:
                values.saleInvoiceDetails.consignee &&
                /^[0-9a-fA-F]{24}$/.test(values.saleInvoiceDetails.consignee)
                  ? values.saleInvoiceDetails.consignee
                  : undefined,
              actualBuyer: values.saleInvoiceDetails.actualBuyer,
              numberOfSalesInvoices:
                values.saleInvoiceDetails.numberOfSalesInvoices ||
                values.saleInvoiceDetails.invoice?.length,
              commercialInvoices: values.saleInvoiceDetails.invoice?.map((inv) => ({
                commercialInvoiceNumber: inv.commercialInvoiceNumber,
                clearanceCommercialInvoiceUrl: inv.clearanceCommercialInvoice,
                actualCommercialInvoiceUrl: inv.actualCommercialInvoice,
                saberInvoiceUrl: inv.saberInvoice,
                addProductDetails: inv.addProductDetails,
                _id: inv._id,
              })),
              _id: values.saleInvoiceDetails._id,
            }
          : undefined,
        blDetails: values.blDetails
          ? {
              review: values.blDetails.review,
              shippingLineName:
                values.blDetails.shippingLineName &&
                /^[0-9a-fA-F]{24}$/.test(values.blDetails.shippingLineName)
                  ? values.blDetails.shippingLineName
                  : undefined,
              noOfBl: values.blDetails.noOfBl || values.blDetails.Bl?.length,
              Bl: values.blDetails.Bl?.map((bl) => ({
                blNumber: bl.blNumber,
                blDate: bl.blDate,
                telexDate: bl.telexDate,
                uploadBLUrl: bl.uploadBLUrl,
                _id: bl._id,
              })),
              _id: values.blDetails._id,
            }
          : undefined,
        otherDetails: values.otherDetails?.map((item) => ({
          review: item.review,
          certificateName: item.certificateName,
          certificateNumber: item.certificateNumber,
          date: item.date,
          issuerOfCertificate: item.issuerOfCertificate,
          uploadCopyOfCertificate: item.uploadCopyOfCertificate,
          _id: item._id,
        })),
      });

      console.log("Cleaned Payload for /shipmentdrafts/update:", JSON.stringify(payload, null, 2));
      await putData(`/shipmentdrafts/update/${params.id}`, payload);
      toast.success("Draft updated successfully!");
      saveProgressSilently(values, params.id);
    } catch (error: any) {
      console.error("Error updating draft:", error);
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update draft due to a server error";
      toast.error(`Error updating draft: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const submitDraft = async () => {
    setIsLoading(true);
    try {
      const values = form.getValues();
      console.log("Submitting draft for ID:", params.id, "Form Values:", JSON.stringify(values, null, 2));

      // Validate critical fields
      if (!params.id || !/^[0-9a-fA-F]{24}$/.test(params.id)) {
        throw new Error("Invalid draft ID");
      }
      if (!organizationId || !/^[0-9a-fA-F]{24}$/.test(organizationId)) {
        throw new Error("Invalid organization ID");
      }

      const hasInvalidProducts = values.bookingDetails?.containers?.some(
        (container) =>
          container.addProductDetails?.some(
            (productId) => !productId || typeof productId !== "string"
          )
      );

      if (hasInvalidProducts) {
        toast.error(
          "One or more product details are invalid. Please provide at least one detail for each product."
        );
        setIsLoading(false);
        return;
      }

      // Helper function to clean payload (remove undefined fields)
      const cleanObject = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(cleanObject).filter((item: any) => item !== undefined && item !== null);
        }
        if (typeof obj !== "object" || obj === null) {
          return obj;
        }
        const cleaned: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined && value !== null) {
            if (typeof value === "object" && !Array.isArray(value)) {
              const nested = cleanObject(value);
              if (Object.keys(nested).length > 0) {
                cleaned[key] = nested;
              }
            } else if (Array.isArray(value)) {
              const cleanedArray = cleanObject(value);
              if (cleanedArray.length > 0) {
                cleaned[key] = cleanedArray;
              }
            } else {
              cleaned[key] = value;
            }
          }
        }
        return cleaned;
      };

      const payload = cleanObject({
        shipmentId: params.id,
        organizationId: organizationId,
        createdAt: values.createdAt,
        updatedAt: new Date().toISOString(),
        createdBy: values.createdBy,
        bookingDetails: values.bookingDetails
          ? {
              review: values.bookingDetails.review,
              invoiceNumber: values.bookingDetails.invoiceNumber,
              bookingNumber: values.bookingDetails.bookingNumber,
              portOfLoading: values.bookingDetails.portOfLoading,
              destinationPort: values.bookingDetails.destinationPort,
              vesselSailingDate: values.bookingDetails.vesselSailingDate,
              vesselArrivingDate: values.bookingDetails.vesselArrivingDate,
              numberOfContainer:
                values.bookingDetails.numberOfContainer ||
                values.bookingDetails.containers?.length,
              containers: values.bookingDetails.containers?.map((container) => ({
                containerType: container.containerType,
                containerNumber: container.containerNumber,
                truckNumber: container.truckNumber,
                truckDriverContactNumber: container.truckDriverContactNumber,
                addProductDetails: container.addProductDetails?.filter(
                  (productId) => productId && typeof productId === "string"
                ),
                _id: container._id,
              })),
              _id: values.bookingDetails._id,
            }
          : undefined,
        shippingDetails: values.shippingDetails
          ? {
              review: values.shippingDetails.review,
              transporterName:
                values.shippingDetails.transporterName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.transporterName)
                  ? values.shippingDetails.transporterName
                  : undefined,
              noOftransportinvoices:
                values.shippingDetails.noOftransportinvoices ||
                values.shippingDetails.transporterInvoices?.length,
              transporterInvoices: values.shippingDetails.transporterInvoices?.map((invoice) => ({
                invoiceNumber: invoice.invoiceNumber,
                uploadInvoiceUrl: invoice.uploadInvoiceUrl,
                date: invoice.date,
                valueWithGst: invoice.valueWithGst,
                valueWithoutGst: invoice.valueWithoutGst,
                _id: invoice._id,
              })),
              forwarderName:
                values.shippingDetails.forwarderName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.forwarderName)
                  ? values.shippingDetails.forwarderName
                  : undefined,
              noOfForwarderinvoices:
                values.shippingDetails.noOfForwarderinvoices ||
                values.shippingDetails.forwarderInvoices?.length,
              forwarderInvoices: values.shippingDetails.forwarderInvoices?.map((invoice) => ({
                invoiceNumber: invoice.invoiceNumber,
                uploadInvoiceUrl: invoice.uploadInvoiceUrl,
                date: invoice.date,
                valueWithGst: invoice.valueWithGst,
                valueWithoutGst: invoice.valueWithoutGst,
                _id: invoice._id,
              })),
              _id: values.shippingDetails._id,
            }
          : undefined,
        shippingBillDetails: values.shippingBillDetails
          ? {
              review: values.shippingBillDetails.review,
              portCode: values.shippingBillDetails.portCode,
              cbName:
                values.shippingBillDetails.cbName &&
                /^[0-9a-fA-F]{24}$/.test(values.shippingBillDetails.cbName)
                  ? values.shippingBillDetails.cbName
                  : undefined,
              cbCode: values.shippingBillDetails.cbCode,
              numberOFShippingBill:
                values.shippingBillDetails.numberOFShippingBill ||
                values.shippingBillDetails.bills?.length,
              shippingBills: values.shippingBillDetails.bills?.map((bill) => ({
                shippingBillUrl: bill.uploadShippingBill,
                shippingBillNumber: bill.shippingBillNumber,
                shippingBillDate: bill.shippingBillDate,
                drawbackValue: bill.drawbackValue,
                rodtepValue: bill.rodtepValue,
                ConversionRateInDollars: bill.ConversionRateInDollars,
                _id: bill._id,
              })),
              _id: values.shippingBillDetails._id,
            }
          : undefined,
        supplierDetails: values.supplierDetails
          ? {
              review: values.supplierDetails.review,
              clearance: values.supplierDetails.clearance
                ? {
                    noOfSuppliers:
                      values.supplierDetails.clearance.noOfSuppliers ||
                      values.supplierDetails.clearance.suppliers?.length,
                    suppliers: values.supplierDetails.clearance.suppliers?.map(
                      (supplier) => ({
                        supplierName: supplier.supplierName
                          ? {
                              _id: supplier.supplierName._id,
                              supplierName: supplier.supplierName.supplierName,
                            }
                          : undefined,
                        noOfInvoices:
                          supplier.noOfInvoices || supplier.invoices?.length,
                        invoices: supplier.invoices?.map((invoice) => ({
                          supplierInvoiceNumber: invoice.supplierInvoiceNumber,
                          supplierInvoiceDate: invoice.supplierInvoiceDate,
                          supplierInvoiceValueWithGST: invoice.supplierInvoiceValueWithGST,
                          supplierInvoiceValueWithOutGST: invoice.supplierInvoiceValueWithOutGST,
                          clearanceSupplierInvoiceUrl: invoice.clearanceSupplierInvoiceUrl,
                          _id: invoice._id,
                        })),
                        _id: supplier._id,
                      })
                    ),
                    _id: values.supplierDetails.clearance._id,
                  }
                : undefined,
              actual: values.supplierDetails.actual
                ? {
                    actualSupplierName: values.supplierDetails.actual.actualSupplierName,
                    actualSupplierInvoiceUrl: values.supplierDetails.actual.actualSupplierInvoiceUrl,
                    actualSupplierInvoiceValue: values.supplierDetails.actual.actualSupplierInvoiceValue,
                    shippingBillUrl: values.supplierDetails.actual.shippingBillUrl,
                    _id: values.supplierDetails.actual._id,
                  }
                : undefined,
              _id: values.supplierDetails._id,
            }
          : undefined,
        saleInvoiceDetails: values.saleInvoiceDetails
          ? {
              review: values.saleInvoiceDetails.review,
              consignee:
                values.saleInvoiceDetails.consignee &&
                /^[0-9a-fA-F]{24}$/.test(values.saleInvoiceDetails.consignee)
                  ? values.saleInvoiceDetails.consignee
                  : undefined,
              actualBuyer: values.saleInvoiceDetails.actualBuyer,
              numberOfSalesInvoices:
                values.saleInvoiceDetails.numberOfSalesInvoices ||
                values.saleInvoiceDetails.invoice?.length,
              commercialInvoices: values.saleInvoiceDetails.invoice?.map((inv) => ({
                commercialInvoiceNumber: inv.commercialInvoiceNumber,
                clearanceCommercialInvoiceUrl: inv.clearanceCommercialInvoice,
                actualCommercialInvoiceUrl: inv.actualCommercialInvoice,
                saberInvoiceUrl: inv.saberInvoice,
                addProductDetails: inv.addProductDetails,
                _id: inv._id,
              })),
              _id: values.saleInvoiceDetails._id,
            }
          : undefined,
        blDetails: values.blDetails
          ? {
              review: values.blDetails.review,
              shippingLineName:
                values.blDetails.shippingLineName &&
                /^[0-9a-fA-F]{24}$/.test(values.blDetails.shippingLineName)
                  ? values.blDetails.shippingLineName
                  : undefined,
              noOfBl: values.blDetails.noOfBl || values.blDetails.Bl?.length,
              Bl: values.blDetails.Bl?.map((bl) => ({
                blNumber: bl.blNumber,
                blDate: bl.blDate,
                telexDate: bl.telexDate,
                uploadBLUrl: bl.uploadBLUrl,
                _id: bl._id,
              })),
              _id: values.blDetails._id,
            }
          : undefined,
        otherDetails: values.otherDetails?.map((item) => ({
          review: item.review,
          certificateName: item.certificateName,
          certificateNumber: item.certificateNumber,
          date: item.date,
          issuerOfCertificate: item.issuerOfCertificate,
          uploadCopyOfCertificate: item.uploadCopyOfCertificate,
          _id: item._id,
        })),
      });

      console.log("Cleaned Payload for /shipment/add:", JSON.stringify(payload, null, 2));
      await postData(`/shipment/add`, payload);
      toast.success("Shipment created successfully!");
      localStorage.removeItem(`draft_${params.id}`);
      router.push("../");
    } catch (error: any) {
      console.error("Error creating shipment:", error);
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create shipment due to a server error";
      toast.error(`Error creating shipment: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchDraftData() {
      try {
        setIsFetching(true);
        console.log("Fetching draft data for ID:", params.id);

        const token = Cookies.get("AccessToken");
        console.log(
          "AccessToken:",
          token ? `${token.slice(0, 10)}...` : "No token found"
        );

        if (!token) {
          console.warn("No AccessToken found in cookies");
          toast.error("Please log in to view draft data");
          router.push("/login");
          return;
        }

        const isValidJwt = token.split(".").length === 3;
        console.log("Token format valid (JWT):", isValidJwt);
        if (!isValidJwt) {
          console.warn("Invalid token format:", token);
          toast.error("Invalid authentication token. Please log in again.");
          Cookies.remove("AccessToken");
          router.push("/login");
          return;
        }

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("Token payload:", {
            role: payload.role,
            userId: payload.userId,
          });
        } catch (e) {
          console.warn("Failed to decode token payload:", e);
        }

        // Use fetchData for the API call
        const response = await fetchData(`/shipmentdrafts/getbyid/${params.id}`);
        console.log("API Response from fetchData:", JSON.stringify(response, null, 2));

        // Check if response contains shipmentDraft data
        if (!response.shipmentDraft) {
          console.warn("No shipmentDraft data in response:", response);
          throw new Error("Shipment draft data not found in response");
        }

        const fetchedOrgId =
          typeof response.shipmentDraft.organizationId === "object"
            ? response.shipmentDraft.organizationId?._id
            : response.shipmentDraft.organizationId || undefined;
        setOrganizationId(fetchedOrgId || urlOrgId || undefined);
        console.log("Set organizationId:", fetchedOrgId || urlOrgId);

        // Map response to form values
        const updatedValues: FormValues = {
          draftId: response.shipmentDraft._id || undefined,
          organizationId: fetchedOrgId || urlOrgId || undefined,
          createdAt: response.shipmentDraft.createdAt || undefined,
          updatedAt: response.shipmentDraft.updatedAt || undefined,
          createdBy: response.shipmentDraft.createdBy || undefined,
          bookingDetails: response.shipmentDraft.bookingDetails
            ? {
                review: response.shipmentDraft.bookingDetails.review || undefined,
                invoiceNumber: response.shipmentDraft.bookingDetails.invoiceNumber || undefined,
                bookingNumber: response.shipmentDraft.bookingDetails.bookingNumber || undefined,
                portOfLoading: response.shipmentDraft.bookingDetails.portOfLoading || undefined,
                destinationPort: response.shipmentDraft.bookingDetails.destinationPort || undefined,
                vesselSailingDate: response.shipmentDraft.bookingDetails.vesselSailingDate || undefined,
                vesselArrivingDate: response.shipmentDraft.bookingDetails.vesselArrivingDate || undefined,
                numberOfContainer:
                  response.shipmentDraft.bookingDetails.numberOfContainer ||
                  response.shipmentDraft.bookingDetails.containers?.length ||
                  undefined,
                containers: Array.isArray(response.shipmentDraft.bookingDetails?.containers)
                  ? response.shipmentDraft.bookingDetails.containers.map((container: any) => ({
                      containerType: container.containerType || undefined,
                      containerNumber: container.containerNumber || undefined,
                      truckNumber: container.truckNumber || undefined,
                      truckDriverContactNumber: container.truckDriverContactNumber || undefined,
                      addProductDetails: Array.isArray(container.addProductDetails)
                        ? container.addProductDetails
                            .map((product: any) => product._id || product.productId)
                            .filter((id: any) => typeof id === "string" && id.length > 0)
                        : [],
                      _id: container._id || undefined,
                    }))
                  : [],
                _id: response.shipmentDraft.bookingDetails._id || undefined,
              }
            : undefined,
          shippingDetails: response.shipmentDraft.shippingDetails
            ? {
                review: response.shipmentDraft.shippingDetails.review || undefined,
                transporterName:
                  typeof response.shipmentDraft.shippingDetails.transporterName === "object"
                    ? response.shipmentDraft.shippingDetails.transporterName?._id
                    : response.shipmentDraft.shippingDetails.transporterName &&
                      /^[0-9a-fA-F]{24}$/.test(response.shipmentDraft.shippingDetails.transporterName)
                    ? response.shipmentDraft.shippingDetails.transporterName
                    : undefined,
                noOftransportinvoices:
                  response.shipmentDraft.shippingDetails.noOftransportinvoices ||
                  response.shipmentDraft.shippingDetails.transporterInvoices?.length ||
                  undefined,
                transporterInvoices: Array.isArray(response.shipmentDraft.shippingDetails?.transporterInvoices)
                  ? response.shipmentDraft.shippingDetails.transporterInvoices.map((invoice: any) => ({
                      invoiceNumber: invoice.invoiceNumber || undefined,
                      uploadInvoiceUrl: invoice.uploadInvoiceUrl || undefined,
                      date: invoice.date || undefined,
                      valueWithGst: invoice.valueWithGst || undefined,
                      valueWithoutGst: invoice.valueWithoutGst || undefined,
                      _id: invoice._id || undefined,
                    }))
                  : [],
                forwarderName:
                  typeof response.shipmentDraft.shippingDetails.forwarderName === "object"
                    ? response.shipmentDraft.shippingDetails.forwarderName?._id
                    : response.shipmentDraft.shippingDetails.forwarderName &&
                      /^[0-9a-fA-F]{24}$/.test(response.shipmentDraft.shippingDetails.forwarderName)
                    ? response.shipmentDraft.shippingDetails.forwarderName
                    : undefined,
                noOfForwarderinvoices:
                  response.shipmentDraft.shippingDetails.noOfForwarderinvoices ||
                  response.shipmentDraft.shippingDetails.forwarderInvoices?.length ||
                  undefined,
                forwarderInvoices: Array.isArray(response.shipmentDraft.shippingDetails?.forwarderInvoices)
                  ? response.shipmentDraft.shippingDetails.forwarderInvoices.map((invoice: any) => ({
                      invoiceNumber: invoice.invoiceNumber || undefined,
                      uploadInvoiceUrl: invoice.uploadInvoiceUrl || undefined,
                      date: invoice.date || undefined,
                      valueWithGst: invoice.valueWithGst || undefined,
                      valueWithoutGst: invoice.valueWithoutGst || undefined,
                      _id: invoice._id || undefined,
                    }))
                  : [],
                _id: response.shipmentDraft.shippingDetails._id || undefined,
              }
            : undefined,
          shippingBillDetails: response.shipmentDraft.shippingBillDetails
            ? {
                review: response.shipmentDraft.shippingBillDetails.review || undefined,
                portCode: response.shipmentDraft.shippingBillDetails.portCode || undefined,
                cbName:
                  typeof response.shipmentDraft.shippingBillDetails.cbName === "object"
                    ? response.shipmentDraft.shippingBillDetails.cbName?._id
                    : response.shipmentDraft.shippingBillDetails.cbName &&
                      /^[0-9a-fA-F]{24}$/.test(response.shipmentDraft.shippingBillDetails.cbName)
                    ? response.shipmentDraft.shippingBillDetails.cbName
                    : undefined,
                cbCode: response.shipmentDraft.shippingBillDetails.cbCode || undefined,
                numberOFShippingBill:
                  response.shipmentDraft.shippingBillDetails.shippingBills?.length || 0,
                bills: Array.isArray(response.shipmentDraft.shippingBillDetails?.shippingBills)
                  ? response.shipmentDraft.shippingBillDetails.shippingBills.map((bill: BackendShippingBill) => ({
                      uploadShippingBill: bill.shippingBillUrl || undefined,
                      shippingBillNumber: bill.shippingBillNumber || undefined,
                      shippingBillDate: bill.shippingBillDate || undefined,
                      drawbackValue: bill.drawbackValue ? Number(bill.drawbackValue) : undefined,
                      rodtepValue: bill.rodtepValue ? Number(bill.rodtepValue) : undefined,
                      ConversionRateInDollars: bill.ConversionRateInDollars
                        ? Number(bill.ConversionRateInDollars)
                        : undefined,
                      _id: bill._id || undefined,
                    }))
                  : [],
                _id: response.shipmentDraft.shippingBillDetails._id || undefined,
              }
            : undefined,
          supplierDetails: response.shipmentDraft.supplierDetails
            ? {
                review: response.shipmentDraft.supplierDetails.review || undefined,
                clearance: response.shipmentDraft.supplierDetails.clearance
                  ? {
                      noOfSuppliers:
                        response.shipmentDraft.supplierDetails.clearance.noOfSuppliers ||
                        response.shipmentDraft.supplierDetails.clearance.suppliers?.length ||
                        undefined,
                      suppliers: Array.isArray(response.shipmentDraft.supplierDetails.clearance?.suppliers)
                        ? response.shipmentDraft.supplierDetails.clearance.suppliers.map((supplier: any) => ({
                            supplierName: supplier.supplierName
                              ? {
                                  _id: supplier.supplierName._id || undefined,
                                  supplierName: supplier.supplierName.supplierName || undefined,
                                  gstNo: supplier.supplierName.gstNo || undefined,
                                  address: supplier.supplierName.address || undefined,
                                  responsiblePerson: supplier.supplierName.responsiblePerson || undefined,
                                  mobileNumber: supplier.supplierName.mobileNumber || undefined,
                                  state: supplier.supplierName.state || undefined,
                                  factoryAddress: supplier.supplierName.factoryAddress || undefined,
                                  organizationId: supplier.supplierName.organizationId || undefined,
                                  createdAt: supplier.supplierName.createdAt || undefined,
                                  updatedAt: supplier.supplierName.updatedAt || undefined,
                                  __v: supplier.supplierName.__v || undefined,
                                }
                              : undefined,
                            noOfInvoices:
                              supplier.noOfInvoices || supplier.invoices?.length || undefined,
                            invoices: Array.isArray(supplier.invoices)
                              ? supplier.invoices.map((invoice: any) => ({
                                  supplierInvoiceNumber: invoice.supplierInvoiceNumber || undefined,
                                  supplierInvoiceDate: invoice.supplierInvoiceDate || undefined,
                                  supplierInvoiceValueWithGST: invoice.supplierInvoiceValueWithGST
                                    ? Number(invoice.supplierInvoiceValueWithGST)
                                    : undefined,
                                  supplierInvoiceValueWithOutGST: invoice.supplierInvoiceValueWithOutGST
                                    ? Number(invoice.supplierInvoiceValueWithOutGST)
                                    : undefined,
                                  clearanceSupplierInvoiceUrl: invoice.clearanceSupplierInvoiceUrl || undefined,
                                  _id: invoice._id || undefined,
                                }))
                              : [],
                            _id: supplier._id || undefined,
                          }))
                        : [],
                      _id: response.shipmentDraft.supplierDetails.clearance._id || undefined,
                    }
                  : undefined,
                actual: response.shipmentDraft.supplierDetails.actual
                  ? {
                      actualSupplierName: response.shipmentDraft.supplierDetails.actual.actualSupplierName || undefined,
                      actualSupplierInvoiceUrl:
                        response.shipmentDraft.supplierDetails.actual.actualSupplierInvoiceUrl || undefined,
                      actualSupplierInvoiceValue: response.shipmentDraft.supplierDetails.actual.actualSupplierInvoiceValue
                        ? Number(response.shipmentDraft.supplierDetails.actual.actualSupplierInvoiceValue)
                        : undefined,
                      shippingBillUrl: response.shipmentDraft.supplierDetails.actual.shippingBillUrl || undefined,
                      _id: response.shipmentDraft.supplierDetails.actual._id || undefined,
                    }
                  : undefined,
                _id: response.shipmentDraft.supplierDetails._id || undefined,
              }
            : undefined,
          saleInvoiceDetails: response.shipmentDraft.saleInvoiceDetails
            ? {
                review: response.shipmentDraft.saleInvoiceDetails.review || undefined,
                consignee:
                  typeof response.shipmentDraft.saleInvoiceDetails.consignee === "object"
                    ? response.shipmentDraft.saleInvoiceDetails.consignee?._id
                    : response.shipmentDraft.saleInvoiceDetails.consignee &&
                      /^[0-9a-fA-F]{24}$/.test(response.shipmentDraft.saleInvoiceDetails.consignee)
                    ? response.shipmentDraft.saleInvoiceDetails.consignee
                    : undefined,
                actualBuyer: response.shipmentDraft.saleInvoiceDetails.actualBuyer || undefined,
                numberOfSalesInvoices:
                  response.shipmentDraft.saleInvoiceDetails.numberOfSalesInvoices ||
                  response.shipmentDraft.saleInvoiceDetails.commercialInvoices?.length ||
                  undefined,
                invoice: Array.isArray(response.shipmentDraft.saleInvoiceDetails?.commercialInvoices)
                  ? response.shipmentDraft.saleInvoiceDetails.commercialInvoices.map((inv: any) => ({
                      commercialInvoiceNumber: inv.commercialInvoiceNumber || undefined,
                      clearanceCommercialInvoice: inv.clearanceCommercialInvoiceUrl || undefined,
                      actualCommercialInvoice: inv.actualCommercialInvoiceUrl || undefined,
                      saberInvoice: inv.saberInvoiceUrl || undefined,
                      addProductDetails: inv.addProductDetails || [],
                      _id: inv._id || undefined,
                    }))
                  : [],
                _id: response.shipmentDraft.saleInvoiceDetails._id || undefined,
              }
            : undefined,
          blDetails: response.shipmentDraft.blDetails
            ? {
                review: response.shipmentDraft.blDetails.review || undefined,
                shippingLineName:
                  typeof response.shipmentDraft.blDetails.shippingLineName === "object"
                    ? response.shipmentDraft.blDetails.shippingLineName?._id
                    : response.shipmentDraft.blDetails.shippingLineName &&
                      /^[0-9a-fA-F]{24}$/.test(response.shipmentDraft.blDetails.shippingLineName)
                    ? response.shipmentDraft.blDetails.shippingLineName
                    : undefined,
                noOfBl: response.shipmentDraft.blDetails.noOfBl || response.shipmentDraft.blDetails.Bl?.length || undefined,
                Bl: Array.isArray(response.shipmentDraft.blDetails?.Bl)
                  ? response.shipmentDraft.blDetails.Bl.map((bl: any) => ({
                      blNumber: bl.blNumber || undefined,
                      blDate: bl.blDate || undefined,
                      telexDate: bl.telexDate || undefined,
                      uploadBLUrl: bl.uploadBLUrl || undefined,
                      _id: bl._id || undefined,
                    }))
                  : [],
                _id: response.shipmentDraft.blDetails._id || undefined,
              }
            : undefined,
          otherDetails: Array.isArray(response.shipmentDraft.otherDetails)
            ? response.shipmentDraft.otherDetails.map((item: any) => ({
                review: item.review || undefined,
                certificateName: item.certificateName || undefined,
                certificateNumber: item.certificateNumber || undefined,
                date: item.date || undefined,
                issuerOfCertificate: item.issuerOfCertificate || undefined,
                uploadCopyOfCertificate: item.uploadCopyOfCertificate || undefined,
                _id: item._id || undefined,
              }))
            : [],
        };

        console.log("Mapped form values:", JSON.stringify(updatedValues, null, 2));
        form.reset(updatedValues);
        isInitialLoad.current = false;
        if (!hasShownToast.current) {
          toast.success("Draft data loaded successfully!");
          hasShownToast.current = true;
        }
      } catch (error: any) {
        console.error("Error fetching draft data:", {
          message: error.message,
          stack: error.stack,
          response: error.response ? error.response.data : undefined,
        });
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load draft data";
        setFetchError(errorMessage);
        toast.error(errorMessage);
        isInitialLoad.current = false;
      } finally {
        setIsFetching(false);
      }
    }

    fetchDraftData();
  }, [params.id, form, urlOrgId, router]);

  const retryFetch = () => {
    setFetchError(null);
    setIsFetching(true);
    form.reset(form.getValues());
  };

  if (isFetching) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading draft data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
        <p className="text-red-600">{fetchError}</p>
        <Button onClick={retryFetch} className="mt-4">
          Retry
        </Button>
        <a href="/dashboard" className="text-blue-600 underline mt-2">
          Return to Dashboard
        </a>
      </div>
    );
  }

  if (!organizationId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Error: Organization ID not found. Please try again.</p>
        <a href="/dashboard" className="text-blue-600 underline">
          Return to Dashboard
        </a>
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
            title={`Edit Draft: ${form.watch("bookingDetails.invoiceNumber") || "N/A"}`}
          />
          <p className="text-muted-foreground text-sm">
            Complete the form below to edit draft details.
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
        <div className="flex gap-2">
          {currentStep < steps.length - 1 ? (
            <Button
              className="h-8"
              type="button"
              onClick={handleSectionSubmit}
              disabled={isLoading || isProductDetailsOpen}
            >
              Next
              {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
            </Button>
          ) : (
            <>
              <Button
                className="h-8"
                type="button"
                onClick={saveDraft}
                disabled={isLoading || isProductDetailsOpen}
              >
                Update Draft
                {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
              </Button>
              <Button
                className="h-8"
                type="button"
                onClick={submitDraft}
                disabled={isLoading || isProductDetailsOpen}
              >
                Create Shipment
                {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
              </Button>
            </>
          )}
        </div>
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3 w-full p-3"
        >
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