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
import { Trash } from "lucide-react";
import { fetchData, postData } from "@/axiosUtility/api";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import { useEffect, useState, useRef } from "react";
import { debounce } from "lodash";

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
  const volume = (length * breadth * height) / 1000000; // Convert cm³ to m³
  const densityFactor = (350 * 10) / 1000; // Your existing formula: 350 * 10 / 1000
  return Number((volume * densityFactor).toFixed(2));
};

// Define the form schema
const formSchema = z.object({
  lotName: z
    .string()
    .min(3, { message: "Lot name must be at least 3 characters long" })
    .optional(),
  materialType: z
    .string()
    .min(3, { message: "Material type must be at least 3 characters long" })
    .optional(),
  markerCost: z
    .number()
    .min(0, { message: "Marker cost must be greater than or equal to zero" })
    .optional(),
  transportCost: z
    .number()
    .min(1, { message: "Transport cost must be greater than or equal to zero" })
    .optional(),
  materialCost: z
    .number()
    .min(1, { message: "Material cost must be greater than or equal to zero" })
    .optional(),
  quarryName: z
    .string()
    .min(3, { message: "Quarry name must be at least 3 characters long" })
    .optional(),
  quarryCost: z
    .number()
    .min(1, { message: "Quarry cost must be greater than or equal to zero" })
    .optional(),
  commissionCost: z
    .number()
    .min(1, {
      message: "Commission cost must be greater than or equal to zero",
    })
    .optional(),
  markerOperatorName: z
    .string()
    .min(1, { message: "Marker name is required" })
    .optional(),
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
              .min(0, { message: "Length must be greater than zero" }),
            units: z.literal("cm").default("cm"),
          }),
          breadth: z.object({
            value: z
              .number()
              .min(0, { message: "Breadth must be greater than zero" }),
            units: z.literal("cm").default("cm"),
          }),
          height: z.object({
            value: z
              .number()
              .min(0, { message: "Height must be greater than zero" }),
            units: z.literal("cm").default("cm"),
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

export function RawMaterialCreateNewForm({}: RawMaterialCreateNewFormProps) {
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
          dimensions: {
            weight: { value: 0, units: "tons" },
            length: { value: 0, units: "cm" },
            breadth: { value: 0, units: "cm" },
            height: { value: 0, units: "cm" },
          },
        },
      ],
    },
  });

  const { control, setValue, watch, getValues } = form;

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
  const handleBlockCountChange = (value: string) => {
    const newCount = Number(value);

    if (newCount < blocks.length) {
      setShowConfirmation(true);
      setBlockCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange({
        value,
        watch,
        setValue,
        getValues,
        fieldName: "blocks",
        createNewItem: () => ({
          dimensions: {
            weight: { value: 0, units: "tons" },
            length: { value: 0, units: "cm" },
            breadth: { value: 0, units: "cm" },
            height: { value: 0, units: "cm" },
          },
        }),
        customFieldSetters: {
          blocks: (items, setValue) => {
            setValue("noOfBlocks", items.length);
            setBlocks(items);
          },
        },
        saveCallback: saveProgressSilently,
      }) as any;
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
    try {
      await postData("/factory-management/inventory/addlotandblocks", {
        ...values,
        materialCost: values.materialCost || 0,
        markerCost: values.markerCost || 0,
        transportCost: values.transportCost || 0,
        factoryId,
        organizationId,
        status: "active",
      });
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
      const volume = (length.value * breadth.value * height.value) / 1000000; // m³
      const density = 2.7; // Example density in tons/m³
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
      async (query: string, pageNo = 1) => {
        try {
          setLoading(true);
          const res = await fetchData(
            `/quarry/getbyfactory/${factoryId}?search=${query}&page=${pageNo}&limit=50`
          );
          const data = res;

          if (pageNo === 1) {
            setQuarries(data.data || data);
          } else {
            setQuarries((prev) => [...prev, ...(data.data || data)]);
          }

          setHasMore((data?.data?.length || data.length) === 20);
        } catch (err) {
          console.error("Failed to fetch:", err);
        } finally {
          setLoading(false);
        }
      },
      500, // Reduced from 1000ms to 500ms for better responsiveness
      { leading: false, trailing: true } // Only trigger after typing stops
    ),
    [factoryId]
  );

  // Trigger fetchQuarries and reset page on search change
  useEffect(() => {
    if (dropdownOpen && factoryId) {
      setPage(1); // Reset page to 1 on search change
      setQuarries([]); // Clear previous results
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
    setTimeout(() => inputRef.current?.focus(), 0); // Restore focus
    saveProgressSilently(getValues());
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="materialType"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Granite"
                      disabled={isLoading}
                      {...field}
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
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
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
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
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
              name="transportCost"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Cost</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter transport cost"
                      type="number"
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
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
                        setPage(1); // Reset page on search change
                        setQuarries([]); // Clear previous results
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
                      {quarries.length > 0 ? (
                        quarries.map((item) => (
                          <div
                            key={item._id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleQuarrySelect(item.lesseeName ?? "");
                            }}
                          >
                            {item.lesseeName}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          {loading ? "Loading..." : "No results found"}
                        </div>
                      )}
                      {hasMore && (
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
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
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
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
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
              name="noOfBlocks"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Blocks</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter number of blocks"
                      type="number"
                      min="1"
                      disabled={isLoading}
                      onWheel={(e) =>
                        e.target instanceof HTMLElement && e.target.blur()
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          field.onChange(1);
                          handleBlockCountChange("1");
                          return;
                        }
                        field.onChange(Number(value));
                        handleBlockCountChange(value);
                      }}
                      value={field.value ?? 1}
                      onBlur={() => saveProgressSilently(getValues())}
                    />
                  </FormControl>
                  <FormMessage />
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
                            value: parseFloat(globalLength) || 0,
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
                            value: parseFloat(globalBreadth) || 0,
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
                            value: parseFloat(globalHeight) || 0,
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Length (cm)</TableHead>
                <TableHead>Breadth (cm)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Weight (tons)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      name={`blocks.${index}.dimensions.length.value`}
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={block.dimensions.length.value}
                              placeholder="Enter length"
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.length.value =
                                  parseFloat(e.target.value) || 0.1;
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
                              min="0"
                              step="1"
                              value={block.dimensions.breadth.value}
                              placeholder="Enter breadth"
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.breadth.value =
                                  parseFloat(e.target.value) || 0.1;
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
                              min="0"
                              step="1"
                              value={block.dimensions.height.value}
                              placeholder="Enter height"
                              onWheel={(e) =>
                                e.target instanceof HTMLElement &&
                                e.target.blur()
                              }
                              onChange={(e) => {
                                const updatedBlocks = [...blocks];
                                updatedBlocks[index].dimensions.height.value =
                                  parseFloat(e.target.value) || 0.1;
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
                    {block.dimensions.weight.value.toFixed(2)}
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
                      placeholder="Vehicle Number"
                      disabled={isLoading}
                      onChange={(e) => {
                        const updatedBlocks = [...blocks];
                        updatedBlocks[index].vehicleNumber = e.target.value;
                        setBlocks(updatedBlocks);
                        setValue("blocks", updatedBlocks);
                        saveProgressSilently(getValues());
                      }}
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
                <TableCell colSpan={4} className="text-right font-bold">
                  Total Volume (m³): {calculateTotalVolume().inM.toFixed(2)}
                </TableCell>
                <TableCell className="font-bold">
                  Total Weight (tons):{" "}
                  {calculateTotalWeight().inTons.toFixed(2)}
                </TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>

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
