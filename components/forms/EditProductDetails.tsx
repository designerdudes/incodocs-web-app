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

interface AddProductDetails {
  productId?: string;
  code: string;
  HScode: string;
  description: string;
  unitOfMeasurements?: string;
  countryOfOrigin?: string;
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

const formSchema = z.object({
  productId: z.string().optional(),
  code: z.string().min(1, "Product Code is required"),
  HScode: z.string().min(1, "HS Code is required"),
  description: z.string().min(1, "Description is required"),
  unitOfMeasurements: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  prices: z
    .array(
      z.object({
        variantName: z.string().optional(),
        variantType: z.string().optional(),
        sellPrice: z
          .number()
          .min(0, "Sell Price must be non-negative")
          .optional(),
        buyPrice: z
          .number()
          .min(0, "Buy Price must be non-negative")
          .optional(),
        _id: z.string().optional(),
      })
    )
    .optional(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: initialValues.productId || "",
      code: initialValues.code || "",
      HScode: initialValues.HScode || "",
      description: initialValues.description || "",
      unitOfMeasurements: initialValues.unitOfMeasurements || "",
      countryOfOrigin: initialValues.countryOfOrigin || "",
      prices: initialValues.prices?.length
        ? initialValues.prices
        : [
            {
              variantName: "",
              variantType: "",
              sellPrice: undefined,
              buyPrice: undefined,
            },
          ],
      netWeight: initialValues.netWeight,
      grossWeight: initialValues.grossWeight,
      cubicMeasurement: initialValues.cubicMeasurement,
    },
  });

  useEffect(() => {
    if (open) {
      console.log(
        "EditProductDetailsForm resetting with initialValues:",
        initialValues
      );
      form.reset({
        productId: initialValues.productId || "",
        code: initialValues.code || "",
        HScode: initialValues.HScode || "",
        description: initialValues.description || "",
        unitOfMeasurements: initialValues.unitOfMeasurements || "",
        countryOfOrigin: initialValues.countryOfOrigin || "",
        prices: initialValues.prices?.length
          ? initialValues.prices
          : [
              {
                variantName: "",
                variantType: "",
                sellPrice: undefined,
                buyPrice: undefined,
              },
            ],
        netWeight: initialValues.netWeight,
        grossWeight: initialValues.grossWeight,
        cubicMeasurement: initialValues.cubicMeasurement,
      });
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (values: FormValues) => {
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      form.handleSubmit(handleSubmit)();
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Product Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onKeyDown={handleKeyDown}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
              name="prices.0.variantName"
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
              name="prices.0.variantType"
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
              name="prices.0.sellPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sell Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={field.value != null ? field.value : ""}
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
              name="prices.0.buyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buy Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 80"
                      value={field.value != null ? field.value : ""}
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
                      value={field.value != null ? field.value : ""}
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
                      value={field.value != null ? field.value : ""}
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
                      value={field.value != null ? field.value : ""}
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
            <div className="col-span-1 md:col-span-2">
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
