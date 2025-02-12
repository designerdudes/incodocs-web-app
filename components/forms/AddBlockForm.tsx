"use client";
import * as React from "react";
import * as z from "zod";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "../ui/table";
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
import { useParams, useRouter } from "next/navigation";
import { Trash, Volume } from "lucide-react";
import { postData, putData } from "@/axiosUtility/api";

interface AddBlockFormProps {
  params: {
    lotId: string;
  };
  gap: number;
}

const formSchema = z.object({
  markerCost: z
    .number()
    .min(1, { message: "Marker cost must be greater than or equal to zero" })
    .optional(),
  transportCost: z
    .number()
    .min(1, { message: "Transport cost must be greater than or equal to zero" })
    .optional(),
  materialCost: z
    .number()
    .min(1, { message: "Material cost must be greater than or equal to zero" })
    .optional(),
  noOfBlocks: z
    .number()
    .min(1, { message: "Number of blocks must be greater than zero" }),
  blocks: z
    .array(
      z.object({
        dimensions: z.object({
          weight: z.object({
            value: z
              .number({ required_error: "Weight is required" })
              .min(0.1, { message: "Weight is required" }),
            units: z.literal("tons").default("tons"),
          }),
          length: z.object({
            value: z
              .number({ required_error: "Length is required" })
              .min(0.1, { message: "Length is requied" }),
            units: z.literal("inch").default("inch"),
          }),
          breadth: z.object({
            value: z
              .number({ required_error: "Breadth is required" })
              .min(0.1, { message: "Breadth is required" }),
            units: z.literal("inch").default("inch"),
          }),
          height: z.object({
            value: z
              .number({ required_error: "Height is required" })
              .min(0.1, { message: "Height is required" }),
            units: z.literal("inch").default("inch"),
          }),
        }),
      })
    )
    .min(1, { message: "At least one block is required" }),
});

export function AddBlockForm({ params }: AddBlockFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
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
  const factoryId = useParams().factoryid;
  const organizationId = "674b0a687d4f4b21c6c980ba";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  let lotId = params.lotId;
  console.log("this is lot id", params.lotId);

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

    const submissionData = {
      ...values,
      lotId,
      blocks,
      factoryId,
      organizationId,
      status: "active",
    };

    console.log("Submitting data:", submissionData); // Debugging

    try {
      await putData(
        `/factory-management/inventory/updatelotaddblocks/${params.lotId}`,
        submissionData
      );
      setIsLoading(false);
      toast.success("Block created/updated successfully");
      router.push("../");
    } catch (error) {
      console.error("Error creating/updating Block:", error);
      setIsLoading(false);
      toast.error("Error creating/updating Block");
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`grid grid-cols-3 gap-3`}>
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
                      value={field.value === 0 ? "" : field.value} // Check if field.value is 0 and render an empty string instead
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
                    <FormField
                      name={`blocks.${index}.dimensions.weight.value`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Weight"
                              type="number"
                              value={block.dimensions.weight.value}
                              onChange={(e) => {
                                const slabs = form.getValues("blocks");
                                blocks[index].dimensions.weight.value =
                                  parseFloat(e.target.value) || 0;
                                form.setValue("blocks", slabs, {
                                  shouldValidate: true,
                                });
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`blocks.${index}.dimensions.length.value`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Length"
                              type="number"
                              value={block.dimensions.length.value}
                              onChange={(e) => {
                                const slabs = form.getValues("blocks");
                                blocks[index].dimensions.length.value =
                                  parseFloat(e.target.value) || 0;
                                form.setValue("blocks", slabs, {
                                  shouldValidate: true,
                                });
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`blocks.${index}.dimensions.breadth.value`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Breadth"
                              type="number"
                              value={block.dimensions.breadth.value}
                              onChange={(e) => {
                                const slabs = form.getValues("blocks");
                                blocks[index].dimensions.breadth.value =
                                  parseFloat(e.target.value) || 0;
                                form.setValue("blocks", slabs, {
                                  shouldValidate: true,
                                });
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`blocks.${index}.dimensions.height.value`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Height"
                              type="number"
                              value={block.dimensions.height.value}
                              onChange={(e) => {
                                const slabs = form.getValues("blocks");
                                blocks[index].dimensions.height.value =
                                  parseFloat(e.target.value) || 0;
                                form.setValue("blocks", slabs, {
                                  shouldValidate: true,
                                });
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
