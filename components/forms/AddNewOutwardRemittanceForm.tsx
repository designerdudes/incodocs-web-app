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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import CalendarComponent from "../CalendarComponent";

const outwardRemittanceFormSchema = z.object({
  bankName: z.string().optional(),
  paymentProofUrl: z.string().optional(),
  method: z.enum(["bank_transfer", "cash", "cheque", "other"], {
    errorMap: () => ({ message: "Payment method is required" }),
  }),
  paymentDate: z.string().optional(),
  amount: z.coerce.number().optional(),
  description: z.string().optional(),
  customerName: z.string().min(1, { message: "Enter Customer Name" }),
  organizationId: z.string(),
});
type OutwardRemittanceFormValues = z.infer<typeof outwardRemittanceFormSchema>;

interface AddNewOutwardRemittanceFormProps {
  initialData?: OutwardRemittanceFormValues;
}

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

const AddNewOutwardRemittanceForm: React.FC<AddNewOutwardRemittanceFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const organisationID = params.organizationId;
  const [isLoading, setIsLoading] = useState(false);
 
      const form = useForm<OutwardRemittanceFormValues>({
    resolver: zodResolver(outwardRemittanceFormSchema),
    defaultValues: (initialData as any) || {
      customerName: "",
      bankName: "",
      paymentDate: "",
      amount: "",
      method: "",
      description: "",
      organizationId: params.organizationId,
    },
  }) as any;
  const onSubmit = async (data: OutwardRemittanceFormValues) => {
    try {
      setIsLoading(true);
      await postData(`/remittance/outward/create`, {
        ...data,
      });
      toast.success("Outward Remittance added successfully");
      router.push(
        `/${params.organizationId}/documentation/remittance/outwardRemittance`
      );
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Bank Name"
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
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full">
                          {field.value
                            ? format(new Date(field.value as any), "PPPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        selected={
                          field.value ? new Date(field.value as any) : undefined
                        }
                        onSelect={(date: Date | undefined) => {
                          field.onChange(date?.toISOString());
                          saveProgressSilently(form.getValues());
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
            name="paymentProofUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Proof</FormLabel>
                <FormControl>
                  <FormField
                    name={`paymentProofUrl`}
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <FileUploadField
                            name={`paymentProofUrl`}
                            storageKey="documents_fileUrl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    control={form.control}
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
                <FormLabel>Payment method</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
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
          <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Customer Name"
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>amount</FormLabel>
                <FormControl>
                  <Input
                  type="number"
                  min={0}
                    placeholder="Enter amount"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-1  grid-cols-2">
                <FormLabel>description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional description"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex justify-start">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Outward Remittance"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNewOutwardRemittanceForm;
