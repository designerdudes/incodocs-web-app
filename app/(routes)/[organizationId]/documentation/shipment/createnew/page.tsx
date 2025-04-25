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
import { OtherDetails } from "./components/OtherDetails";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { postData } from "@/axiosUtility/api";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { debounce } from "lodash";

// Save progress functions
const saveProgressSilently = (data: any) => {
  localStorage.setItem("shipmentDraft", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
};

const saveProgressWithFeedback = (data: any) => {
  saveProgressSilently(data);
  toast.success("Progress saved as draft!");
};

// Updated Zod Schema with all fields optional
const formSchema = z.object({
  bookingDetails: z
    .object({
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
      containers: z
        .array(
          z.object({
            containerNumber: z.string().optional(),
            truckNumber: z.string().optional(),
            trukDriverContactNumber: z.number().optional(),
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
                            units: z.string().optional(),
                          })
                          .optional(),
                        breadth: z
                          .object({
                            value: z.number().optional(),
                            units: z.string().optional(),
                          })
                          .optional(),
                      })
                      .optional(),
                  })
                  .optional(),
              })
              .optional(),
          })
        )
        .optional(),
    })
    .optional(),
  shippingDetails: z
    .object({
      review: z.string().optional(),
      forwarder: z.string().optional(),
      noOfForwarderinvoices: z.number().optional(),
      forwarderInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
            date: z.string().datetime({ message: "Invalid date format" }).optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
          })
        )
        .optional(),
      transporter: z.string().optional(),
      noOftransportinvoices: z.number().optional(),
      transporterInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
            date: z.string().datetime({ message: "Invalid date format" }).optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  shippingBillDetails: z
    .object({
      review: z.string().optional(),
      portCode: z.string().optional(),
      cbName: z.string().optional(),
      cdCode: z.string().optional(),
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
          })
        )
        .optional(),
    })
    .optional(),
  supplierDetails: z
    .object({
      review: z.string().optional(),
      clearance: z
        .object({
          supplierName: z.string().optional(),
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
                supplierInvoiceValueWithGST: z.string().optional(),
                supplierInvoiceValueWithOutGST: z.string().optional(),
                clearanceSupplierInvoiceUrl: z
                  .string()
                  .url("Invalid URL")
                  .optional(),
              })
            )
            .optional(),
        })
        .optional(),
      actual: z
        .object({
          actualSupplierName: z.string().optional(),
          actualSupplierInvoiceUrl: z.string().url("Invalid URL").optional(),
          actualSupplierInvoiceValue: z.string().optional(),
          shippingBillUrl: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  saleInvoiceDetails: z
    .object({
      review: z.string().optional(),
      consignee: z.string().optional(),
      actualBuyer: z.string().optional(),
      commercialInvoices: z
        .array(
          z.object({
            commercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoiceUrl: z.string().url("Invalid URL").optional(),
            actualCommercialInvoiceUrl: z.string().url("Invalid URL").optional(),
            saberInvoiceUrl: z.string().url("Invalid URL").optional(),
          })
        )
        .optional(),
    })
    .optional(),
  blDetails: z
    .object({
      review: z.string().optional(),
      blNumber: z.string().optional(),
      blDate: z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
      telexDate: z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
      uploadBL: z.string().url("Invalid URL").optional(),
      shippingDetails: z
        .object({
          review: z.string().optional(),
          shippingLineName: z.string().optional(),
          noOfShipmentinvoices: z.number().optional(),
          shippingLineInvoices: z
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
              })
            )
            .optional(),
          // ... (other shippingDetails fields)
        })
        .optional(),
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
      })
    )
    .optional(),
  organizationId: z.string().optional(),
  shipmentId: z.string().optional(),
});


