"use client";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import toast from "react-hot-toast";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { containerTypes } from "../data/formSchema";
import { fetchData } from "@/axiosUtility/api";
import { AddContainerTypeModal } from "./AddContainerTypeModal";
import { Textarea } from "@/components/ui/textarea";
import ProductFormPage from "@/components/forms/AddProductForm";
// import { CalendarDay } from "react-day-picker";
import CalendarComponent from "@/components/CalendarComponent";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface SaveDetailsProps {
  saveProgress: (data: any) => void;
}

interface BookingDetailsProps extends SaveDetailsProps {
  onSectionSubmit: () => void;
  setInvoiceNumber: (val: string) => void;
  params: string | string[];
}

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

type Port = {
  _id: string;
  port: string;
};

export function BookingDetails({
  saveProgress,
  onSectionSubmit,
  setInvoiceNumber,
  params,
}: BookingDetailsProps) {
  const { control, setValue, watch, getValues, register } = useFormContext();
  const containersFromForm = watch("bookingDetails.containers") || [];
  const GlobalModal = useGlobalModal();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [containerCountToBeDeleted, setContainerCountToBeDeleted] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customContainerTypes, setCustomContainerTypes] =
    useState(containerTypes);
  const invoiceNumber = watch("bookingDetails.invoiceNumber");
  const organizationId = Array.isArray(params) ? params[0] : params;
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(1);
  const [ports, setPorts] = useState<Port[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 300;
  const [destOpen, setDestOpen] = useState(false);
  const [destinationPorts, setDestinationPorts] = useState<Port[]>([]);
  const [destPage, setDestPage] = useState(1);
  const [destHasMore, setDestHasMore] = useState(true);
  const [destLoading, setDestLoading] = useState(false);

  useEffect(() => {
    if (invoiceNumber) {
      setInvoiceNumber(invoiceNumber);
    }
  }, [invoiceNumber, setInvoiceNumber]);

  // Combine default and custom container types
  const containerTypeEntities = customContainerTypes.map((type) => ({
    _id: type.value,
    label: type.label,
    category: type.category,
  }));

  const handleAddContainerType = (data: {
    value: string;
    label: string;
    category: string;
  }) => {
    if (customContainerTypes.some((type) => type.value === data.value)) {
      toast.error("Container type value must be unique");
      return;
    }
    const newContainerType = {
      value: data.value,
      label: data.label,
      category: data.category,
    };
    setCustomContainerTypes([...customContainerTypes, newContainerType]);
    setValue(`bookingDetails.containers[0].containerType`, data.value);
    saveProgressSilently(getValues());
  };

  useEffect(() => {
    setValue("bookingDetails.containers", containersFromForm);
    setValue("NumberOfContainer", containersFromForm.length);
  }, []);

  const handleDelete = (index: number) => {
    const updatedContainers = containersFromForm.filter(
      (_: any, i: number) => i !== index
    );
    setValue("bookingDetails.containers", updatedContainers);
    setValue("NumberOfContainer", updatedContainers.length);
    saveProgressSilently(getValues());
  };

  const handleContainerCountChange = (value: string) => {
    const newCount = Number(value) || 1;

    if (newCount < containersFromForm.length) {
      setShowConfirmation(true);
      setContainerCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "bookingDetails.containers",
        createNewItem: () => ({
          containerNumber: "",
          truckNumber: "",
          truckDriverContactNumber: "",
          addProductDetails: [],
          containerType: "",
        }),
        customFieldSetters: {
          "bookingDetails.containers": (items, setValue) => {
            setValue("NumberOfContainer", items.length);
          },
        },
        saveCallback: saveProgressSilently,
      });
    }
  };

  const handleConfirmChange = () => {
    if (containerCountToBeDeleted !== null) {
      const updatedContainers = containersFromForm.slice(
        0,
        containerCountToBeDeleted
      );
      setValue("bookingDetails.containers", updatedContainers);
      setValue("NumberOfContainer", updatedContainers.length);
      saveProgressSilently(getValues());
      setContainerCountToBeDeleted(null);
    }
    setShowConfirmation(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ProductsResponse = await fetchData(
          `https://incodocs-server.onrender.com/shipment/productdetails/getbyorg/${organizationId}`
        );
        const ProductsData = ProductsResponse;
        const mappedProduct = ProductsData.map((product: any) => {
          const stoneName =
            product?.tileDetails?.stoneName ||
            product?.slabDetails?.stoneName ||
            product?.stepRiserDetails?.stoneName;

          return {
            _id: product._id,
            code: product.productType,
            description: stoneName,
            name: product.productType + ": " + stoneName,
          };
        });
        setProducts(mappedProduct);
      } catch (error) {
        console.error("Error fetching Product Data:", error);
      }
    };
    fetchProducts();
  }, [products]);

  const fetchPorts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const page = pageRef.current;
      // console.log("Fetching page:", page);
      const res = await fetchData(
        `/shipment/port/get?limit=${limit}&page=${page}`
      );
      const newPorts: Port[] = res.data || [];
      // Prevent duplicates
      setPorts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const unique = newPorts.filter((p) => !existingIds.has(p._id));
        return [...prev, ...unique];
      });
      if (newPorts.length < limit) {
        setHasMore(false);
      } else {
        pageRef.current += 1;
      }
    } catch (err) {
      console.error("Error fetching ports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestPorts = async () => {
    if (destLoading) return;
    setDestLoading(true);
    try {
      const res = await fetchData(
        `/shipment/port/get?limit=${limit}&page=${destPage}`
      );
      const newPorts: Port[] = res.data || [];
      setDestinationPorts((prev) => [...prev, ...newPorts]);
      setDestPage((prev) => prev + 1);
      if (newPorts.length < 20) {
        setDestHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch destination ports", error);
    } finally {
      setDestLoading(false);
    }
  };

  useEffect(() => {
    fetchPorts();
    fetchDestPorts();
  }, []);

  const openProductForm = () => {
    GlobalModal.title = "Add New Product";
    GlobalModal.description = "Fill in the details to create a new product.";
    GlobalModal.children = (
      <ProductFormPage
        orgId={organizationId}
        onSuccess={async () => {
          try {
            const ProductsResponse = await fetchData(
              "/shipment/productdetails/get"
            );
            const ProductsData = await ProductsResponse;
            const mappedProduct = ProductsData.map((product: any) => {
              const stoneName =
                product?.tileDetails?.stoneName ||
                product?.slabDetails?.stoneName ||
                product?.stepRiserDetails?.stoneName;

              return {
                _id: product._id,
                code: product.productType,
                description: stoneName,
                name: product.productType + ": " + stoneName,
              };
            });
            setProducts(mappedProduct || []);
            saveProgressSilently(getValues());
            toast.success("Product created successfully");
          } catch (error) {
            console.error("Error refreshing products:", error);
            toast.error("Failed to refresh product list");
          }
          GlobalModal.onClose();
        }}
      />
    );
    GlobalModal.onOpen();
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      <FormField
        control={control}
        name="bookingDetails.invoiceNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice Number</FormLabel>
            <FormControl>
              <Input
                {...register("bookingDetails.invoiceNumber")}
                placeholder="e.g., 99808541234"
                className="uppercase"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bookingDetails.bookingNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Booking Number</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., MRKU6998040"
                className="uppercase"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bookingDetails.portOfLoading"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Port of Loading</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "flex h-10 w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || "Select a port"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="min-w-2/3 max-w-2/3 p-0">
                <Command>
                  <CommandInput placeholder="Search port..." />
                  <CommandList
                    className="max-h-60 overflow-auto"
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      if (
                        el.scrollTop + el.clientHeight >=
                          el.scrollHeight - 10 &&
                        hasMore &&
                        !loading
                      ) {
                        fetchPorts();
                      }
                    }}
                  >
                    <CommandEmpty>No port found.</CommandEmpty>
                    <CommandGroup>
                      {ports.map((port) => (
                        <CommandItem
                          key={port._id}
                          value={port.port}
                          onSelect={(val) => {
                            field.onChange(val.toUpperCase());
                            setOpen(false);
                            saveProgressSilently(getValues());
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === port.port
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {port.port}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bookingDetails.destinationPort"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination Port</FormLabel>
            <Popover open={destOpen} onOpenChange={setDestOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={destOpen}
                  className={cn(
                    "flex h-10 w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || "Select a port"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="min-w-2/3 max-w-2/3 p-0">
                <Command>
                  <CommandInput placeholder="Search port..." />
                  <CommandList
                    className="max-h-60 overflow-auto"
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      if (
                        el.scrollTop + el.clientHeight >=
                          el.scrollHeight - 10 &&
                        destHasMore &&
                        !destLoading
                      ) {
                        fetchDestPorts(); // fetches more ports on scroll
                      }
                    }}
                  >
                    <CommandEmpty>No port found.</CommandEmpty>
                    <CommandGroup>
                      {destinationPorts.map((port) => (
                        <CommandItem
                          key={port._id}
                          value={port.port}
                          onSelect={(val) => {
                            field.onChange(val.toUpperCase());
                            setDestOpen(false);
                            saveProgressSilently(getValues());
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === port.port
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {port.port}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bookingDetails.vesselSailingDate"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Vessel Sailing Date</FormLabel>
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
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date: any) => {
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
      <FormField
        control={control}
        name="bookingDetails.vesselArrivingDate"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Vessel Arriving Date</FormLabel>
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
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
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
      <FormField
        control={control}
        name="NumberOfContainer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Containers</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of containers"
                value={field.value || 1}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(1);
                    handleContainerCountChange("1");
                    return;
                  }
                  const numericValue = Number(value);
                  field.onChange(numericValue.toString());
                  handleContainerCountChange(numericValue.toString());
                }}
                min={1}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {containersFromForm.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Container Type</TableHead>
                <TableHead>Container Number</TableHead>
                <TableHead>Truck Number</TableHead>
                <TableHead>Truck Driver Contact</TableHead>
                <TableHead>Product Details</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containersFromForm.map((container: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].containerType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EntityCombobox
                              entities={containerTypeEntities}
                              value={field.value || ""}
                              onChange={(value) => {
                                field.onChange(value);
                                saveProgressSilently(getValues());
                              }}
                              displayProperty="label"
                              valueProperty="_id"
                              placeholder="Select container type"
                              onAddNew={() => setIsModalOpen(true)}
                              addNewLabel="Add New Container Type"
                              multiple={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].containerNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., 7858784698986"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].truckNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., BH 08 5280"
                              {...field}
                              onBlur={() => saveProgressSilently(getValues())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].truckDriverContactNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="e.g.,+91 1234567891"
                              {...field}
                              // value={field.value || ""}
                              // onChange={(e) =>
                              //   field.onChange(
                              //     e.target.value ? Number(e.target.value) : ""
                              //   )
                              // }
                              onBlur={() => saveProgressSilently(getValues())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`bookingDetails.containers[${index}].addProductDetails`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <EntityCombobox
                              entities={products}
                              value={field.value || ""}
                              onChange={(value) => {
                                field.onChange(value);
                                saveProgressSilently(getValues());
                              }}
                              displayProperty="name"
                              valueProperty="_id"
                              placeholder="Select Product"
                              onAddNew={openProductForm}
                              multiple={true}
                              addNewLabel="Add New Product"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <Button
                      type="button"
                      variant="secondary"
                      onClick={() => openProductForm(index)}
                      className="mb-2"
                    >
                      Add Product
                    </Button>
                    {container.addProductDetails?.length > 0 ? (
                      <ScrollArea className="h-32">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Code</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>HS Code</TableHead>
                              <TableHead>Net Weight</TableHead>
                              <TableHead>Gross Weight</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader> 
                          <TableBody>
                            {container.addProductDetails.map((productId: string) => {
                              const product = productsCache.find(
                                (p) => p._id === productId
                              );
                              return (
                                <TableRow key={productId}>
                                  <TableCell>
                                    {product ? product.code : "Loading..."}
                                  </TableCell>
                                  <TableCell>
                                    {product ? product.dscription : "Loading..."}
                                  </TableCell>
                                  <TableCell>
                                    {product ? product.HScode : "Loading..."}
                                  </TableCell>
                                  <TableCell>
                                    {product ? `${product.netWeight} kg` : "Loading..."}
                                  </TableCell>
                                  <TableCell>
                                    {product ? `${product.grossWeight} kg` : "Loading..."}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeProduct(index, productId)}
                                    >
                                      <Trash size={16} />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    ) : (
                      <p className="text-gray-500">No products added</p>
                    )} */}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <FormField
        control={control}
        name="bookingDetails.review"
        render={({ field }) => (
          <FormItem className="col-span-4 mt-4">
            <FormLabel>Remarks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., this is some random comment for booking details"
                {...field}
                onBlur={() => saveProgressSilently(getValues())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AddContainerTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddContainerType}
      />
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmChange}
        title="Are you sure?"
        description="You are reducing the number of containers. This action cannot be undone."
      />
    </div>
  );
}
