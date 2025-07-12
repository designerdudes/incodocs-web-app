"use client";
import React from "react";
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
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";

const formSchema = z.object({
  trim: z.object({
    height: z.object({
      value: z.preprocess(
        (val) => (val ? parseFloat(val as string) : undefined),
        z.number().min(0.1, { message: "Height must be greater than zero" })
      ),
      units: z.literal("inch"),
    }),
    length: z.object({
      value: z.preprocess(
        (val) => (val ? parseFloat(val as string) : undefined),
        z.number().min(0.1, { message: "Length must be greater than zero" })
      ),
      units: z.literal("inch"),
    }),
  }),
});

interface Props {
  params: { id: string };
}

function CardWithForm(params: Props) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [slabData, setSlabData] = React.useState<any>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trim: {
        height: { value: 0, units: "inch" },
        length: { value: 0, units: "inch" },
      },
    },
  });

  React.useEffect(() => {
    const fetchSlabData = async () => {
      try {
        const GetData = await fetchData(
          `/factory-management/inventory/finished/get/${params.params.id}`
        );
        setSlabData(GetData);

        // Update form default values when data is fetched
        if (GetData?.trim) {
          form.setValue("trim.height.value", GetData.trim.height.value || 0);
          form.setValue("trim.length.value", GetData.trim.length.value || 0);
        }
      } catch (error) {
        console.error("Error fetching slab data:", error);
      }
    };
    fetchSlabData();
  }, []);

  const GlobalModal = useGlobalModal();

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    GlobalModal.title = "Confirm Details";
    GlobalModal.description = "Please review the entered details:";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>
          <strong>Slab Number:</strong> {slabData?.slabNumber}
        </p>
        <p>
          <strong>Block Number:</strong> {slabData?.blockNumber}
        </p>
        <p>
          <strong>Height (inches):</strong> {values.trim.height.value}
        </p>
        <p>
          <strong>Length (inches):</strong> {values.trim.length.value}
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
                  `/factory-management/inventory/finished/put/${params.params.id}`,
                  {
                    trim: values.trim,
                    status: "polished",
                  }
                );
                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Slab Polish Values updated successfully");
              } catch (error) {
                console.error("Error updating Slab:", error);
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error updating Slab");
              }
              window.location.reload();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
    GlobalModal.onOpen();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          handleSubmit(values);
        })}
        className="grid gap-4"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Height */}
          <FormField
            control={form.control}
            name="trim.height.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (inches)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 15"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    step="any" // Allows decimal values
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        field.onChange(value);
                      }
                    }}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Length */}
          <FormField
            control={form.control}
            name="trim.length.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (inches)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 10"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    step="any" // Allows decimal values
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        field.onChange(value);
                      }
                    }}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default CardWithForm;
