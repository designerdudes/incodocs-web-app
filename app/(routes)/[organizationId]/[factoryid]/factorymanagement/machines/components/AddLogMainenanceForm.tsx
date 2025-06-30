"use client";

import React, { useEffect, useState } from "react";
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
import { postData, fetchData } from "@/axiosUtility/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import CalendarComponent from "@/components/CalendarComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { handleDynamicArrayCountChange } from "@/lib/utils/CommonInput";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { useGlobalModal } from "@/hooks/GlobalModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export const machineLogSchema = z.object({
  machineId: z.string().optional(),
  componentType: z.string(),
  componentCost: z.number().min(0, "Component Cost must be at least 0"),
  workerName: z.string().optional(),
  replacedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date-time format",
  }),
  sqfProcessed: z
    .number({ invalid_type_error: "Expected SQF must be a number" })
    .optional(),
  otherExpenses: z
    .array(
      z.object({
        expenseName: z.string(),
        expenseCost: z.number(),
      })
    )
    .optional(),
  review: z.string().optional(),
});

type MachineLogFormValues = z.infer<typeof machineLogSchema>;

interface Expense {
  expenseName: string;
  expenseCost: number;
}

interface Props {
  params: string;
}

export default function MachineFormPage({ params }: Props) {
  const GlobalModal = useGlobalModal();
  const router = useRouter();
  const [expenseBlockCount, setExpenseBlockCount] = useState(1);
  const [otherExpenses, setOtherExpenses] = useState<Expense[]>([
    { expenseName: "", expenseCost: 0 },
  ]);
  const [expenseCountToBeDeleted, setExpenseCountToBeDeleted] = useState<
    number | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [machineType, setMachineType] = useState<"Cutting" | "Polish">(
    "Cutting"
  );
  const machineId = params;

  const form = useForm<MachineLogFormValues>({
    resolver: zodResolver(machineLogSchema),
    defaultValues: {
      machineId: machineId,
      componentType: "",
      componentCost: 0,
      workerName: "",
      replacedAt: "",
      sqfProcessed: 0,
      otherExpenses: [{ expenseName: "", expenseCost: 0 }],
      review: "",
    },
  });

  const { control, setValue, watch, getValues } = form;

  useEffect(() => {
    async function fetchMachineType() {
      try {
        const data = await fetchData(`/machine/log/getbymachine/${params}`);

        if (!Array.isArray(data) || data.length === 0) {
          toast.error("No logs found for this machine");
          return;
        }

        const firstLog = data[0]; // 👈 Get the first log entry
        const machine = firstLog.machineId;

        const isCutting = Boolean(machine?.typeCutting);
        const isPolish = Boolean(machine?.typePolish);

        let machineType: "Cutting" | "Polish" | null = null;

        if (isCutting) {
          machineType = "Cutting";
        } else if (isPolish) {
          machineType = "Polish";
        }

        if (!machineType) {
          toast.error("Unknown machine type");
          return;
        }

        setMachineType(machineType);
        setValue(
          "componentType",
          machineType === "Cutting" ? "Segment" : "Bid"
        );
      } catch (err) {
        console.error("Error fetching machine type:", err);
        toast.error("Failed to fetch machine type");
      }
    }

    fetchMachineType();
  }, [params, setValue]);

  useEffect(() => {
    const current = getValues("otherExpenses") || [];
    setOtherExpenses(current);
    setExpenseBlockCount(current.length || 1);
  }, [getValues]);

  const handleExpenseCountChange = (value: string) => {
    const newCount = Number(value);
    setExpenseBlockCount(newCount);

    if (newCount < otherExpenses.length) {
      setShowConfirmation(true);
      setExpenseCountToBeDeleted(newCount);
    } else {
      handleDynamicArrayCountChange({
        value: String(newCount),
        watch,
        setValue,
        getValues,
        fieldName: "otherExpenses",
        createNewItem: (): Expense => ({ expenseName: "", expenseCost: 0 }),
        customFieldSetters: {
          otherExpenses: (items, setValue) => {
            setOtherExpenses(items);
            setValue("otherExpenses", items);
          },
        },
      }) as any;
    }
  };

  const handleConfirmChange = () => {
    if (expenseCountToBeDeleted !== null) {
      const updated = otherExpenses.slice(0, expenseCountToBeDeleted);
      setOtherExpenses(updated);
      setValue("otherExpenses", updated);
      setExpenseBlockCount(updated.length);
    }
    setExpenseCountToBeDeleted(null);
    setShowConfirmation(false);
  };

  const handleDeleteExpense = (index: number) => {
    const updated = otherExpenses.filter((_, i) => i !== index);
    setOtherExpenses(updated);
    setValue("otherExpenses", updated);
    setExpenseBlockCount(updated.length);
  };

  async function onSubmit(values: z.infer<typeof machineLogSchema>) {
    setIsLoading(true);
    try {
      await postData("/machine/log/add", {
        ...values,
        params,
      });
      toast.success("Log Added Successfully");
      router.push("../");
    } catch (error) {
      toast.error("Error updating Log Maintenance");
    } finally {
      setIsLoading(false);
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-3"
        >
          {/* Component Type */}
          <FormField
            control={form.control}
            name="componentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Component Type</FormLabel>
                <FormControl>
                  <Input value={field.value} readOnly disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Component Cost */}
          <FormField
            name="componentCost"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Component Cost</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Component Cost"
                    type="number"
                    min={0}
                    {...field}
                    // onChange={(e) =>
                    //   field.onChange(parseFloat(e.target.value) || 0)
                    // }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Worker Name */}
          <FormField
            control={form.control}
            name="workerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Worker Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg: Rajuu"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Replaced At */}
          <FormField
            control={form.control}
            name="replacedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Replaced At</FormLabel>
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date: Date | undefined) =>
                        field.onChange(date?.toISOString())
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expected SQF */}
          <FormField
            name="sqfProcessed"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected SQF Processed</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Expected SQF Processed"
                    min={0}
                    type="number"
                    // disabled={isLoading}
                    {...field}
                    // onChange={(e) =>
                    //   field.onChange(parseFloat(e.target.value) || 0)
                    // }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other Expenses Count */}
          <FormItem>
            <FormLabel>Number of Expenses</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                value={expenseBlockCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") return;
                  handleExpenseCountChange(value);
                }}
                disabled={isLoading}
              />
            </FormControl>
          </FormItem>

          {/* Expense Table */}
          <Table className="col-span-3">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Expense Name</TableHead>
                <TableHead>Expense Cost</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherExpenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <FormField
                      name={`otherExpenses.${index}.expenseName`}
                      control={control}
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g Rajuu"
                              value={expense.expenseName}
                              onChange={(e) => {
                                const updated = [...otherExpenses];
                                updated[index].expenseName = e.target.value;
                                setOtherExpenses(updated);
                                setValue("otherExpenses", updated);
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      name={`otherExpenses.${index}.expenseCost`}
                      control={control}
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              placeholder="Enter The Cost"
                              min={0}
                              value={expense.expenseCost}
                              onChange={(e) => {
                                const updated = [...otherExpenses];
                                updated[index].expenseCost =
                                  parseFloat(e.target.value) || 0;
                                setOtherExpenses(updated);
                                setValue("otherExpenses", updated);
                              }}
                              disabled={isLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteExpense(index)}
                      disabled={isLoading}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total Cost: ₹
                  {otherExpenses
                    .reduce((sum, e) => sum + e.expenseCost, 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Remarks */}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Remarks</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Submit"}
          </Button>

          <ConfirmationDialog
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmChange}
            title="Are you sure?"
            description="You are reducing the number of Expense Blocks. This action cannot be undone."
          />
        </form>
      </Form>
    </div>
  );
}
