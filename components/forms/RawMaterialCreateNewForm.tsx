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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { fetchData, postData } from "@/axiosUtility/api";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useEffect, useState, useRef } from "react";
import { debounce } from "lodash";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

// Save progress to localStorage
const saveProgressSilently = (data: any) => {
  try {
    localStorage.setItem("rawMaterialFormData", JSON.stringify(data));
    localStorage.setItem("lastSaved", new Date().toISOString());
  } catch (error) {
    console.error("Failed to save progress to localStorage:", error);
  }
};

// Function to calculate weight based on dimensions
const calculateWeight = (length: number, breadth: number, height: number) => {
  const volumeInCubicInches = length * breadth * height;
  const volumeInCubicMeters = volumeInCubicInches / 1000000;

  const density = 3.5; // tons per m³
  const weight = volumeInCubicMeters * density;
  return Number(weight.toFixed(2));
};

// Define the form schema
const formSchema = z.object({
  lotName: z
    .string()
    .min(2, { message: "Lot name must be at least 3 characters long" })
    .optional(),
  materialType: z
    .string()
    .min(3, { message: "Material type must be at least 2 characters long" })
    .optional(),
  markerCost: z
    .number()
    .min(0, { message: "Marker cost must be greater than or equal to zero" })
    .optional(),
  blockLoadingCost: z
    .number()
    .min(0, { message: "Transport cost must be greater than or equal to zero" })
    .optional(),
  materialCost: z
    .number()
    .min(0, { message: "Material cost must be greater than or equal to zero" })
    .optional(),
  quarryName: z
    .string()
    .min(3, { message: "Quarry name must be at least 3 characters long" })
    .optional(),
  quarryCost: z
    .number()
    .min(0, { message: "Quarry cost must be greater than or equal to zero" })
    .optional(),
  commissionCost: z
    .number()
    .min(0, {
      message: "Commission cost must be greater than or equal to zero",
    })
    .optional(),
  markerOperatorName: z
    .string()
    .min(1, { message: "Marker name is required" })
    .optional(),
  noOfBlocks: z
    .number()
    .min(1, { message: "Number of blocks must be greater than zero" })
    .optional(),
  blocks: z
    .array(
      z.object({
        blockNumber: z.string().optional(),
        materialType: z.string().optional(),
        inStock: z.boolean().optional(),
        blockphoto: z.string().optional(),
        vehicleNumber: z.string().optional(),
        dimensions: z.object({
          weight: z.object({
            value: z
              .number()
              .min(1, { message: "Weight must be greater than zero" }),
            units: z.literal("tons").default("tons"),
          }),
          length: z.object({
            value: z
              .number()
              .min(1, { message: "Length must be greater than zero" }),
            units: z.enum(["cm", "inch"]).default("inch"),
          }),
          breadth: z.object({
            value: z
              .number()
              .min(1, { message: "Breadth must be greater than zero" }),
            units: z.enum(["cm", "inch"]).default("inch"),
          }),
          height: z.object({
            value: z
              .number()
              .min(1, { message: "Height must be greater than zero" }),
            units: z.enum(["cm", "inch"]).default("inch"),
          }),
        }),
      })
    )
    .min(1, { message: "At least one block is required" }),
});

interface RawMaterialCreateNewFormProps {
  gap: number;
}

