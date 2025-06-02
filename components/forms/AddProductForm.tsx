"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm, UseFormReturn, FieldPath } from "react-hook-form";
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
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

// Zod Schemas
const tileSchema = z.object({
  stoneName: z.string().optional(),
  stonePhoto: z.string().optional(),
  size: z
    .object({
      length: z
        .number()
        .min(0, { message: "Length must be positive" })
        .optional(),
      breadth: z
        .number()
        .min(0, { message: "Breadth must be positive" })
        .optional(),
    })
    .optional(),
  thickness: z
    .object({
      value: z
        .number()
        .min(0, { message: "Thickness must be positive" })
        .optional(),
    })
    .optional(),
  moulding: z
    .object({
      mouldingSide: z
        .enum(["one side", "two side", "three side", "four side"])
        .optional(),
      typeOfMoulding: z
        .enum(["half bullnose", "full bullnose", "bevel"])
        .optional(),
    })
    .optional(),
  noOfBoxes: z
    .number()
    .min(0, { message: "Number of boxes must be positive" })
    .optional(),
  piecesPerBox: z
    .number()
    .min(0, { message: "Pieces per box must be positive" })
    .optional(),
});

const slabSchema = z.object({
  stoneName: z.string().optional(),
  stonePhoto: z.string().optional(),
  manualMeasurement: z.string().optional(),
  uploadMeasurement: z.string().optional(),
});

