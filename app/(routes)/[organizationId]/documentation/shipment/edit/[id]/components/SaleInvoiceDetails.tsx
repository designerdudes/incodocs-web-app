"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalModal } from "@/hooks/GlobalModal";
import AddConsigneeForm from "@/components/forms/AddConsigneeForm";
import EntityCombobox from "@/components/ui/EntityCombobox";

const consigneeOptions = [
  { id: "67acfa7f7dabb67dd56d34c5", name: "khan" }, // Match API _id
  { id: "2", name: "consigneeNo24" },
];

interface SaleInvoiceDetailsProps {
  shipmentId: string;
}

export function SaleInvoiceDetails({ shipmentId }: SaleInvoiceDetailsProps) {
  const { control, setValue, handleSubmit, watch, getValues } =
    useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "saleInvoiceDetails.invoice",
  });

  const [showInvoiceForm, setShowInvoiceForm] = useState<boolean>(false);
  const [consignees, setConsignees] = useState<{ _id: string; name: string }[]>(
    []
  );
  const GlobalModal = useGlobalModal();

  // Watch form values for debugging
  const formValues = watch("saleInvoiceDetails");
  console.log("Current Sale Invoice Details Values:", formValues);

  // Handle Number of Invoices Change
  const handleInvoiceNumberCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("saleInvoiceDetails.numberOfSalesInvoices", value, {
      shouldDirty: true,
    });
    const currentInvoices = formValues.invoice || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length)
        .fill(null)
        .map(() => ({
          commercialInvoiceNumber: "",
          clearanceCommercialInvoice: "",
          actualCommercialInvoice: "",
          saberInvoice: "",
          addProductDetails: "",
        }));
      append(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        remove(i);
      }
    }
  };

  const openConsigneeForm = () => {
    GlobalModal.title = "Add New Consignee";
    GlobalModal.children = (
      <AddConsigneeForm
        onSuccess={() => {
          fetch(
            "https://incodocs-server.onrender.com/shipment/consignee/getbyorg/674b0a687d4f4b21c6c980ba"
          )
            .then((res) => res.json())
            .then((data) => {
              const mappedConsignees = data.map((consignee: any) => ({
                _id: consignee._id,
                name: consignee.name || consignee.consigneeName,
              }));
              setConsignees(mappedConsignees);
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  // Update API Call
  const onSubmit = async (data: any) => {
    console.log("Submitting Sale Invoice Details:", data.saleInvoiceDetails);
    try {
      const response = await fetch(
        "http://localhost:4080/shipment/sale-invoice-details",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipmentId,
            saleInvoiceDetails: data.saleInvoiceDetails,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update sale invoice details: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      toast.success("Sale invoice details updated successfully!");
    } catch (error) {
      console.error("Error updating sale invoice details:", error);
      if (error instanceof Error) {
        toast.error(`Failed to update sale invoice details: ${error.message}`);
      } else {
        toast.error("Failed to update sale invoice details");
      }
    }
  };
  // Fetch consignees on mount
  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const response = await fetch(
          "https://incodocs-server.onrender.com/shipment/consignee/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const data = await response.json();
        const mappedConsignees = data.map((consignee: any) => ({
          _id: consignee._id,
          name: consignee.name || consignee.consigneeName,
        }));
        setConsignees(mappedConsignees);
      } catch (error) {
        console.error("Error fetching consignees:", error);
      }
    };
    fetchConsignees();
  }, []);

  function saveProgressSilently(arg0: FieldValues): void {
    throw new Error("Function not implemented.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="name"
                  placeholder="Select a Consignee"
                  onAddNew={openConsigneeForm}
                  addNewLabel="Add New Consignee"
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
                  onChange={(e) => field.onChange(e.target.value)}
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
        {fields.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Commercial Invoice Number</TableHead>
                  <TableHead>Clearance Commercial Invoice</TableHead>
                  <TableHead>Actual Commercial Invoice</TableHead>
                  <TableHead>SABER Invoice</TableHead>
                  <TableHead>Add Invoice Details</TableHead>
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
                              onChange={(e) => field.onChange(e.target.value)}
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
                              onChange={(e) => field.onChange(e.target.value)}
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
                              onChange={(e) => field.onChange(e.target.value)}
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
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      {showInvoiceForm ? (
                        <FormField
                          control={control}
                          name={`saleInvoiceDetails.invoice[${index}].addProductDetails`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                placeholder="Add Invoice"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={() => setShowInvoiceForm(false)}
                              />
                            </FormControl>
                          )}
                        />
                      ) : (
                        <Button
                          variant="default"
                          size="lg"
                          type="button"
                          onClick={() => setShowInvoiceForm(true)}
                        >
                          Add Invoice
                        </Button>
                      )}
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
        )}
        {/* Review */}
        <FormField
          control={control}
          name="shippingDetails.review"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., this is some random comment"
                  {...field}
                  onBlur={() => saveProgressSilently(getValues())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  );
}
