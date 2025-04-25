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
import { postData, putData } from "@/axiosUtility/api";
import { useRouter, useParams } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { debounce } from "lodash";

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

// Zod Schema aligned with the provided payload
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
                  id:z.string().optional(),
                  code: z.string().optional(),
                  HScode: z.string().optional(),
                  dscription: z.string().optional(),
                  unitOfMeasurements: z.string().optional(),
                  countryOfOrigin: z.string().optional(),
                  variantName: z.string().optional(),
                  varianntType: z.string().optional(),
                  sellPrice: z.number().optional(),
                  buyPrice: z.number().optional(),
                  netWeight: z.number().optional(),
                  grossWeight: z.number().optional(),
                  cubicMeasurement: z.number().optional(),
                })
              )
              .default([]),
            _id: z.string().optional(),
          })
        )
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
            date: z.string().datetime({ message: "Invalid date format" }).optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
            _id: z.string().optional(),
          })
        )
        .optional(),
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
            date: z.string().datetime({ message: "Invalid date format" }).optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
            _id: z.string().optional(),
          })
        )
        .optional(),
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
      ShippingBills: z
        .array(
          z.object({
            shippingBillUrl: z.string().url("Invalid URL").optional(),
            shippingBillNumber: z.string().optional(),
            shippingBillDate: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            drawbackValue: z.string().optional(),
            rodtepValue: z.string().optional(),
            _id: z.string().optional(),
          })
        )
        .optional(),
      _id: z.string().optional(),
    })
    .optional(),
  supplierDetails: z
    .object({
      review: z.string().optional(),
      clearance: z
        .object({
          numberOfSuppliers: z.number().optional(),
          suppliers: z
            .array(
              z.object({
                supplierName: z
                  .string()
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
                      supplierInvoiceDate: z
                        .string()
                        .datetime({ message: "Invalid date format" })
                        .optional(),
                      supplierInvoiceValueWithGST: z.number().optional(),
                      supplierInvoiceValueWithOutGST: z.number().optional(),
                      clearanceSupplierInvoiceUrl: z
                        .string()
                        .url("Invalid URL")
                        .optional(),
                      _id: z.string().optional(),
                    })
                  )
                  .optional(),
              })
            )
            .optional(),
          _id: z.string().optional(),
        })
        .optional(),
      actual: z
        .object({
          actualSupplierName: z.string().optional(),
          actualSupplierInvoiceUrl: z.string().url("Invalid URL").optional(),
          actualSupplierInvoiceValue: z.number().optional(),
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
      commercialInvoices: z
        .array(
          z.object({
            commercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoiceUrl: z
              .string()
              .url("Invalid URL")
              .optional(),
            actualCommercialInvoiceUrl: z.string().url("Invalid URL").optional(),
            saberInvoiceUrl: z.string().url("Invalid URL").optional(),
            _id: z.string().optional(),
          })
        )
        .optional(),
      _id: z.string().optional(),
    })
    .optional(),
  blDetails: z
    .object({
      review: z.string().optional(),
      shippingLine: z
        .string()
        .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), {
          message: "shippingLine must be a valid ObjectId or empty",
        })
        .optional(),
      blNumber: z.string().optional(),
      blDate: z.string().datetime({ message: "Invalid date format" }).optional(),
      telexDate: z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
      uploadBL: z.string().url("Invalid URL").optional(),
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
    .optional(),
});

// Infer the type from the schema
export type FormValues = z.infer<typeof formSchema>;

