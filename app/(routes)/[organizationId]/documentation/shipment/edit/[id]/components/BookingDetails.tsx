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
  prices?: {
    variantName?: string;
    variantType?: string;
    sellPrice?: number;
    buyPrice?: number;
    _id?: string;
  }[];
  netWeight?: number;
  grossWeight?: number;
  cubicMeasurement?: number;
}

interface ProductDetails {
  _id?: string;
  productId?: string;
  code: string;
  description: string;
  unitOfMeasurements: string;
  countryOfOrigin: string;
  HScode?: string;
  prices?: {
    variantName?: string;
    variantType?: string;
    sellPrice?: number;
    buyPrice?: number;
    _id?: string;
  }[];
  netWeight?: number;
  grossWeight?: number;
  cubicMeasurement?: number;
}

interface BookingDetailsProps {
  shipmentId: string;
  orgId?: string;
  saveProgress: (data: any) => void;
  onSectionSubmit: () => Promise<void>;
  onProductDetailsOpenChange?: Dispatch<SetStateAction<boolean>>;
}

interface ProductDetailsSubTableProps {
  productId: string;
  fetchProductDetails: (productId: string) => Promise<ProductDetails | null>;
  onEdit: () => void;
}

export function BookingDetails({
  shipmentId,
  orgId,
  saveProgress,
  onSectionSubmit,
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

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "bookingDetails.containers",
  });

  // Watch form values with fallback
  const formValues = watch("bookingDetails") || {};
  const containers = formValues.containers || [];

  // Fetch booking details on mount
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!orgId || !shipmentId) return;
      setIsLoading(true);
      try {
        const orgIdToUse = orgId || "674b0a687d4f4b21c6c980ba";
        const response = await fetch(
          `https://incodocs-server.onrender.com/shipment/bookingdetails/get/${orgIdToUse}/${shipmentId}`
        );
        if (!response.ok) throw new Error("Failed to fetch booking details");
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setValue(
            "bookingDetails",
            {
              invoiceNumber: data.invoiceNumber || "",
              bookingNumber: data.bookingNumber || "",
              portOfLoading: data.portOfLoading || "",
              destinationPort: data.destinationPort || "",
              vesselSailingDate: data.vesselSailingDate || undefined,
              vesselArrivingDate: data.vesselArrivingDate || undefined,
              numberOfContainer: data.containers?.length || 0,
              containers:
                data.containers?.map((container: any) => ({
                  containerNumber: container.containerNumber || "",
                  truckNumber: container.truckNumber || "",
                  truckDriverContactNumber:
                    container.truckDriverContactNumber || undefined,
                  addProductDetails: container.addProductDetails || [],
                })) || [],
            },
            { shouldDirty: false }
          );
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingDetails();
  }, [orgId, shipmentId, setValue]);

  // Autosave form data when bookingDetails changes
  useEffect(() => {
    if (formValues && !isLoading) {
      saveProgress({ bookingDetails: formValues });
    }
  }, [formValues, saveProgress, isLoading]);

  // Initialize numberOfContainer based on containers length
  useEffect(() => {
    if (containers.length > 0 && !formValues.numberOfContainer) {
      setValue("bookingDetails.numberOfContainer", containers.length, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [containers, formValues.numberOfContainer, setValue]);

  // Fetch product details using API
  const fetchProductDetails = useCallback(
    async (productId: string): Promise<ProductDetails | null> => {
      if (productDetailsCache[productId]) {
        return productDetailsCache[productId];
      }
      try {
        console.log("Fetching product details for:", productId);
        const response = await fetch(
          `https://incodocs-server.onrender.com/shipment/productdetails/get/${productId}`
        );
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();
        console.log("Product details API response:", data);
        const productDetails: ProductDetails = {
          _id: data._id,
          productId: data._id,
          code: data.code || "",
          description: data.description || "",
          unitOfMeasurements: data.unitOfMeasurements || "",
          countryOfOrigin: data.countryOfOrigin || "",
          HScode: data.HScode || "",
          prices:
            data.prices?.map((price: any) => ({
              variantName: price.variantName || "",
              variantType: price.variantType || price.varianntType || "",
              sellPrice: price.sellPrice || undefined,
              buyPrice: price.buyPrice || undefined,
              _id: price._id || undefined,
            })) || [],
          netWeight: data.netWeight || undefined,
          grossWeight: data.grossWeight || undefined,
          cubicMeasurement: data.cubicMeasurement || undefined,
        };
        console.log("Mapped productDetails:", productDetails);
        setProductDetailsCache((prev) => ({
          ...prev,
          [productId]: productDetails,
        }));
        return productDetails;
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
        return null;
      }
    },
    [productDetailsCache]
  );

  // Handle Container Count Change
  const handleContainerCountChange = (value: number | undefined) => {
    if (value === undefined || isNaN(value) || value < 0) {
      setValue("bookingDetails.numberOfContainer", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("bookingDetails.containers", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      replace([]);
      return;
    }
    setValue("bookingDetails.numberOfContainer", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const currentContainers = containers || [];
    if (value > currentContainers.length) {
      const newContainers = Array(value - currentContainers.length)
        .fill(null)
        .map(() => ({
          containerNumber: "",
          truckNumber: "",
          truckDriverContactNumber: undefined,
          addProductDetails: [],
        }));
      append(newContainers);
    } else if (value < currentContainers.length) {
      for (let i = currentContainers.length - 1; i >= value; i--) {
        remove(i);
      }
    }
  };

  // Handle delete container
  const handleDelete = (index: number) => {
    remove(index);
    setValue(
      "bookingDetails.numberOfContainer",
      fields.length - 1 || undefined,
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
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
    const productId = data.productId || crypto.randomUUID();

    const updatedContainers = [...currentContainers];
    updatedContainers[containerIndex] = {
      ...updatedContainers[containerIndex],
      addProductDetails: [
        {
          productId,
          code: data.code,
          description: data.description,
          unitOfMeasurements: data.unitOfMeasurements || "",
          countryOfOrigin: data.countryOfOrigin || "",
          HScode: data.HScode,
          prices: data.prices || [],
          netWeight: data.netWeight,
          grossWeight: data.grossWeight,
          cubicMeasurement: data.cubicMeasurement,
        },
      ],
    };

    setValue("bookingDetails.containers", updatedContainers, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const productDetails: ProductDetails = {
      productId,
      code: data.code,
      description: data.description,
      unitOfMeasurements: data.unitOfMeasurements || "",
      countryOfOrigin: data.countryOfOrigin || "",
      HScode: data.HScode,
      prices: data.prices || [],
      netWeight: data.netWeight,
      grossWeight: data.grossWeight,
      cubicMeasurement: data.cubicMeasurement,
    };

    // Update cache with new product details
    setProductDetailsCache((prev) => ({
      ...prev,
      [productId]: productDetails,
    }));

    // Trigger autosave
    saveProgress({ bookingDetails: getValues().bookingDetails });
  };

  // Prepare initial values for EditProductDetailsForm
  const getInitialValues = (index: number): AddProductDetails => {
    const product = containers?.[index]?.addProductDetails?.[0];
    const cachedProduct = product?.productId
      ? productDetailsCache[product.productId]
      : null;

    // Prefer cached API data if available, fallback to container data
    if (cachedProduct) {
      console.log("Using cached product for initialValues:", cachedProduct);
      return {
        productId: cachedProduct.productId || "",
        code: cachedProduct.code || "",
        description: cachedProduct.description || "",
        unitOfMeasurements: cachedProduct.unitOfMeasurements || "",
        countryOfOrigin: cachedProduct.countryOfOrigin || "",
        HScode: cachedProduct.HScode || "",
        prices: cachedProduct.prices || [
          {
            variantName: "",
            variantType: "",
            sellPrice: undefined,
            buyPrice: undefined,
          },
        ],
        netWeight: cachedProduct.netWeight,
        grossWeight: cachedProduct.grossWeight,
        cubicMeasurement: cachedProduct.cubicMeasurement,
      };
    }

    // Fallback to container data
    console.log("Using container product for initialValues:", product);
    return product
      ? {
          productId: product.productId || "",
          code: product.code || "",
          description: product.description || "",
          unitOfMeasurements: product.unitOfMeasurements || "",
          countryOfOrigin: product.countryOfOrigin || "",
          HScode: product.HScode || "",
          prices: product.prices || [
            {
              variantName: "",
              variantType: "",
              sellPrice: undefined,
              buyPrice: undefined,
            },
          ],
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
          prices: [
            {
              variantName: "",
              variantType: "",
              sellPrice: undefined,
              buyPrice: undefined,
            },
          ],
          netWeight: undefined,
          grossWeight: undefined,
          cubicMeasurement: undefined,
        };
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
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
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
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
                    handleContainerCountChange(undefined);
                    return;
                  }
                  const numericValue = Math.max(0, Number(value));
                  field.onChange(numericValue);
                  handleContainerCountChange(numericValue);
                }}
                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                        disabled={
                          !containers?.[index]?.addProductDetails?.length ||
                          isLoading
                        }
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
                        disabled={isLoading}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRow === index &&
                    containers?.[index]?.addProductDetails?.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <ProductDetailsSubTable
                            productId={
                              containers[index].addProductDetails[0]
                                .productId ||
                              containers[index].addProductDetails[0]._id ||
                              ""
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

function ProductDetailsSubTable({
  productId,
  fetchProductDetails,
  onEdit,
}: ProductDetailsSubTableProps) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await fetchProductDetails(productId);
      console.log("Product in sub-table:", data);
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

  const price = product.prices?.[0] || {};

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
          <TableCell>{price.variantName || "N/A"}</TableCell>
          <TableCell>{price.variantType || "N/A"}</TableCell>
          <TableCell>{price.sellPrice ?? "N/A"}</TableCell>
          <TableCell>{price.buyPrice ?? "N/A"}</TableCell>
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
