"use client";
import * as React from "react";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EntityCombobox from "@/components/ui/EntityCombobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { fetchData, postData } from "@/axiosUtility/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import CalendarComponent from "../CalendarComponent";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import ConfirmationDialog from "../ConfirmationDialog";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import { Calendar } from "../ui/calendar";

interface RawPurchaseCreateNewFormProps {
  gap: number;
  orgId: string;
}

const formSchema = z.object({
  SupplierId: z.string().nonempty({ message: "Supplier ID is required" }),
  factoryId: z.string().nonempty({ message: "Factory ID is required" }),
  invoiceNo: z.string().min(1, { message: "Invoice number is required" }),
  invoiceValue: z.number().optional(),
  purchaseDate: z.string().optional(),
  gstPercentage: z.enum(["0%", "1%", "5%", "12%", "18%"]).optional(),
  ratePerCubicVolume: z.number().optional(),
  materialType: z.string().optional(),
  volumeQuantity: z.number().optional(),
  weight: z.number().optional(),
  blocks: z
    .array(
      z.object({
        blockNumber: z.number().optional(),
        materialType: z.string().optional(),
        status: z.string().optional(),
        inStock: z.boolean().optional(),
        dimensions: z
          .object({
            weight: z
              .object({
                value: z.number().optional(),
                units: z.literal("tons").optional(),
              })
              .optional(),
            length: z
              .object({
                value: z.number().optional(),
                units: z.literal("inch").optional(),
              })
              .optional(),
            breadth: z
              .object({
                value: z.number().optional(),
                units: z.literal("inch").optional(),
              })
              .optional(),
            height: z
              .object({
                value: z.number().optional(),
                units: z.literal("inch").optional(),
              })
              .optional(),
          })
          .optional(),
      })
    )
    .optional(),
  noOfBlocks: z.number().optional(),
  paymentProof: z.string().optional(),
});

