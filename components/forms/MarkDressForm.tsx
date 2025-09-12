"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import toast from "react-hot-toast";
import { fetchData, putData } from "@/axiosUtility/api";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


interface MarkDressFormProps {
  parentBlockId: string;
  blockNumber: string;
  originalBlockVolume: number;
   netDimensions: {
    length?: { value: number; units: string };
    breadth?: { value: number; units: string };
    height?: { value: number; units: string };
    weight?: { value?: number; units: string };
  };
  onSubmit: () => void;
}

interface FormValues {
  length: number;
  breadth: number;
  height: number;
  outTime: string;
  dressedPhoto: string | null;
}

export default function MarkDressForm({
  parentBlockId,
  netDimensions,
  blockNumber,
  originalBlockVolume,
  onSubmit,
}: MarkDressFormProps) {
  const density = 3.5;
  const [inTime, setInTime] = useState<string>(""); 
    const [outTime, setOutTime] = useState<string>("");

  const [assignedMachine, setAssignedMachine] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [originalBlock, setOriginalBlock] = useState<any>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      length: 0,
      breadth: 0,
      height: 0,
      outTime: "",
      dressedPhoto: null,
    },
  });

  const { handleSubmit, control, setValue, watch } = form;
  const watchedFields = watch(["length", "breadth", "height"]);

  const volume = (watchedFields[0] * watchedFields[1] * watchedFields[2]) / 1_000_000;
  const weight = volume * density;

