"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Search,
  Trash,
} from "lucide-react";
import { format } from "date-fns";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  customerName: z.string().optional(),
  customerAddress: z.string().optional(),
  customerId: z
    .object({
      _id: z.string(),
      name: z.string(),
    })
    .optional(),

  noOfSlabs: z
    .union([
      z.string().min(1, { message: "Enter number of slabs" }),
      z.number(),
    ])
    .optional(),

  saleDate: z
    .union([z.string().min(1, { message: "Enter date" }), z.date()])
    .optional(),

  factoryId: z
    .object({
      _id: z.string(),
      factoryName: z.string(),
    })
    .optional(),

  slabIds: z.array(z.any()).optional(),

  length: z
    .union([z.string().min(1, { message: "Enter length" }), z.number()])
    .optional(),

  height: z
    .union([z.string().min(1, { message: "Enter height" }), z.number()])
    .optional(),
  invoiceNo: z.string().optional(),
  actualInvoiceValue: z.number().optional(),
  invoiceValue: z.number().optional(),
  gstPercentage: z.string().optional(),
  paymentProof: z.string().optional(),
});

export default function EditSaleForm({
  polishedSlabs,
}: {
  polishedSlabs: any[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const [customerLoading, setCustomerLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<
    { address: string; _id: string; name: string }[]
  >([]);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const factoryId = params.factoryid as string;
  const organisationId = params.organizationId as string;
  const SlabId = searchParams.get("EditSalesId");
  const [slabsData, setSlabsData] = useState<any[]>([]);
  const [show, setShow] = React.useState(false);
  const type = searchParams.get("type");
  const [isWithGst, setIsGst] = useState(false);
  const [actual, setactual] = useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedSlabs, setSelectedSlabs] = React.useState<string[]>([]);
  const toggleSlab = (id: string) => {
    setSelectedSlabs((prev) =>
      prev.includes(id) ? prev.filter((slabId) => slabId !== id) : [...prev, id]
    );
  };
  const filteredSlabs = polishedSlabs.filter((slab) => {
    const slabNumber = slab?.slabNumber?.toString().toLowerCase() || "";
    const blockNumber = slab?.blockNumber?.toString().toLowerCase() || "";
    const materialType =
      slab?.blockId?.lotId?.materialType?.toLowerCase() || "";
    const query = search.toLowerCase();

    return (
      slabNumber.includes(query) ||
      blockNumber.includes(query) ||
      materialType.includes(query)
    );
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: {
        _id: "",
        name: "",
      },
      noOfSlabs: "",
      saleDate: "",
      factoryId: {
        _id: "",
        factoryName: "",
      },
      slabIds: [],
      length: "",
      height: "",
      invoiceNo: "",
      actualInvoiceValue: undefined,
      invoiceValue: undefined,
      gstPercentage: "0",
      paymentProof: "",
    },
  });
  React.useEffect(() => {
    const fetchingCustomers = async () => {
      try {
        setCustomerLoading(true);
        const customerResponse = await fetchData(
          `/accounting/customer/getbyfactory/${factoryId}`
        );
        const customerData = await customerResponse;

        const mappedCustomers = customerData.map((customer: any) => ({
          _id: customer._id,
          name: customer.customerName,
          address: customer.customerAddress, // <- include this
        }));
        setCustomers(mappedCustomers);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setCustomerLoading(false);
      }
    };

    fetchingCustomers();
  }, [customers]);

  // Fetch existing lot data and reset form values
  useEffect(() => {
    async function fetchSlabData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `https://incodocs-server.onrender.com/transaction/sale/getbyid/${SlabId}`
        );
        const data = response;
        setSlabsData(data.slabIds || []);
        if (data.actual === true) {
          setactual(true);
        }
        if (data.gstPercentage !== undefined && data.gstPercentage !== null) {
          setIsGst(true);
        }
        // Reset form with fetched values
        form.reset({
          customerId: {
            _id: data.customerId?._id || "",
            name: data.customerId?.customerName || "", // must match `displayProperty="name"`
          },
          noOfSlabs: data.noOfSlabs || "",
          paymentProof: data?.paymentProof || "",
          saleDate: data.saleDate || "",
          invoiceNo: data.invoiceNo || "",
          invoiceValue: data?.invoiceValue || undefined,
          actualInvoiceValue: data.actualInvoiceValue || undefined,
          factoryId: {
            _id: data.factoryId?._id || "",
            factoryName: data.factoryId?.factoryName || "",
          },
          gstPercentage:
            data?.gstPercentage !== undefined ? `${data.gstPercentage}` : "0",
        });
      } catch (error) {
        console.error("Error fetching sale data:", error);
        toast.error("Failed to fetch sale data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchSlabData();
  }, [SlabId]);

  const handleDeleteSlab = (slabId: string) => {
    setIsLoading(true);
    if (slabsData.length <= 1) {
      toast.error("At least one slab must be present in the sale.");
      setIsLoading(false);
      return;
    }
    GlobalModal.title = "Confirm Slab Deletion";
    GlobalModal.description =
      "Are you sure you want to remove this Slab? This action cannot be undone.";
    GlobalModal.children = (
      <div className="space-y-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            GlobalModal.onClose();
            setIsLoading(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setSlabsData((prev) => prev.filter((slab) => slab._id !== slabId));
            GlobalModal.onClose();
            setIsLoading(false);
          }}
        >
          Confirm
        </Button>
      </div>
    );
    GlobalModal.onOpen();
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const slabIdsFromSlabsData = slabsData.map((slab) => slab._id);
    const mergedSlabIds = Array.from(
      new Set([...slabIdsFromSlabsData, ...selectedSlabs])
    );
    const updatedValues = {
      ...values,
      noOfSlabs: mergedSlabIds.length || values.noOfSlabs,
      slabIds: mergedSlabIds,
    };

    GlobalModal.title = "Confirm Slab Update";
    GlobalModal.description = "Are you sure you want to update this Slab?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>customer Name: {updatedValues.customerId?.name}</p>
        <p>Number of Slabs: {updatedValues.noOfSlabs}</p>
        {isWithGst && <p>GST Percentage: {updatedValues.gstPercentage}%</p>}
        <p>
          Sale Date:{" "}
          {updatedValues.saleDate
            ? moment(
                new Date(updatedValues.saleDate).toLocaleDateString()
              ).format("DD MMM YYYY")
            : "N/A"}
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsLoading(false);
              GlobalModal.onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await putData(
                  `/transaction/sale/updateactualsale/${SlabId}`,
                  updatedValues
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Slab updated successfully");
                router.push(`./`);
              } catch (error) {
                console.error("Error updating Slab:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating Slab");
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
    GlobalModal.onOpen();
    setIsLoading(false);
  };

  const gstPercentage = form.watch("gstPercentage");

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="customerId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Customer</FormLabel>
                  <FormControl>
                    <EntityCombobox
                      entities={customers}
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : field.value?._id ?? ""
                      }
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      displayProperty="name"
                      valueProperty="_id"
                      placeholder="Select Customer"
                      onAddNew={() => {
                        window.open(
                          `/${organisationId}/${factoryId}/factorymanagement/parties/customer/createNew`,
                          "_blank"
                        );
                      }}
                      multiple={false}
                      addNewLabel="Add New Customer"
                      // disabled={isLoading || customerLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentProof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Proof</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="paymentProof"
                      storageKey="paymentProof"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!actual && (
              <FormField
                name="gstPercentage"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Percentage</FormLabel>
                    <FormControl>
                      <select
                        disabled={isLoading}
                        {...field}
                        className="block w-full border-slate-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 bg-transparent"
                      >
                        <option value="0">0%</option>
                        <option value="1">1%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {gstPercentage !== "0" && (
              <FormField
                name="noOfSlabs"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number Of Slabs</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of slabs"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined
                          )
                        }
                        min={0}
                        onWheel={(e) =>
                          e.target instanceof HTMLElement && e.target.blur()
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="invoiceNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No.</FormLabel>
                  <FormControl>
                    <Input
                      type="text  "
                      placeholder="Enter Invoice No."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={actual ? "actualInvoiceValue" : "invoiceValue"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="saleDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full">
                          {field.value ? (
                            format(new Date(field.value), "PPPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0 text-sm flex flex-col relative"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        startMonth={new Date(2010, 0)}
                        endMonth={new Date(2025, 11)}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString());
                        }}
                        captionLayout="dropdown"
                        classNames={{
                          caption: "flex justify-between items-center",
                          caption_label: "text-sm font-medium hidden",
                          dropdown: "border rounded p-0 text-xs",
                          months: "flex flex-col",
                        }}
                        className="bg-white p-4 rounded-xl shadow-md"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {actual && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slab Number</TableHead>
                  <TableHead>Block Number</TableHead>
                  <TableHead>Material Type</TableHead>
                  <TableHead className="text-right">Length</TableHead>
                  <TableHead className="text-right">Height</TableHead>
                  <TableHead className="text-right">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slabsData.map((slab: any) => (
                  <TableRow key={slab._id}>
                    <TableCell>{slab?.slabNumber || "N/A"}</TableCell>
                    <TableCell>{slab?.blockNumber || "N/A"}</TableCell>
                    <TableCell>
                      {slab?.blockId?.lotId?.materialType || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {slab?.dimensions?.length?.value || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {slab?.dimensions?.height?.value || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSlab(slab._id)}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {actual && (
            <div className="text-right">
              <Button
                type="button"
                variant="default"
                className="text-sm"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <>
                    Hide <ChevronUp />
                  </>
                ) : (
                  <>
                    Add More Slabs <ChevronDown />
                  </>
                )}
              </Button>
            </div>
          )}
          {show && (
            <div>
              <div className=" relative mb-4 w-1/3 flex justify-between items-center">
                <Input
                  type="text"
                  placeholder="Search by Slab, Block, or Material Type"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search size={14} className="absolute right-2 opacity-50" />
              </div>
              <Table>
                {filteredSlabs.length < 1 ? (
                  <TableCaption>No Slabs Available For Sale</TableCaption>
                ) : (
                  <TableCaption>List Of Your Slabs For Sale</TableCaption>
                )}
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Slab Number</TableHead>
                    <TableHead>Block Number</TableHead>
                    <TableHead>Material Type</TableHead>
                    <TableHead className="text-right">Length</TableHead>
                    <TableHead className="text-right">Height</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlabs.map((slab: any) => (
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={selectedSlabs.includes(slab._id)}
                          onCheckedChange={() => toggleSlab(slab._id)}
                        />
                      </TableCell>
                      <TableCell>{slab?.slabNumber || "N/A"}</TableCell>
                      <TableCell>{slab?.blockNumber || "N/A"}</TableCell>
                      <TableCell>
                        {slab?.blockId?.lotId?.materialType || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {slab?.dimensions?.length?.value || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {slab?.dimensions?.height?.value || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