export default function CreateNewFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const orgid = useParams().organizationId;


  const steps = [
    {
      id: 1,
      name: "Booking Details",
      component: (
        <BookingDetails
          saveProgress={saveProgressWithFeedback}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 2,
      name: "Shipping Details",
      component: (
        <ShippingDetails
          saveProgress={saveProgressWithFeedback}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 3,
      name: "Shipping Bill Details",
      component: (
        <ShippingBillDetails
          saveProgress={saveProgressWithFeedback}
          onSectionSubmit={handleSectionSubmit}
        />
      ),
    },
    {
      id: 4,
      name: "Supplier Details",
      component: (
        <SupplierDetails
          saveProgress={saveProgressWithFeedback}
          onSectionSubmit={handleSectionSubmit}
          params={orgid}
        />
      ),
    },
    {
      id: 5,
      name: "Commercial Invoice",
      component: (
        <SaleInvoiceDetails
          saveProgress={saveProgressWithFeedback}
          onSectionSubmit={handleSectionSubmit}
          params={orgid}
        />
      ),
    },
    {
      id: 6,
      name: "Bill of Lading Details",
      component: (
        <BillOfLadingDetails
          saveProgress={saveProgressWithFeedback}
          onSectionSubmit={handleSectionSubmit}
          params={orgid}
        />
      ),
    },
    {
      id: 7,
      name: "Other Details",
      component: <OtherDetails
        saveProgress={saveProgressWithFeedback} />,
    },
  ];


  const loadDraft = () => {
    const draft = localStorage.getItem("shipmentDraft");
    return draft ? JSON.parse(draft) : {};
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: loadDraft(),
  });

  const watchedValues = form.watch();
  const debouncedSave = debounce(saveProgressSilently, 1000);
  useEffect(() => {
    debouncedSave(watchedValues);
  }, [watchedValues, debouncedSave]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const submitDraft = async () => {
    setIsLoading(true);
    try {
      const values = form.getValues();
      const payload = {
        shipmentId: values.shipmentId || undefined,
        bookingDetails: values.bookingDetails || {},
        shippingDetails: {
          forwarder: values.shippingDetails?.forwarder ?? "",
          forwarderInvoices: values.shippingDetails?.forwarderInvoices ?? [],
          transporter: values.shippingDetails?.transporter ?? "",
          transporterInvoices: values.shippingDetails?.transporterInvoices ?? [],
        },
        shippingBillDetails: values.shippingBillDetails || {},
        supplierDetails: values.supplierDetails || {},
        saleInvoiceDetails: {
          review: values.saleInvoiceDetails?.review ?? "",
          consignee: values.saleInvoiceDetails?.consignee ?? "",
          actualBuyer: values.saleInvoiceDetails?.actualBuyer ?? "",
          commercialInvoices: values.saleInvoiceDetails?.commercialInvoices ?? [],
        },
        blDetails: {
          review: values.blDetails?.review ?? "",
          blNumber: values.blDetails?.blNumber ?? "",
          blDate: values.blDetails?.blDate ?? "",
          telexDate: values.blDetails?.telexDate ?? "",
          uploadBL: values.blDetails?.uploadBL ?? "",
          shippingDetails: {
            review: values.blDetails?.shippingDetails?.review ?? "",
            shippingLineName: values.blDetails?.shippingDetails?.shippingLineName || undefined,
            noOfShipmentinvoices: values.blDetails?.shippingDetails?.noOfShipmentinvoices ?? 0,
            shippingLineInvoices: values.blDetails?.shippingDetails?.shippingLineInvoices ?? [],
          },
        },
        otherDetails: values.otherDetails || [],
        organizationId,
      };
      await postData("/shipment/add/", payload);
      toast.success("Shipment created successfully!");
      router.push("./");
      setTimeout(() => localStorage.removeItem("shipmentDraft"), 2000);;
      setTimeout(() => window.location.reload(), 5000);
    } catch (error) {
      console.error("Error submitting draft:", error);
      toast.error("Error submitting shipment");
    } finally {
      setIsLoading(false);
    }
  };
  async function handleSectionSubmit() {
    setIsLoading(true);
    try {
      const values = form.getValues();
      saveProgressWithFeedback(values); // Save as draft
      nextStep();
    } catch (error) {
      console.error(`Error saving ${steps[currentStep].name} as draft:`, error);
      toast.error(`Error saving ${steps[currentStep].name} as draft`);
    } finally {
      setIsLoading(false);
    }
  }

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
        <Button
          className="h-8"
          type="button"
          onClick={handleSectionSubmit}
          disabled={isLoading}
        >
          Save and Next
          {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
        </Button>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full">
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      </div>

      <FormProvider {...form}>
        <form className="flex flex-col gap-3 w-full p-3">
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
              type="button"
              onClick={handleSectionSubmit}
              disabled={currentStep === 7 || isLoading}
            >
              Save and Next
              {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
            </Button>

          </div>

          <div className="flex justify-between">
            <Heading className="text-xl" title={steps[currentStep].name} />
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Pass handleSectionSubmit to relevant components */}
          {steps[currentStep].id === 1 && (
            <BookingDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
            />
          )}
          {steps[currentStep].id === 2 && (
            <ShippingDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
            />
          )}
          {steps[currentStep].id === 3 && (
            <ShippingBillDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
            />
          )}
          {steps[currentStep].id === 4 && (
            <SupplierDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
              params={orgid}
            />
          )}
          {steps[currentStep].id === 5 && (
            <SaleInvoiceDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
              params={orgid}
            />
          )}
          {steps[currentStep].id === 6 && (
            <BillOfLadingDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
              params={orgid}
            />
          )}
          {steps[currentStep].id === 7 && (
            <OtherDetails saveProgress={saveProgressWithFeedback} />
          )}
        </form>
      </FormProvider>

      {/* Final Submit Button on Last Step */}
      {currentStep === steps.length - 1 && (
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            onClick={submitDraft}
            disabled={isLoading}
          >
            Submit Shipment
            {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
          </Button>
        </div>
      )}
    </div>
  );
}