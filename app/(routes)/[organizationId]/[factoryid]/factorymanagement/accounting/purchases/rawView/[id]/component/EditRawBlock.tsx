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
import { useRouter } from "next/navigation";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

const formSchema = z.object({
  dimensions: z.object({
    length: z.object({
      value: z
        .number()
        .min(0.1, { message: "Length must be greater than zero" }),
      units: z.literal("inch").default("inch"),
    }),
    height: z.object({
      value: z
        .number()
        .min(0.1, { message: "Height must be greater than zero" }),
      units: z.literal("inch").default("inch"),
    }),
    breadth: z.object({
      value: z
        .number()
        .min(0.1, { message: "Breadth must be greater than zero" }),
      units: z.literal("inch").default("inch"),
    }),
    weight: z.object({
      value: z
        .number()
        .min(0.1, { message: "Weight must be greater than zero" }),
      units: z.literal("tons").default("tons"),
    }),
  }),
});

interface Props {
  params: {
    _id: string; // Block ID (the same as the route parameter)
  };
}

export default function EditBlockForm({ params }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  //   console.log("ppppppppaaa",params)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dimensions: {
        length: { value: 0, units: "inch" },
        height: { value: 0, units: "inch" },
        breadth: { value: 0, units: "inch" },
        weight: { value: 0, units: "tons" },
      },
    },
  });

  const blockId = params._id;

  const length = form.watch("dimensions.length.value") || 1;
  const breadth = form.watch("dimensions.breadth.value") || 1;
  const height = form.watch("dimensions.height.value") || 1;
 
  useEffect(() => {
  const calculatedWeight =
    (((length * breadth * height) / 1000000) * 350 * 10) / 1000;

  form.setValue("dimensions.weight.value", parseFloat(calculatedWeight.toFixed(2)));
}, [length, breadth, height, form]);

  // Fetch block data and reset form with values
  useEffect(() => {
    async function fetchBlockData() {
      try {
        setIsFetching(true);
        const response = await fetchData(
          `/factory-management/inventory/raw/get/${blockId}`
        );

        const data = response;

        // Map backend data to form values
        form.reset({
          dimensions: {
            length: {
              value: data.dimensions?.length?.value || 0,
              units: data.dimensions?.length?.units || "inch",
            },
            height: {
              value: data.dimensions?.height?.value || 0,
              units: data.dimensions?.height?.units || "inch",
            },
            breadth: {
              value: data.dimensions?.breadth?.value || 0,
              units: data.dimensions?.breadth?.units || "inch",
            },
            weight: {
              value: data.dimensions?.weight?.value || 0,
              units: data.dimensions?.weight?.units || "tons",
            },
          },
        });
      } catch (error) {
        console.error("Error fetching block data:", error);
        toast.error("Failed to fetch block data");
      } finally {
        setIsFetching(false);
      }
    }

    fetchBlockData();
  }, [blockId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    GlobalModal.title = "Confirm Block Update";
    GlobalModal.description = "Are you sure you want to update this block?";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>
          Length: {values.dimensions.length.value}{" "}
          {values.dimensions.length.units}
        </p>
        <p>
          Height: {values.dimensions.height.value}{" "}
          {values.dimensions.height.units}
        </p>
        <p>
          Breadth: {values.dimensions.breadth.value}{" "}
          {values.dimensions.breadth.units}
        </p>
        <p>
          Weight: {values.dimensions.weight.value}{" "}
          {values.dimensions.weight.units}
        </p>
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
                  `/factory-management/inventory/raw/put/${blockId}`,
                  values
                );
                console.log("poppopopssss", values);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Block updated successfully");
                window.location.reload();
              } catch (error) {
                console.error("Error updating block:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating block");
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
        <p className="ml-2 text-gray-500">Loading block details...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dimensions.height.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (inches)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 15"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dimensions.length.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (inches)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 10"
                    type="number"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dimensions.breadth.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breadth (inches)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 10"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dimensions.weight.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (tons)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value || ""}
                    readOnly
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="text-sm font-medium">Weight (inches)</div>
            <div className="pt-5 text-sm">
              {(
                (((length * breadth * height) / 1000000) * 350 * 10) /
                1000
              ).toFixed(2)}
            </div>
          </div>
        </div>

        {/* <div>
          <FormLabel>Volume (in³)</FormLabel>
          <p className="border p-2 rounded bg-gray-100">{volume || 0}</p>
        </div> */}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
