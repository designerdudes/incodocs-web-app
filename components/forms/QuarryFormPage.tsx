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
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// 🧾 Zod Schema
export const quarrySchema = z.object({
  lesseeId: z.string().optional(),
  lesseeName: z.string().min(1,"Lesses Name is required"),
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
      router.push("../");
    } catch (error) {
      toast.error("Error creating quarry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col space-y-6 w-full"
        >
          <div className="grid grid-flow-col gap-4">
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
          </div>
          {/* File Upload: documents.fileUrl */}
          <div>
            {documentFields.length > 0 && (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Document Upload</TableHead>
                    <TableHead>Document Date</TableHead>
                    <TableHead>Review / Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentFields.map((doc: any, index: number) => (
                    <TableRow key={doc.id}>
                      {/* File Name */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.fileName`}
                          render={({ field }) => (
                            <FormItem>
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
                      </TableCell>

                      {/* File Upload */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.fileUrl`}
                          render={() => (
                            <FormItem>
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
                      </TableCell>

                      {/* Document Date */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.date`}
                          render={({ field }) => (
                            <FormItem>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      {field.value
                                        ? format(new Date(field.value), "PPPP")
                                        : "Pick a date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <CalendarComponent
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
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
                      </TableCell>

                      {/* Review / Description */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`documents.${index}.review`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter review"
                                  className="resize-none"
                                  rows={2}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
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
              {isLoading ? "Saving..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
