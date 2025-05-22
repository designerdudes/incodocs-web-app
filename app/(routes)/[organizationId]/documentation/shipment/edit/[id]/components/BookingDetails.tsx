"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { CalendarIcon, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { fetchData } from "@/axiosUtility/api";
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
import EditProductDetails from "@/components/forms/EditProductDetails";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";
import { EditContainerTypeModal } from "./EditContainerTypeModal";
import { containerTypes } from "../data/schema";
import EntityCombobox from "@/components/ui/EntityCombobox";
import { Textarea } from "@/components/ui/textarea";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useGlobalModal } from "@/hooks/GlobalModal";
import CalendarComponent from "@/components/CalendarComponent";

interface AddProductDetails {
  productId?: string;
  code: string;
  HScode: string;
  description: string;
  unitOfMeasurements: string;
  countryOfOrigin: string;
  prices: {
    variantName: string;
    variantType: string;
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
  unitOfMeasurements?: string;
  countryOfOrigin?: string;
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
  const containersFromForm = watch("bookingDetails.containers") || [];
  const [editModalOpen, setEditModalOpen] = useState(false);
  const GlobalModal = useGlobalModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<
    number | null
  >(null);
  const [containerCountToBeDeleted, setContainerCountToBeDeleted] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [customContainerTypes, setCustomContainerTypes] =
    useState(containerTypes);
  const [productDetailsCache, setProductDetailsCache] = useState<
    Record<string, ProductDetails>
  >({});
  const [products, setProducts] = useState<any[]>([]);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "bookingDetails.containers",
  });

  // Watch form values with fallback
  const formValues = watch("bookingDetails") || {};
  const containers = formValues.containers || [];

  // Combine default and custom container types
  const containerTypeEntities = customContainerTypes.map((type: any) => ({
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

  const handleConfirmChange = () => {
    if (containerCountToBeDeleted !== null) {
      const updatedContainers = containersFromForm.slice(
        0,
        containerCountToBeDeleted
      );
      setValue("bookingDetails.containers", updatedContainers);
      setValue("bookingDetails.numberOfContainer", updatedContainers.length);
      saveProgressSilently(getValues());
      setContainerCountToBeDeleted(null);
    }
    setShowConfirmation(false);
  };

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
          unitOfMeasurements: data.unitOfMeasurements || undefined,
          countryOfOrigin: data.countryOfOrigin || undefined,
          HScode: data.HScode || "",
          prices:
            data.prices?.map((price: any) => ({
              variantName: price.variantName || undefined,
              variantType: price.variantType || price.varianntType || undefined,
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

  const openProductForm = (index: number, isEditing: boolean = false) => {
    const initialValues = getInitialValues(index);
    const hasExistingProduct = !!initialValues.productId;

    GlobalModal.title =
      isEditing || hasExistingProduct ? "Edit Product" : "Add New Product";
    GlobalModal.description =
      isEditing || hasExistingProduct
        ? "Update the details of the existing product."
        : "Fill in the details to create a new product.";
    GlobalModal.children = (
      <EditProductDetails
        open={true} // Set open to true to ensure the modal is visible
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            GlobalModal.onClose();
            setSelectedContainerIndex(null);
          }
        }}
        containerIndex={index}
        initialValues={initialValues}
        onSubmit={(data, containerIndex) => {
          handleProductDetailsSubmit(data, containerIndex);
        }}
        onSuccess={async () => {
          try {
            const ProductsResponse = await fetchData(
              "/shipment/productdetails/get"
            );
            const ProductsData = await ProductsResponse.json();
            const mappedProduct = ProductsData.map((product: any) => ({
              _id: product._id,
              code: product.code,
              description: product.description,
              name: product.code + ": " + product.description,
            }));
            setProducts(mappedProduct || []);
            saveProgressSilently(getValues());
            toast.success(
              isEditing || hasExistingProduct
                ? "Product updated successfully"
                : "Product created successfully"
            );
          } catch (error) {
            console.error("Error refreshing products:", error);
            toast.error("Failed to refresh product list");
          }
          GlobalModal.onClose();
          setSelectedContainerIndex(null);
        }}
      />
    );
    GlobalModal.onOpen();
  };

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
    openProductForm(index, true);
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

    // Update the product in the backend if it exists
    if (data.productId) {
      try {
        fetch(
          `https://incodocs-server.onrender.com/shipment/productdetails/update/${data.productId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productDetails),
          }
        ).then((response) => {
          if (!response.ok) throw new Error("Failed to update product");
          console.log("Product updated in backend");
        });
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product in backend");
      }
    }

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
        prices: [
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
          prices: product.prices?.length
            ? product.prices
            : [
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
          productId: "",
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

  function saveProgressSilently(arg0: FieldValues): void {
    saveProgress({ bookingDetails: getValues().bookingDetails });
  }

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
                <React.Fragment key={index}>
                  <TableRow>
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
                                placeholder="e.g., +91 1234567891"
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
                        name={`bookingDetails.containers[${index}].addProductDetails[0].productId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <EntityCombobox
                                entities={products}
                                value={field.value || ""}
                                onChange={(value) => {
                                  // Ensure value is a single string or undefined
                                  const singleValue = Array.isArray(value)
                                    ? value[0]
                                    : value;
                                  field.onChange(singleValue || undefined);
                                  if (singleValue) {
                                    fetchProductDetails(singleValue).then(
                                      (productDetails) => {
                                        if (productDetails) {
                                          // Transform ProductDetails to AddProductDetails
                                          const addProductDetails: AddProductDetails =
                                            {
                                              productId: singleValue,
                                              code: productDetails.code || "",
                                              HScode:
                                                productDetails.HScode || "", // Provide default for HScode
                                              description:
                                                productDetails.description ||
                                                "",
                                              unitOfMeasurements:
                                                productDetails.unitOfMeasurements ||
                                                "",
                                              countryOfOrigin:
                                                productDetails.countryOfOrigin ||
                                                "",
                                              prices: productDetails.prices
                                                ?.length
                                                ? productDetails.prices.map(
                                                    (price) => ({
                                                      variantName:
                                                        price.variantName || "",
                                                      variantType:
                                                        price.variantType || "",
                                                      sellPrice:
                                                        price.sellPrice,
                                                      buyPrice: price.buyPrice,
                                                      _id: price._id,
                                                    })
                                                  )
                                                : [
                                                    {
                                                      variantName: "",
                                                      variantType: "",
                                                      sellPrice: undefined,
                                                      buyPrice: undefined,
                                                    },
                                                  ],
                                              netWeight:
                                                productDetails.netWeight,
                                              grossWeight:
                                                productDetails.grossWeight,
                                              cubicMeasurement:
                                                productDetails.cubicMeasurement,
                                            };
                                          handleProductDetailsSubmit(
                                            addProductDetails,
                                            index
                                          );
                                        }
                                      }
                                    );
                                  } else {
                                    setValue(
                                      `bookingDetails.containers[${index}].addProductDetails`,
                                      [],
                                      { shouldDirty: true }
                                    );
                                  }
                                  saveProgressSilently(getValues());
                                }}
                                displayProperty="name"
                                valueProperty="_id"
                                placeholder="Select Product"
                                onAddNew={() => openProductForm(index)}
                                addNewLabel="Add New Product"
                                multiple={false}
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
                        variant="destructive"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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

      <EditContainerTypeModal
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
