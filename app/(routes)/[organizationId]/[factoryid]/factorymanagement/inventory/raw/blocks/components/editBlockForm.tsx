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
import { useRouter } from "next/navigation";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

// densities for materials (t/m³)
const materialDensities: Record<string, number> = {
  Granite: 2.75,
  Marble: 2.7,
  Limestone: 2.6,
  "Black galaxy": 2.9,
};

// schema
const formSchema = z.object({
  blockNumber: z.string().optional(),
  factoryId: z.string().optional(),
  lotId: z.object({
    _id: z.string(),
    materialType: z.string().optional(),
    lotName: z.string().optional(),
  }),
  dimensions: z.object({
    length: z.object({
      value: z.coerce.number().min(0.1),
      units: z.literal("cm").default("cm"),
    }),
    breadth: z.object({
      value: z.coerce.number().min(0.1),
      units: z.literal("cm").default("cm"),
    }),
    height: z.object({
      value:z.coerce.number().min(0.1),
      units: z.literal("cm").default("cm"),
    }),
   weight: z
  .object({
    value: z.coerce.number().optional(),
    units: z.literal("t").default("t"),
  })
  .partial()
  .optional(),
  }).optional(),
  netDimensions: z.object({
    length: z.object({
      value: z.coerce.number().min(0.1),
      units: z.literal("cm").default("cm"),
    }),
    breadth: z.object({
      value: z.coerce.number().min(0.1),
      units: z.literal("cm").default("cm"),
    }),
    height: z.object({
      value:z.coerce.number().min(0.1),
      units: z.literal("cm").default("cm"),
    }),
   weight: z
  .object({
    value: z.coerce.number().optional(),
    units: z.literal("t").default("t"),
  })
  .partial()
  .optional(),
  }).optional(),
});

interface Props {
  params: {
    _id: string;
  };
}

export default function EditBlockForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

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

  const materialType = form.watch("lotId.materialType") || "";

  // volumes
  const grossVolume = (dLength * dBreadth * dHeight) / 1_000_000;
  const netVolume = (nLength * nBreadth * nHeight) / 1_000_000;

  const density = materialDensities[materialType] || 0;

  // weights
  const grossWeight = (grossVolume * density).toFixed(2);
  const netWeight = (netVolume * density).toFixed(2);

  // fetch block data
  useEffect(() => {
    async function fetchBlockData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `/factory-management/inventory/raw/get/${blockId}`
        );

        const data = response;
        // console.log("wwwwwww",data)

        form.reset({
          blockNumber: data.blockNumber || "",
          factoryId: data.factoryId || "",
          lotId: {
            _id: data.lotId?._id || "",
            materialType: data.lotId?.materialType || "",
            lotName: data.lotId?.lotName || "",
          },
          dimensions: {
            length: {
              value: data.dimensions?.length?.value || 0,
              units: data.dimensions?.length?.units || "cm",
            },
            breadth: {
              value: data.dimensions?.breadth?.value || 0,
              units: data.dimensions?.breadth?.units || "cm",
            },
            height: {
              value: data.dimensions?.height?.value || 0,
              units: data.dimensions?.height?.units || "cm",
            },
            weight: {
              value: data.dimensions?.weight?.value || 0,
              units: data.dimensions?.weight?.units || "t",
            },
          },
          netDimensions: {
            length: {
              value: data.netDimensions?.length?.value || 0,
              units: data.netDimensions?.length?.units || "cm",
            },
            breadth: {
              value: data.netDimensions?.breadth?.value || 0,
              units: data.netDimensions?.breadth?.units || "cm",
            },
            height: {
              value: data.netDimensions?.height?.value || 0,
              units: data.netDimensions?.height?.units || "cm",
            },
            weight: {
              value: data.netDimensions?.weight?.value || 0,
              units: data.netDimensions?.weight?.units || "t",
            },
          },
        });
      } catch (error) {
        console.error("Error fetching block data:", error);
        toast.error("Failed to fetch block data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchBlockData();
  }, [blockId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    //  console.log("Form submitted sssss✅", values);
    setIsLoading(true);

    GlobalModal.title = "Confirm Block Update";
    GlobalModal.description = "Are you sure you want to update this block?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Block Number: {values.blockNumber}</p>
        <p>Material Type: {values.lotId.materialType}</p>
        <p>
          Gross → Volume: {grossVolume.toFixed(2)} m³ | Weight: {grossWeight} tons
        </p>
        <p>
          Net → Volume: {netVolume.toFixed(2)} m³ | Weight: {netWeight} tons
        </p>
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
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Block updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error updating block:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating block");
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
      <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
      console.error("❌ Validation failed:", errors);
    })} className="space-y-6">
        {/* Block number */}
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

        {/* Material Type (from lotId) */}
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
          <h3 className="font-semibold">Gross Dimensions</h3>
          <div className="grid grid-cols-3 gap-4">
            {["length", "breadth", "height"].map((dim) => (
              <FormField
                key={dim}
                control={form.control}
                name={`dimensions.${dim}.value` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {dim.charAt(0).toUpperCase() + dim.slice(1)} (cm)
                    </FormLabel>
                    <FormControl>
                     <Input
  type="number"
  value={field.value ?? ""}
  onChange={(e) =>
    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
  }
/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="text-sm font-medium">
            Volume: {grossVolume.toFixed(2)} m³ | Weight: {grossWeight} tons
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
                    <FormLabel>
                      {dim.charAt(0).toUpperCase() + dim.slice(1)} (cm)
                    </FormLabel>
                    <FormControl>
                      <Input
  type="number"
  value={field.value ?? ""}
  onChange={(e) =>
    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
  }
/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="text-sm font-medium">
            Volume: {netVolume.toFixed(2)} m³ | Weight: {netWeight} tons
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
