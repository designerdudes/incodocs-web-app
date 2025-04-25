"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";

// Define AddProductDetails type inline
interface AddProductDetails {
  productId?: string; // Optional, to align with BookingDetails.tsx
  code: string;
  HScode: string;
  description: string; // Changed from dscription
  unitOfMeasurements?: string;
  countryOfOrigin?: string;
  variantName?: string;
  varianntType?: string;
  sellPrice?: number;
  buyPrice?: number;
  netWeight?: number;
  grossWeight?: number;
  cubicMeasurement?: number;
}

// Define the form schema based on AddProductDetails
const formSchema = z.object({
  productId: z.string().optional(),
  code: z.string().min(1, "Product Code is required"),
  HScode: z.string().min(1, "HS Code is required"),
  description: z.string().min(1, "Description is required"), // Changed from dscription
  unitOfMeasurements: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  variantName: z.string().optional(),
  varianntType: z.string().optional(),
  sellPrice: z.number().min(0, "Sell Price must be non-negative").optional(),
  buyPrice: z.number().min(0, "Buy Price must be non-negative").optional(),
  netWeight: z.number().min(0, "Net Weight must be non-negative").optional(),
  grossWeight: z
    .number()
    .min(0, "Gross Weight must be non-negative")
    .optional(),
  cubicMeasurement: z
    .number()
    .min(0, "Cubic Measurement must be non-negative")
    .optional(),
});

type FormValues = AddProductDetails;

interface EditProductDetailsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  containerIndex: number;
  initialValues: FormValues;
  onSubmit: (data: FormValues, containerIndex: number) => void;
}

export default function EditProductDetailsForm({
  open,
  onOpenChange,
  containerIndex,
  initialValues,
  onSubmit,
}: EditProductDetailsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with initialValues
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: initialValues.productId || "",
      code: initialValues.code || "",
      HScode: initialValues.HScode || "",
      description: initialValues.description || "", // Changed from dscription
      unitOfMeasurements: initialValues.unitOfMeasurements || "",
      countryOfOrigin: initialValues.countryOfOrigin || "",
      variantName: initialValues.variantName || "",
      varianntType: initialValues.varianntType || "",
      sellPrice: initialValues.sellPrice ?? 0,
      buyPrice: initialValues.buyPrice ?? 0,
      netWeight: initialValues.netWeight ?? 0,
      grossWeight: initialValues.grossWeight ?? 0,
      cubicMeasurement: initialValues.cubicMeasurement ?? 0,
    },
  });

  // Debug initialValues
  useEffect(() => {
    console.log("EditProductDetailsForm initialValues:", initialValues);
  }, [initialValues]);

  const handleSubmit = async (values: FormValues) => {
    // Double-check required fields (redundant due to Zod, but for safety)
    if (
      !values.code.trim() ||
      !values.HScode.trim() ||
      !values.description.trim()
    ) {
      toast.error(
        "Please fill in all required fields (Code, HS Code, Description)."
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log("EditProductDetailsForm submitted with values:", values);
      onSubmit(values, containerIndex);
      toast.success("Product details updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent Enter key from submitting parent form
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      form.handleSubmit(handleSubmit)();
    }
  };

  // Disable submit button until form is valid
  const isFormValid = form.formState.isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onKeyDown={handleKeyDown}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PROD001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="HScode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HS Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sample Product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitOfMeasurements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measurement</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="countryOfOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country of Origin</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Variant1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="varianntType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Type1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sell Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
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
            <FormField
              control={form.control}
              name="buyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buy Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 80"
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
            <FormField
              control={form.control}
              name="netWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
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
            <FormField
              control={form.control}
              name="grossWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 60"
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
            <FormField
              control={form.control}
              name="cubicMeasurement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cubic Measurement</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 1.5"
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !isFormValid}>
                {isLoading && (
                  <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
