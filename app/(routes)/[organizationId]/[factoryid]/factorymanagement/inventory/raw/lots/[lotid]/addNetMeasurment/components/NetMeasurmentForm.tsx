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
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { putData } from "@/axiosUtility/api";
import { useEffect, useState } from "react";

// ---------------- Schema ----------------
const formSchema = z.object({
  blocks: z.array(
    z.object({
      netDimensions: z.object({
        length: z
          .number({ required_error: "Length is required" })
          .min(0.1, "Must be > 0"),
        breadth: z
          .number({ required_error: "Breadth is required" })
          .min(0.1, "Must be > 0"),
        height: z
          .number({ required_error: "Height is required" })
          .min(0.1, "Must be > 0"),
      }),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

interface AddBlockFormProps {
  LotData: any;
  BlocksData: any[]; // end-to-end data
  
}

// ---------------- Helpers ----------------
function calculateVolume(l: number, b: number, h: number) {
  return (l * b * h) / 1_000_000; // m³
}
function calculateWeight(l: number, b: number, h: number) {
  const volume = calculateVolume(l, b, h);
  const density = 3.5; // tons/m³
  return volume * density;
}

// ---------------- Component ----------------
export function NetMeasurmentForm({ LotData, BlocksData }: AddBlockFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const factoryId = useParams().factoryid;
  const organizationId = useParams().organizationId;
  const lotId = LotData?._id;

  // Map End-to-End (from BlocksData) and setup empty Net Measurement
 const mappedBlocks = (BlocksData || []).map((block: any) => ({
  blockNumber: block.blockNumber || `B-${block._id?.slice(-4)}`, // fallback if no number
  dimensions: {
    length: block.dimensions?.length?.value || 0,
    breadth: block.dimensions?.breadth?.value || 0,
    height: block.dimensions?.height?.value || 0,
  },
  netDimensions: {
    length: 0,
    breadth: 0,
    height: 0,
  },
}));

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blocks: mappedBlocks.map((b) => ({
        netDimensions: b.netDimensions,
      })),
    },
  });

  const { control, getValues, setValue, trigger } = form;

  // ---------- Submit ----------
  async function onSubmit(values: FormData) {
    setIsLoading(true);
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please fill all required fields correctly");
      setIsLoading(false);
      return;
    }

    const submissionData = {
      lotId,
      factoryId,
      organizationId,
      netBlocks: values.blocks.map((block, i) => ({
        ...block.netDimensions,
      })),
    };

    try {
      await putData(
        `/factory-management/inventory/lot/update/${lotId}`,
        submissionData
      );
      toast.success("Net measurements saved");
      router.push("../");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving net measurements");
    } finally {
      setIsLoading(false);
    }
  }

  // ---------- Totals ----------
  const totals = React.useMemo(() => {
    let endVol = 0,
      endWt = 0,
      netVol = 0,
      netWt = 0;
    mappedBlocks.forEach((b, i) => {
      // End-to-End
      const v1 = calculateVolume(
        b.dimensions.length,
        b.dimensions.breadth,
        b.dimensions.height
      );
      endVol += v1;
      endWt += v1 * 3.5;

      // Net (from form values)
      const n = getValues().blocks[i]?.netDimensions || {
        length: 0,
        breadth: 0,
        height: 0,
      };
      const v2 = calculateVolume(n.length, n.breadth, n.height);
      netVol += v2;
      netWt += v2 * 3.5;
    });
    return { endVol, endWt, netVol, netWt };
  }, [mappedBlocks, getValues]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2}>#</TableHead>
                <TableHead rowSpan={2}>Block No.</TableHead>

                <TableHead colSpan={5} className="text-center">
                  End-to-End Measurement
                </TableHead>
                <TableHead colSpan={5} className="text-center">
                  Net Measurement
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Length (cm)</TableHead>
                <TableHead>Breadth (cm)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Weight (tons)</TableHead>

                <TableHead>Length (cm)</TableHead>
                <TableHead>Breadth (cm)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Weight (tons)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mappedBlocks.map((block, index) => {
                const endVol = calculateVolume(
                  block.dimensions.length,
                  block.dimensions.breadth,
                  block.dimensions.height
                );
                const endWt = endVol * 3.5;

                const net = getValues().blocks[index]?.netDimensions || {
                  length: 0,
                  breadth: 0,
                  height: 0,
                };
                const netVol = calculateVolume(
                  net.length,
                  net.breadth,
                  net.height
                );
                const netWt = netVol * 3.5;

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                     <TableCell>{block.blockNumber}</TableCell>

                    {/* End-to-End (readonly) */}
                    <TableCell>{block.dimensions.length}</TableCell>
                    <TableCell>{block.dimensions.breadth}</TableCell>
                    <TableCell>{block.dimensions.height}</TableCell>
                    <TableCell>{endVol.toFixed(2)}</TableCell>
                    <TableCell>{endWt.toFixed(2)}</TableCell>

                    {/* Net Measurement (editable) */}
                    <TableCell>
                      <FormField
                        name={`blocks.${index}.netDimensions.length`}
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={field.value || ""} // keep it controlled
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  // remove leading zeros while typing
                                  const cleaned =
                                    raw === ""
                                      ? ""
                                      : raw.replace(/^0+(?=\d)/, "");
                                  const num =
                                    cleaned === "" ? 0 : parseFloat(cleaned);
                                  setValue(
                                    `blocks.${index}.netDimensions.length`,
                                    num,
                                    { shouldValidate: true, shouldDirty: true }
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        name={`blocks.${index}.netDimensions.breadth`}
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={field.value || ""} // control the value
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const cleaned =
                                    raw === ""
                                      ? ""
                                      : raw.replace(/^0+(?=\d)/, "");
                                  const num =
                                    cleaned === "" ? 0 : parseFloat(cleaned);

                                  setValue(
                                    `blocks.${index}.netDimensions.breadth`,
                                    num,
                                    { shouldValidate: true, shouldDirty: true }
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    <TableCell>
                      <FormField
                        name={`blocks.${index}.netDimensions.height`}
                        control={control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={field.value || ""} // control the value
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const cleaned =
                                    raw === ""
                                      ? ""
                                      : raw.replace(/^0+(?=\d)/, "");
                                  const num =
                                    cleaned === "" ? 0 : parseFloat(cleaned);

                                  setValue(
                                    `blocks.${index}.netDimensions.height`,
                                    num,
                                    { shouldValidate: true, shouldDirty: true }
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    <TableCell>{netVol.toFixed(2)}</TableCell>
                    <TableCell>{netWt.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell colSpan={3}></TableCell>
                <TableCell className="font-bold">
                  {totals.endVol.toFixed(2)}
                </TableCell>
                <TableCell className="font-bold">
                  {totals.endWt.toFixed(2)}
                </TableCell>

                <TableCell colSpan={3}></TableCell>
                <TableCell className="font-bold">
                  {totals.netVol.toFixed(2)}
                </TableCell>
                <TableCell className="font-bold">
                  {totals.netWt.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Net Measurements"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
