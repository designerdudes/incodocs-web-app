"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
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
import { CalendarIcon, Trash, ChevronDown, ChevronUp } from "lucide-react";
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
import EditProductDetailsForm from "@/components/forms/EditProductDetails";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";

interface AddProductDetails {
  productId?: string;
  code: string;
  description: string;
  unitOfMeasurements?: string;
  countryOfOrigin?: string;
  HScode: string;
  variantName?: string;
  varianntType?: string;
  sellPrice?: number;
  buyPrice?: number;
  netWeight?: number;
  grossWeight?: number;
  cubicMeasurement?: number;
}

interface ProductDetails {
  code: string;
  description: string;
  unitOfMeasurements: string;
  countryOfOrigin: string;
  HScode: string;
  prices: {
    variantName: string;
    varianntType: string;
    sellPrice: number;
    buyPrice: number;
  }[];
  netWeight: number;
  grossWeight: number;
  cubicMeasurement: number;
}

interface BookingDetailsProps {
  shipmentId: string;
  onProductDetailsOpenChange?: (open: boolean) => void;
}

export function BookingDetails({
  shipmentId,
  onProductDetailsOpenChange,
}: BookingDetailsProps) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [productDetailsCache, setProductDetailsCache] = useState<
    Record<string, ProductDetails>
  >({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bookingDetails.containers",
  });

  // Watch form values with fallback
  const formValues = watch("bookingDetails") || {};
  const containers = formValues.containers || [];

  // Autosave form data when bookingDetails changes
  useEffect(() => {
    if (formValues) {
      saveProgress({ bookingDetails: formValues });
    }
  }, [formValues, saveProgress]);

  // Fetch product details dynamically
  const fetchProductDetails = useCallback(async (productId: string) => {
    if (productDetailsCache[productId]) {
      return productDetailsCache[productId];
    }
    try {
      const response = await fetch(
        `http://localhost:4080/shipment/productdetails/get/${productId}`
      );
      if (!response.ok) throw new Error("Failed to fetch product details");
      const data: ProductDetails = await response.json();
      setProductDetailsCache((prev) => ({ ...prev, [productId]: data }));
      return data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details");
      return null;
    }
  }, [productDetailsCache]);

  // Handle Container Count Change
  const handleContainerCountChange = (value: number) => {
    if (isNaN(value) || value < 0) return;
    setValue("bookingDetails.numberOfContainer", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const currentContainers = formValues.containers || [];
    if (value > currentContainers.length) {
      const newContainers = Array(value - currentContainers.length)
        .fill(null)
        .map(() => ({
          containerNumber: "",
          truckNumber: "",
          truckDriverContactNumber: undefined,
          addProductDetails: [
            {
              productCategory: "",
              graniteAndMarble: "",
              tiles: {
                noOfBoxes: 0,
                noOfPiecesPerBoxes: 0,
                sizePerTile: {
                  length: { value: 0, units: "inch" },
                  breadth: { value: 0, units: "inch" },
                },
              },
              slabType: "",
              slabLength: { value: undefined, units: "inch" },
              slabBreadth: { value: undefined, units: "inch" },
              slabThickness: undefined,
              slabDocument: undefined,
            },
          ],
        }));
      append(newContainers);
    } else if (value < currentContainers.length) {
      setValue("bookingDetails.containers", currentContainers.slice(0, value), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Handle delete container
  const handleDelete = (index: number) => {
    remove(index);
    setValue("bookingDetails.numberOfContainer", fields.length - 1, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (expandedRow === index) setExpandedRow(null);
  };

  // Handle toggle product details
  const handleToggleProductDetails = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Handle edit product details
  const handleEditProductDetails = (index: number) => {
    setSelectedContainerIndex(index);
    setEditModalOpen(true);
    onProductDetailsOpenChange?.(true);
  };

  // Handle product details submission
  const handleProductDetailsSubmit = (
    data: AddProductDetails,
    containerIndex: number
  ) => {
    const currentValues = getValues();
    const currentContainers = currentValues.bookingDetails?.containers || [];
    const productId =
      data.productId ||
      currentContainers[containerIndex]?.addProductDetails?.[0]?.productId ||
      "6808de91c9a2b5ab721c95cd"; // Placeholder; replace with actual productId logic

    const updatedContainers = [...currentContainers];
    updatedContainers[containerIndex] = {
      ...updatedContainers[containerIndex],
      addProductDetails: [{ productId }],
    };

    setValue("bookingDetails.containers", updatedContainers, {
      shouldDirty: false,
      shouldValidate: false,
      shouldTouch: false,
    });

    // Map AddProductDetails to ProductDetails for caching
    const productDetails: ProductDetails = {
      code: data.code,
      description: data.description,
      unitOfMeasurements: data.unitOfMeasurements || "",
      countryOfOrigin: data.countryOfOrigin || "",
      HScode: data.HScode,
      prices: [
        {
          variantName: data.variantName || "",
          varianntType: data.varianntType || "",
          sellPrice: data.sellPrice || 0,
          buyPrice: data.buyPrice || 0,
        },
      ],
      netWeight: data.netWeight || 0,
      grossWeight: data.grossWeight || 0,
      cubicMeasurement: data.cubicMeasurement || 0,
    };

    // Cache the product details
    setProductDetailsCache((prev) => ({
      ...prev,
      [productId]: productDetails,
    }));
  };

  // Prepare initial values for EditProductDetailsForm
  const getInitialValues = (index: number): AddProductDetails => {
    const productId = containers?.[index]?.addProductDetails?.[0]?.productId;
    const product = productId ? productDetailsCache[productId] : null;
    return (
      product
        ? {
            productId,
            code: product.code,
            description: product.description,
            unitOfMeasurements: product.unitOfMeasurements,
            countryOfOrigin: product.countryOfOrigin,
            HScode: product.HScode,
            variantName: product.prices[0]?.variantName,
            varianntType: product.prices[0]?.varianntType,
            sellPrice: product.prices[0]?.sellPrice,
            buyPrice: product.prices[0]?.buyPrice,
            netWeight: product.netWeight,
            grossWeight: product.grossWeight,
            cubicMeasurement: product.cubicMeasurement,
          }
        : {
            code: "",
            description: "",
            unitOfMeasurements: "",
            countryOfOrigin: "",
            HScode: "",
            variantName: "",
            varianntType: "",
            sellPrice: 0,
            buyPrice: 0,
            netWeight: 0,
            grossWeight: 0,
            cubicMeasurement: 0,
          }
    );
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
                placeholder="e.g., 99808541234"
                className="uppercase"
                {...field}
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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
            <FormControl>
              <Input
                placeholder="e.g., CHENNAI"
                className="uppercase"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
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
            <FormControl>
              <Input
                placeholder="e.g., UMM QASAR"
                className="uppercase"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
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
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString())}
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
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString())}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bookingDetails.numberOfContainer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Containers</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of containers"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(undefined);
                    handleContainerCountChange(0);
                    return;
                  }
                  const numericValue = Math.max(0, Number(value));
                  field.onChange(numericValue);
                  handleContainerCountChange(numericValue);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {fields.length > 0 && (
        <div className="col-span-4 overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Container Number</TableHead>
                <TableHead>Truck Number</TableHead>
                <TableHead>Truck Driver Contact</TableHead>
                <TableHead>Product Details</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
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
                                value={field.value ?? ""}
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
                                value={field.value ?? ""}
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
                                placeholder="e.g., 7702791728"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleToggleProductDetails(index)}
                        disabled={!containers?.[index]?.addProductDetails?.[0]?.productId}
                      >
                        {expandedRow === index ? (
                          <>
                            Hide Product Details
                            <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Show Product Details
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
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
                  {expandedRow === index &&
                    containers?.[index]?.addProductDetails?.[0]?.productId && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <ProductDetailsSubTable
                            productId={
                              containers[index].addProductDetails[0].productId
                            }
                            fetchProductDetails={fetchProductDetails}
                            onEdit={() => handleEditProductDetails(index)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedContainerIndex !== null && (
        <EditProductDetailsForm
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open);
            onProductDetailsOpenChange?.(open);
            if (!open) setSelectedContainerIndex(null);
          }}
          containerIndex={selectedContainerIndex}
          initialValues={getInitialValues(selectedContainerIndex)}
          onSubmit={handleProductDetailsSubmit}
        />
      )}
    </div>
  );
}