const stepRiserSchema = z.object({
  stoneName: z.string().optional(),
  stonePhoto: z.string().optional(),
  mixedBox: z
    .object({
      noOfBoxes: z
        .number()
        .min(0, { message: "Number of boxes must be positive" })
        .optional(),
      noOfSteps: z
        .number()
        .min(0, { message: "Number of steps must be positive" })
        .optional(),
      sizeOfStep: z
        .object({
          length: z
            .number()
            .min(0, { message: "Step length must be positive" })
            .optional(),
          breadth: z
            .number()
            .min(0, { message: "Step breadth must be positive" })
            .optional(),
          thickness: z
            .number()
            .min(0, { message: "Step thickness must be positive" })
            .optional(),
        })
        .optional(),
      noOfRiser: z
        .number()
        .min(0, { message: "Number of risers must be positive" })
        .optional(),
      sizeOfRiser: z
        .object({
          length: z
            .number()
            .min(0, { message: "Riser length must be positive" })
            .optional(),
          breadth: z
            .number()
            .min(0, { message: "Riser breadth must be positive" })
            .optional(),
          thickness: z
            .number()
            .min(0, { message: "Riser thickness must be positive" })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  seperateBox: z
    .object({
      noOfBoxOfSteps: z
        .number()
        .min(0, { message: "Number of step boxes must be positive" })
        .optional(),
      sizeOfBoxOfSteps: z
        .object({
          length: z
            .number()
            .min(0, { message: "Step box length must be positive" })
            .optional(),
          breadth: z
            .number()
            .min(0, { message: "Step box breadth must be positive" })
            .optional(),
          thickness: z
            .number()
            .min(0, { message: "Step box thickness must be positive" })
            .optional(),
        })
        .optional(),
      noOfBoxOfRisers: z
        .number()
        .min(0, { message: "Number of riser boxes must be positive" })
        .optional(),
      sizeOfBoxOfRisers: z
        .object({
          length: z
            .number()
            .min(0, { message: "Riser box length must be positive" })
            .optional(),
          breadth: z
            .number()
            .min(0, { message: "Riser box breadth must be positive" })
            .optional(),
          thickness: z
            .number()
            .min(0, { message: "Riser box thickness must be positive" })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

const productSchema = z.object({
  productType: z.enum(["Tiles", "Slabs", "StepsAndRisers"], {
    message: "Product type must be Tiles, Slabs, or StepsAndRisers",
  }),
  tileDetails: tileSchema.optional(),
  slabDetails: slabSchema.optional(),
  stepRiserDetails: stepRiserSchema.optional(),
  organizationId: z.string().optional(),
  createdBy: z.string().optional(),
});

// Infer TypeScript type from Zod schema
type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  orgId?: string;
}

export default function ProductFormPage({ onSuccess }: ProductFormProps) {
  const orgId = useParams().organizationId;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productType: "Tiles",
      tileDetails: {
        stoneName: "",
        stonePhoto: "",
        size: { length: 0, breadth: 0 },
        thickness: { value: 0 },
        moulding: { mouldingSide: "one side", typeOfMoulding: "half bullnose" },
        noOfBoxes: 0,
        piecesPerBox: 0,
      },
      slabDetails: {
        stoneName: "",
        stonePhoto: "",
        manualMeasurement: "",
        uploadMeasurement: "",
      },
      stepRiserDetails: {
        stoneName: "",
        stonePhoto: "",
        mixedBox: {
          noOfBoxes: 0,
          noOfSteps: 0,
          sizeOfStep: { length: 0, breadth: 0, thickness: 0 },
          noOfRiser: 0,
          sizeOfRiser: { length: 0, breadth: 0, thickness: 0 },
        },
        seperateBox: {
          noOfBoxOfSteps: 0,
          sizeOfBoxOfSteps: { length: 0, breadth: 0, thickness: 0 },
          noOfBoxOfRisers: 0,
          sizeOfBoxOfRisers: { length: 0, breadth: 0, thickness: 0 },
        },
      },
      organizationId: orgId as string,
    },
  });

  const productType = form.watch("productType");

  const handleSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    try {
      const payload: ProductFormValues = {
        productType: values.productType,
        organizationId: values.organizationId,
        createdBy: values.createdBy,
      };
      if (values.productType === "Tiles") {
        payload.tileDetails = values.tileDetails;
      } else if (values.productType === "Slabs") {
        payload.slabDetails = values.slabDetails;
      } else if (values.productType === "StepsAndRisers") {
        payload.stepRiserDetails = values.stepRiserDetails;
      }
      await postData("/shipment/productdetails/add", payload);
      toast.success("Product created successfully");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Bad Request");
      } else {
        toast.error("Error creating product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tiles">Tiles</SelectItem>
                    <SelectItem value="Slabs">Slabs</SelectItem>
                    <SelectItem value="StepsAndRisers">
                      Steps and Risers
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {productType === "Tiles" && (
            <div className="flex flex-col gap-4 border p-4 rounded-md">
              <h3 className="text-lg font-semibold col-span-3">Tile Details</h3>
              <FormField
                control={form.control}
                name="tileDetails.stoneName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stone Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Granite" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tileDetails.stonePhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stone Photo</FormLabel>
                    <FormControl>
                      <FileUploadField
                        name="tileDetails.stonePhoto"
                        storageKey="tileDetails_stonePhoto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="tileDetails.size.length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size Length (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tileDetails.size.breadth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size Breadth (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tileDetails.thickness.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thickness (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="tileDetails.moulding.mouldingSide"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moulding Side</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Moulding Side" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one side">One Side</SelectItem>
                            <SelectItem value="two side">Two Side</SelectItem>
                            <SelectItem value="three side">
                              Three Side
                            </SelectItem>
                            <SelectItem value="four side">Four Side</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="tileDetails.moulding.typeOfMoulding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Moulding</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Moulding Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="half bullnose">
                              Half Bullnose
                            </SelectItem>
                            <SelectItem value="full bullnose">
                              Full Bullnose
                            </SelectItem>
                            <SelectItem value="bevel">Bevel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="tileDetails.noOfBoxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Boxes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tileDetails.piecesPerBox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pieces per Box</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {productType === "Slabs" && (
            <div className="flex flex-col gap-2 border p-4 rounded-md">
              <h3 className="text-lg font-semibold col-span-3">Slab Details</h3>
              <FormField
                control={form.control}
                name="slabDetails.stoneName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stone Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marble" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slabDetails.stonePhoto"
                render={() => (
                  <FormItem>
                    <FormLabel>Stone Photo</FormLabel>
                    <FormControl>
                      <FileUploadField
                        name="slabDetails.stonePhoto"
                        storageKey="slabDetails_stonePhoto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slabDetails.manualMeasurement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manual Measurement</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 120x60 cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slabDetails.uploadMeasurement"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Measurement</FormLabel>
                    <FormControl>
                      <FileUploadField
                        name="slabDetails.uploadMeasurement"
                        storageKey="slabDetails_uploadMeasurement"
                        accept=".pdf,.jpg,.jpeg,.png" // optional: restrict file types if needed
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {productType === "StepsAndRisers" && (
            <div className="space-y-4 border p-4 rounded-md">
              <h3 className="text-lg font-semibold">
                Steps and Risers Details
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2 col-span-3">
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.stoneName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stone Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sandstone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.stonePhoto"
                    render={() => (
                      <FormItem>
                        <FormLabel>Stone Photo</FormLabel>
                        <FormControl>
                          <FileUploadField
                            name="stepRiserDetails.stonePhoto"
                            storageKey="stepRiserDetails_stonePhoto"
                            accept=".jpg,.jpeg,.png"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 border p-4 rounded-md">
                <h4 className="text-md font-semibold col-span-3">Mixed Box</h4>
                <FormField
                  control={form.control}
                  name="stepRiserDetails.mixedBox.noOfBoxes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Boxes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stepRiserDetails.mixedBox.noOfSteps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Steps</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.mixedBox.sizeOfStep.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Length (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.mixedBox.sizeOfStep.breadth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Breadth (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.mixedBox.sizeOfStep.thickness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Thickness (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="stepRiserDetails.mixedBox.noOfRiser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Risers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.mixedBox.sizeOfRiser.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Riser Length (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.mixedBox.sizeOfRiser.breadth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Riser Breadth (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.mixedBox.sizeOfRiser.thickness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Riser Thickness (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 border p-4 rounded-md">
                <h4 className="text-md font-semibold col-span-3">
                  Separate Box
                </h4>
                <FormField
                  control={form.control}
                  name="stepRiserDetails.seperateBox.noOfBoxOfSteps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Step Boxes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.seperateBox.sizeOfBoxOfSteps.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Length (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.seperateBox.sizeOfBoxOfSteps.breadth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Breadth (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.seperateBox.sizeOfBoxOfSteps.thickness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Step Thickness (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="stepRiserDetails.seperateBox.noOfBoxOfRisers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Riser Boxes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-2 border p-4 rounded-md">
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.seperateBox.sizeOfBoxOfRisers.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Riser Length (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.seperateBox.sizeOfBoxOfRisers.breadth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Riser Breadth (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stepRiserDetails.seperateBox.sizeOfBoxOfRisers.thickness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Riser Thickness (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
