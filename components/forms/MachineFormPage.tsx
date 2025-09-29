"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ✅ Zod Schema
export const machineSchema = z.object({
  factoryId: z.string().optional(),
  machineName: z.string().min(1, "Machine Name is required"),
  typeCutting: z.string().optional(),
  typePolish: z.string().optional(),
  machineOwnership: z.string().optional(),
  machineCost: z.string().optional(),
  machinePhoto: z.instanceof(File).optional(), // ✅ Proper file validation
  installationDate: z.string().optional(),
  isActive: z.boolean().optional(),

  components: z
    .array(
      z.object({
        type: z.string().optional(),
        details: z.object({
          bladeThinkness: z.string().optional(),
          bladeSize: z.string().optional(),
          cost: z.string().optional(),
          review: z.string().optional(),
        }),
      })
    )
    .optional(),
});

type MachineFormValues = z.infer<typeof machineSchema>;

interface MachineFormProps {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default function MachineFormPage({ params }: MachineFormProps) {
  const orgId = params.organizationId;
  const factoryId = params.factoryid;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MachineFormValues>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      factoryId,
      machineName: "",
      typeCutting: "",
      typePolish: "",
      machineOwnership: "",
      machineCost: "",
      machinePhoto: undefined,
      installationDate: "",
      isActive: true,
      components: [
        {
          type: "",
          details: {
            bladeThinkness: "",
            bladeSize: "",
            cost: "",
            review: "",
          },
        },
      ],
    },
  });

  const { control } = form;

  // 🔄 useFieldArray for components
  const { fields: componentFields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  const handleSubmit = async (values: MachineFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // ✅ Append form fields to FormData
      Object.entries(values).forEach(([key, val]) => {
        if (key === "components") {
          formData.append("components", JSON.stringify(val));
        } else if (key === "machinePhoto" && val instanceof File) {
          formData.append("machinePhoto", val);
        } else if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      await postData("/machine/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Machine added successfully!");
      router.push("../");
    } catch (error) {
      toast.error("Error creating machine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 🔹 Basic Machine Info */}
          <div className="grid grid-cols-3 gap-4">
            {/* Machine Name */}
            <FormField
              control={form.control}
              name="machineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Saw Cutter" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Cutting */}
            <FormField
              control={form.control}
              name="typeCutting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Cutting</FormLabel>
                  <FormControl>
                    <Input placeholder="Eg: Diamond" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Machine Ownership */}
            <FormField
              control={form.control}
              name="machineOwnership"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Ownership</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">Select Ownership</option>
                      <option value="Rent">Rent</option>
                      <option value="Own">Own</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Machine Cost */}
            <FormField
              control={form.control}
              name="machineCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Eg: 50000" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Machine Photo */}
            <FormField
              control={form.control}
              name="machinePhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={isLoading}
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Installation Date */}
            <FormField
              control={form.control}
              name="installationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Date</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 🔹 Components Table */}
          <div>
            {componentFields.length > 0 && (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Component Type</TableHead>
                    <TableHead>Blade Thickness</TableHead>
                    <TableHead>Blade Size</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentFields.map((comp, index) => (
                    <TableRow key={comp.id}>
                      {/* Type */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`components.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Eg: Blade" disabled={isLoading} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Thickness */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`components.${index}.details.bladeThinkness`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="0.8 mm"
                                  type="number"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Size */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`components.${index}.details.bladeSize`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="30"
                                  type="number"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Cost */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`components.${index}.details.cost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="1000"
                                  type="number"
                                  disabled={isLoading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Review */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`components.${index}.details.review`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter review"
                                  className="resize-none"
                                  rows={2}
                                  disabled={isLoading}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Remove */}
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* 🔹 Add Component + Submit */}
          <div className="flex items-center justify-center w-1/2 gap-4">
            <Button
              className="w-1/2"
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  type: "",
                  details: { bladeThinkness: "", bladeSize: "", cost: "", review: "" },
                })
              }
            >
              + Add Component
            </Button>

            <Button type="submit" disabled={isLoading} className="w-1/2">
              {isLoading ? "Saving..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
