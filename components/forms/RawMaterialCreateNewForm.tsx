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
import { postData } from "@/axiosUtility/api";

interface RawMaterialCreateNewFormProps {
  gap: number;
}

const formSchema = z.object({
  lotName: z
    .string()
    .min(3, { message: "Lot name must be at least 3 characters long" }),
  materialType: z
    .string()
    .min(3, { message: "Material type must be at least 3 characters long" }),
  noOfBlocks: z
    .number()
    .min(1, { message: "Number of blocks must be greater than zero" }),
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

export function RawMaterialCreateNewForm({
  gap,
}: RawMaterialCreateNewFormProps) {
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

  function applyIndividualGlobalDataToAllRows() {
    const updatedBlocks = blocks.map((entry) => ({
      ...entry,
      weight: applyWeightToAll
        ? parseFloat(globalWeight) || entry.weight
        : entry.weight,
      length: applyLengthToAll
        ? parseFloat(globalLength) || entry.length
        : entry.length,
      breadth: applyBreadthToAll
        ? parseFloat(globalBreadth) || entry.breadth
        : entry.breadth,
      height: applyHeightToAll
        ? parseFloat(globalHeight) || entry.height
        : entry.height,
    }));
    setBlocks(updatedBlocks);
    form.setValue("blocks", updatedBlocks);
  }

  React.useEffect(() => {
    form.setValue("noOfBlocks", blocks.length);
  }, [blocks, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("values", values);
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
    const totalVolumeInInches = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume = length.value * breadth.value * height.value;
      return total + (volume || 0); // Add only valid volumes
    }, 0);

    const totalVolumeInCm = totalVolumeInInches * 16.387; // Convert to cm³

    return {
      inInches: totalVolumeInInches,
      inCm: totalVolumeInCm,
    };
  }


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`grid grid-cols-3 gap-3`}>
            <FormField
              name="lotName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Xyz" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="materialType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Granite"
                      disabled={isLoading}
                      {...field}
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
                placeholder="Length (inch)"
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
                placeholder="Breadth (inch)"
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
                placeholder="Height (inch)"
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
                <TableHead>Length (inch)</TableHead>
                <TableHead>Breadth (inch)</TableHead>
                <TableHead>Height (inch)</TableHead>
                <TableHead>Volume(in³)</TableHead>
                <TableHead>Volume(cm³)</TableHead>
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
                      block.dimensions.length.value *
                      block.dimensions.breadth.value *
                      block.dimensions.height.value
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {(
                      block.dimensions.length.value *
                      block.dimensions.breadth.value *
                      block.dimensions.height.value *
                      2.54
                    ).toFixed(2)}
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
                <TableCell colSpan={5} className="text-right font-bold">
                  Total Volume (in³): {calculateTotalVolume().inInches.toFixed(2)}
                </TableCell>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total Volume (cm³): {calculateTotalVolume().inCm.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>


              </TableRow>
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
