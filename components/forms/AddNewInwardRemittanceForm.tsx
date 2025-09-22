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
import { fetchData, postData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { FileUploadField } from "@/app/(routes)/[organizationId]/documentation/shipment/createnew/components/FileUploadField";
import EntityCombobox from "../ui/EntityCombobox";
import { useGlobalModal } from "@/hooks/GlobalModal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import CalendarComponent from "../CalendarComponent";

const inwardRemittanceFormSchema = z.object({
  inwardRemittanceNumber: z.string().min(1, { message: "Inward Remittance Number is required" }),
  inwardRemittanceDate: z.string().min(1, { message: "Date is required" }),
  inwardRemittanceValue: z.string().optional(),
  inwardRemittanceCopy: z.string().optional(),
  invoiceNumber: z.string().optional(),
  invoiceValue: z.string().optional(),
  invoiceDate: z.string().min(1, { message: "Invoice Date is required" }),
  invoiceCopy: z.string().optional(),
  method: z.enum(["bank_transfer", "cash", "cheque", "other"], {
    errorMap: () => ({ message: "Payment Method is required" }),
  }),
  differenceAmount: z.number().optional(),
  notes: z.string().optional(),
  consigneeId: z.string().optional(),
  organizationId: z.string(),
});
type InwardRemittanceFormValues = z.infer<typeof inwardRemittanceFormSchema>;

interface AddNewInwardRemittanceFormProps {
  initialData?: InwardRemittanceFormValues;
}

function saveProgressSilently(data: any) {
  localStorage.setItem("shipmentFormData", JSON.stringify(data));
  localStorage.setItem("lastSaved", new Date().toISOString());
}

const AddNewInwardRemittanceForm: React.FC<AddNewInwardRemittanceFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const organisationID = params.organizationId

  const { openModal } = useGlobalModal() as any;
  const [isLoading, setIsLoading] = useState(false);
  const [consigneeNames, setConsigneeNames] = useState<
    { _id: string; name: string }[]
  >([]);

  //get all consignee
  const consignee = async () => {
    const res = await fetchData(`/shipment/consignee/getbyorg/${organisationID}`)
    setConsigneeNames(res)
  }
  consignee()


  const form = useForm<InwardRemittanceFormValues>({
    resolver: zodResolver(inwardRemittanceFormSchema),
    defaultValues: initialData as any || {
      inwardRemittanceNumber: "",
      inwardRemittanceDate: "",
      inwardRemittanceValue: "",
      inwardRemittanceCopy: "",
      invoiceNumber: "",
      invoiceValue: "",
      invoiceDate: "",
      invoiceCopy: "",
      differenceAmount: undefined,
      method: "bank_transfer",
      notes: "",
      consigneeId: undefined,
      organizationId: params.organizationId,
    }
  }) as any
  const onSubmit = async (data: InwardRemittanceFormValues) => {
    try {
      setIsLoading(true);
      await postData(
        `/remittance/create`,
        {
          ...data,
          organizationId: params.organizationId,
          inwardRemittanceValue: Number(data.inwardRemittanceValue),
          invoiceValue: Number(data.invoiceValue),
          differenceAmount: Number(data.differenceAmount) || 0,
        }
      );
      toast.success("Inward Remittance added successfully");
      router.push(`/${params.organizationId}/documentation/remittance`);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="inwardRemittanceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inward Remittance Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Inward Remittance Number"
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
            name="inwardRemittanceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inward Remittance Date</FormLabel>
                <FormControl>


                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          {field.value
                            ? format(
                              new Date(field.value as any),
                              "PPPP"
                            )
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
                            ? new Date(field.value as any)
                            : undefined
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
            name="inwardRemittanceValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inward Remittance Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Inward Remittance Value"
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
            name="inwardRemittanceCopy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inward Remittance Copy</FormLabel>
                <FormControl>
                  <FormField
                    name={`inwardRemittanceCopy`}
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <FileUploadField
                            name={`inwardRemittanceCopy`}
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
                    type="number"
                    placeholder="Enter Invoice Value"
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
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          {field.value
                            ? format(
                              new Date(field.value as any),
                              "PPPP"
                            )
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
                            ? new Date(field.value as any)
                            : undefined
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
            name="invoiceCopy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Copy</FormLabel>
                <FormControl>
                  <FormField
                    name={`invoiceCopy`}
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <FileUploadField
                            name={`invoiceCopy`}
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
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Method" />
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
            name="consigneeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consignee</FormLabel>
                <FormControl>
                  <EntityCombobox
                    entities={consigneeNames}
                    value={field.value || ""}
                    onChange={(value) => field.onChange(value)}
                    valueProperty="_id"
                    displayProperty="name"
                    placeholder="Select a Consignee Name"
                    onAddNew={() => {
                      window.open(
                        `/${organisationID}/documentation/parties/createNew`,
                        "_blank"
                      );
                    }}
                    multiple={false}
                    addNewLabel="Add New Consignee"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes"
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Inward Remittance"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddNewInwardRemittanceForm;