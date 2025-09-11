"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/ui/icons";
import { putData } from "@/axiosUtility/api"; // ✅ already authorized
import toast from "react-hot-toast";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";

// ✅ Schema
const formSchema = z
  .object({
    crackedPhoto: z.any().optional(),
    crackedBlockRemarks: z.string().optional(),
    confirmCrack: z.boolean().refine((val) => val === true, {
      message: "You must confirm to mark this block as cracked",
    }),
  })
  .refine((data) => data.crackedPhoto || data.crackedBlockRemarks, {
    message: "Upload a cracked block photo OR provide a crackedBlockRemarks",
    path: ["crackedBlockRemarks"],
  });

interface CrackedBlockFormProps {
  blockData: {
    _id: string;
    blockNumber: string;
    lotName: string;
    createdAt: string;
    status?: string;
  };
  onStatusChange?: (newStatus: string) => void;
}

export default function CrackedBlockForm({
  blockData,
  onStatusChange,
}: CrackedBlockFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(blockData.status || "inStock");
  const GlobalModal = useGlobalModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crackedPhoto: undefined,
      crackedBlockRemarks: "",
      confirmCrack: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    GlobalModal.title = "Confirm Mark as Cracked";
    GlobalModal.description =
      "Do you want to mark this block as cracked? This action cannot be undone.";
    GlobalModal.children = (
      <div className="space-y-4">
        <p>Block: {blockData.blockNumber}</p>
        <p>Lot: {blockData.lotName}</p>
        <p>Date: {new Date(blockData.createdAt).toLocaleDateString("en-GB")}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => GlobalModal.onClose()}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                setIsLoading(true);

                const formData = new FormData();
                if (values.crackedPhoto) {
                  formData.append("crackedPhoto", values.crackedPhoto);
                }
                if (values.crackedBlockRemarks) {
                  formData.append("crackedBlockRemarks", values.crackedBlockRemarks);
                }
                await putData(
                  `/factory-management/inventory/raw/markcracked/${blockData._id}`,
                  values,
                );

                toast.success("Block marked as cracked successfully");

                setLocalStatus("Cracked");
                if (onStatusChange) {
                  onStatusChange("Cracked");
                }

                GlobalModal.onClose();
              } catch (error) {
                console.error("Error:", error);
                toast.error("Failed to mark block as cracked");
                GlobalModal.onClose();
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* ✅ Block Details */}
        <div>
          <FormLabel>Block Name</FormLabel>
          <Input value={blockData.blockNumber} disabled />
        </div>
        <div>
          <FormLabel>Lot Name</FormLabel>
          <Input value={blockData.lotName} disabled />
        </div>
        <div>
          <FormLabel>Created Date</FormLabel>
          <Input
            value={new Date(blockData.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            disabled
          />
        </div>

        {/* ✅ Upload Photo */}
        <FormField
          control={form.control}
          name="crackedPhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Cracked Block Photo</FormLabel>
              <FormControl>
                <FileUploadField
                  name={field.name}
                  storageKey="crackedPhoto"
                  onChange={(file) => field.onChange(file)} // ✅ connect to RHF
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Reason */}
        <FormField
          control={form.control}
          name="crackedBlockRemarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason (if no photo)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter reason..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Confirmation Checkbox */}
        <FormField
          control={form.control}
          name="confirmCrack"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                Do you want to mark this block as cracked? This action cannot be
                undone.
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Submit */}
        <Button
          type="submit"
          disabled={isLoading || !form.watch("confirmCrack")}
          className="w-full"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
