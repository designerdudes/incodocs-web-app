"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalModal } from "@/hooks/GlobalModal";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { Icons } from "@/components/ui/icons";
import { fetchData } from "@/axiosUtility/api";
import Cookies from "js-cookie";

interface SaleInvoiceDetailsProps {
  shipmentId: string;
  orgId: string | undefined;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<any>;
}

export function SaleInvoiceDetails({
  shipmentId,
  orgId,
  saveProgress,
  onSectionSubmit,
}: SaleInvoiceDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [consignees, setConsignees] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const GlobalModal = useGlobalModal();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "saleInvoiceDetails.invoice",
  });

  // Watch form values
  const formValues = watch("saleInvoiceDetails");

  // Autosave form data when saleInvoiceDetails changes
  useEffect(() => {
    saveProgress({ saleInvoiceDetails: formValues });
  }, [formValues, saveProgress]);

  // Fetch consignees using fetchData
  const fetchConsignees = async () => {
    if (!orgId) {
      console.warn("fetchConsignees: No orgId provided");
      setConsignees([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchData(`/shipment/consignee/getbyorg/${orgId}?t=${Date.now()}`);
      console.log("API Response (Consignees):", data);
      const mappedConsignees = Array.isArray(data)
        ? data.map((consignee: any) => ({
            _id: consignee._id,
            name: consignee.name || consignee.consigneeName || "Unknown Consignee",
          }))
        : [];
      console.log("Mapped Consignees:", mappedConsignees);
      setConsignees(mappedConsignees);
    } catch (error: any) {
      console.error("Error fetching consignees:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        Cookies.remove("AccessToken");
        window.location.href = "/login";
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to fetch consignees.");
      } else {
        toast.error("Failed to fetch consignees");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch consignees on mount or orgId change
  useEffect(() => {
    fetchConsignees();
  }, [orgId]);

  // Reset consignee field if selected ID is invalid
  useEffect(() => {
    const currentConsigneeId = watch("saleInvoiceDetails.consignee");
    console.log("Current Consignee ID:", currentConsigneeId);
    console.log("Available Consignees:", consignees);
    if (
      currentConsigneeId &&
      consignees.length > 0 &&
      !consignees.find((c) => c._id === currentConsigneeId)
    ) {
      console.warn("Consignee ID not found, resetting field");
      setValue("saleInvoiceDetails.consignee", "", { shouldDirty: true });
    }
  }, [consignees, watch, setValue]);

  // Sync invoice fields with numberOfSalesInvoices and API data
  useEffect(() => {
    if (!formValues) {
      console.warn("SaleInvoiceDetails: formValues is undefined");
      return;
    }
    console.log("SaleInvoiceDetails formValues:", formValues);
    console.log("SaleInvoiceDetails fields:", fields);

    const numberOfInvoices = formValues.numberOfSalesInvoices ?? 0;
    const currentInvoices = formValues.invoice ?? [];

    if (
      currentInvoices.length > 0 &&
      fields.length !== currentInvoices.length
    ) {
      console.log("Replacing fields with API invoices:", currentInvoices);
      replace(currentInvoices);
    } else if (numberOfInvoices !== fields.length) {
      console.log(
        "Syncing fields with numberOfSalesInvoices:",
        numberOfInvoices
      );
      if (numberOfInvoices > fields.length) {
        const newInvoices = Array(numberOfInvoices - fields.length)
          .fill(null)
          .map(() => ({
            commercialInvoiceNumber: "",
            clearanceCommercialInvoice: "",
            actualCommercialInvoice: "",
            saberInvoice: "",
            addProductDetails: [],
          }));
        append(newInvoices, { shouldFocus: false });
      } else if (numberOfInvoices < fields.length) {
        for (let i = fields.length - 1; i >= numberOfInvoices; i--) {
          remove(i);
        }
      }
    }
  }, [formValues, fields.length, append, remove, replace]);

  // Handle Number of Invoices Change
  const handleInvoiceNumberCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    console.log("handleInvoiceNumberCountChange:", value);
    setValue("saleInvoiceDetails.numberOfSalesInvoices", value, {
      shouldDirty: true,
    });
    const currentInvoices = formValues?.invoice ?? [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length)
        .fill(null)
        .map(() => ({
          commercialInvoiceNumber: "",
          clearanceCommercialInvoice: "",
          actualCommercialInvoice: "",
          saberInvoice: "",
          addProductDetails: [],
        }));
      append(newInvoices, { shouldFocus: false });
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        remove(i);
      }
    }
  };

  const openConsigneeForm = () => {
    if (!orgId) {
      toast.error("Cannot add consignee: Organization ID is missing");
      return;
    }
    console.log("Opening AddConsigneeForm with orgId:", orgId);
    GlobalModal.title = "Add New Consignee";
    GlobalModal.children = (
      <AddConsigneeForm
        orgId={orgId}
        onSuccess={() => {
          fetchConsignees();
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Select Consignee */}
      <FormField
        control={control}
        name="saleInvoiceDetails.consignee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Consignee</FormLabel>
            <FormControl>
              <EntityCombobox
                entities={consignees}
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
                displayProperty="name"
                placeholder="Select a Consignee"
                onAddNew={openConsigneeForm}
                addNewLabel="Add New Consignee"
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Actual Buyer */}
      <FormField
        control={control}
        name="saleInvoiceDetails.actualBuyer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actual Buyer</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter buyer name"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Number of Commercial Invoices */}
      <FormField
        control={control}
        name="saleInvoiceDetails.numberOfSalesInvoices"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Commercial Invoices</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of Commercial Invoices"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  field.onChange(value);
                  handleInvoiceNumberCountChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Invoices Table */}
      {fields.length > 0 ? (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Commercial Invoice Number</TableHead>
                <TableHead>Clearance Commercial Invoice</TableHead>
                <TableHead>Actual Commercial Invoice</TableHead>
                <TableHead>SABER Invoice</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].commercialInvoiceNumber`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="Eg: 123456898"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].clearanceCommercialInvoice`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="Eg: 123456898"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].actualCommercialInvoice`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="Eg: 123456898"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`saleInvoiceDetails.invoice[${index}].saberInvoice`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            placeholder="Eg: 123456898"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="col-span-4 mt-4 text-muted-foreground">
          No invoices added. Set the number of commercial invoices to add one.
        </div>
      )}

      {/* Review */}
      <FormField
        control={control}
        name="saleInvoiceDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4">
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}