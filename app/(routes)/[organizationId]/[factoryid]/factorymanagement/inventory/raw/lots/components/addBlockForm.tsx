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
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { postData } from "@/axiosUtility/api";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";

const formSchema = z.object({
  materialCost: z
    .number()
    .min(1, { message: "Material cost must be greater than or equal to zero" })
    .optional(),
  transportCost: z
    .number()
    .min(1, { message: "Transport cost must be greater than or equal to zero" })
    .optional(),
  markerCost: z
    .number()
    .min(1, { message: "Marker cost must be greater than or equal to zero" })
    .optional(),
  noOfBlocks: z
    .number()
    .min(1, { message: "Number of blocks must be greater than zero" }),
  dimensions: z.object({
    weight: z.object({
      value: z
        .number()
        .min(0.1, { message: "Weight must be greater than zero" }),
      units: z.literal("tons").default("tons"),
    }),
    length: z.object({
      value: z
        .number()
        .min(0.1, { message: "Length must be greater than zero" }),
      units: z.literal("inch").default("inch"),
    }),
    breadth: z.object({
      value: z
        .number()
        .min(0.1, { message: "Breadth must be greater than zero" }),
      units: z.literal("inch").default("inch"),
    }),
    height: z.object({
      value: z
        .number()
        .min(0.1, { message: "Height must be greater than zero" }),
      units: z.literal("inch").default("inch"),
    }),
  }),
  inStock: z.boolean().optional(),
  SlabsId: z.array(z.string()).optional(),
  blocks: z
    .array(
      z.object({
        materialType: z
          .string()
          .min(1, { message: "Material type is required" })
          .optional(),
        status: z.string().min(1, { message: "Status is required" }).optional(),
        inStock: z.boolean().optional(),
        dimensions: z.object({
          weight: z.object({
            value: z
              .number()
              .min(0.1, { message: "Weight must be greater than zero" }),
            units: z.literal("tons").default("tons"),
          }),
          length: z.object({
            value: z
              .number()
              .min(0.1, { message: "Length must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          breadth: z.object({
            value: z
              .number()
              .min(0.1, { message: "Breadth must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          height: z.object({
            value: z
              .number()
              .min(0.1, { message: "Height must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
        }),
      })
    )
    .min(1, { message: "At least one block is required" }),
});

interface Props {
  params: {
    _id: string;
  };
}

function AddBlockForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0); // State for calculated volume
  const factoryId = useParams().factoryid;
  const lotId = params._id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  // Function to calculate volume
  const calculateVolume = (values: {
    dimensions: {
      length: { value: number | string };
      breadth: { value: number | string };
      height: { value: number | string };
    };
  }) => {
    const length = parseFloat(values.dimensions.length.value as string) || 0;
    const breadth = parseFloat(values.dimensions.breadth.value as string) || 0;
    const height = parseFloat(values.dimensions.height.value as string) || 0;

    const volume = length * breadth * height;
    setVolume(volume);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // Ensure blocks are part of the form submission
    const submissionData = {
      ...values,
      blocks, // Add blocks explicitly
      factoryId,
      lotId,
      status: "inStock",
    };

    try {
      await postData("/factory-management/inventory/raw/add", submissionData);
      setIsLoading(false);
      toast.success("Block added successfully");

      // Redirect instead of reloading
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating Factory:", error);
      setIsLoading(false);
      toast.error("Error creating Factory");
    }
  };

  const [blocks, setBlocks] = React.useState<any[]>([]);
  const [globalWeight, setGlobalWeight] = React.useState<string>("");
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalBreadth, setGlobalBreadth] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyWeightToAll, setApplyWeightToAll] =
    React.useState<boolean>(false);
  const [applyLengthToAll, setApplyLengthToAll] =
    React.useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] =
    React.useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] =
    React.useState<boolean>(false);

  const organizationId = "674b0a687d4f4b21c6c980ba";

  function handleBlocksInputChange(value: string) {
    const count = parseInt(value, 10);

    if (!isNaN(count) && count > 0) {
      const newBlocks = Array.from({ length: count }, (_, index) => ({
        dimensions: {
          blockNumber: index + 1,
          weight: { value: 0, units: "tons" as "tons" },
          length: { value: 0, units: "inch" as "inch" },
          breadth: { value: 0, units: "inch" as "inch" },
          height: { value: 0, units: "inch" as "inch" },
        },
      }));

      setBlocks(newBlocks);
      form.setValue("blocks", newBlocks);
    } else {
      setBlocks([]);
      form.setValue("blocks", []);
    }
  }

  React.useEffect(() => {
    form.setValue("noOfBlocks", blocks.length);
  }, [blocks, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await postData("/factory-management/inventory/addlotandblocks", {
        ...values,
        factoryId,
        organizationId,
        status: "active",
      });
      setIsLoading(false);
      toast.success("Lot created/updated successfully");
      router.push("./");
    } catch (error) {
      console.error("Error creating/updating Lot:", error);
      setIsLoading(false);
      toast.error("Error creating/updating Lot");
    }
    router.refresh();
  }
  function calculateTotalVolume() {
    const totalVolumeInM = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume = (length.value * breadth.value * height.value) / 1000000;
      return total + (volume || 0);
    }, 0);
    return {
      inM: totalVolumeInM,
    };
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="materialCost"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Cost</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter material cost"
                    type="number"
                    disabled={isLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="markerCost"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marker Cost</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter marker cost"
                    type="number"
                    disabled={isLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="transportCost"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transport Cost</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter transport cost"
                    type="number"
                    disabled={isLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="noOfBlocks"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Blocks</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter number of blocks"
                    type="number"
                    disabled={isLoading}
                    onChange={(e) => {
                      field.onChange(e);
                      handleBlocksInputChange(e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <Input
              value={globalWeight}
              onChange={(e) => setGlobalWeight(e.target.value)}
              placeholder="Weight (tons)"
              type="number"
              disabled={isLoading}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <input
                type="checkbox"
                checked={applyWeightToAll}
                onChange={(e) => {
                  setApplyWeightToAll(e.target.checked);
                  if (e.target.checked) {
                    const updatedBlocks = blocks.map((block) => ({
                      ...block,
                      dimensions: {
                        ...block.dimensions,
                        weight: {
                          ...block.dimensions.weight,
                          value: parseFloat(globalWeight) || 0,
                        },
                      },
                    }));
                    setBlocks(updatedBlocks);
                    form.setValue("blocks", updatedBlocks);
                  }
                }}
              />{" "}
              Apply Weight to all rows
            </label>
          </div>
          <div>
            <Input
              value={globalLength}
              onChange={(e) => setGlobalLength(e.target.value)}
              placeholder="Length (cm)"
              type="number"
              disabled={isLoading}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <input
                type="checkbox"
                checked={applyLengthToAll}
                onChange={(e) => {
                  setApplyLengthToAll(e.target.checked);
                  if (e.target.checked) {
                    const updatedBlocks = blocks.map((block) => ({
                      ...block,
                      dimensions: {
                        ...block.dimensions,
                        length: {
                          ...block.dimensions.length,
                          value: parseFloat(globalLength) || 0,
                        },
                      },
                    }));
                    setBlocks(updatedBlocks);
                    form.setValue("blocks", updatedBlocks);
                  }
                }}
              />{" "}
              Apply Length to all rows
            </label>
          </div>
          <div>
            <Input
              value={globalBreadth}
              onChange={(e) => setGlobalBreadth(e.target.value)}
              placeholder="Breadth (cm)"
              type="number"
              disabled={isLoading}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <input
                type="checkbox"
                checked={applyBreadthToAll}
                onChange={(e) => {
                  setApplyBreadthToAll(e.target.checked);
                  if (e.target.checked) {
                    const updatedBlocks = blocks.map((block) => ({
                      ...block,
                      dimensions: {
                        ...block.dimensions,
                        breadth: {
                          ...block.dimensions.breadth,
                          value: parseFloat(globalBreadth) || 0,
                        },
                      },
                    }));
                    setBlocks(updatedBlocks);
                    form.setValue("blocks", updatedBlocks);
                  }
                }}
              />{" "}
              Apply Breadth to all rows
            </label>
          </div>
          <div>
            <Input
              value={globalHeight}
              onChange={(e) => setGlobalHeight(e.target.value)}
              placeholder="Height (cm)"
              type="number"
              disabled={isLoading}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <input
                type="checkbox"
                checked={applyHeightToAll}
                onChange={(e) => {
                  setApplyHeightToAll(e.target.checked);
                  if (e.target.checked) {
                    const updatedBlocks = blocks.map((block) => ({
                      ...block,
                      dimensions: {
                        ...block.dimensions,
                        height: {
                          ...block.dimensions.height,
                          value: parseFloat(globalHeight) || 0,
                        },
                      },
                    }));
                    setBlocks(updatedBlocks);
                    form.setValue("blocks", updatedBlocks);
                  }
                }}
              />{" "}
              Apply Height to all rows
            </label>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Weight (tons)</TableHead>
              <TableHead>Length (cm)</TableHead>
              <TableHead>Breadth (cm)</TableHead>
              <TableHead>Height (cm)</TableHead>
              <TableHead>Volume(m³)</TableHead>
              <TableHead> Vehicle Number </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((block, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={block.dimensions.weight.value}
                    placeholder="Enter weight"
                    onChange={(e) => {
                      const updatedBlocks = [...blocks];
                      updatedBlocks[index].dimensions.weight.value =
                        parseFloat(e.target.value) || 0;
                      setBlocks(updatedBlocks);
                      form.setValue("blocks", updatedBlocks);
                    }}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={block.dimensions.length.value}
                    placeholder="Enter length"
                    onChange={(e) => {
                      const updatedBlocks = [...blocks];
                      updatedBlocks[index].dimensions.length.value =
                        parseFloat(e.target.value) || 0;
                      setBlocks(updatedBlocks);
                      form.setValue("blocks", updatedBlocks);
                    }}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={block.dimensions.breadth.value}
                    placeholder="Enter breadth"
                    onChange={(e) => {
                      const updatedBlocks = [...blocks];
                      updatedBlocks[index].dimensions.breadth.value =
                        parseFloat(e.target.value) || 0;
                      setBlocks(updatedBlocks);
                      form.setValue("blocks", updatedBlocks);
                    }}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={block.dimensions.height.value}
                    placeholder="Enter height"
                    onChange={(e) => {
                      const updatedBlocks = [...blocks];
                      updatedBlocks[index].dimensions.height.value =
                        parseFloat(e.target.value) || 0;
                      setBlocks(updatedBlocks);
                      form.setValue("blocks", updatedBlocks);
                    }}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  {(
                    (block.dimensions.length.value *
                      block.dimensions.breadth.value *
                      block.dimensions.height.value) /
                    1000000
                  ).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Input
                    type="string"
                    placeholder="BH 08 BH 0823"
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => {
                      const updatedBlocks = blocks.filter(
                        (_, i) => i !== index
                      );

                      setBlocks(updatedBlocks);
                      form.setValue("blocks", updatedBlocks);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="text-right font-bold">
                Total Volume (m³): {calculateTotalVolume().inM.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow></TableRow>
          </TableFooter>
        </Table>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default AddBlockForm;
