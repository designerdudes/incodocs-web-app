"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "../CalendarComponent";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import { fetchData, putData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const inwardRemittanceFormSchema = z.object({
    inwardRemittanceNumber: z.string().min(1),
    inwardRemittanceDate: z.string().optional(),
    inwardRemittanceValue: z.number().optional(),
    inwardRemittanceCopy: z.string().optional(),
    invoiceNumber: z.string().optional(),
    invoiceValue: z.number().optional(),
    invoiceDate: z.string().optional(),
    invoiceCopy: z.string().optional(),
    status: z.string().optional(),
    method: z.enum(["bank_transfer", "cash", "cheque", "other"]),
    differenceAmount: z.number().optional(),
    notes: z.string().optional(),
   
    organizationId: z.string(),
});

type InwardRemittanceFormValues = z.infer<typeof inwardRemittanceFormSchema>;

interface EditInwardRemittanceFormProps {
    params: {
        _id: string;
        organizationId: {
            _id: string;
            name: string;
        };
        inwardRemittanceNumber: string;
        inwardRemittanceDate: string;
        inwardRemittanceValue?: number;
        inwardRemittanceCopy?: string;
        invoiceNumber?: string;
        invoiceValue?: number;
        invoiceDate: string;
        invoiceCopy?: string;
        status?: string;
        method?: "bank_transfer" | "cash" | "cheque" | "other";
        differenceAmount?: number;
        notes?: string;
        
    }
}


export default function EditInwardRemittanceForm({ params }: EditInwardRemittanceFormProps) {
    const orgId = params?.organizationId?._id;
    const remittanceId = params?._id
    const router = useRouter();
    const [initialData, setInitialData] = useState<InwardRemittanceFormValues | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    console.log("This is orgId", orgId)
    console.log("This is remittanceId", remittanceId)

    console.log("This is params in form", params)


    const form = useForm<InwardRemittanceFormValues>({
        resolver: zodResolver(inwardRemittanceFormSchema),
        defaultValues: {
            inwardRemittanceNumber: params.inwardRemittanceNumber || "",
            inwardRemittanceValue: params.inwardRemittanceValue || 0,
            inwardRemittanceDate: params.inwardRemittanceDate || "",
            inwardRemittanceCopy: params.inwardRemittanceCopy || "",
            invoiceNumber: params.invoiceNumber || "",
            invoiceValue: params.invoiceValue || 0,
            invoiceDate: params.invoiceDate || "",
            invoiceCopy: params.invoiceCopy || "",
            status: params.status || "",
            method: params.method || "bank_transfer",
            differenceAmount: params.differenceAmount || 0,
            notes: params.notes || "",
           
            organizationId: orgId || "",
        },
    });


    useEffect(() => {
        form.reset({
            inwardRemittanceNumber: params?.inwardRemittanceNumber || "",
            inwardRemittanceValue: params?.inwardRemittanceValue || 0,
            inwardRemittanceDate: params?.inwardRemittanceDate || "",
            inwardRemittanceCopy: params?.inwardRemittanceCopy || "",
            invoiceNumber: params?.invoiceNumber || "",
            invoiceValue: params?.invoiceValue || 0,
            invoiceDate: params?.invoiceDate || "",
            invoiceCopy: params?.invoiceCopy || "",
            status: params?.status || "",
            method: params?.method || "bank_transfer",
            differenceAmount: params?.differenceAmount || 0,
            notes: params?.notes || "",
          

            organizationId: orgId || "",
        });
    }, [params, form]);
    // Fetch remittance data once

    const onSubmit = async (values: InwardRemittanceFormValues) => {
        setIsLoading(true);
        try {
            await putData(`/remittance/update/${remittanceId}`, {
                ...values,
                organizationId: orgId,
                // inwardRemittanceValue: Number(values.inwardRemittanceValue),
                // invoiceValue: Number(values.invoiceValue),
                // differenceAmount: Number(values.differenceAmount) || 0,
            });
            toast.success("Inward Remittance updated successfully");
            router.push(`/${orgId}/documentation/remittance`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="inwardRemittanceNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Inward Remittance Number</FormLabel>
                                <FormControl><Input {...field} placeholder="Enter Inward Remittance Number" disabled={isLoading} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="inwardRemittanceDate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Inward Remittance Date</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                {field.value ? format(new Date(field.value), "PPPP") : "Pick a date"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                selected={
                                                    field.value ? new Date(field.value as any) : undefined
                                                }
                                                onSelect={(date: Date | undefined) => {
                                                    field.onChange(date?.toISOString());
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="inwardRemittanceValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inward Remittance Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Inward Remittance Value"
                                            min={0}
                                            disabled={isLoading}
                                            className="w-[40%]" // Limit width to 40%
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(parseFloat(e.target.value) || 0)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="inwardRemittanceCopy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inward Remittance Copy</FormLabel>
                                    <FormControl>
                                        <FileUploadField
                                            name="inwardRemittanceCopy"
                                            storageKey="documents_fileUrl"
                                            value={field.value} // <-- bind RHF value
                                            onChange={field.onChange} // <-- bind RHF onChange
                                        />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="invoiceNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Invoice Number"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="invoiceValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Invoice Value"
                                            min={0}
                                            disabled={isLoading}
                                            className="w-[40%]" // Limit width to 40%
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(parseFloat(e.target.value) || 0)
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter Status"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="invoiceDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Date</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    {field.value
                                                        ? format(new Date(field.value), "PPPP")
                                                        : "Pick a date"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    selected={
                                                        field.value ? new Date(field.value as any) : undefined
                                                    }
                                                    onSelect={(date: Date | undefined) => {
                                                        field.onChange(date?.toISOString());
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="invoiceCopy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice Copy</FormLabel>
                                    <FormControl>
                                        <FileUploadField
                                            name="invoiceCopy"
                                            storageKey="documents_fileUrl"
                                            onChange={field.onChange}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Payment Method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="cheque">Cheque</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="differenceAmount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Difference Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Difference Amount"
                                        min={0}
                                        disabled={isLoading}
                                        className="w-[40%]" // Limit width to 40%
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(parseFloat(e.target.value) || 0)
                                        }
                                    />
                                </FormControl>                                     <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem className="md:col-span-3">
                                <FormLabel>Notes</FormLabel>
                                <FormControl><Textarea {...field} placeholder="Enter any additional notes" disabled={isLoading} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Submit"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}