useEffect(() => {
  const fetchBlockData = async () => {
    try {
      const res = await fetchData(
        `/factory-management/inventory/raw/get/${parentBlockId}`
      );

      const length = res.dimensions?.length?.value || 0;
      const breadth = res.dimensions?.breadth?.value || 0;
      const height = res.dimensions?.height?.value || 0;
      const vol = (length * breadth * height) / 1_000_000;
      const wgt = density * vol;

        setOriginalBlock({ length, breadth, height, volume, weight });

        // assigned machine & in/out time from backend
        if (res?.dressing?.machineId) {
          setAssignedMachine({
            id: res.dressing.machineId._id,
            name: res.dressing.machineId.machineName,
          });
        }

        if (res?.dressing?.in) {
          setInTime(res.dressing.in.substring(0, 16)); // format for datetime-local
        }

        if (res?.dressing?.out) {
          setOutTime(res.dressing.out.substring(0, 16));
        }
      } catch (error) {
        console.error("Error fetching block data:", error);
      }
    };

    if (parentBlockId) fetchBlockData();
  }, [parentBlockId]);

  const onFormSubmit = async (data: FormValues) => {
    if (!assignedMachine) return ;

    try {
      await putData(`/factory-management/inventory/raw/markdressed/${parentBlockId}`, {
        dressDimensions: { length: data.length, breadth: data.breadth, height: data.height, volume, weight },
        machineId: assignedMachine.id,
        outTime: data.outTime,
        dressedPhoto: data.dressedPhoto,
      });
      toast.success("Block dressed successfully");
      onSubmit();
    } catch (error: any) {
      console.error("Mark dressed failed", error);
      toast.error(error?.response?.data?.message || "Failed to mark dressed");
    }
  };

  const netLength = netDimensions?.length?.value ?? 0;
  const netBreadth = netDimensions?.breadth?.value ?? 0;
  const netHeight = netDimensions?.height?.value ?? 0;
  const netVolume = (netLength * netBreadth * netHeight) / 1_000_000;
  const netWeight = netVolume * density;

  return (
    <Form {...form}>
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>End to End Measurement</AccordionTrigger>
          <AccordionContent>
            {originalBlock && (
              <div className="border p-3 rounded-lg bg-gray-100">
                <h3 className="font-semibold mb-2">Original Block</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div><Label>Length (cm)</Label><Input type="number" value={originalBlock.length} disabled /></div>
                  <div><Label>Breadth (cm)</Label><Input type="number" value={originalBlock.breadth} disabled /></div>
                  <div><Label>Height (cm)</Label><Input type="number" value={originalBlock.height} disabled /></div>
                  <div><Label>Volume (m³)</Label><Input type="number" value={originalBlock.volume.toFixed(2)} disabled /></div>
                  <div><Label>Weight (tons)</Label><Input type="number" value={originalBlock.weight.toFixed(2)} disabled /></div>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Net Measurement</AccordionTrigger>
          <AccordionContent>
            <div className="border p-3 rounded-lg bg-gray-100">
              <h3 className="font-semibold mb-2">Net Dimensions Block</h3>
              <div className="grid grid-cols-5 gap-4">
                <div><Label>Length (cm)</Label><Input type="number" value={netLength} disabled /></div>
                <div><Label>Breadth (cm)</Label><Input type="number" value={netBreadth} disabled /></div>
                <div><Label>Height (cm)</Label><Input type="number" value={netHeight} disabled /></div>
                <div><Label>Volume (m³)</Label><Input type="number" value={netVolume.toFixed(2)} disabled /></div>
                <div><Label>Weight (tons)</Label><Input type="number" value={netWeight.toFixed(2)} disabled /></div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

       <AccordionItem value="item-3">
  <AccordionTrigger>Assigned Machine</AccordionTrigger>
  <AccordionContent>
    <div className="border p-3 rounded-lg bg-gray-100 space-y-3">
      <div>
        <Label>Machine Used</Label>
        <Input type="text" value={assignedMachine?.name || "Not Assigned"} disabled />
      </div>
      <div>
        <Label>In Time (Date & Time)</Label>
        <Input type="datetime-local" value={inTime || ""} disabled />
      </div>
    </div>
  </AccordionContent>
</AccordionItem>


      </Accordion>

      {/* Dressed Block Fields */}
     <div className="border p-3 rounded-lg bg-white">
  <h3 className="font-semibold mb-2">Dressed Block Dimension</h3>
  <div className="grid grid-cols-5 gap-5">
    {/* Length */}
    <div>
      <Label>Length (cm)</Label>
      <Input
        type="number"
        value={watch("length")}
        onChange={(e) => setValue("length", Number(e.target.value))}
      />
    </div>

    {/* Breadth */}
    <div>
      <Label>Breadth (cm)</Label>
      <Input
        type="number"
        value={watch("breadth")}
        onChange={(e) => setValue("breadth", Number(e.target.value))}
      />
    </div>

    {/* Height */}
    <div>
      <Label>Height (cm)</Label>
      <Input
        type="number"
        value={watch("height")}
        onChange={(e) => setValue("height", Number(e.target.value))}
      />
    </div>

    {/* Volume */}
    <div>
      <Label>Volume (m³)</Label>
      <Input
        type="number"
        value={((watch("length") * watch("breadth") * watch("height")) / 1_000_000).toFixed(2)}
        disabled
      />
    </div>

    {/* Weight */}
    <div>
      <Label>Weight (t)</Label>
      <Input
        type="number"
        value={(((watch("length") * watch("breadth") * watch("height")) / 1_000_000) * density).toFixed(2)}
        disabled
      />
    </div>
  </div>
</div>

      {/* Cracked Photo Upload */}
      <div className="border p-3 rounded-lg bg-white">
        <Label>Dressed Photo</Label>
        <Controller
          name="dressedPhoto"
          control={control}
          render={({ field }) => (
            <FileUploadField
              storageKey="dressedPhoto"
              value={field.value}
              onChange={field.onChange}
              name="dressedPhoto"
            />
          )}
        />
      </div>

      {/* Out Time */}
      <div className="border p-3 rounded-lg bg-white space-y-3">
        <Controller
          name="outTime"
          control={control}
          render={({ field }) => (
            <>
              <Label>Out Time (Date & Time)</Label>
              <Input type="datetime-local" {...field} />
            </>
          )}
        />
      </div>

      <Button type="submit" className="mt-4 w-full">
        Mark Dressed
      </Button>
    </form>
    </Form>
  );
}