// Default form values
const defaultFormValues: FormValues = {
  shipmentId: "",
  organizationId: "",
  createdAt: undefined,
  updatedAt: undefined,
  createdBy: "",
  bookingDetails: {
    review: "",
    invoiceNumber: "",
    bookingNumber: "",
    portOfLoading: "",
    destinationPort: "",
    vesselSailingDate: undefined,
    vesselArrivingDate: undefined,
    numberOfContainer: 0,
    containers: [],
    _id: "",
  },
  shippingDetails: {
    review: "",
    transporterName: "",
    noOftransportinvoices: 0,
    transporterInvoices: [],
    forwarderName: "",
    noOfForwarderinvoices: 0,
    forwarderInvoices: [],
    _id: "",
  },
  shippingBillDetails: {
    review: "",
    portCode: "",
    cbName: "",
    cbCode: "",
    numberOFShippingBill: 0,
    ShippingBills: [],
    _id: "",
  },
  supplierDetails: {
    review: "",
    clearance: {
      numberOfSuppliers: 0,
      suppliers: [],
      _id: "",
    },
    actual: {
      actualSupplierName: "",
      actualSupplierInvoiceUrl: "",
      actualSupplierInvoiceValue: undefined,
      shippingBillUrl: "",
      _id: "",
    },
    _id: "",
  },
  saleInvoiceDetails: {
    review: "",
    consignee: "",
    actualBuyer: "",
    numberOfSalesInvoices: 0,
    commercialInvoices: [],
    _id: "",
  },
  blDetails: {
    review: "",
    shippingLine: "",
    blNumber: "",
    blDate: undefined,
    telexDate: undefined,
    uploadBL: "",
    _id: "",
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
  const router = useRouter();
  const orgId = useParams().organizationId;
  const organizationId = "680a22e241b238b4f6c1713f";
  const isInitialLoad = useRef(true); // Track initial load

  const loadDraft = (shipmentId: string): FormValues => {
    const draft = localStorage.getItem(`shipmentDraft_${shipmentId}`);
    return draft ? { ...defaultFormValues, ...JSON.parse(draft) } : defaultFormValues;
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
    return () => debouncedSave.cancel(); // Cleanup debounce on unmount
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
      console.log("handleSectionSubmit blocked: isProductDetailsOpen =", isProductDetailsOpen);
      return;
    }
    setIsLoading(true);
    try {
      const values = form.getValues();
      console.log(`Saving draft for ${steps[currentStep].name}:`, values);
      saveProgressWithFeedback(values, params.id); // Show toast
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
      console.log("Submitting shipment update for ID:", params.id, "Values:", values);
      const payload = {
        shipmentId: params.id,
        organizationId,
        createdAt: values.createdAt || undefined,
        updatedAt: values.updatedAt || undefined,
        createdBy: values.createdBy || undefined,
        bookingDetails: {
          review: values.bookingDetails?.review || "",
          invoiceNumber: values.bookingDetails?.invoiceNumber || "",
          bookingNumber: values.bookingDetails?.bookingNumber || "",
          portOfLoading: values.bookingDetails?.portOfLoading || "",
          destinationPort: values.bookingDetails?.destinationPort || "",
          vesselSailingDate: values.bookingDetails?.vesselSailingDate || undefined,
          vesselArrivingDate: values.bookingDetails?.vesselArrivingDate || undefined,
          numberOfContainer: values.bookingDetails?.numberOfContainer || 0,
          containers: values.bookingDetails?.containers?.map((container) => ({
            containerType: container.containerType || "",
            containerNumber: container.containerNumber || "",
            truckNumber: container.truckNumber || "",
            truckDriverContactNumber: container.truckDriverContactNumber || undefined,
            addProductDetails: container.addProductDetails || [],
            _id: container._id || undefined,
          })) || [],
          _id: values.bookingDetails?._id || undefined,
        },
        shippingDetails: {
          review: values.shippingDetails?.review || "",
          transporterName:
            values.shippingDetails?.transporterName &&
            /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.transporterName)
              ? values.shippingDetails.transporterName
              : undefined,
          noOftransportinvoices:
            values.shippingDetails?.noOftransportinvoices ||
            values.shippingDetails?.transporterInvoices?.length ||
            0,
          transporterInvoices:
            values.shippingDetails?.transporterInvoices?.map((invoice) => ({
              invoiceNumber: invoice.invoiceNumber || "",
              uploadInvoiceUrl: invoice.uploadInvoiceUrl || "",
              date: invoice.date || undefined,
              valueWithGst: invoice.valueWithGst || undefined,
              valueWithoutGst: invoice.valueWithoutGst || undefined,
              _id: invoice._id || undefined,
            })) || [],
          forwarderName:
            values.shippingDetails?.forwarderName &&
            /^[0-9a-fA-F]{24}$/.test(values.shippingDetails.forwarderName)
              ? values.shippingDetails.forwarderName
              : undefined,
          noOfForwarderinvoices:
            values.shippingDetails?.noOfForwarderinvoices ||
            values.shippingDetails?.forwarderInvoices?.length ||
            0,
          forwarderInvoices:
            values.shippingDetails?.forwarderInvoices?.map((invoice) => ({
              invoiceNumber: invoice.invoiceNumber || "",
              uploadInvoiceUrl: invoice.uploadInvoiceUrl || "",
              date: invoice.date || undefined,
              valueWithGst: invoice.valueWithGst || undefined,
              valueWithoutGst: invoice.valueWithoutGst || undefined,
              _id: invoice._id || undefined,
            })) || [],
          _id: values.shippingDetails?._id || undefined,
        },
        shippingBillDetails: {
          review: values.shippingBillDetails?.review || "",
          portCode: values.shippingBillDetails?.portCode || "",
          cbName: values.shippingBillDetails?.cbName || "",
          cbCode: values.shippingBillDetails?.cbCode || "",
          numberOFShippingBill:
            values.shippingBillDetails?.numberOFShippingBill ||
            values.shippingBillDetails?.ShippingBills?.length ||
            0,
          ShippingBills:
            values.shippingBillDetails?.ShippingBills?.map((bill) => ({
              shippingBillUrl: bill.shippingBillUrl || "",
              shippingBillNumber: bill.shippingBillNumber || "",
              shippingBillDate: bill.shippingBillDate || undefined,
              drawbackValue: bill.drawbackValue || "",
              rodtepValue: bill.rodtepValue || "",
              _id: bill._id || undefined,
            })) || [],
          _id: values.shippingBillDetails?._id || undefined,
        },
        supplierDetails: {
          review: values.supplierDetails?.review || "",
          clearance: {
            numberOfSuppliers:
              values.supplierDetails?.clearance?.numberOfSuppliers ||
              values.supplierDetails?.clearance?.suppliers?.length ||
              0,
            suppliers:
              values.supplierDetails?.clearance?.suppliers?.map((supplier) => ({
                supplierName:
                  supplier.supplierName &&
                  /^[0-9a-fA-F]{24}$/.test(supplier.supplierName)
                    ? supplier.supplierName
                    : undefined,
                noOfInvoices: supplier.noOfInvoices || 0,
                invoices:
                  supplier.invoices?.map((invoice) => ({
                    supplierGSTN: invoice.supplierGSTN || "",
                    supplierInvoiceNumber: invoice.supplierInvoiceNumber || "",
                    supplierInvoiceDate: invoice.supplierInvoiceDate || undefined,
                    supplierInvoiceValueWithGST:
                      invoice.supplierInvoiceValueWithGST || undefined,
                    supplierInvoiceValueWithOutGST:
                      invoice.supplierInvoiceValueWithOutGST || undefined,
                    clearanceSupplierInvoiceUrl:
                      invoice.clearanceSupplierInvoiceUrl || "",
                    _id: invoice._id || undefined,
                  })) || [],
              })) || [],
            _id: values.supplierDetails?.clearance?._id || undefined,
          },
          actual: {
            actualSupplierName: values.supplierDetails?.actual?.actualSupplierName || "",
            actualSupplierInvoiceUrl:
              values.supplierDetails?.actual?.actualSupplierInvoiceUrl || "",
            actualSupplierInvoiceValue:
              values.supplierDetails?.actual?.actualSupplierInvoiceValue || undefined,
            shippingBillUrl: values.supplierDetails?.actual?.shippingBillUrl || "",
            _id: values.supplierDetails?.actual?._id || undefined,
          },
          _id: values.supplierDetails?._id || undefined,
        },
        saleInvoiceDetails: {
          review: values.saleInvoiceDetails?.review || "",
          consignee:
            values.saleInvoiceDetails?.consignee &&
            /^[0-9a-fA-F]{24}$/.test(values.saleInvoiceDetails.consignee)
              ? values.saleInvoiceDetails.consignee
              : undefined,
          actualBuyer: values.saleInvoiceDetails?.actualBuyer || "",
          numberOfSalesInvoices:
            values.saleInvoiceDetails?.numberOfSalesInvoices ||
            values.saleInvoiceDetails?.commercialInvoices?.length ||
            0,
          commercialInvoices:
            values.saleInvoiceDetails?.commercialInvoices?.map((inv) => ({
              commercialInvoiceNumber: inv.commercialInvoiceNumber || "",
              clearanceCommercialInvoiceUrl: inv.clearanceCommercialInvoiceUrl || "",
              actualCommercialInvoiceUrl: inv.actualCommercialInvoiceUrl || "",
              saberInvoiceUrl: inv.saberInvoiceUrl || "",
              _id: inv._id || undefined,
            })) || [],
          _id: values.saleInvoiceDetails?._id || undefined,
        },
        blDetails: {
          review: values.blDetails?.review || "",
          shippingLine:
            values.blDetails?.shippingLine &&
            /^[0-9a-fA-F]{24}$/.test(values.blDetails.shippingLine)
              ? values.blDetails.shippingLine
              : undefined,
          blNumber: values.blDetails?.blNumber || "",
          blDate: values.blDetails?.blDate || undefined,
          telexDate: values.blDetails?.telexDate || undefined,
          uploadBL: values.blDetails?.uploadBL || "",
          _id: values.blDetails?._id || undefined,
        },
        otherDetails:
          values.otherDetails?.map((item) => ({
            review: item.review || "",
            certificateName: item.certificateName || "",
            certificateNumber: item.certificateNumber || "",
            date: item.date || undefined,
            issuerOfCertificate: item.issuerOfCertificate || "",
            uploadCopyOfCertificate: item.uploadCopyOfCertificate || "",
            _id: item._id || undefined,
          })) || [],
      };

      await putData(`/shipment/update/${params.id}`, payload);
      toast.success("Shipment updated successfully!");
      router.push("../");
      setTimeout(() => localStorage.removeItem(`shipmentDraft_${params.id}`), 2000);
      setTimeout(() => window.location.reload(), 5000);
    } catch (error: any) {
      console.error("Error submitting shipment update:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        toast.error(`Error updating shipment: ${error.response.data.message || "Server error"}`);
      } else {
        toast.error("Error updating shipment: Network error or server unreachable");
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

        const data = await response.json();
        console.log("Raw API response:", data);

        const updatedValues: FormValues = {
          shipmentId: data.shipmentId || "",
          organizationId: data.organizationId || "",
          createdAt: data.createdAt || undefined,
          updatedAt: data.updatedAt || undefined,
          createdBy: data.createdBy || "",
          bookingDetails: {
            review: data.bookingDetails?.review || "",
            invoiceNumber: data.bookingDetails?.invoiceNumber || "",
            bookingNumber: data.bookingDetails?.bookingNumber || "",
            portOfLoading: data.bookingDetails?.portOfLoading || "",
            destinationPort: data.bookingDetails?.destinationPort || "",
            vesselSailingDate: data.bookingDetails?.vesselSailingDate || undefined,
            vesselArrivingDate: data.bookingDetails?.vesselArrivingDate || undefined,
            numberOfContainer: data.bookingDetails?.numberOfContainer || 0,
            containers: Array.isArray(data.bookingDetails?.containers)
              ? data.bookingDetails.containers.map((container: any) => ({
                  containerType: container.containerType || "",
                  containerNumber: container.containerNumber || "",
                  truckNumber: container.truckNumber || "",
                  truckDriverContactNumber: container.truckDriverContactNumber || undefined,
                  addProductDetails: Array.isArray(container.addProductDetails)
                    ? container.addProductDetails.map((product: any) => ({
                        code: product.code || "",
                        HScode: product.HScode || "",
                        dscription: product.dscription || "",
                        unitOfMeasurements: product.unitOfMeasurements || "",
                        countryOfOrigin: product.countryOfOrigin || "",
                        variantName: product.variantName || "",
                        varianntType: product.varianntType || "",
                        sellPrice: product.sellPrice ?? undefined,
                        buyPrice: product.buyPrice ?? undefined,
                        netWeight: product.netWeight ?? undefined,
                        grossWeight: product.grossWeight ?? undefined,
                        cubicMeasurement: product.cubicMeasurement ?? undefined,
                      }))
                    : [],
                  _id: container._id || "",
                }))
              : [],
            _id: data.bookingDetails?._id || "",
          },
          shippingDetails: {
            review: data.shippingDetails?.review || "",
            transporterName:
              data.shippingDetails?.transporterName &&
              /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.transporterName)
                ? data.shippingDetails.transporterName
                : undefined,
            noOftransportinvoices:
              data.shippingDetails?.noOftransportinvoices ||
              data.shippingDetails?.transporterInvoices?.length ||
              0,
            transporterInvoices:
              data.shippingDetails?.transporterInvoices?.map((invoice: any) => ({
                invoiceNumber: invoice.invoiceNumber || "",
                uploadInvoiceUrl: invoice.uploadInvoiceUrl || "",
                date: invoice.date || undefined,
                valueWithGst: invoice.valueWithGst || undefined,
                valueWithoutGst: invoice.valueWithoutGst || undefined,
                _id: invoice._id || "",
              })) || [],
            forwarderName:
              data.shippingDetails?.forwarderName &&
              /^[0-9a-fA-F]{24}$/.test(data.shippingDetails.forwarderName)
                ? data.shippingDetails.forwarderName
                : undefined,
            noOfForwarderinvoices:
              data.shippingDetails?.noOfForwarderinvoices ||
              data.shippingDetails?.forwarderInvoices?.length ||
              0,
            forwarderInvoices:
              data.shippingDetails?.forwarderInvoices?.map((invoice: any) => ({
                invoiceNumber: invoice.invoiceNumber || "",
                uploadInvoiceUrl: invoice.uploadInvoiceUrl || "",
                date: invoice.date || undefined,
                valueWithGst: invoice.valueWithGst || undefined,
                valueWithoutGst: invoice.valueWithoutGst || undefined,
                _id: invoice._id || "",
              })) || [],
            _id: data.shippingDetails?._id || "",
          },
          shippingBillDetails: {
            review: data.shippingBillDetails?.review || "",
            portCode: data.shippingBillDetails?.portCode || "",
            cbName: data.shippingBillDetails?.cbName || "",
            cbCode: data.shippingBillDetails?.cbCode || "",
            numberOFShippingBill:
              data.shippingBillDetails?.numberOFShippingBill ||
              data.shippingBillDetails?.ShippingBills?.length ||
              0,
            ShippingBills:
              (
                data.shippingBillDetails?.ShippingBills ||
                data.shippingBillDetails?.bills ||
                []
              )?.map((bill: BackendShippingBill) => ({
                shippingBillUrl: bill.shippingBillUrl || "",
                shippingBillNumber: bill.shippingBillNumber || "",
                shippingBillDate: bill.shippingBillDate || undefined,
                drawbackValue: bill.drawbackValue || "",
                rodtepValue: bill.rodtepValue || "",
                _id: bill._id || "",
              })) || [],
            _id: data.shippingBillDetails?._id || "",
          },
          supplierDetails: {
            review: data.supplierDetails?.review || "",
            clearance: {
              numberOfSuppliers:
                data.supplierDetails?.clearance?.numberOfSuppliers ||
                data.supplierDetails?.clearance?.suppliers?.length ||
                0,
              suppliers:
                data.supplierDetails?.clearance?.suppliers?.map((supplier: any) => ({
                  supplierName:
                    supplier.supplierName &&
                    /^[0-9a-fA-F]{24}$/.test(supplier.supplierName)
                      ? supplier.supplierName
                      : undefined,
                  noOfInvoices: supplier.noOfInvoices || 0,
                  invoices:
                    supplier.invoices?.map((invoice: any) => ({
                      supplierGSTN: invoice.supplierGSTN || "",
                      supplierInvoiceNumber: invoice.supplierInvoiceNumber || "",
                      supplierInvoiceDate: invoice.supplierInvoiceDate || undefined,
                      supplierInvoiceValueWithGST:
                        invoice.supplierInvoiceValueWithGST || undefined,
                      supplierInvoiceValueWithOutGST:
                        invoice.supplierInvoiceValueWithOutGST || undefined,
                      clearanceSupplierInvoiceUrl:
                        invoice.clearanceSupplierInvoiceUrl || "",
                      _id: invoice._id || "",
                    })) || [],
                })) || [],
              _id: data.supplierDetails?.clearance?._id || "",
            },
            actual: {
              actualSupplierName: data.supplierDetails?.actual?.actualSupplierName || "",
              actualSupplierInvoiceUrl:
                data.supplierDetails?.actual?.actualSupplierInvoiceUrl || "",
              actualSupplierInvoiceValue:
                data.supplierDetails?.actual?.actualSupplierInvoiceValue || undefined,
              shippingBillUrl: data.supplierDetails?.actual?.shippingBillUrl || "",
              _id: data.supplierDetails?.actual?._id || "",
            },
            _id: data.supplierDetails?._id || "",
          },
          saleInvoiceDetails: {
            review: data.saleInvoiceDetails?.review || "",
            consignee:
              data.saleInvoiceDetails?.consignee &&
              /^[0-9a-fA-F]{24}$/.test(data.saleInvoiceDetails.consignee)
                ? data.saleInvoiceDetails.consignee
                : undefined,
            actualBuyer: data.saleInvoiceDetails?.actualBuyer || "",
            numberOfSalesInvoices:
              data.saleInvoiceDetails?.numberOfSalesInvoices ||
              data.saleInvoiceDetails?.commercialInvoices?.length ||
              0,
            commercialInvoices:
              (
                data.saleInvoiceDetails?.commercialInvoices ||
                data.saleInvoiceDetails?.invoice ||
                []
              )?.map((inv: any) => ({
                commercialInvoiceNumber: inv.commercialInvoiceNumber || "",
                clearanceCommercialInvoiceUrl:
                  inv.clearanceCommercialInvoiceUrl || "",
                actualCommercialInvoiceUrl: inv.actualCommercialInvoiceUrl || "",
                saberInvoiceUrl: inv.saberInvoiceUrl || "",
                _id: inv._id || "",
              })) || [],
            _id: data.saleInvoiceDetails?._id || "",
          },
          blDetails: {
            review: data.blDetails?.review || "",
            shippingLine:
              data.blDetails?.shippingLine &&
              /^[0-9a-fA-F]{24}$/.test(data.blDetails.shippingLine)
                ? data.blDetails.shippingLine
                : undefined,
            blNumber: data.blDetails?.blNumber || "",
            blDate: data.blDetails?.blDate || undefined,
            telexDate: data.blDetails?.telexDate || undefined,
            uploadBL: data.blDetails?.uploadBL || "",
            _id: data.blDetails?._id || "",
          },
          otherDetails:
            data.otherDetails?.length > 0
              ? data.otherDetails.map((item: any) => ({
                  review: item.review || "",
                  certificateName: item.certificateName || "",
                  certificateNumber: item.certificateNumber || "",
                  date: item.date || undefined,
                  issuerOfCertificate: item.issuerOfCertificate || "",
                  uploadCopyOfCertificate: item.uploadCopyOfCertificate || "",
                  _id: item._id || "",
                }))
              : [],
        };

        console.log("Mapped form values:", JSON.stringify(updatedValues, null, 2));
        form.reset(updatedValues);
        isInitialLoad.current = false; // Allow autosave after initial load
      } catch (error) {
        console.error("Error fetching shipment data:", error);
        toast.error("Failed to load shipment data");
        isInitialLoad.current = false; // Allow autosave even if fetch fails
      } finally {
        setIsFetching(false);
      }
    }

    fetchShipmentData();
  }, [params.id, form, organizationId]);

  if (isFetching) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Loading shipment data...</p>
      </div>
    );
  }

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
            title={`Edit Shipment: ${form.watch("bookingDetails.invoiceNumber") || "N/A"}`}
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

      {/* New container for Previous and Save and Next buttons */}
      <div className="flex justify-between items-center mb-4">
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
          onClick={currentStep < steps.length - 1 ? handleSectionSubmit : submitDraft}
          disabled={isLoading || isProductDetailsOpen}
        >
          {currentStep < steps.length - 1 ? "Update and Next" : "Update Shipment"}
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