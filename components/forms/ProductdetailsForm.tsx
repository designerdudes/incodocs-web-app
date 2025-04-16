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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Schema with required slab fields
const formSchema = z.object({
  productCategory: z.string().min(1, "Category is required"),
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

  slabType: z.string().optional(),
  slabLength: z
    .object({
      value: z.number({ required_error: "Length is required" }),
      units: z.string(),
    })
    .optional(),
  slabBreadth: z
    .object({
      value: z.number({ required_error: "Breadth is required" }),
      units: z.string(),
    })
    .optional(),
  slabThickness: z.number().nonnegative().optional(),
  slabDocument: z.any().optional(),
});

interface ProductDetailsFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export default function ProductDetailsForm({ onSubmit }: ProductDetailsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [tileSizeInput, setTileSizeInput] = useState("");
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [productCategories, setProductCategories] = useState([
    "Granite & Marble",
    "Ceramic",
  ]);
  const graniteSubcategories = ["Tiles", "Slabs"];

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
      slabType: "",
      slabLength: { value: undefined, units: "inch" },
      slabBreadth: { value: undefined, units: "inch" },
      slabThickness: undefined,
      slabDocument: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      onSubmit(values);
      toast.success("Product details added successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !productCategories.includes(trimmed)) {
      setProductCategories([...productCategories, trimmed]);
      setSelectedCategory(trimmed);
      form.setValue("productCategory", trimmed);
      toast.success("Category added!");
      setNewCategory("");
      setOpenAddCategory(false);
    } else {
      toast.error("Invalid or duplicate category.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          {/* Category */}
          <FormField
            control={form.control}
            name="productCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Category</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === "__add_new__") {
                        setOpenAddCategory(true);
                      } else {
                        field.onChange(value);
                        setSelectedCategory(value);
                        setSelectedSubcategory(value === "Ceramic" ? "Tiles" : "");
                        form.setValue("graniteAndMarble", "");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="__add_new__" className="text-blue-600">
                        + Add Another Category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subcategory */}
          {selectedCategory === "Granite & Marble" && (
            <FormField
              control={form.control}
              name="graniteAndMarble"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSubcategory(value);
                      }}
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

          {/* Tiles Fields */}
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
                        placeholder="e.g., 10"
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tiles.noOfPiecesPerBoxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pieces per Box</FormLabel>
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
                          const [l, b] = value.split("x").map(Number);
                          field.onChange(
                            !isNaN(l) && !isNaN(b)
                              ? {
                                length: { value: l, units: "inch" },
                                breadth: { value: b, units: "inch" },
                              }
                              : {
                                length: { value: undefined, units: "inch" },
                                breadth: { value: undefined, units: "inch" },
                              }
                          );
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Slabs Fields */}
          {selectedSubcategory === "Slabs" && (
            <>
              <FormField
                control={form.control}
                name="slabType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slab Type</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Slab Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Book Match">Book Match</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slabLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Length in inches"
                          value={field.value?.value ?? ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val >= 0 || e.target.value === "") {
                              field.onChange({
                                value: val,
                                units: "inch",
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slabBreadth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breadth</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Breadth in inches"
                          value={field.value?.value ?? ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val >= 0 || e.target.value === "") {
                              field.onChange({
                                value: val,
                                units: "inch",
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="slabThickness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thickness (mm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g., 18"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (val >= 0 || e.target.value === "") {
                            field.onChange(val);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slabDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Document (PDF, JPG, PNG)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}


          <Button type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="h-4 w-4 animate-spin mr-2" />}
            Save Product Details
          </Button>
        </form>
      </Form>

      {/* Add Category Modal */}
      <Dialog open={openAddCategory} onOpenChange={setOpenAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleAddCategory}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
