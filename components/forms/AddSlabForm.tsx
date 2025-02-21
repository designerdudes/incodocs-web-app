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
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { putData } from "@/axiosUtility/api";

interface AddSlabsFormProps {
  gap: number;
  BlockData: any;
}

const formSchema = z.object({
  _id: z.string().optional(),
  numberofSlabs: z.string().regex(/^[1-9]\d*$/, {
    message: "Number of slabs must be a positive number",
  }),
  slabs: z
    .array(
      z.object({
        dimensions: z.object({
          length: z.object({
            value: z
              .number({ required_error: "Length is required" })
              .min(0.1, { message: "Length must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          height: z.object({
            value: z
              .number({ required_error: "Height is required" })
              .min(0.1, { message: "Height must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          status: z.literal("readyForPolish").default("readyForPolish"),
        }),
      })
    )
    .min(1, { message: "You must define at least one slab" }),
});

export function AddSlabForm({ BlockData, gap }: AddSlabsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [slabsCount, setSlabsCount] = React.useState(0);
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] = React.useState(false);
  const [applyHeightToAll, setApplyHeightToAll] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: BlockData?._id || "",
      numberofSlabs: BlockData?.numberofSlabs || "",
      slabs: BlockData?.slabs || [],
    },
  });

  function handleSlabsInputChange(value: string) {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      setSlabsCount(count);
      const defaultDimensions = {
        length: { value: 0, units: "inch" as "inch" },
        height: { value: 0, units: "inch" as "inch" },
        status: "readyForPolish" as "readyForPolish",
      };
      form.setValue(
        "slabs",
        Array.from({ length: count }, () => ({ dimensions: defaultDimensions }))
      );
    } else {
      setSlabsCount(0);
      form.setValue("slabs", []);
    }
  }

  React.useEffect(() => {
    if (applyLengthToAll || applyHeightToAll) {
      const updatedSlabs = form.getValues("slabs") || [];
      const newSlabs = updatedSlabs.map((slab) => ({
        dimensions: {
          ...slab.dimensions,
          length: applyLengthToAll
            ? { value: Number(globalLength) || 0, units: "inch" as "inch" }
            : slab.dimensions.length,
          height: applyHeightToAll
            ? { value: Number(globalHeight) || 0, units: "inch" as "inch" }
            : slab.dimensions.height,
        },
      }));
      form.setValue("slabs", newSlabs, { shouldValidate: true });
    }
  }, [globalLength, globalHeight, applyLengthToAll, applyHeightToAll]);

  function calculateSqft(length?: number, height?: number): string {
    const lengthInFeet = (length || 0) / 12;
    const heightInFeet = (height || 0) / 12;
    const area = lengthInFeet * heightInFeet;
    return area > 0 ? area.toFixed(2) : "0.00";
  }

  function handleDeleteRow(index: number) {
    const updatedSlabs = [...form.getValues("slabs")];
    updatedSlabs.splice(index, 1);
    setSlabsCount(updatedSlabs.length);
    form.setValue("slabs", updatedSlabs);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await putData(
        `/factory-management/inventory/updateblockaddslab/${BlockData._id}`,
        {
          ...values,
          status: "cut",
        }
      );

      toast.success("Slab Added successfully");

      // Navigate back to the Processing page
      router.back();

      // Force reload after navigation
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("An error occurred while updating data");
    } finally {
      setIsLoading(false);
    }
  }

  function calculateTotalSqft(): string {
    const slabs = form.getValues("slabs") || [];
    const totalSqft = slabs.reduce((sum, slab) => {
      const lengthInFeet = (slab.dimensions.length.value || 0) / 12;
      const heightInFeet = (slab.dimensions.height.value || 0) / 12;
      return sum + lengthInFeet * heightInFeet;
    }, 0);
    return totalSqft.toFixed(2); // Round to 2 decimal places
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className={`grid grid-cols-${gap} gap-3`}>
            <FormField
              name="numberofSlabs"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Slabs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of slabs"
                      disabled={isLoading}
                      value={field.value}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        field.onChange(value.toString());
                        handleSlabsInputChange(value.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Length(inches)"
                type="number"
                value={globalLength}
                onChange={(e) => setGlobalLength(e.target.value)}
                disabled={isLoading}
              />
              <label className="text-sm font-medium flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={applyLengthToAll}
                  onChange={(e) => setApplyLengthToAll(e.target.checked)}
                />{" "}
                Apply Length (inches) to all rows
              </label>
            </div>
            <div>
              <Input
                placeholder="Height(inches)"
                type="number"
                value={globalHeight}
                onChange={(e) => setGlobalHeight(e.target.value)}
                disabled={isLoading}
              />
              <label className="text-sm font-medium flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={applyHeightToAll}
                  onChange={(e) => setApplyHeightToAll(e.target.checked)}
                />{" "}
                Apply Height (inches) to all rows
              </label>
            </div>
          </div>
          {slabsCount > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Length(inches)</TableHead>
                  <TableHead>Height(inches)</TableHead>
                  <TableHead>Area (sqft)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.getValues("slabs").map((slab, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        name={`slabs.${index}.dimensions.length.value`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Length"
                                type="number"
                                value={slab.dimensions.length.value}
                                onChange={(e) => {
                                  const slabs = form.getValues("slabs");
                                  slabs[index].dimensions.length.value =
                                    parseFloat(e.target.value) || 0;
                                  form.setValue("slabs", slabs, {
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
                        name={`slabs.${index}.dimensions.height.value`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Height"
                                type="number"
                                value={slab.dimensions.height.value}
                                onChange={(e) => {
                                  const slabs = form.getValues("slabs");
                                  slabs[index].dimensions.height.value =
                                    parseFloat(e.target.value) || 0;
                                  form.setValue("slabs", slabs, {
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
                      {calculateSqft(
                        slab.dimensions.length.value,
                        slab.dimensions.height.value
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>
                    Total Area (sqft): {calculateTotalSqft()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
          <Button type="submit" disabled={isLoading}>
            Add Slabs
          </Button>
        </form>
      </Form>
    </div>
  );
}
