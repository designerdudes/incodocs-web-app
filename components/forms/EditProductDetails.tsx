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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";

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

const formSchema = z.object({
  productId: z.string().optional(),
  code: z.string().min(1, { message: "Code is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  unitOfMeasurements: z
    .string()
    .min(1, { message: "Unit of Measurement is required" }),
  countryOfOrigin: z.string().min(1, { message: "Select a country" }),
  HScode: z.string().min(1, { message: "HS Code is required" }),
  prices: z.array(
    z.object({
      variantName: z.string().min(1, { message: "Variant name is required" }),
      variantType: z.string().min(1, { message: "Variant type is required" }),
      sellPrice: z.number().min(0).optional(),
      buyPrice: z.number().min(0).optional(),
      _id: z.string().optional(),
    })
  ),
  netWeight: z.number().min(0).optional(),
  grossWeight: z.number().min(0).optional(),
  cubicMeasurement: z.number().min(0).optional(),
});

type FormValues = AddProductDetails;

interface EditProductDetailsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  containerIndex: number;
  initialValues: FormValues;
  onSubmit: (data: FormValues, containerIndex: number) => void;
  onSuccess?: () => void;
}

export default function EditProductDetails({
  open,
  onOpenChange,
  containerIndex,
  initialValues,
  onSubmit,
  onSuccess,
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
      netWeight: initialValues.netWeight || undefined,
      grossWeight: initialValues.grossWeight || undefined,
      cubicMeasurement: initialValues.cubicMeasurement || undefined,
    },
  });

  useEffect(() => {
    if (open) {
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
        netWeight: initialValues.netWeight || undefined,
        grossWeight: initialValues.grossWeight || undefined,
        cubicMeasurement: initialValues.cubicMeasurement || undefined,
      });
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      onSubmit(values, containerIndex);
      toast.success("Product details updated successfully!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
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
            className="space-y-6 w-full"
          >
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Eg: PROD-001" {...field} />
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
                      <Textarea
                        placeholder="e.g., this is some random comment for booking details"
                        {...field}
                      />
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
                      <Input placeholder="Eg: Sq. Ft" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="China">China</SelectItem>
                        <SelectItem value="Turkey">Turkey</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Eg: 25151200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
              <h3 className="text-lg font-semibold col-span-3">
                Price Variant
              </h3>
              {form.watch("prices").map((_, index) => (
                <React.Fragment key={index}>
                  <FormField
                    control={form.control}
                    name={`prices.${index}.variantName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Eg: Retail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`prices.${index}.variantType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Eg: Whole" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`prices.${index}.sellPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sell Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
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
                    name={`prices.${index}.buyPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buy Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="netWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net Weight (Kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
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
                    <FormLabel>Gross Weight (Kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
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
                    <FormLabel>Cubic Measurement (m³)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
