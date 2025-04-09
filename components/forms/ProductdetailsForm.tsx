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
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import toast from "react-hot-toast";

// Schema for ProductDetailsForm
const formSchema = z.object({
  productCategory: z.string().optional(),
  graniteAndMarble: z.string().optional(),
  tiles: z
    .object({
      noOfBoxes: z.number().nonnegative().optional(),
      noOfPiecesPerBoxes: z.number().nonnegative().optional(),
      sizePerTile: z
        .object({
          length: z
            .object({
              value: z.number().nonnegative().optional(),
              units: z.string().optional(),
            })
            .optional(),
          breadth: z
            .object({
              value: z.number().nonnegative().optional(),
              units: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

interface ProductDetailsFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

function ProductDetailsForm({ onSubmit }: ProductDetailsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [tileSizeInput, setTileSizeInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCategory: "",
      graniteAndMarble: "",
      tiles: {
        noOfBoxes: undefined,
        noOfPiecesPerBoxes: undefined,
        sizePerTile: {
          length: { value: undefined, units: "inch" },
          breadth: { value: undefined, units: "inch" },
        },
      },
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      onSubmit(values);
      toast.success("Product details added successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add product details");
    } finally {
      setIsLoading(false);
    }
  };

  const productCategories = ["Granite & Marble", "Ceramic"];
  const graniteSubcategories = ["Tiles", "Slabs"];

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
                    setSelectedSubcategory(value === "Ceramic" ? "Tiles" : "");
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
            name="graniteAndMarble"
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

        {/* Tile Details */}
        {(selectedSubcategory === "Tiles" || selectedCategory === "Ceramic") && (
          <>
            <FormField
              control={form.control}
              name="tiles.noOfBoxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Boxes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
                      min="0"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Math.max(0, parseInt(e.target.value))
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
              name="tiles.noOfPiecesPerBoxes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Pieces per Box</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 4"
                      min="0"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Math.max(0, parseInt(e.target.value))
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
              name="tiles.sizePerTile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size per Tile (e.g., 120x60)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., 120x60"
                      value={tileSizeInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTileSizeInput(value);

                        const [lengthStr, breadthStr] = value
                          .split("x")
                          .map((val) => val.trim());

                        const length = parseInt(lengthStr);
                        const breadth = parseInt(breadthStr);

                        const isValid =
                          !isNaN(length) &&
                          !isNaN(breadth) &&
                          length >= 0 &&
                          breadth >= 0;

                        field.onChange(
                          isValid
                            ? {
                                length: { value: length, units: "inch" },
                                breadth: { value: breadth, units: "inch" },
                              }
                            : {
                                length: { value: undefined, units: "inch" },
                                breadth: { value: undefined, units: "inch" },
                              }
                        );
                      }}
                    />
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
          Save Product Details
        </Button>
      </form>
    </Form>
  );
}

export default ProductDetailsForm;