export interface Quarry {
  _id: any;
  lesseeId?: string;
  lesseeName?: string;
  mineralName?: string;
  businessLocationNames?: string[];
  factoryId?: any;
  documents?: {
    fileName?: string;
    fileUrl?: string;
    date?: Date;
    review?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export function RawMaterialCreateNewForm({ }: RawMaterialCreateNewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [globalLength, setGlobalLength] = useState<string>("");
  const [globalBreadth, setGlobalBreadth] = useState<string>("");
  const [globalHeight, setGlobalHeight] = useState<string>("");
  const [applyLengthToAll, setApplyLengthToAll] = useState<boolean>(false);
  const [applyBreadthToAll, setApplyBreadthToAll] = useState<boolean>(false);
  const [applyHeightToAll, setApplyHeightToAll] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [blockCountToBeDeleted, setBlockCountToBeDeleted] = useState<
    number | null
  >(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5); // default rows per page

  // 👇 put it right here
  const paginatedBlocks = blocks.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );
const [blockCountInput, setBlockCountInput] = useState("1");
  const [search, setSearch] = useState("");
  const [quarries, setQuarries] = useState<Quarry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const factoryId = useParams().factoryid;
  const organizationId = useParams().organizationId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noOfBlocks: 1,
      blocks: [
        {
          blockNumber: "",
          materialType: "",
          inStock: true,
          blockphoto: "",
          vehicleNumber: "",
          dimensions: {
            weight: { value: 0, units: "tons" },
            length: { value: undefined, units: "inch" },
            breadth: { value: undefined, units: "inch" },
            height: { value: undefined, units: "inch" },
          },
        },
      ],
    },
  });

  const { control, setValue, watch, getValues, trigger } = form;

  // Sync blocks state with form on mount
  useEffect(() => {
    const formBlocks = watch("blocks") || [];
    if (formBlocks.length > 0) {
      setBlocks(formBlocks);
    }
  }, [watch]);

  // Watch for changes in dimensions and update weight
  useEffect(() => {
    blocks.forEach((block, index) => {
      const { length, breadth, height } = block.dimensions;
      if (length.value && breadth.value && height.value) {
        const calculatedWeight = calculateWeight(
          length.value,
          breadth.value,
          height.value
          // length.units
        );
        setValue(`blocks.${index}.dimensions.weight.value`, calculatedWeight);
      }
    });
    saveProgressSilently(getValues());
  }, [blocks, setValue, getValues]);

  // Restore focus after state updates
  useEffect(() => {
    if (dropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [search, quarries, dropdownOpen]);

  // Handle block count changes
  const handleBlockCountChange = async (value: string) => {
    const newCount = Number(value) || 1;
    if (newCount < blocks.length) {
      setShowConfirmation(true);
      setBlockCountToBeDeleted(newCount);
    } else {
      const currentBlocks = getValues("blocks") || [];
      const newBlocks = Array.from({ length: newCount }, (_, index) =>
        index < currentBlocks.length
          ? currentBlocks[index]
          : {
            blockNumber: "",
            materialType: "",
            inStock: true,
            blockphoto: "",
            vehicleNumber: "",
            dimensions: {
              weight: { value: 0, units: "tons" },
              length: { value: undefined, units: "inch" },
              breadth: { value: undefined, units: "inch" },
              height: { value: undefined, units: "inch" },
            },
          }
      );
      setBlocks(newBlocks);
      // setValue("blocks", newBlocks);
      setValue("noOfBlocks", newBlocks.length);
      saveProgressSilently(getValues());
      const isValid = await trigger("blocks");
      if (!isValid) {
        console.error("Block validation failed:", form.formState.errors);
      }
    }
  };

  // Handle confirmation for reducing block count
  const handleConfirmChange = () => {
    if (blockCountToBeDeleted !== null) {
      const updatedBlocks = blocks.slice(0, blockCountToBeDeleted);
      setBlocks(updatedBlocks);
      setValue("blocks", updatedBlocks);
      setValue("noOfBlocks", updatedBlocks.length);
      saveProgressSilently(getValues());
      setBlockCountToBeDeleted(null);
    }
    setShowConfirmation(false);
  };

  // Handle block deletion
  const handleDeleteBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
    setValue("blocks", updatedBlocks);
    setValue("noOfBlocks", updatedBlocks.length);
    saveProgressSilently(getValues());
  };

  // Form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const isValid = await trigger();
    if (!isValid) {
      console.error("Form validation failed:", form.formState.errors);
      toast.error("Please fill all required fields correctly");
      setIsLoading(false);
      return;
    }
    try {
      const payload = {
        ...values,
        materialType: values.materialType || "granite",
        materialCost: values.materialCost || 0,
        markerCost: values.markerCost || 0,
        blockLoadingCost: values.blockLoadingCost || 0,
        quarryCost: values.quarryCost || 0,
        commissionCost: values.commissionCost || 0,
        markerOperatorName: values.markerOperatorName || "",
        quarryName: values.quarryName || "",
        factoryId,
        organizationId,
        status: "active",
        blocks: values.blocks.map((block) => ({
          blockNumber: block.blockNumber || "",
          materialType: block.materialType || "",
          blockphoto: block.blockphoto || "",
          vehicleNumber: block.vehicleNumber || "",
          inStock: block.inStock ?? true,
          dimensions: {
            weight: { value: block.dimensions.weight.value, units: "tons" },
            length: { value: block.dimensions.length.value, units: "inch" },
            breadth: { value: block.dimensions.breadth.value, units: "inch" },
            height: { value: block.dimensions.height.value, units: "inch" },
          },
        })),
      };
      await postData("/factory-management/inventory/addlotandblocks", payload);
      toast.success("Lot created/updated successfully");
      router.push("./");
      setTimeout(() => localStorage.removeItem("rawMaterialFormData"), 3000);
    } catch (error) {
      console.error("Error creating/updating Lot:", error);
      toast.error("Error creating/updating Lot");
    } finally {
      setIsLoading(false);
    }
    router.refresh();
  }

  // Calculate total volume
  function calculateTotalVolume() {
    const totalVolumeInM = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume = (length.value * breadth.value * height.value) / 1000000;

      // length.value * breadth.value * height.value * (length.units === "inch" ? 0.000016387064 : 0.000001);
      return total + (volume || 0);
    }, 0);
    return {
      inM: totalVolumeInM,
    };
  }

  // Calculate total weight
  function calculateTotalWeight() {
    const totalWeightInTons = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const l = length ?? 0
      const b = breadth ?? 0
      const h = height ?? 0
      const volume = (l.value * b.value * h.value) / 1000000 || 0; // m³
      const density = 3.5; // Example density in tons/m³
      //   length.value * breadth.value * height.value * (length.units === "inch" ? 0.000016387064 : 0.000001);
      // const density = 3.5;
      const weight = volume * density;
      return total + weight;
    }, 0);
    return {
      inTons: totalWeightInTons,
    };
  }

  // Optimized fetchQuarries
  const fetchQuarries = React.useCallback(
    debounce(
      async (search: string, pageNo = 1) => {
        try {
          setLoading(true);
          const res = await fetchData(
            `/quarry/getbyfactory/${factoryId}?search=${search}&page=${pageNo}&limit=50`
          );
          const data = res;
          if (pageNo === 1) {
            setQuarries(data.data || data);
          } else {
            setQuarries((prev) => [...prev, ...(data.data || data)]);
          }
          setHasMore((data?.data?.length || data.length) === 50);
        } catch (err) {
          console.error("Failed to fetch:", err);
        } finally {
          setLoading(false);
        }
      },
      500,
      { leading: false, trailing: true }
    ),
    [factoryId]
  );

  // Trigger fetchQuarries and reset page on search change
  useEffect(() => {
    if (dropdownOpen && factoryId) {
      setPage(1);
      setQuarries([]);
      fetchQuarries(search, 1);
    }
  }, [search, dropdownOpen, fetchQuarries]);

  // Handle page increment separately
  useEffect(() => {
    if (page > 1 && dropdownOpen && factoryId) {
      fetchQuarries(search, page);
    }
  }, [page, dropdownOpen, fetchQuarries, search]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        saveProgressSilently(getValues());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [getValues]);

  // Handle quarry selection
  const handleQuarrySelect = (lesseeName: string) => {
    setSearch(lesseeName);
    setValue("quarryName", lesseeName);
    setDropdownOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
    saveProgressSilently(getValues());
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="lotName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:LotName"
                      disabled={isLoading}
                      {...field}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="materialType"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:Granite"
                      disabled={isLoading}
                      {...field}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="materialCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter material cost"
                      min={0} // prevents typing negatives
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Math.max(0, parseFloat(value)) : undefined; // clamp to 0
                        field.onChange(numValue);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="markerCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marker Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter marker cost"
                      type="number"
                      min={0}
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Math.max(0, parseFloat(value)) : undefined;
                        field.onChange(numValue);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="blockLoadingCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Block Loading Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Block Loading Cost"
                      type="number"
                      min={0}
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Math.max(0, parseFloat(value)) : undefined;
                        field.onChange(numValue);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="markerOperatorName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marker Operator</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Operator Name"
                      disabled={isLoading}
                      {...field}
                      value={field.value ?? ""}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="quarryName"
              control={control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Quarry Name</FormLabel>
                  <FormControl>
                    <Input
                      ref={inputRef}
                      placeholder="Enter Quarry Name"
                      disabled={isLoading || loading}
                      value={search}
                      onFocus={() => setDropdownOpen(true)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearch(val);
                        field.onChange(val);
                        setPage(1);
                        setQuarries([]);
                        fetchQuarries(val);
                        setDropdownOpen(true);
                      }}
                    />
                  </FormControl>

                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto"
                    >
                      {/* Quarry list or "No results" */}
                      {quarries.length > 0 ? (
                        quarries.map((item) => (
                          <div
                            key={item._id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleQuarrySelect(
                                `${item.lesseeName} - ${item.lesseeId}`
                              );
                            }}
                          >
                            {`${item.lesseeName} - ${item.lesseeId}`}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          {loading ? "Loading..." : "No results found"}
                        </div>
                      )}

                      {/* Load more if available */}
                      {hasMore && quarries.length > 0 && (
                        <div
                          className="p-2 text-center text-blue-500 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setPage((prev) => prev + 1);
                          }}
                        >
                          Load more...
                        </div>
                      )}

                      {/* Always show Add New Quarry option */}
                      <div
                        className="p-2 text-blue-500 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          window.open(
                            `/${organizationId}/${factoryId}/factorymanagement/parties/quarry/createNew`,
                            "_blank"
                          );
                        }}
                      >
                        + Add New Quarry
                      </div>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="quarryCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quarry Transport Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Quarry Transport Cost"
                      min={0}
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Math.max(0, parseFloat(value)) : undefined;
                        field.onChange(numValue);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="commissionCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Commission Cost"
                      min={0}
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value ? Math.max(0, parseFloat(value)) : undefined;
                        field.onChange(numValue);
                      }}
                      value={field.value ?? undefined}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
  control={control}
  name="noOfBlocks"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Number of Blocks</FormLabel>
      <FormControl>
        <Input
          type="number"
          min={1}
          placeholder="Enter number of blocks"
          value={blockCountInput}
          onChange={async (e) => {
            const val = e.target.value;
            setBlockCountInput(val);

            const n = Math.max(1, parseInt(val || "1", 10));
            field.onChange(n); // keep RHF in sync
            await handleBlockCountChange(String(n)); // update rows
          }}
        />
      </FormControl>
    </FormItem>
  )}
