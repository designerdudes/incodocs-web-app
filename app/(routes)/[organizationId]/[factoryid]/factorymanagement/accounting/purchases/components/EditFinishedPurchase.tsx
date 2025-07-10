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
import { useParams, useRouter } from "next/navigation";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";
import { cn } from "@/lib/utils";
import EntityCombobox from "@/components/ui/EntityCombobox";

const formSchema = z.object({
  supplierId: z.string().min(3).optional(),
  ratePerSqft: z.union([z.string(), z.number()]).optional(),
  numberofSlabs: z.union([z.string(), z.number()]).optional(),
  purchaseDate: z.string().optional(),
});

interface Props {
  params: {
    _id: string; // Slab ID
  };
}

export default function EditLotForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const [supplierNames, setSupplierNames] = React.useState<
    { _id: string; name: string }[]
  >([]);
  const [supplierLoading, setSupplierLoading] = React.useState(false);

  const factoryId = useParams().factoryid as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: "",
      ratePerSqft: "",
      numberofSlabs: "",
      purchaseDate: "",
    },
  });

  const SlabId = params._id;
useEffect(() => {
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
          toast.error("Failed to fetch suppliers");
        } finally {
          setSupplierLoading(false);
        }
      };
      fetchingData();
    }, [])

  const handleAddNewSupplier = () => {
    toast("Add new supplier functionality to be implemented");
  };

  useEffect(() => {
    async function fetchSlabData() {
      try {
        setIsFetching(true);
        const res = await fetchData(
          `https://incodocs-server.onrender.com/transaction/purchase/slabgetbyid/${SlabId}`
        );
        const result = res;

        const data = result.getPurchase;

        form.reset({
          supplierId: data?.supplierId || "",
          ratePerSqft: String(data?.ratePerSqft || ""),
          numberofSlabs: String(data?.noOfSlabs || ""),
          purchaseDate: data?.purchaseDate
            ? moment(data.purchaseDate).format("YYYY-MM-DD")
            : "",
        });
      } catch (error) {
        console.error("Error fetching Slab data:", error);
        toast.error("Failed to fetch Slab data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchSlabData();
  }, [SlabId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // console.log("Payload valuesssssss:", values);
    GlobalModal.title = "Confirm Slab Update";
    GlobalModal.description = "Are you sure you want to update this Slab?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Supplier Id: {values.supplierId}</p>
        <p>Rate per Sqft: {values.ratePerSqft}</p>
        <p>No. of Slabs: {values.numberofSlabs}</p>
        <p>Purchase Date: {values.purchaseDate}</p>
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
                  `/transaction/purchase/updateslab/${SlabId}`,
                  values
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Slab updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error updating Slab:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating Slab");
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
        <p className="ml-2 text-gray-500">Loading Slab details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="supplierId"
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
                    onAddNew={handleAddNewSupplier}
                    addNewLabel="Add New Supplier"
                    disabled={isLoading || supplierLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ratePerSqft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate per Sqft</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Eg: 1000"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberofSlabs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Slabs</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Eg: 10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
