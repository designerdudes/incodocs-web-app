"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";

// 🧾 Zod Schema
export const quarrySchema = z.object({
  lesseeId: z.string().optional(),
  lesseeName: z.string().optional(),
  mineralName: z.string().optional(),
  businessLocationNames: z.string().optional(),
  factoryId: z.string().optional(),
  documents: z
    .array(
      z.object({
        fileName: z.string().optional(),
        fileUrl: z.string().optional(),
        date: z.string().optional(),
        review: z.string().optional(),
      })
    )
    .optional(),
});

type QuarryFormValues = z.infer<typeof quarrySchema>;

interface QuarryFormProps {
  params: {
    factoryid: string;
    organizationId: string;
  };
}

export default function QuarryFormPage({ params }: QuarryFormProps) {
  const orgId = params.organizationId;
  const factoryId = params.factoryid;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuarryFormValues>({
    resolver: zodResolver(quarrySchema),
    defaultValues: {
      lesseeId: "",
      lesseeName: "",
      mineralName: "",
      businessLocationNames: "",
      factoryId: factoryId,
      documents: [
        {
          fileName: "",
          fileUrl: "",
          date: "",
          review: "",
        },
      ],
    },
  });

  const { control, ...formMethods } = form;

  const {
    fields: documentFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "documents",
  });

  const handleSubmit = async (values: QuarryFormValues) => {
    setIsLoading(true);
    try {
      await postData("/quarry/create", {
        ...values,
        params,
      });
      toast.success("Quarry added successfully!");
      router.push("./");
    } catch (error) {
      toast.error("Error creating/updating quarry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="lesseeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lessee ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: LID001"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lesseeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lessee Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Quarry Pvt Ltd"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mineralName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mineral Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Marble"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessLocationNames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Location(s)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Rajasthan, Andhra Pradesh"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload: documents.fileUrl */}
          {documentFields.map((doc: any, index: any) => (
            <div
              key={doc.id}
              className="border p-4 rounded-md space-y-4 relative"
            >
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`documents.${index}.fileName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Eg: LeaseAgreement.pdf"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`documents.${index}.fileUrl`}
                render={() => (
                  <FormItem>
                    <FormLabel>Document Upload</FormLabel>
                    <FormControl>
                      <FileUploadField
                        name={`documents.${index}.fileUrl`}
                        storageKey="quarryDocs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`documents.${index}.date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Document Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full">
                            {field.value
                              ? format(new Date(field.value), "PPPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`documents.${index}.review`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review / Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter review"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <div className="flex items-center justify-center w-1/2 gap-4">
            <Button
              className="w-1/2 "
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  fileName: "",
                  fileUrl: "",
                  date: "",
                  review: "",
                })
              }
            >
              + Add Document
            </Button>

            <Button type="submit" disabled={isLoading} className="w-1/2">
              {isLoading ? "Saving..." : "Add Quarry"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
