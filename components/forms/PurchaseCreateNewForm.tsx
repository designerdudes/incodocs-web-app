"use client";
import * as React from "react";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { postData } from "@/axiosUtility/api";

interface PurchaseCreateNewFormProps {
  gap: number;
}

const formSchema = z
  .object({
    SupplierName: z
      .string()
      .min(3, { message: "Supplier name must be at least 3 characters long" }),
    supplierGSTN: z
      .string()
      .min(3, { message: "Supplier GSTN must be at least 3 characters long" }),
    purchaseDate: z
      .string()
      .min(3, { message: "Purchase date must be at least 3 characters long" }),
    purchaseType: z.enum(["Raw", "Finished"], {
      errorMap: () => ({ message: "Invalid option selected" }),
    }),
    rate: z
      .number({ invalid_type_error: "Rate must be a number" })
      .min(1, { message: "Rate must be greater than 0" }),
    blocks: z
      .array(
        z.object({
          blockNumber: z.number().min(1, { message: "Block number is required" }),
          weight: z
            .number()
            .min(0.1, { message: "Weight must be greater than zero" }),
          breadth: z
            .number()
            .min(0.1, { message: "Breadth must be greater than zero" }),
          length: z
            .number()
            .min(0.1, { message: "Length must be greater than zero" }),
          height: z
            .number()
            .min(0.1, { message: "Height must be greater than zero" }),
        })
      )
      .min(1, { message: "At least one block is required" })
      .optional(),
    noOfBlocks: z
      .number()
      .min(1, { message: "No of Blocks must be greater than 0" })
      .optional(),
    noOfSlabs: z
      .number()
      .min(1, { message: "No of Slabs must be greater than 0" })
      .optional(),
    length: z
      .number()
      .min(1, { message: "Length must be greater than 0" })
      .optional(),
    height: z
      .number()
      .min(1, { message: "Height must be greater than 0" })
      .optional(),
    breadth: z
      .number()
      .min(1, { message: "Breadth must be greater than 0" })
      .optional(),
  })
  .refine(
    (data) =>
      data.purchaseType === "Raw" ||
      (data.purchaseType === "Finished" && data.rate > 0),
    {
      message: "Rate must be greater than 0",
      path: ["rate"],
    }
  );

export function PurchaseCreateNewForm({ gap }: PurchaseCreateNewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [purchaseType, setPurchaseType] = React.useState<"Raw" | "Finished">(
    "Raw"
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      SupplierName: "",
      supplierGSTN: "",
      purchaseDate: "",
      purchaseType: "Raw",
      rate: 0,
      blocks: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await postData("/factory-management/inventory/addlotandblocks", {
        ...values,
        status: "active",
      });
      toast.success("Lot created/updated successfully");
      router.push("./factorymanagement/inventory/raw/lots");
    } catch (error) {
      toast.error("Error creating/updating Lot");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`grid grid-cols-${gap} gap-3`}>
            {/* Supplier Name */}
            <FormField
              name="SupplierName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Xyz" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Supplier GSTN */}
            <FormField
              name="supplierGSTN"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier GSTN</FormLabel>
                  <FormControl>
                    <Input placeholder="GSTN" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Date */}
            <FormField
              name="purchaseDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="DD/MM/YYYY"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Type */}
            <FormField
              name="purchaseType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Type</FormLabel>
                  <FormControl>
                    <select
                      disabled={isLoading}
                      {...field}
                      className="block w-full border-slate-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-3 bg-transparent"
                      onChange={(e) => {
                        field.onChange(e);
                        setPurchaseType(e.target.value as "Raw" | "Finished");
                      }}
                    >
                      <option value="Raw">Raw</option>
                      <option value="Finished">Finished</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rate (Dynamic Field) */}
            <FormField
              name="rate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {purchaseType === "Raw"
                      ? "Rate per Cubic Meter"
                      : "Rate per Sqft"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        purchaseType === "Raw"
                          ? "Enter rate per cubic meter"
                          : "Enter rate per sqft"
                      }
                      type="number"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Raw Specific Fields */}
          {purchaseType === "Raw" && (
            <div className="grid grid-cols-3 gap-3">
              {/* No of Blocks */}
              <FormField
                name="noOfBlocks"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No of Blocks</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter number of blocks"
                        type="number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Length */}
              <FormField
                name="length"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Length"
                        type="number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Height */}
              <FormField
                name="height"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Height"
                        type="number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Breadth */}
              <FormField
                name="breadth"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breadth</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Breadth"
                        type="number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Finished Specific Fields */}
          {purchaseType === "Finished" && (
            <div className="grid grid-cols-3 gap-3">
              {/* No of Slabs */}
              <FormField
                name="noOfSlabs"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No of Slabs</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter number of slabs"
                        type="number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Length */}
              <FormField
                name="length"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Length"
                        type="number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Height */}
              <FormField
                name="height"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Height"
                        type="number"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
