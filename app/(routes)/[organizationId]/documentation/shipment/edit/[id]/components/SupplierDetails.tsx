"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import SupplierForm from "@/components/forms/Addsupplierform";
import { useGlobalModal } from "@/hooks/GlobalModal";
import EntityCombobox from "@/components/ui/EntityCombobox";

interface SupplierDetailsProps {
  shipmentId: string;
}

export function SupplierDetails({ shipmentId }: SupplierDetailsProps) {
  const { control, setValue, handleSubmit, watch, getValues } =
    useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplierDetails.clearance.invoices",
  });
  const [supplierNames, setSupplierNames] = useState<
    { _id: string; name: string }[]
  >([]);
  const [shippingBills, setShippingBills] = useState<{ _id: string; name: string }[]>([]);
  const GlobalModal = useGlobalModal();

  // Watch form values for debugging
  const formValues = watch("supplierDetails");
  console.log("Current Supplier Details Values:", formValues);

  // Handle Number of Invoices Change
  const handleInvoiceCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("supplierDetails.clearance.noOfInvoices", value, {
      shouldDirty: true,
    });
    const currentInvoices = formValues.clearance.invoices || [];
    if (value > currentInvoices.length) {
      const newInvoices = Array(value - currentInvoices.length)
        .fill(null)
        .map(() => ({
          supplierGSTN: "",
          supplierInvoiceNumber: "",
          supplierInvoiceDate: undefined,
          supplierInvoiceValueWithGST: "",
          supplierInvoiceValueWithOutGST: "",
          clearanceSupplierInvoiceUrl: "",
        }));
      append(newInvoices);
    } else if (value < currentInvoices.length) {
      for (let i = currentInvoices.length - 1; i >= value; i--) {
        remove(i);
      }
    }
  };
   // Fetch supplier names and shipping bills
    useEffect(() => {
      const fetchData = async () => {
        try {
          const supplierResponse = await fetch(
            "https://incodocs-server.onrender.com/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba"
          );
          const supplierData = await supplierResponse.json();
          const mappedSuppliers = supplierData.map((supplier: any) => ({
            _id: supplier._id,
            name: supplier.supplierName,
          }));
          setSupplierNames(mappedSuppliers);
        } catch (error) {
          console.error("Error fetching supplier data:", error);
        }
      };
      fetchData();
      // Placeholder for shipping bills until API is provided
      setShippingBills([
        { _id: "1", name: "Bill 1" },
        { _id: "2", name: "Bill 2" },
      ]);
    }, []);

  // Update API Call
  const onSubmit = async (data: any) => {
    console.log("Submitting Supplier Details:", data.supplierDetails);
    try {
      const response = await fetch(
        "http://localhost:4080/shipment/supplier-details",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipmentId,
            supplierDetails: data.supplierDetails,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update supplier details: ${errorText}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      toast.success("Supplier details updated successfully!");
    } catch (error) {
      console.error("Error updating supplier details:", error);
      toast.error(`Failed to update supplier details`);
    }
  };

  function saveProgressSilently(arg0: FieldValues): void {
    throw new Error("Function not implemented.");
  }
  const openSupplierForm = () => {
    GlobalModal.title = "Add New Supplier";
    GlobalModal.children = (
      <SupplierForm
        onSuccess={() => {
          fetch(
            "https://incodocs-server.onrender.com/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba"
          )
            .then((res) => res.json())
            .then((data) => {
              const mappedSuppliers = data.map((supplier: any) => ({
                _id: supplier._id,
                name: supplier.supplierName,
              }));
              setSupplierNames(mappedSuppliers);
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 gap-3">
        {/* Clearance Supplier Name */}
        <FormField
          control={control}
          name="supplierDetails.clearance.supplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Supplier Name</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={supplierNames}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="name"
                  placeholder="Select a Supplier Name"
                  onAddNew={openSupplierForm}
                  addNewLabel="Add New Supplier"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Invoices */}
        <FormField
          control={control}
          name="supplierDetails.clearance.noOfInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Supplier Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of invoices"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(value);
                    handleInvoiceCountChange(value);
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
                  <TableHead>Supplier GSTN</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Upload Invoice</TableHead>
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
                        name={`supplierDetails.clearance.invoices.${index}.supplierGSTN`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="eg. 27AABCU9603R1ZM"
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
                        name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="eg. INV123"
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
                        name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceDate`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline">
                                    {field.value
                                      ? format(field.value, "PPPP")
                                      : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceValueWithGST`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="eg. 5000"
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
                        name={`supplierDetails.clearance.invoices.${index}.supplierInvoiceValueWithOutGST`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="eg. 4500"
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
                        name={`supplierDetails.clearance.invoices.${index}.clearanceSupplierInvoiceUrl`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              type="file"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                              }
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
        )}
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-4 gap-3">
        {/* Actual Supplier Details */}
        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. Actual Supplier Inc."
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierInvoiceValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Invoice Value</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. 6000"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierInvoiceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Actual Supplier Invoice</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="supplierDetails.actual.shippingBillUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Bill URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. http://example.com/shipping-bill.pdf"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
