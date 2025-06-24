  "use client";
  import { Button } from "@/components/ui/button";
  import Heading from "@/components/ui/heading";
  import { ChevronLeft } from "lucide-react";
  import Link from "next/link";
  import { Separator } from "@/components/ui/separator";
  import React, { useState, useEffect } from "react";
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
  import { fetchData, postData } from "@/axiosUtility/api";
  import { useParams, useRouter } from "next/navigation";
  import { Icons } from "@/components/ui/icons";
  import { formSchema } from "./data/formSchema";
  import { CommercialInvoiceDetails } from "./components/SaleInvoiceDetails";

  // Save progress to localStorage
  const saveProgressToLocalStorage = (data: any, orgid: string) => {
    try {
      localStorage.setItem(`form-data-${orgid}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Save draft to backend
  const saveProgressWithFeedback = async (data: any, orgid: string) => {
    try {
      const response = await postData("/shipmentdrafts/add", { ...data, organizationId: orgid });
      console.log("Save Draft API Response:", response); // Log API response
      toast.success("Progress saved as draft!");
      return response;
    } catch (error) {
      console.error("Error saving draft to API:", error);
      toast.error("Failed to save draft");
      throw error;
    }
  };

  export default function CreateNewShipmentFormPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const rawOrgId = useParams().organizationId;
    const orgid = Array.isArray(rawOrgId) ? rawOrgId[0] : rawOrgId;
    const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<string>("");

    React.useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const GetCurrentUser = await fetchData(`/user/currentUser`);
          const currentUserId = GetCurrentUser._id;
          setCurrentUser(currentUserId);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchCurrentUser();
    }, []);

    const steps = [
      {
        id: 1,
        name: "Booking Details",
        component: (
          <BookingDetails
            saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
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
            saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
            onSectionSubmit={handleSectionSubmit}
            params={orgid}
            currentUser={currentUser}
          />
        ),
      },
      {
        id: 3,
        name: "Shipping Bill Details",
        component: (
          <ShippingBillDetails
            saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
            onSectionSubmit={handleSectionSubmit}
            params={orgid}
            currentUser={currentUser}
          />
        ),
      },
      {
        id: 4,
        name: "Supplier Details",
        component: (
          <SupplierDetails
            saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
            onSectionSubmit={handleSectionSubmit}
            params={orgid}
            currentUser={currentUser}
          />
        ),
      },
      {
        id: 5,
        name: "Commercial Invoice",
        component: (
          <CommercialInvoiceDetails
            saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
            onSectionSubmit={handleSectionSubmit}
            params={orgid}
            currentUser={currentUser}
          />
        ),
      },
      {
        id: 6,
        name: "Bill of Lading Details",
        component: (
          <BillOfLadingDetails
            saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
            onSectionSubmit={handleSectionSubmit}
            params={orgid}
            currentUser={currentUser}
          />
        ),
      },
      {
        id: 7,
        name: "Other Details",
        component: (
          <OtherDetails
            saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
          />
        ),
      },
    ];

    const loadDraft = async (): Promise<Record<string, any>> => {
      try {
        // Try loading from localStorage first
        const localData = localStorage.getItem(`form-data-${orgid}`);
        if (localData) {
          const parsedData = JSON.parse(localData);
          console.log("Loaded from localStorage:", parsedData);
          return parsedData;
        }
        // Fallback to API if no local data
        const response = await fetchData(`/shipmentdrafts/getbyorg/${orgid}`);
        console.log("Load Draft API Response:", response);
        return response.data || response || {};
      } catch (error) {
        console.error("Error accessing draft from API:", error);
        return {};
      }
    };

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: async () => await loadDraft(),
    });

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
            invoiceNumber: values?.bookingDetails?.invoiceNumber,
            bookingNumber: values?.bookingDetails?.bookingNumber || "",
            portOfLoading: values?.bookingDetails?.portOfLoading || "",
            destinationPort: values?.bookingDetails?.destinationPort || "",
            vesselSailingDate: values?.bookingDetails?.vesselSailingDate || "",
            vesselArrivingDate: values?.bookingDetails?.vesselArrivingDate || "",
            containers: values?.bookingDetails?.containers || undefined,
            review: values.bookingDetails?.review || "",
          },
          shippingDetails: {
            forwarderName: values.shippingDetails?.forwarderName || undefined,
            forwarderInvoices: values.shippingDetails?.forwarderInvoices ?? [],
            transporterName: values.shippingDetails?.transporterName || undefined,
            transporterInvoices:
              values.shippingDetails?.transporterInvoices || undefined,
            review: values.shippingDetails?.review || "",
          },
          shippingBillDetails: values.shippingBillDetails || {},
          supplierDetails: {
            review: values.supplierDetails?.review || "",
            clearance: {
              noOfSuppliers:
                values.supplierDetails?.clearance?.noOfSuppliers || undefined,
              suppliers:
                values.supplierDetails?.clearance?.suppliers || undefined,
            },
            actual: values.supplierDetails?.actual || undefined,
          },
          saleInvoiceDetails: {
            review: values.saleInvoiceDetails?.review ?? "",
            consignee: values.saleInvoiceDetails?.consignee || undefined,
            actualBuyer: values.saleInvoiceDetails?.actualBuyer ?? "",
            commercialInvoices:
              values.saleInvoiceDetails?.commercialInvoices ?? [],
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
        const response = await postData("/shipment/add/", payload);
        console.log("Submit Draft API Response:", response);
        toast.success("Shipment created successfully!");
        form.reset();
        localStorage.removeItem(`form-data-${orgid}`);
        setTimeout(() => router.push("./"), 1000);
      } catch (error: any) {
        console.error("Error submitting draft:", error);
        const serverMessage = error?.response?.data?.message;

        if (serverMessage === "Booking detail invoice number already exist") {
          toast.error("Invoice number already exists. Please use a unique one.");
        } else {
          toast.error(
            "Error submitting shipment: " + (serverMessage || error.message)
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    async function handleSectionSubmit() {
      setIsLoading(true);
      try {
        const values = form.getValues();
        saveProgressToLocalStorage(values, orgid); // Save to localStorage only
        nextStep();
      } catch (error) {
        console.error(`Error saving ${steps[currentStep].name} to localStorage:`, error);
        toast.error(`Error saving ${steps[currentStep].name}`);
      } finally {
        setIsLoading(false);
      }
    }

    async function handleSaveDraft() {
      setIsLoading(true);
      try {
        const values = form.getValues();
        console.log("Save Draft Data:", values);
        await saveProgressWithFeedback(values, orgid); // Save to backend
        form.reset();
        localStorage.removeItem(`form-data-${orgid}`);
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Failed to save draft");
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
            <Heading
              className="leading-tight"
              title={`Create New Shipment${
                invoiceNumber ? ` — ${invoiceNumber}` : ""
              }`}
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
                onClick={() =>
                  setCurrentStep(currentStep > 0 ? currentStep - 1 : 0)
                }
                disabled={currentStep === 0 || isLoading}
                className={`${currentStep === 0 ? "invisible" : ""}`}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {currentStep === steps.length - 1 && (
                  <Button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                    variant="outline"
                  >
                    Save Draft
                    {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={
                    currentStep < steps.length - 1
                      ? handleSectionSubmit
                      : submitDraft
                  }
                  disabled={isLoading}
                >
                  {currentStep < steps.length - 1
                    ? "Save and Next"
                    : "Save and Submit"}
                  {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <Heading className="text-xl" title={steps[currentStep].name} />
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>

            {steps[currentStep].id === 1 && (
              <BookingDetails
                saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
                onSectionSubmit={handleSectionSubmit}
                setInvoiceNumber={setInvoiceNumber}
                params={orgid}
              />
            )}
            {steps[currentStep].id === 2 && (
              <ShippingDetails
                saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
                onSectionSubmit={handleSectionSubmit}
                params={orgid}
                currentUser={currentUser}
              />
            )}
            {steps[currentStep].id === 3 && (
              <ShippingBillDetails
                saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
                onSectionSubmit={handleSectionSubmit}
                params={orgid}
                currentUser={currentUser}
              />
            )}
            {steps[currentStep].id === 4 && (
              <SupplierDetails
                saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
                onSectionSubmit={handleSectionSubmit}
                params={orgid}
                currentUser={currentUser}
              />
            )}
            {steps[currentStep].id === 5 && (
              <CommercialInvoiceDetails
                saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
                onSectionSubmit={handleSectionSubmit}
                params={orgid}
                currentUser={currentUser}
              />
            )}
            {steps[currentStep].id === 6 && (
              <BillOfLadingDetails
                saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
                onSectionSubmit={handleSectionSubmit}
                params={orgid}
                currentUser={currentUser}
              />
            )}
            {steps[currentStep].id === 7 && (
              <OtherDetails
                saveProgress={(data: any) => saveProgressToLocalStorage(data, orgid)}
              />
            )}
          </form>
        </FormProvider>
      </div>
    );
  }