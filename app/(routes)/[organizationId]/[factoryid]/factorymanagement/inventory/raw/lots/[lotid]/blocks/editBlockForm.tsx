"use client";

import React, { useEffect, useState } from "react";
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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

// ✅ Schema aligned with backend
const dimensionSchema = z.object({
  value: z.coerce.number().min(0).optional(),
  units: z.union([z.literal("cm"), z.literal("inch")]).default("cm"),
});

const weightSchema = z
  .object({
    value: z.coerce.number().optional(),
    units: z.union([z.literal("t"), z.literal("tons")]).default("t"),
  })
  .partial()
  .optional();

const formSchema = z.object({
  blockNumber: z.string().optional(),
  factoryId: z.string().optional(),
  lotId: z.object({
    _id: z.string(),
    materialType: z.string().optional(),
    lotName: z.string().optional(),
  }),
  dimensions: z
    .object({
      length: dimensionSchema,
      breadth: dimensionSchema,
      height: dimensionSchema,
      weight: weightSchema,
    })
    .optional(),
  netDimensions: z
    .object({
      length: dimensionSchema,
      breadth: dimensionSchema,
      height: dimensionSchema,
      weight: weightSchema,
    })
    .optional(),
  status: z.string(),

  // splitting
  splitDimensions: z
    .object({
      length: dimensionSchema,
      breadth: dimensionSchema,
      height: dimensionSchema,
    })
    .optional(),
  splittingIn: z.string().optional(),
  splittingOut: z.string().optional(),
  splitPhoto: z.string().optional(),

  // dressing
  dressDimensions: z
    .object({
      length: dimensionSchema,
      breadth: dimensionSchema,
      height: dimensionSchema,
    })
    .optional(),
  dressingIn: z.string().optional(),
  dressingOut: z.string().optional(),
  dressedPhoto: z.string().optional(),
});

interface Props {
  params: { _id: string };
}