/>

          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Input
                value={globalLength}
                type="number"
                onWheel={(e) =>
                  e.target instanceof HTMLElement && e.target.blur()
                }
                onChange={(e) => setGlobalLength(e.target.value)}
                placeholder="Length (cm)"
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
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
                            value: parseFloat(globalLength) || 0.1,
                          },
                        },
                      }));
                      setBlocks(updatedBlocks);
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Length to all rows
              </label>
            </div>
            <div>
              <Input
                value={globalBreadth}
                type="number"
                onWheel={(e) =>
                  e.target instanceof HTMLElement && e.target.blur()
                }
                onChange={(e) => setGlobalBreadth(e.target.value)}
                placeholder="Breadth (cm)"
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
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
                            value: parseFloat(globalBreadth) || 0.1,
                          },
                        },
                      }));
                      setBlocks(updatedBlocks);
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Breadth to all rows
              </label>
            </div>
            <div>
              <Input
                type="number"
                value={globalHeight}
                onWheel={(e) =>
                  e.target instanceof HTMLElement && e.target.blur()
                }
                onChange={(e) => setGlobalHeight(e.target.value)}
                placeholder="Height (cm)"
                disabled={isLoading}
                onBlur={() => saveProgressSilently(getValues())}
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
                            value: parseFloat(globalHeight) || 0.1,
                          },
                        },
                      }));
                      setBlocks(updatedBlocks);
                      setValue("blocks", updatedBlocks);
                      saveProgressSilently(getValues());
                    }
                  }}
                />{" "}
                Apply Height to all rows
              </label>
            </div>
          </div>
         <div className="w-full overflow-x-auto">

          <Table className="min-w-max ">
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Block Number</TableHead>
                <TableHead>Material Type</TableHead>
                <TableHead>Length (cm)</TableHead>
                <TableHead>Breadth (cm)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Weight (tons)</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Block Photo</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="whitespace-nowrap">
               {paginatedBlocks.map((block, index) => (
    <TableRow key={index}>
      <TableCell>{pageIndex * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      name={`blocks.${index}.blockNumber`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Block Number"
                              value={block.blockNumber || ""}
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].blockNumber =
                                  e.target.value;
                                  setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
                                saveProgressSilently(getValues());
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
                      name={`blocks.${index}.materialType`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Material Type"
                              value={block.materialType || ""}
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].materialType =
                                  e.target.value;
                                  setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
                                saveProgressSilently(getValues());
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
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step="1"
                              value={block.dimensions.length.value}
                              placeholder="Length"
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.length.value =
                                  parseFloat(e.target.value) || undefined;
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
                                saveProgressSilently(getValues());
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
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step="1"
                              value={block.dimensions.breadth.value}
                              placeholder="Breadth"
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.breadth.value =
                                  parseFloat(e.target.value) || undefined;
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
                                saveProgressSilently(getValues());
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
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step="1"
                              value={block.dimensions.height.value}
                              placeholder="Height"
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.height.value =
                                  parseFloat(e.target.value) || undefined;
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
                                saveProgressSilently(getValues());
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
                    {((

                      (block?.dimensions?.length?.value *
                        block?.dimensions?.breadth?.value *
                        block?.dimensions?.height?.value) /
                        1000000
                      ) || 0
                      ).toFixed(2)
                      // block?.dimensions?.height?.value *
                      // (block?.dimensions?.length?.units === "inch" ? 0.000016387064 : 0.000001)
                    }
                  </TableCell>
                  <TableCell>
                    {calculateWeight(
                      block?.dimensions?.length?.value,
                      block?.dimensions?.breadth?.value,
                      block?.dimensions?.height?.value
                      // block.dimensions.length.units
                    ) || 0
                      .toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="string"
                      placeholder="Vehicle Number"
                      disabled={isLoading}
                      value={block.vehicleNumber || ""}
                      onChange={(e) => {
                        const updatedBlocks = [...blocks];
                        updatedBlocks[index].vehicleNumber = e.target.value;
                        setBlocks(updatedBlocks);
                        setValue("blocks", updatedBlocks);
                        saveProgressSilently(getValues());
                      }}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <FormField
                      control={control}
                      name={`blocks.${index}.blockphoto`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploadField
                              name={field.name}
                              value={field.value || ""}
                              onChange={(value) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].blockphoto = value || "";
                                setBlocks(updatedBlocks);
                                setValue("blocks", updatedBlocks);
                                saveProgressSilently(getValues());
                              }}
                              storageKey="blockphoto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => handleDeleteBlock(index)}
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
                <TableCell colSpan={9}></TableCell> {/* Empty cells to push content to the right */}
                <TableCell colSpan={2} className="text-right">
                  <div className="flex flex-col items-end font-bold space-y-1">
                    <span>Total Volume (m³): {calculateTotalVolume().inM.toFixed(2) || 0}</span>
                    <span>Total Weight (tons): {calculateTotalWeight().inTons.toFixed(2) || 0}</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>


          </Table>
              </div>
{/* Pagination */}
<div className="flex items-center justify-between gap-8 h-[5%]">
  <div className="flex items-center gap-3">
    <Label className="max-sm:sr-only">Rows per page</Label>
    <Select
      value={pageSize.toString()}
      onValueChange={(value) => {
        setPageSize(Number(value));
        setPageIndex(0); // reset to first page
      }}
    >
      <SelectTrigger className="w-fit whitespace-nowrap">
        <SelectValue placeholder="Select number of results" />
      </SelectTrigger>
      <SelectContent>
        {[5, 10, 25, 50].map((size) => (
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
        {blocks.length === 0
          ? 0
          : pageIndex * pageSize + 1}
        -
        {Math.min((pageIndex + 1) * pageSize, blocks.length)}
      </span>{" "}
      of{" "}
      <span className="text-foreground">{blocks.length}</span>
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
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
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
                Math.min(prev + 1, Math.ceil(blocks.length / pageSize) - 1)
              )
            }
            disabled={pageIndex >= Math.ceil(blocks.length / pageSize) - 1}
          >
            <ChevronRightIcon size={16} />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            size="icon"
            variant="outline"
            onClick={() =>
              setPageIndex(Math.ceil(blocks.length / pageSize) - 1)
            }
            disabled={pageIndex >= Math.ceil(blocks.length / pageSize) - 1}
          >
            <ChevronLastIcon size={16} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>

          <ConfirmationDialog
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmChange}
            title="Are you sure?"
            description="You are reducing the number of blocks. This action cannot be undone."
          />
        </form>
      </Form>
    </div>
  );
}
