"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";

// 📌 Schema for validation
const formSchema = z.object({
  productCategory: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),
  
  // Tile Details
  numBoxes: z.string().optional(),
  piecesPerBox: z.string().optional(),
  tileSize: z.string().optional(),

  // Slab Details
  numBundles: z.string().optional(),
  slabsPerBundle: z.string().optional(),
  measurementSheet: z.any().optional(),
  totalSqmtrWithAllowance: z.string().optional(),
  totalSqmtrWithoutAllowance: z.string().optional(),
});

// 📌 Dropdown options
const productCategories = ["Granite & Marble", "Ceramic"];
const graniteSubcategories = ["Tiles", "Slabs"];

function ProductDetailsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCategory: "",
      subcategory: "",
      numBoxes: "",
      piecesPerBox: "",
      tileSize: "",
      numBundles: "",
      slabsPerBundle: "",
      measurementSheet: undefined,
      totalSqmtrWithAllowance: "",
      totalSqmtrWithoutAllowance: "",
    },
  });

  const GlobalModal = useGlobalModal();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("Product Data:", values);
      toast.success("Product added successfully!");
      GlobalModal.onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add product");
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        
        {/* Product Category */}
        <FormField
          control={form.control}
          name="productCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCategory(value);
                    setSelectedSubcategory(value === "Ceramic" ? "Tiles" : ""); // Auto-select Tiles for Ceramic
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subcategory (only for Granite & Marble) */}
        {selectedCategory === "Granite & Marble" && (
          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSubcategory(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {graniteSubcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* TILE DETAILS (If "Tiles" is selected OR if category is "Ceramic") */}
        {(selectedSubcategory === "Tiles" || selectedCategory === "Ceramic") && (
          <>
            <FormField
              control={form.control}
              name="numBoxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Boxes</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Eg: 50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="piecesPerBox"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Pieces per Box</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Eg: 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tileSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size per Tile (e.g., 120x60)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Eg: 120x60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* SLAB DETAILS (Only if "Slabs" is selected) */}
        {selectedSubcategory === "Slabs" && (
          <>
            <FormField
              control={form.control}
              name="numBundles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Bundles</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Eg: 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slabsPerBundle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Slabs per Bundle</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Eg: 8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measurementSheet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Measurement Sheet</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>

      </form>
    </Form>
  );
}

export default ProductDetailsForm;
