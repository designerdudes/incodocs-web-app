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
import { BillOfLadingDetails } from "./components/BillOfLadingDetails";
import { OtherDetails } from "./components/OtherDetails";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { postData } from "@/axiosUtility/api";
import { useParams, useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { debounce } from "lodash";
import { formSchema } from "./data/formSchema";
import { CommercialInvoiceDetails } from "./components/SaleInvoiceDetails";

// Save progress functions
const saveProgressSilently = (data: any) => {
  localStorage.setItem("shipmentDraft", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
};

const saveProgressWithFeedback = (data: any) => {
  saveProgressSilently(data);
  toast.success("Progress saved as draft!");
};

export default function CreateNewShipmentFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const orgid = useParams().organizationId;
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);

  const steps = [
    {
      id: 1,
      name: "Booking Details",
      component: (
        <BookingDetails
          saveProgress={saveProgressWithFeedback}
          onSectionSubmit={handleSectionSubmit}
          setInvoiceNumber={setInvoiceNumber}
          params={orgid}
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
          params={orgid}
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
          params={orgid}
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
        <CommercialInvoiceDetails
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
      component: <OtherDetails saveProgress={saveProgressWithFeedback} />,
    },
  ];


  const loadDraft = (): Record<string, any> => {
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
        bookingDetails: {
          invoiceNumber: values?.bookingDetails?.invoiceNumber || "",
          bookingNumber: values?.bookingDetails?.bookingNumber || "",
          portOfLoading: values?.bookingDetails?.portOfLoading || "",
          destinationPort: values?.bookingDetails?.destinationPort || "",
          vesselSailingDate: values?.bookingDetails?.vesselSailingDate || "",
          vesselArrivingDate: values?.bookingDetails?.vesselArrivingDate || "",
          containers: values?.bookingDetails?.containers || [], // Includes containerType
          review: values.bookingDetails?.review || ""
        },
        shippingDetails: {
          forwarderName: values.shippingDetails?.forwarderName ?? "",
          forwarderInvoices: values.shippingDetails?.forwarderInvoices ?? [],
          transporterName: values.shippingDetails?.transporterName ?? "",
          transporterInvoices: values.shippingDetails?.transporterInvoices ?? [],
          review: values.shippingDetails?.review || ""
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
          shippingLineName: values.blDetails?.shippingLineName || undefined,
          noOfBl: values.blDetails?.noOfBl ?? 0,
          review: values.blDetails?.review ?? "",
          Bl: values.blDetails?.Bl ?? [],
        },
        otherDetails: values.otherDetails || [],
        organizationId: orgid,
      };
      console.log("Payload to be sent:", payload);
      await postData("/shipment/add/", payload);
      toast.success("Shipment created successfully!");
      router.push("./");
      setTimeout(() => localStorage.removeItem("shipmentDraft"), 3000);;
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
          <Heading className="leading-tight"
            title={`Create New Shipment${invoiceNumber ? ` — ${invoiceNumber}` : ""}`}
          />
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
        <form className="flex flex-col gap-3 w-full p-3">
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep > 0 ? currentStep - 1 : 0)}
              disabled={currentStep === 0 || isLoading}
              className={`${currentStep === 0 ? "invisible" : ""}`}
            >
              Previous
            </Button>

            <Button
              type="button"
              onClick={handleSectionSubmit}
              disabled={currentStep === 6 || isLoading}
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
              setInvoiceNumber={setInvoiceNumber}
              params={orgid}

            />
          )}
          {steps[currentStep].id === 2 && (
            <ShippingDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
              params={orgid}
            />
          )}
          {steps[currentStep].id === 3 && (
            <ShippingBillDetails
              saveProgress={saveProgressWithFeedback}
              onSectionSubmit={handleSectionSubmit}
              params={orgid}
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
            <CommercialInvoiceDetails
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