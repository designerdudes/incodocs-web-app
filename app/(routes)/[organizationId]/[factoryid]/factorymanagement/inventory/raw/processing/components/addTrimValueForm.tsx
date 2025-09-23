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
import { Slab } from "./inpolishingcolumns";
import toast from "react-hot-toast";

const formSchema = z.object({
  polishedValues: z.object({
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
  outTime: z.string().nonempty("Out Time is required"),
  status: z.literal("polished"),
});

interface Props {
  params: { id: string };
}

function CardWithForm(params: Props) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [slabData, setSlabData] = React.useState<Slab>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      polishedValues: {
        height: { value: 0, units: "inch" },
        length: { value: 0, units: "inch" },
      },
      outTime: new Date().toISOString().slice(0, 16), // auto-fill as datetime-local format
      status: "polished",
    },
  });

  React.useEffect(() => {
    const fetchSlabData = async () => {
      try {
        const GetData = await fetchData(
          `/factory-management/inventory/finished/get/${params.params.id}`
        );
        setSlabData(GetData);
      } catch (error) {
        console.error("Error fetching slab data:", error);
      }
    };
    fetchSlabData();
  }, [params.params.id]);

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
          <strong>Height (inches):</strong>{" "}
          {values.polishedValues.height.value}
        </p>
        <p>
          <strong>Length (inches):</strong>{" "}
          {values.polishedValues.length.value}
        </p>
        <p>
          <strong>Out Time:</strong>{" "}
          {new Date(values.outTime).toLocaleString()}
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
                const payload = {
                  ...values,
                  outTime: new Date(values.outTime).toISOString(),
                };

                await putData(
                  `/factory-management/inventory/finished/markpolished/${params.params.id}`,
                  payload
                );

                setIsLoading(false);
                GlobalModal.onClose();
                toast.success("Slab marked as Polished successfully");
              } catch (error) {
                setIsLoading(false);
                GlobalModal.onClose();
                toast.error("Error marking slab as polished");
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Height */}
          <FormField
            control={form.control}
            name="polishedValues.height.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (inches)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 54"
                    type="number"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    step="any"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        field.onChange(value);
                      }
                    }}
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Length */}
          <FormField
            control={form.control}
            name="polishedValues.length.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (inches)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: 120"
                    type="number"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    step="any"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        field.onChange(value);
                      }
                    }}
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Out Time */}
        <FormField
          control={form.control}
          name="outTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Out Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