// Sub-component for product details sub-table
interface ProductDetailsSubTableProps {
  productId: string;
  fetchProductDetails: (productId: string) => Promise<ProductDetails | null>;
  onEdit: () => void;
}

function ProductDetailsSubTable({
  productId,
  fetchProductDetails,
  onEdit,
}: ProductDetailsSubTableProps) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      const data = await fetchProductDetails(productId);
      setProduct(data);
      setLoading(false);
    };
    loadProductDetails();
  }, [productId, fetchProductDetails]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (!product) {
    return <div>Failed to load product details.</div>;
  }

  const variant = product.prices[0] || {
    variantName: "N/A",
    varianntType: "N/A",
    sellPrice: 0,
    buyPrice: 0,
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Unit of Measurement</TableHead>
          <TableHead>Country of Origin</TableHead>
          <TableHead>HS Code</TableHead>
          <TableHead>Variant Name</TableHead>
          <TableHead>Variant Type</TableHead>
          <TableHead>Sell Price</TableHead>
          <TableHead>Buy Price</TableHead>
          <TableHead>Net Weight</TableHead>
          <TableHead>Gross Weight</TableHead>
          <TableHead>Cubic Measurement</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{product.code || "N/A"}</TableCell>
          <TableCell>{product.description || "N/A"}</TableCell>
          <TableCell>{product.unitOfMeasurements || "N/A"}</TableCell>
          <TableCell>{product.countryOfOrigin || "N/A"}</TableCell>
          <TableCell>{product.HScode || "N/A"}</TableCell>
          <TableCell>{variant.variantName}</TableCell>
          <TableCell>{variant.varianntType}</TableCell>
          <TableCell>{variant.sellPrice}</TableCell>
          <TableCell>{variant.buyPrice}</TableCell>
          <TableCell>{product.netWeight ?? "N/A"}</TableCell>
          <TableCell>{product.grossWeight ?? "N/A"}</TableCell>
          <TableCell>{product.cubicMeasurement ?? "N/A"}</TableCell>
          <TableCell>
            <Button type="button" variant="secondary" onClick={onEdit}>
              Edit Product
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}