export default function EditBlockForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [blockStatus, setBlockStatus] = useState<string | null>(null);
  const GlobalModal = useGlobalModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockNumber: "",
      factoryId: "",
      lotId: { _id: "", materialType: "", lotName: "" },
      dimensions: {
        length: { value: 0, units: "cm" },
        breadth: { value: 0, units: "cm" },
        height: { value: 0, units: "cm" },
        weight: { value: 0, units: "t" },
      },
      netDimensions: {
        length: { value: 0, units: "cm" },
        breadth: { value: 0, units: "cm" },
        height: { value: 0, units: "cm" },
        weight: { value: 0, units: "t" },
      },
      status: "",

      // splitting
      splitDimensions: {
        length: { value: 0, units: "cm" },
        breadth: { value: 0, units: "cm" },
        height: { value: 0, units: "cm" },
      },
      splittingIn: "",
      splittingOut: "",
      splitPhoto: "",

      // dressing
      dressDimensions: {
        length: { value: 0, units: "cm" },
        breadth: { value: 0, units: "cm" },
        height: { value: 0, units: "cm" },
      },
      dressingIn: "",
      dressingOut: "",
      dressedPhoto: "",
    },
  });

  const blockId = params._id;

  // watchers
  const dLength = form.watch("dimensions.length.value") || 0;
  const dBreadth = form.watch("dimensions.breadth.value") || 0;
  const dHeight = form.watch("dimensions.height.value") || 0;

  const nLength = form.watch("netDimensions.length.value") || 0;
  const nBreadth = form.watch("netDimensions.breadth.value") || 0;
  const nHeight = form.watch("netDimensions.height.value") || 0;

  const sLength = form.watch("splitDimensions.length.value") || 0;
  const sBreadth = form.watch("splitDimensions.breadth.value") || 0;
  const sHeight = form.watch("splitDimensions.height.value") || 0;

  const drLength = form.watch("dressDimensions.length.value") || 0;
  const drBreadth = form.watch("dressDimensions.breadth.value") || 0;
  const drHeight = form.watch("dressDimensions.height.value") || 0;

  const density = 3.5;

  const grossVolume = (dLength * dBreadth * dHeight) / 1_000_000;
  const netVolume = (nLength * nBreadth * nHeight) / 1_000_000;
  const splitVolume = (sLength * sBreadth * sHeight) / 1_000_000;
  const dressedVolume = (drLength * drBreadth * drHeight) / 1_000_000;

  const grossWeight = (grossVolume * density).toFixed(2);
  const netWeight = (netVolume * density).toFixed(2);
  const splitWeight = (splitVolume * density).toFixed(2);
  const dressedWeight = (dressedVolume * density).toFixed(2);

  // fetch data
  useEffect(() => {
    async function fetchBlockData() {
      try {
        setIsFetching(true);
        const data = await fetchData(
          `/factory-management/inventory/raw/get/${blockId}`
        );

        form.reset({
          blockNumber: data.blockNumber || "",
          factoryId: data.factoryId || "",
          lotId: {
            _id: data.lotId?._id || "",
            materialType: data.lotId?.materialType || "",
            lotName: data.lotId?.lotName || "",
          },
          dimensions: data.dimensions,
          netDimensions: data.netDimensions,
          status: data.status || "",

          splitDimensions: data.splitDimensions,
          splittingIn: data.splitting?.in || "",
          splittingOut: data.splitting?.out || "",
          splitPhoto: data.splitPhoto || "",

          dressDimensions: data.dressDimensions,
          dressingIn: data.dressing?.in || "",
          dressingOut: data.dressing?.out || "",
          dressedPhoto: data.dressedPhoto || "",
        });

        setBlockStatus(data.status);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch block data");
      } finally {
        setIsFetching(false);
      }
    }
    fetchBlockData();
  }, [blockId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
  setIsLoading(true);

  // ✅ build clean payload
  const payload = {
    dimensions: {
      ...values.dimensions,
      weight: { value: Number(grossWeight), units: "t" },
    },
    netDimensions: {
      ...values.netDimensions,
      weight: { value: Number(netWeight), units: "t" },
    },
    dressDimensions: values.dressDimensions
      ? {
          ...values.dressDimensions,
          weight: { value: Number(dressedWeight), units: "t" },
        }
      : undefined,
    splitDimensions: values.splitDimensions || undefined,
    dressedPhoto: values.dressedPhoto || undefined,
    splitPhoto: values.splitPhoto || undefined,
    dressing: values.dressingIn || values.dressingOut
      ? {
          in: values.dressingIn,
          out: values.dressingOut,
        }
      : undefined,
    splitting: values.splittingIn || values.splittingOut
      ? {
          in: values.splittingIn,
          out: values.splittingOut,
        }
      : undefined,
    status: values.status,
  };

  GlobalModal.title = "Confirm Block Update";
  GlobalModal.description = "Are you sure you want to update this block?";
  GlobalModal.children = (
    <div className="space-y-4">
      <p>Block Number: {values.blockNumber}</p>
      <p>Material Type: {values.lotId.materialType}</p>
      <p>
        Gross → Volume: {grossVolume.toFixed(2)} m³ | Weight: {grossWeight} t
      </p>
      <p>
        Net → Volume: {netVolume.toFixed(2)} m³ | Weight: {netWeight} t
      </p>
      {values.dressDimensions && (
        <p>
          Dressed → Volume: {dressedVolume.toFixed(2)} m³ | Weight:{" "}
          {dressedWeight} t
        </p>
      )}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            GlobalModal.onClose();
            setIsLoading(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              await putData(
                `/factory-management/inventory/raw/put/${blockId}`,
                payload
              );
              toast.success("Block updated successfully");
              window.location.reload();
            } catch (error) {
              console.error("Update error:", error);
              toast.error("Update failed");
            } finally {
              setIsLoading(false);
              GlobalModal.onClose();
            }
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
  GlobalModal.onOpen();
};


  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-60">
        <Icons.spinner className="h-6 w-6 animate-spin" />
        <p className="ml-2 text-gray-500">Loading block details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Block Number */}
        <FormField
          control={form.control}
          name="blockNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Block Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter block number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Material Type */}
        <FormField
          control={form.control}
          name="lotId.materialType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Type</FormLabel>
              <FormControl>
                <Input placeholder="Material type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gross Dimensions */}
        <div className="space-y-2 border p-4 rounded-md">
          <h3 className="font-semibold">End To End Dimensions</h3>
          <div className="grid grid-cols-3 gap-4">
            {["length", "breadth", "height"].map((dim) => (
              <FormField
                key={dim}
                control={form.control}
                name={`dimensions.${dim}.value` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dim}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="text-sm font-medium">
            Volume: {grossVolume.toFixed(2)} m³ | Weight: {grossWeight} t
          </div>
        </div>

        {/* Net Dimensions */}
        <div className="space-y-2 border p-4 rounded-md">
          <h3 className="font-semibold">Net Dimensions</h3>
          <div className="grid grid-cols-3 gap-4">
            {["length", "breadth", "height"].map((dim) => (
              <FormField
                key={dim}
                control={form.control}
                name={`netDimensions.${dim}.value` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dim}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="text-sm font-medium">
            Volume: {netVolume.toFixed(2)} m³ | Weight: {netWeight} t
          </div>
        </div>

        {/* Split Section */}
        {blockStatus === "split" && (
          <>
            <div className="space-y-2 border p-4 rounded-md">
              <h3 className="font-semibold">Split Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
                {["length", "breadth", "height"].map((dim) => (
                  <FormField
                    key={dim}
                    control={form.control}
                    name={`splitDimensions.${dim}.value` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dim}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="text-sm font-medium">
                Volume: {splitVolume.toFixed(2)} m³ | Weight: {splitWeight} t
              </div>
            </div>

            <FormField
              control={form.control}
              name="splittingIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>In Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="splittingOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Out Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="splitPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split Block Photo</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name={field.name}
                      storageKey="splitPhoto"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {/* Dressed Section */}
        {blockStatus === "dressed" && (
          <>
            <div className="space-y-2 border p-4 rounded-md">
              <h3 className="font-semibold">Dressed Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
                {["length", "breadth", "height"].map((dim) => (
                  <FormField
                    key={dim}
                    control={form.control}
                    name={`dressDimensions.${dim}.value` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dim}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <div className="text-sm font-medium">
                Volume: {dressedVolume.toFixed(2)} m³ | Weight: {dressedWeight}{" "}
                t
              </div>
            </div>

            {/* In Time */}
            <FormField
              control={form.control}
              name="dressingIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>In Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Out Time */}
            <FormField
              control={form.control}
              name="dressingOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Out Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Photo */}
            <FormField
              control={form.control}
              name="dressedPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dressed Block Photo</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name={field.name}
                      storageKey="dressedPhoto"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
