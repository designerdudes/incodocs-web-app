"use client";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AddBlockForm } from "@/components/forms/AddBlockForm";

// Define the Zod schema (same as in AddBlockForm)
const formSchema = z.object({
    markerCost: z
        .number()
        .min(1, { message: "Marker cost must be greater than or equal to zero" })
        .optional(),
    transportCost: z
        .number()
        .min(1, { message: "Transport cost must be greater than or equal to zero" })
        .optional(),
    materialCost: z
        .number()
        .min(1, { message: "Material cost must be greater than or equal to zero" })
        .optional(),
    noOfBlocks: z
        .number()
        .min(1, { message: "Number of blocks must be greater than zero" }),
    blocks: z
        .array(
            z.object({
                dimensions: z.object({
                    weight: z.object({
                        value: z
                            .number({ required_error: "Weight is required" })
                            .min(0.1, { message: "Weight must be greater than zero" }),
                        units: z.literal("tons").default("tons"),
                    }),
                    length: z.object({
                        value: z
                            .number({ required_error: "Length is required" })
                            .min(0.1, { message: "Length must be greater than zero" }),
                        units: z.literal("inch").default("inch"),
                    }),
                    breadth: z.object({
                        value: z
                            .number({ required_error: "Breadth is required" })
                            .min(0.1, { message: "Breadth must be greater than zero" }),
                        units: z.literal("inch").default("inch"),
                    }),
                    height: z.object({
                        value: z
                            .number({ required_error: "Height is required" })
                            .min(0.1, { message: "Height must be greater than zero" }),
                        units: z.literal("inch").default("inch"),
                    }),
                }),
            })
        )
        .min(1, { message: "At least one block is required" }),
});

type FormData = z.infer<typeof formSchema>;

interface LotFormWrapperProps {
    lotData: {
        lotId: string;
        lotName: string;
        materialType: string;
        blocksId: string[];
        transportCost: number;
        materialCost: number;
        markerCost: number;
        markerOperatorName: string;
        createdAt: string;
        updatedAt: string;
        blocks: Array<{
            dimensions: {
                weight: { value: number; units: string };
                length: { value: number; units: string };
                breadth: { value: number; units: string };
                height: { value: number; units: string };
            };
        }>;
    };
}

export default function LotFormWrapper({ lotData }: LotFormWrapperProps) {
    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            markerCost: lotData?.markerCost || undefined,
            transportCost: lotData?.transportCost || undefined,
            materialCost: lotData?.materialCost || undefined,
            noOfBlocks: lotData?.blocks?.length || 1,
            blocks:
                lotData?.blocks?.length > 0
                    ? lotData.blocks
                    : [
                        {
                            dimensions: {
                                weight: { value: 0.1, units: "tons" },
                                length: { value: 0.1, units: "inch" },
                                breadth: { value: 0.1, units: "inch" },
                                height: { value: 0.1, units: "inch" },
                            },
                        },
                    ],
        },
    });

    return (
        <FormProvider {...methods}>
            <AddBlockForm LotData={lotData} />
        </FormProvider>
    );
}