"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchData, putData } from "@/axiosUtility/api";
import { toast } from "react-hot-toast";
import { useGlobalModal } from "@/hooks/GlobalModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slabSchema = z.object({
  _id: z.string(),
  slabNumber: z.string(),
  dimensions: z.object({
    length: z.object({
      value: z.number().min(0.1, "Length required"),
      units: z.string(),
    }),
    height: z.object({
      value: z.number().min(0.1, "Height required"),
      units: z.string(),
    }),
  }),
  cuttingPaymentStatus: z.object({
    status: z.string(),
  }),
  polishingPaymentStatus: z.object({
    status: z.string(),
  }),
  trim: z.object({
    length: z.object({ units: z.string() }),
    height: z.object({ units: z.string() }),
  }),
});

const formSchema = z.object({
  slab: slabSchema,
});

interface Props {
  params: { _id: string };
}

export default function EditSlabForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slab: {
        _id: "",
        slabNumber: "",
        dimensions: {
          length: { value: 0, units: "inch" },
          height: { value: 0, units: "inch" },
        },
        cuttingPaymentStatus: { status: "pending" },
        polishingPaymentStatus: { status: "pending" },
        trim: {
          length: { units: "inch" },
          height: { units: "inch" },
        },
      },
    },
  });

  const slabId = params._id;

  useEffect(() => {
  async function fetchSlabData() {
    try {
      setIsFetching(true);
      const data = await fetchData(
        `/factory-management/inventory/finished/get/${slabId}`
      );

      const slab = data;
      if (slab) {
        form.reset({
          slab: {
            _id: slab._id || "",
            slabNumber: slab.slabNumber || "",
            dimensions: {
              length: {
                value: slab.dimensions?.length?.value ?? 0,
                units: slab.dimensions?.length?.units ?? "inch",
              },
              height: {
                value: slab.dimensions?.height?.value ?? 0,
                units: slab.dimensions?.height?.units ?? "inch",
              },
            },
            cuttingPaymentStatus: {
              status: slab.cuttingPaymentStatus?.status || "pending",
            },
            polishingPaymentStatus: {
              status: slab.polishingPaymentStatus?.status || "pending",
            },
            trim: {
              length: {
                units: slab.trim?.length?.units || "inch",
              },
              height: {
                units: slab.trim?.height?.units || "inch",
              },
            },
          },
        });
      }
    } catch (error) {
      console.error("Error fetching slab data:", error);
    } finally {
      setIsFetching(false);
    }
  }

  fetchSlabData();
}, [slabId, form]);


  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const slab = values.slab;

    GlobalModal.title = "Confirm Update";
    GlobalModal.description = "Do you want to update this slab?";
    GlobalModal.children = (
      <div className="space-y-2 text-sm max-h-[300px] overflow-auto">
        <p>Slab No: {slab.slabNumber}</p>
        <p>Length: {slab.dimensions.length.value} {slab.dimensions.length.units}</p>
        <p>Height: {slab.dimensions.height.value} {slab.dimensions.height.units}</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsLoading(false);
              GlobalModal.onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await putData(
                  `/factory-management/inventory/finished/put/${slabId}`,
                  slab
                );
                  setIsLoading(false);
                toast.success("Slab updated successfully");
                GlobalModal.onClose();
               window.location.reload();
              } catch (error) {
                toast.error("Update failed");
              } finally {
                setIsLoading(false);
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

  if (isFetching) return <p className="text-center">Loading...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="slab.slabNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slab Number</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slab.dimensions.length.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (inch)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(Math.max(0, Number(e.target.value)))
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slab.dimensions.height.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (inch)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(Math.max(0, Number(e.target.value)))
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slab.cuttingPaymentStatus.status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cutting Payment</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slab.polishingPaymentStatus.status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Polishing Payment</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slab.trim.length.units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trim Length Unit</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slab.trim.height.units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trim Height Unit</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Slab"}
        </Button>
      </form>
    </Form>
  );
}
