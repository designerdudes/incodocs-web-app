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
import ConfirmationDialog from "@/components/ConfirmationDialog";
// import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput"; // Removed since we’ll inline the logic
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "../ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

interface MarkCutAndCreateSlabsFormProps {
  BlockData: any;
}

const formSchema = z.object({
  _id: z.string().optional(),
  numberofSlabs: z
    .number()
    .min(1, { message: "Number of slabs must be greater than zero" }),
  slabs: z
    .array(
      z.object({
        lengthImage: z.string().url("Must be a valid URL").optional(),
        heightImage: z.string().url("Must be a valid URL").optional(),
        slabphoto: z.string().url("Must be a valid URL").optional(),
        productName: z.string().min(1, "Product name required"),
        dimensions: z.object({
          length: z.object({
            value: z
              .number({ required_error: "Length is required" })
              .min(0, { message: "Length must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
          height: z.object({
            value: z
              .number({ required_error: "Height is required" })
              .min(0, { message: "Height must be greater than zero" }),
            units: z.literal("inch").default("inch"),
          }),
        }),
      })
    )
    .min(1, { message: "You must define at least one slab" }),
});

export function MarkCutAndCreateSlabsForm({
  BlockData,
}: MarkCutAndCreateSlabsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [slabs, setSlabs] = React.useState<any[]>([]);
  const [globalLength, setGlobalLength] = React.useState<string>("");
  const [globalHeight, setGlobalHeight] = React.useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] = React.useState(false);
  const [applyHeightToAll, setApplyHeightToAll] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [slabCountToBeDeleted, setSlabCountToBeDeleted] = React.useState<
    number | null
  >(null);
  const [slabCountInput, setslabCountInput] = React.useState("1");
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10); // default rows per page

  const paginatedslabs = slabs.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const assignedMachine = BlockData?.cutting?.machineId || null;
 const inTimeRaw = BlockData?.cutting?.["in"] || "";
const inTime = inTimeRaw
  ? new Date(inTimeRaw).toISOString().slice(0, 16) // 👉 "2025-09-10T10:30"
  : "";

  const [outTime, setOutTime] = React.useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: BlockData?._id || "",
      numberofSlabs: BlockData?.numberofSlabs || 1,
      slabs: BlockData?.slabs || [
        {
          lengthImage: "",
          heightImage: "",
          slabphoto: "",
          productName: "", // Note: productName is required, so we might need a default value
          dimensions: {
            length: { value: 0, units: "inch" }, // Default to valid value
            height: { value: 0, units: "inch" }, // Default to valid value
          },
        },
      ],
    },
  });

  const { control, setValue, watch, getValues, trigger } = form;

  // Sync slabs state with form on mount
  React.useEffect(() => {
    const formSlabs = watch("slabs") || [];
    if (formSlabs.length > 0) {
      setSlabs(formSlabs);
    }
  }, [watch]);

  // Save progress
  const saveProgressSilently = (data: any) => {
    try {
      localStorage.setItem("slabsFormData", JSON.stringify(data));
      localStorage.setItem("lastSaved", new Date().toISOString());
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  // Handle slab count (inlined from RawMaterialCreateNewForm)
  const handleSlabCountChange = async (value: string) => {
    const newCount = Number(value) || 1;
    if (newCount < slabs.length) {
      setShowConfirmation(true);
      setSlabCountToBeDeleted(newCount);
    } else {
      const currentSlabs = getValues("slabs") || [];
      const newSlabs = Array.from({ length: newCount }, (_, index) =>
        index < currentSlabs.length
          ? currentSlabs[index]
          : {
              lengthImage: "",
              heightImage: "",
              slabphoto: "",
              productName: `Slab ${index + 1}`, // Default productName to avoid validation issues
              dimensions: {
                length: { value: 0, units: "inch" },
                height: { value: 0, units: "inch" },
              },
            }
      );
      setSlabs(newSlabs);
      setValue("numberofSlabs", newSlabs.length);
      // setValue("slabs", newSlabs);
      setPageIndex(0); // Reset to first page
      saveProgressSilently(getValues());
      const isValid = await trigger("slabs");
      if (!isValid) {
        console.error("Slab validation failed:", form.formState.errors);
      }
    }
  };

  // Confirm reduce
  const handleConfirmChange = () => {
    if (slabCountToBeDeleted !== null) {
      const updatedSlabs = slabs.slice(0, slabCountToBeDeleted);
      setSlabs(updatedSlabs);
      setValue("slabs", updatedSlabs);
      setValue("numberofSlabs", updatedSlabs.length);
      saveProgressSilently(getValues());
      setSlabCountToBeDeleted(null);
      setPageIndex(0); // Reset to first page
    }
    setShowConfirmation(false);
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    const updatedSlabs = slabs.filter((_, i) => i !== index);
    setSlabs(updatedSlabs);
    setValue("slabs", updatedSlabs);
    setValue("numberofSlabs", updatedSlabs.length);
    saveProgressSilently(getValues());
    if (pageIndex * pageSize >= updatedSlabs.length && pageIndex > 0) {
      setPageIndex(Math.max(0, Math.ceil(updatedSlabs.length / pageSize) - 1));
    }
  };

  // Apply global dims
  React.useEffect(() => {
    if (applyLengthToAll || applyHeightToAll) {
      const updatedSlabs = slabs.map((slab) => ({
        ...slab,
        dimensions: {
          length: applyLengthToAll
            ? { value: parseFloat(globalLength) || 0, units: "inch" }
            : slab.dimensions.length,
          height: applyHeightToAll
            ? { value: parseFloat(globalHeight) || 0, units: "inch" }
            : slab.dimensions.height,
        },
      }));
      setSlabs(updatedSlabs);
      setValue("slabs", updatedSlabs, { shouldValidate: true });
      saveProgressSilently(getValues());
    }
  }, [
    globalLength,
    globalHeight,
    applyLengthToAll,
    applyHeightToAll,
    setValue,
  ]);

  // Calculate sqft
  function calculateSqft(length?: number, height?: number): string {
    const lengthInFeet = (length || 0) / 12;
    const heightInFeet = (height || 0) / 12;
    const area = lengthInFeet * heightInFeet;
    return area > 0 ? area.toFixed(2) : "0.00";
  }

  function calculateTotalSqft(): string {
    const totalSqft = slabs.reduce((sum, slab) => {
      const lengthInFeet = (slab?.dimensions?.length?.value || 0) / 12;
      const heightInFeet = (slab?.dimensions?.height?.value || 0) / 12;
      return sum + lengthInFeet * heightInFeet;
    }, 0);
    return totalSqft.toFixed(2);
  }

  // Submit
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!assignedMachine) return;
    setIsLoading(true);

    try {
      const body = {
        machineId: assignedMachine._id,
        inTime,
        outTime,
        slabs: values.slabs,
      };

      await putData(
        `/factory-management/inventory/raw/markcut/${BlockData._id}`,
        body
      );
      toast.success("Slabs updated successfully");
      router.refresh();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update slabs");
    } finally {
      setIsLoading(false);
    }
  };

  const length = BlockData?.netDimensions?.length?.value ?? 0;
  const breadth = BlockData?.netDimensions?.breadth?.value ?? 0;
  const height = BlockData?.netDimensions?.height?.value ?? 0;
  const density = 3.5;
  const Volume = (length * breadth * height) / 1_000_000;
  const weight = Volume * density;


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>End to End Measurement</AccordionTrigger>
            <AccordionContent>
              {BlockData?.dimensions && (
                <div className="border p-3 rounded-lg bg-gray-100">
                  <h3 className="font-semibold mb-2">Original Block</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <div>
                      <Label>Length (cm)</Label>
                      <Input
                        type="number"
                        value={BlockData?.dimensions?.length?.value ?? ""}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Breadth (cm)</Label>
                      <Input
                        type="number"
                        value={BlockData?.dimensions?.breadth?.value ?? ""}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Height (cm)</Label>
                      <Input
                        type="number"
                        value={BlockData?.dimensions?.height?.value ?? ""}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Volume (m³)</Label>
                      <Input
                        type="number"
                        value={Volume ? Volume.toFixed(2) : ""}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Weight (tons)</Label>
                      <Input
                        type="number"
                        value={
                          BlockData?.dimensions?.weight?.value?.toFixed(2) ?? ""
                        }
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible defaultValue="item-2">
          <AccordionItem value="item-2">
            <AccordionTrigger>Net Measurement</AccordionTrigger>
            <AccordionContent>
              <div className="border p-3 rounded-lg bg-gray-100">
                <h3 className="font-semibold mb-2">Net Dimensions Block</h3>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <Label>Length (cm)</Label>
                    <Input type="number" value={length || ""} disabled />
                  </div>
                  <div>
                    <Label>Breadth (cm)</Label>
                    <Input type="number" value={breadth || ""} disabled />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input type="number" value={height || ""} disabled />
                  </div>
                  <div>
                    <Label>Volume (m³)</Label>
                    <Input
                      type="number"
                      value={Volume ? Volume.toFixed(2) : ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Weight (tons)</Label>
                    <Input
                      type="number"
                      value={weight ? weight.toFixed(2) : ""}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {assignedMachine && (
          <div className="border p-3 rounded-lg bg-gray-100 space-y-2">
            <div>
              <Label>Machine Used</Label>
              <Input type="text" value={assignedMachine.machineName} disabled />
            </div>
            <div>
              <Label>In Time (Date & Time)</Label>
              <Input type="datetime-local" value={inTime} disabled />
            </div>
          </div>
        )}
        <div className="border p-3 rounded-lg bg-white space-y-3">
          <Label>Out Time (Date & Time)</Label>
          <Input
            type="datetime-local"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 ">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="numberofSlabs"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Slabs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      disabled={isLoading}
                      value={slabCountInput}
                      onChange={async (e) => {
                        let val = e.target.value;
                        if (val.length > 3) {
                          val = val.slice(0, 3);
                        }
                        setslabCountInput(val);
                        const n = Math.max(1, parseInt(val || "1", 10));
                        field.onChange(n);
                        await handleSlabCountChange(String(n));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Length (inches)"
                type="number"
                min="0"
                value={globalLength}
                onChange={(e) => setGlobalLength(e.target.value)}
              />
              <label className="text-sm flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={applyLengthToAll}
                  onChange={(e) => setApplyLengthToAll(e.target.checked)}
                />
                <span className="ml-2">Apply Length to all</span>
              </label>
            </div>
            <div>
              <Input
                placeholder="Height (inches)"
                type="number"
                min="0"
                value={globalHeight}
                onChange={(e) => setGlobalHeight(e.target.value)}
              />
              <label className="text-sm flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={applyHeightToAll}
                  onChange={(e) => setApplyHeightToAll(e.target.checked)}
                />
                <span className="ml-2">Apply Height to all</span>
              </label>
            </div>
          </div>

          {slabs.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Length (inch)</TableHead>
                  <TableHead>Height (inch)</TableHead>
                  <TableHead>Area (sqft)</TableHead>
                  <TableHead>Slab Photo</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedslabs.map((slab, index) => {
                  const globalIndex = pageIndex * pageSize + index;
                  return (
                    <TableRow key={globalIndex}>
                      <TableCell>{globalIndex + 1}</TableCell>
                      <TableCell>
                        <Input
                          placeholder="Product Name"
                          value={slab?.productName}
                          onChange={(e) => {
                            const updated = [...slabs];
                            updated[globalIndex].productName = e.target.value;
                            setSlabs(updated);
                            setValue("slabs", updated, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={slab?.dimensions?.length?.value}
                          onChange={(e) => {
                            const updated = [...slabs];
                            updated[globalIndex].dimensions.length.value =
                              parseFloat(e.target.value) || undefined;
                            setSlabs(updated);
                            setValue("slabs", updated);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={slab?.dimensions?.height?.value}
                          onChange={(e) => {
                            const updated = [...slabs];
                            updated[globalIndex].dimensions.height.value =
                              parseFloat(e.target.value) || undefined;
                            setSlabs(updated);
                            setValue("slabs", updated);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {calculateSqft(
                          slab?.dimensions?.length?.value,
                          slab?.dimensions?.height?.value
                        )}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`slabs.${globalIndex}.slabphoto`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <FileUploadField
                                    name={field.name}
                                    value={field.value || ""}
                                    onChange={(value) => {
                                      const updated = [...slabs];
                                      updated[globalIndex].slabphoto =
                                        value || "";
                                      setSlabs(updated);
                                      setValue("slabs", updated, {
                                        shouldValidate: true,
                                      });
                                      saveProgressSilently(getValues());
                                    }}
                                    storageKey="slabphoto"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => handleDeleteRow(globalIndex)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={9} className="text-right">
                    Total Area (sqft): {calculateTotalSqft()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
          <div className="flex items-center justify-between gap-8 h-[5%]">
            <div className="flex items-center gap-3">
              <Label className="max-sm:sr-only">Rows per page</Label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  const newPageSize = Number(value);
                  setPageSize(newPageSize);
                  setPageIndex(0);
                  console.log("New pageSize:", newPageSize);
                }}
              >
                <SelectTrigger className="w-fit whitespace-nowrap">
                  <SelectValue placeholder="Select number of results" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
              <p aria-live="polite">
                <span className="text-foreground">
                  {slabs.length === 0 ? 0 : pageIndex * pageSize + 1}-
                  {Math.min((pageIndex + 1) * pageSize, slabs.length)}
                </span>{" "}
                of <span className="text-foreground">{slabs.length}</span>
              </p>
            </div>

            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setPageIndex(0)}
                      disabled={pageIndex === 0}
                    >
                      <ChevronFirstIcon size={16} />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setPageIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={pageIndex === 0}
                    >
                      <ChevronLeftIcon size={16} />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setPageIndex((prev) =>
                          Math.min(
                            prev + 1,
                            Math.ceil(slabs.length / pageSize) - 1
                          )
                        )
                      }
                      disabled={
                        pageIndex >= Math.ceil(slabs.length / pageSize) - 1
                      }
                    >
                      <ChevronRightIcon size={16} />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setPageIndex(Math.ceil(slabs.length / pageSize) - 1)
                      }
                      disabled={
                        pageIndex >= Math.ceil(slabs.length / pageSize) - 1
                      }
                    >
                      <ChevronLastIcon size={16} />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Update Slabs"}
          </Button>

          <ConfirmationDialog
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmChange}
            title="Are you sure?"
            description="You are reducing the number of slabs. This action cannot be undone."
          />
        </form>
      </Form>
    </div>
  );
}
