"use client";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useGlobalModal } from "@/hooks/GlobalModal";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { SaveDetailsProps } from "./BookingDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import SupplierForm from "@/components/forms/Addsupplierform";
import EntityCombobox from "@/components/ui/EntityCombobox";

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

export function SupplierDetails({ saveProgress }: SaveDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const invoicesFromForm = watch("supplierDetails.clearance.invoices") || [];
  const [invoices, setInvoices] = useState<any[]>(invoicesFromForm);
  const [uploading, setUploading] = useState(false);
  const [supplierNames, setSupplierNames] = useState<{ _id: string; name: string }[]>([]);
  const [shippingBills, setShippingBills] = useState<{ _id: string; name: string }[]>([]);
  const GlobalModal = useGlobalModal();

  // Fetch supplier names and shipping bills
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierResponse = await fetch(
          "http://localhost:4080/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba"
        );
        const supplierData = await supplierResponse.json();
        // Map API data to match Entity interface
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.name,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };
    fetchData();
    // Placeholder for shipping bills until API is provided, updated to use _id
    setShippingBills([
      { _id: "1", name: "Bill 1" },
      { _id: "2", name: "Bill 2" },
    ]);
  }, []);

  const handleDelete = (index: number) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    setValue("supplierDetails.clearance.invoices", updatedInvoices);
    setValue("supplierDetails.clearance.noOfInvoices", updatedInvoices.length);
    saveProgressSilently(getValues());
  };

  const handleInvoiceNumberCountChange = (value: string) => {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const currentInvoices = watch("supplierDetails.clearance.invoices") || [];
      const newInvoices = Array.from({ length: count }, (_, i) =>
        currentInvoices[i] || {
          supplierGSTN: "",
          supplierInvoiceNumber: "",
          supplierInvoiceDate: "",
          supplierInvoiceValueWithGST: "",
          supplierInvoiceValueWithOutGST: "",
          clearanceSupplierInvoiceUrl: "",
        }
      );
      setInvoices(newInvoices);
      setValue("supplierDetails.clearance.invoices", newInvoices);
      setValue("supplierDetails.clearance.noOfInvoices", newInvoices.length);
      saveProgressSilently(getValues());
    } else {
      setInvoices([]);
      setValue("supplierDetails.clearance.invoices", []);
      setValue("supplierDetails.clearance.noOfInvoices", 0);
      saveProgressSilently(getValues());
    }
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:4080/shipmentdocsfile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const storageUrl = data.storageLink;
      setValue(fieldName, storageUrl);
      saveProgressSilently(getValues());
    } catch (error) {
      alert("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const openSupplierForm = () => {
    GlobalModal.title = "Add New Supplier";
    GlobalModal.children = (
      <SupplierForm
        onSuccess={() => {
          fetch("http://localhost:4080/shipment/supplier/getbyorg/674b0a687d4f4b21c6c980ba")
            .then((res) => res.json())
            .then((data) => {
              const mappedSuppliers = data.map((supplier: any) => ({
                _id: supplier._id,
                name: supplier.name,
              }));
              setSupplierNames(mappedSuppliers);
            });
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div>
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

        {/* Number of Supplier Invoices */}
        <FormField
          control={control}
          name="supplierDetails.clearance.noOfInvoices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Supplier Invoices</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of Supplier Invoices"
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value < 0) return;
                    field.onChange(value);
                    handleInvoiceNumberCountChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {invoices.length > 0 && (
          <div className="col-span-4 overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Supplier GSTIN</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Upload Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value With GST</TableHead>
                  <TableHead>Value Without GST</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((_: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].supplierGSTN`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="e.g., GSTIN456"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceNumber`}
                        render={({ field }) => (
                          <FormControl>
                            <Input
                              placeholder="e.g., INV789"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
                            />
                          </FormControl>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].clearanceSupplierInvoiceUrl`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      handleFileUpload(
                                        file,
                                        `supplierDetails.clearance.invoices[${index}].clearanceSupplierInvoiceUrl`
                                      );
                                  }}
                                  disabled={uploading}
                                />
                                <Button
                                  variant="secondary"
                                  className="bg-blue-500 text-white"
                                  disabled={uploading}
                                >
                                  <UploadCloud className="w-5 h-5 mr-2" />
                                  {uploading ? "Uploading..." : "Upload"}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceDate`}
                        render={({ field }) => (
                          <FormItem>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline">
                                    {field.value
                                      ? format(new Date(field.value), "PPPP")
                                      : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => {
                                    field.onChange(date?.toISOString());
                                    saveProgressSilently(getValues());
                                  }}
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
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceValueWithGST`}
                        render={({ field }) => (
                          <Input
                            placeholder="e.g., 1000"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`supplierDetails.clearance.invoices[${index}].supplierInvoiceValueWithOutGST`}
                        render={({ field }) => (
                          <Input
                            placeholder="e.g., 900"
                            {...field}
                            onBlur={() => saveProgressSilently(getValues())}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => handleDelete(index)}
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
      <div className="text-xl font-bold my-3">
        <h2>Actual</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Actual Supplier Name */}
        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., ASI101"
                  className="uppercase"
                  {...field}
                  onBlur={() => saveProgressSilently(getValues())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Actual Supplier Invoice */}
        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierInvoiceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Invoice</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        handleFileUpload(file, "supplierDetails.actual.actualSupplierInvoiceUrl");
                    }}
                    disabled={uploading}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-blue-500 text-white"
                  disabled={uploading}
                >
                  <UploadCloud className="w-5 h-5 mr-2" />
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Actual Supplier Invoice Value */}
        <FormField
          control={control}
          name="supplierDetails.actual.actualSupplierInvoiceValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Supplier Invoice Value</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 1100"
                  {...field}
                  onBlur={() => saveProgressSilently(getValues())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Select Shipping Bill */}
        <FormField
          control={control}
          name="supplierDetails.actual.shippingBillUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Shipping Bill</FormLabel>
              <FormControl>
                <EntityCombobox
                  entities={shippingBills}
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                    saveProgressSilently(getValues());
                  }}
                  displayProperty="name"
                  placeholder="Select a Shipping Bill"
                  onAddNew={() => { }} // Placeholder; add functionality if needed
                  addNewLabel="Add New Shipping Bill" // Optional, can be removed if not needed
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Review */}
        <FormField
          control={control}
          name="supplierDetails.review"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Review</FormLabel>
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

        <div className="mt-2">
          <Button type="button" onClick={() => saveProgress(getValues())}>
            Save Progress
          </Button>
        </div>
      </div>
    </div>
  );
}