export default function RawPurchaseCreateNewForm({
  gap,
  orgId,
}: RawPurchaseCreateNewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [supplierLoading, setSupplierLoading] = React.useState(false);
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
  const [supplierNames, setSupplierNames] = React.useState<
    { _id: string; name: string }[]
  >([]);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [blockCountToBeDeleted, setBlockCountToBeDeleted] = React.useState<
    number | null
  >(null);

  const factoryId = useParams().factoryid as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      SupplierId: "",
      factoryId,
      invoiceNo: "",
      invoiceValue: undefined,
      purchaseDate: "",
      ratePerCubicVolume: undefined,
      gstPercentage: "0%",
      materialType: "",
      volumeQuantity: undefined,
      weight: undefined,
      blocks: [],
      paymentProof: "",
      noOfBlocks: undefined,
    },
  });
  const { control, setValue, watch, getValues } = form;

  React.useEffect(() => {
    const fetchingData = async () => {
      try {
        setSupplierLoading(true);
        const supplierResponse = await fetchData(
          `/accounting/supplier/getbyfactory/${factoryId}`
        );
        const supplierData = await supplierResponse;
        const mappedSuppliers = supplierData.map((supplier: any) => ({
          _id: supplier._id,
          name: supplier.supplierName,
        }));
        setSupplierNames(mappedSuppliers);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      } finally {
        setSupplierLoading(false);
      }
    };
    fetchingData();
  }, [supplierNames]);

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
      }) as any;
    }
  };

  const handleConfirmChange = () => {
    if (blockCountToBeDeleted !== null) {
      const updatedBlocks = blocks.slice(0, blockCountToBeDeleted);
      setBlocks(updatedBlocks);
      setValue("blocks", updatedBlocks);
      setValue("noOfBlocks", updatedBlocks.length);
      setBlockCountToBeDeleted(null);
    }
    setShowConfirmation(false);
  };
  const handleDeleteBlock = (index: number) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
    setValue("blocks", updatedBlocks);
    setValue("noOfBlocks", updatedBlocks.length);
  };

  function handleBlocksInputChange(value: string) {
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) {
      const length = parseFloat(globalLength) || 0;
      const breadth = parseFloat(globalBreadth) || 0;
      const height = parseFloat(globalHeight) || 0;

      const newBlocks = Array.from({ length: count }, (_, index) => {
        const { volume, weight } = calculateVolumeAndWeight(
          length,
          breadth,
          height
        );

        return {
          blockNumber: index + 1,
          materialType: form.getValues("materialType") || "type1",
          status: "inStock",
          inStock: true,
          dimensions: {
            length: { value: length, units: "inch" },
            breadth: { value: breadth, units: "inch" },
            height: { value: height, units: "inch" },
            volume: { value: volume, units: "m³" },
            weight: { value: weight, units: "tons" },
          },
        };
      });

      setBlocks(newBlocks);
      // form.setValue("blocks", newBlocks);
      form.setValue("noOfBlocks", count);
    } else {
      setBlocks([]);
      form.setValue("blocks", []);
      form.setValue("noOfBlocks", undefined);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const gstValue = values.gstPercentage
        ? parseFloat(values.gstPercentage)
        : 0;
      const apiUrl =
        gstValue > 0
          ? "/transaction/purchase/addrawgst"
          : "/transaction/purchase/addraw";
      const payload: any = {
        factoryId: values.factoryId,
        supplierId: values.SupplierId,
        invoiceNo: values.invoiceNo,
        purchaseDate: values.purchaseDate || new Date().toISOString(),
        paymentProof: values.paymentProof || "",
        noOfBlocks: values.noOfBlocks || 0,
        materialType: values.materialType || "steps",
        volumeQuantity: values.volumeQuantity || 0,
        length: values.blocks?.[0]?.dimensions?.length?.value || 0,
        height: values.blocks?.[0]?.dimensions?.height?.value || 0,
        breadth: values.blocks?.[0]?.dimensions?.breadth?.value || 0,
        weight: values.weight || 0,
        ratePerCubicVolume: values.ratePerCubicVolume || 0,
      };

      if (gstValue > 0) {
        payload.invoiceValue = values.invoiceValue || 0;
        payload.gstPercentage = gstValue;
      } else {
        payload.actualInvoiceValue = values.invoiceValue || 0;
        payload.blocks = values.blocks?.map((block, index) => ({
          blockNumber: block.blockNumber || index + 1,
          materialType: block.materialType || values.materialType || "type1",
          status: block.status || "inStock",
          inStock: block.inStock ?? true,
          dimensions: block.dimensions || {
            weight: { value: 0, units: "tons" },
            length: { value: 0, units: "inch" },
            breadth: { value: 0, units: "inch" },
            height: { value: 0, units: "inch" },
          },
        }));
      }

      await postData(apiUrl, payload);
      toast.success("Raw Purchase Added Successfully");
      router.push(`../`);
    } catch (error) {
      console.error("Error creating raw purchase:", error);
      toast.error("Error creating raw purchase");
    } finally {
      setIsLoading(false);
    }
  }
  const calculateWeight = (length: number, breadth: number, height: number) => {
    const volumeInCubicInches = length * breadth * height;
    const volumeInCubicMeters = volumeInCubicInches * 0.000016387064;
    const density = 3.5; // tons per m³
    const weight = volumeInCubicMeters * density;
    return Number(weight.toFixed(2));
  };

  function calculateVolumeAndWeight(
    length: number,
    breadth: number,
    height: number
  ) {
    const volumeInCubicInches = length * breadth * height;
    const volumeInCubicMeters = volumeInCubicInches * 0.0000163871;
    const weightInTons = volumeInCubicMeters * 2.7; // Assuming density of granite

    return {
      volume: volumeInCubicMeters,
      weight: weightInTons,
    };
  }

  // Calculate total volume
  function calculateTotalVolume() {
    const totalVolumeInM = blocks.reduce((total, block) => {
      const { length, breadth, height } = block.dimensions;
      const volume =
        length.value * breadth.value * height.value * 0.000016387064;
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
      const volume =
        length.value * breadth.value * height.value * 0.000016387064; // m³
      const density = 3.5; // Example density in tons/m³
      const weight = volume * density;
      return total + weight;
    }, 0);

    return {
      inTons: totalWeightInTons,
    };
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Supplier Name */}
            <FormField
              name="SupplierId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Supplier</FormLabel>
                  <FormControl>
                    <EntityCombobox
                      entities={supplierNames}
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      valueProperty="_id" // ✅ Ensure supplier ID is passed
                      displayProperty="name"
                      placeholder="Select a Supplier Name"
                      onAddNew={() => {
                        window.open(
                          `/${orgId}/${factoryId}/factorymanagement/parties/supplier/createNew`,
                          "_blank"
                        );
                      }}
                      multiple={false}
                      addNewLabel="Add New Supplier"
                      // disabled={isLoading || supplierLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Date */}
            <FormField
              name="purchaseDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[100%] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "PPP")
                              : "Purchase date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0 text-sm flex flex-col relative"
                          align="start"
                        >
                          {/* <div className="absolute top-0 right-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      field.onChange(null);
                      saveProgressSilently(getValues());
                    }}
                  >
                    Clear
                  </Button>
                </div> */}
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            startMonth={new Date(2010, 0)}
                            endMonth={new Date(2025, 11)}
                            onSelect={(date) => {
                              field.onChange(date?.toISOString());
                            }}
                            captionLayout="dropdown"
                            classNames={{
                              caption: "flex justify-between items-center",
                              caption_label: "text-sm font-medium hidden",
                              dropdown: "border rounded p-0 text-xs",
                              months: "flex flex-col",
                            }}
                            className="bg-white p-4 rounded-xl shadow-md"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentProof"
              render={() => (
                <FormItem>
                  <FormLabel>Payment Proof</FormLabel>
                  <FormControl>
                    <FileUploadField
                      name="paymentProof"
                      storageKey="paymentProof"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Invoice No */}
            <FormField
              name="invoiceNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No.</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Enter Invoice No."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Invoice Value */}
            <FormField
              name="invoiceValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Invoice Value"
                      type="number"
                      min={0}
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GST Percentage */}
            <FormField
              name="gstPercentage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Percentage</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select GST Percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0%">0%</SelectItem>
                        <SelectItem value="1%">1%</SelectItem>
                        <SelectItem value="5%">5%</SelectItem>
                        <SelectItem value="12%">12%</SelectItem>
                        <SelectItem value="18%">18%</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rate per Cubic Volume */}
            <FormField
              name="ratePerCubicVolume"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per Cubic Meter</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter rate per cubic meter"
                      type="number"
                      min={0}
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Material Type */}
            <FormField
              name="materialType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter material type"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Volume Quantity */}
            <FormField
              name="volumeQuantity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume Quantity (m³)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter volume quantity"
                      type="number"
                      min={0}
                      disabled={isLoading}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Blocks Section */}
          <div className="grid grid-cols-3 gap-3">
            <FormField
              name="noOfBlocks"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No of Blocks</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter number of blocks"
                      type="number"
                      min="1"
                      disabled={isLoading}
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
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dimensions Inputs */}
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[
              {
                label: "Length (inch)",
                value: globalLength,
                setter: setGlobalLength,
                apply: applyLengthToAll,
                setApply: setApplyLengthToAll,
                key: "length",
              },
              {
                label: "Breadth (inch)",
                value: globalBreadth,
                setter: setGlobalBreadth,
                apply: applyBreadthToAll,
                setApply: setApplyBreadthToAll,
                key: "breadth",
              },
              {
                label: "Height (inch)",
                value: globalHeight,
                setter: setGlobalHeight,
                apply: applyHeightToAll,
                setApply: setApplyHeightToAll,
                key: "height",
              },
            ].map(({ label, value, setter, apply, setApply, key }) => (
              <div key={key}>
                <Input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={label}
                  type="number"
                  disabled={isLoading}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  <input
                    type="checkbox"
                    checked={apply}
                    onChange={(e) => {
                      setApply(e.target.checked);
                      if (e.target.checked) {
                        const updatedBlocks = blocks.map((block) => ({
                          ...block,
                          dimensions: {
                            ...block.dimensions,
                            [key]: {
                              value: parseFloat(value) || 0,
                              units: key === "weight" ? "tons" : "inch",
                            },
                          },
                        }));
                        setBlocks(updatedBlocks);
                        form.setValue("blocks", updatedBlocks);
                      }
                    }}
                  />{" "}
                  Apply {label} to all rows
                </label>
              </div>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Block Number</TableHead>
                <TableHead>Material Type</TableHead>
                <TableHead>Length (inch)</TableHead>
                <TableHead>Breadth (inch)</TableHead>
                <TableHead>Height (inch)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Weight (tons)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  {/* Block Number */}
                  <TableCell>
                    <Input
                      type="number"
                      value={block?.blockNumber}
                      placeholder="Enter block number"
                      onChange={(e) => {
                        const updatedBlocks = [...blocks];
                        updatedBlocks[index].blockNumber =
                          parseInt(e.target.value) || index + 1;
                        setBlocks(updatedBlocks);
                        form.setValue("blocks", updatedBlocks);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>

                  {/* Material Type */}
                  <TableCell>
                    <Input
                      type="text"
                      value={block?.materialType || ""}
                      placeholder="Enter material type"
                      onChange={(e) => {
                        const updatedBlocks = [...blocks];
                        updatedBlocks[index].materialType = e.target.value;
                        setBlocks(updatedBlocks);
                        form.setValue("blocks", updatedBlocks);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>

                  {/* Length */}
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={block?.dimensions?.length?.value || ""}
                      placeholder="Enter length"
                      onChange={(e) => {
                        const newLength = parseFloat(e.target.value) || 0;
                        const updatedBlocks = [...blocks];

                        updatedBlocks[index].dimensions.length = {
                          value: newLength,
                          units: "inch",
                        };

                        const { breadth, height } =
                          updatedBlocks[index].dimensions;
                        const { volume, weight } = calculateVolumeAndWeight(
                          newLength,
                          breadth?.value || 0,
                          height?.value || 0
                        );

                        updatedBlocks[index].dimensions.volume = {
                          value: volume,
                          units: "m³",
                        };
                        updatedBlocks[index].dimensions.weight = {
                          value: weight,
                          units: "tons",
                        };

                        setBlocks(updatedBlocks);
                        form.setValue("blocks", updatedBlocks);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>

                  {/* Breadth */}
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={block?.dimensions?.breadth?.value || ""}
                      placeholder="Enter breadth"
                      onChange={(e) => {
                        const newBreadth = parseFloat(e.target.value) || 0;
                        const updatedBlocks = [...blocks];

                        updatedBlocks[index].dimensions.breadth = {
                          value: newBreadth,
                          units: "inch",
                        };

                        const { length, height } =
                          updatedBlocks[index].dimensions;
                        const { volume, weight } = calculateVolumeAndWeight(
                          length?.value || 0,
                          newBreadth,
                          height?.value || 0
                        );

                        updatedBlocks[index].dimensions.volume = {
                          value: volume,
                          units: "m³",
                        };
                        updatedBlocks[index].dimensions.weight = {
                          value: weight,
                          units: "tons",
                        };

                        setBlocks(updatedBlocks);
                        form.setValue("blocks", updatedBlocks);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>

                  {/* Height */}
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={block?.dimensions?.height?.value || ""}
                      placeholder="Enter height"
                      onChange={(e) => {
                        const newHeight = parseFloat(e.target.value) || 0;
                        const updatedBlocks = [...blocks];

                        updatedBlocks[index].dimensions.height = {
                          value: newHeight,
                          units: "inch",
                        };

                        const { length, breadth } =
                          updatedBlocks[index].dimensions;
                        const { volume, weight } = calculateVolumeAndWeight(
                          length?.value || 0,
                          breadth?.value || 0,
                          newHeight
                        );

                        updatedBlocks[index].dimensions.volume = {
                          value: volume,
                          units: "m³",
                        };
                        updatedBlocks[index].dimensions.weight = {
                          value: weight,
                          units: "tons",
                        };

                        setBlocks(updatedBlocks);
                        form.setValue("blocks", updatedBlocks);
                      }}
                      disabled={isLoading}
                    />
                  </TableCell>

                  {/* Volume (m³) */}
                  <TableCell>
                    {(
                      block.dimensions.length.value *
                      block.dimensions.breadth.value *
                      block.dimensions.height.value *
                      0.000016387064
                    ).toFixed(2)}
                  </TableCell>
                  {/* Weight (tons) */}
                  <TableCell>
                    {calculateWeight(
                      block.dimensions.length.value,
                      block.dimensions.breadth.value,
                      block.dimensions.height.value
                    )}
                  </TableCell>

                  {/* Action */}
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
            {isLoading ? "Submitting..." : "Submit Raw Purchase"}
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
