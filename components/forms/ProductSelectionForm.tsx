
"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useGlobalModal } from "@/hooks/GlobalModal";
import EntityCombobox from "@/components/ui/EntityCombobox";
import ProductFormPage from "@/components/forms/AddProductForm";
import { fetchData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const productSelectionSchema = z.object({
    productIds: z.array(z.string()).min(1, { message: "Select at least one product" }),
});

interface Product {
    _id: string;
    code: string;
    HScode: string;
    dscription: string;
    unitOfMeasurements: string;
    countryOfOrigin: string;
    variantName: string;
    varianntType: string;
    sellPrice: number;
    buyPrice: number;
    netWeight: number;
    grossWeight: number;
    cubicMeasurement: number;
}

interface ProductSelectionFormProps {
    onSubmit: (data: { productIds: string[] }) => void;
    initialProductIds?: string[];
    onSuccess?: () => void;
}

function saveProgressSilently(data: any) {
    try {
        localStorage.setItem("shipmentFormData", JSON.stringify(data));
        localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
        console.error("Failed to save progress to localStorage:", error);
    }
}

export default function ProductSelectionForm({
    onSuccess,
    onSubmit,
    initialProductIds = [],
}: ProductSelectionFormProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const GlobalModal = useGlobalModal();

    const form = useForm<z.infer<typeof productSelectionSchema>>({
        resolver: zodResolver(productSelectionSchema),
        defaultValues: {
            productIds: initialProductIds,
        },
    });
    const { getValues } = form;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetchData("/shipment/productdetails/get");
                setProducts(response || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleSubmit = (values: z.infer<typeof productSelectionSchema>) => {
        onSubmit(values);
        saveProgressSilently(getValues());
    };

    const openProductForm = () => {
        GlobalModal.title = "Add New Product";
        GlobalModal.description = "Fill in the details to create a new product.";
        GlobalModal.children = (
            <ProductFormPage
                onSuccess={async () => {
                    try {
                        const response = await fetchData("/shipment/productdetails/get");
                        setProducts(response || []);
                        toast.success("Product created successfully");
                        if (onSuccess) onSuccess();
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="productIds"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Select Products</FormLabel>
                            <FormControl>
                                <EntityCombobox
                                    entities={products}
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        saveProgressSilently(getValues());
                                    }}
                                    displayProperty={(product: any) =>
                                        `${product.code} - ${product.description} (HS: ${product.HScode})`
                                    }
                                    valueProperty="_id"
                                    placeholder={isLoading ? "Loading products..." : "Select products"}
                                    onAddNew={openProductForm}
                                    addNewLabel="Add New Product"
                                    multiple={true}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        "Add Products"
                    )}
                </Button>
            </form>
        </Form>
    );
}