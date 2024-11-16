"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/ui/icons"
import { zodResolver } from "@hookform/resolvers/zod"


const formSchema = z.object({
  lotName: z.string().min(3, { message: "Lot name must be at least 3 characters long" }),
  materialType: z.string().min(3, { message: "Material type must be at least 3 characters long" }),
  quantity: z.string().min(1, { message: "Quantity must be a positive number" }).refine(val => parseFloat(val) > 0, {
    message: "Quantity must be greater than zero"
  }),
  weight: z.object({
    value: z.string().min(1, { message: "Weight must be a positive number" }).refine(val => parseFloat(val) > 0, {
      message: "Weight must be greater than zero"
    }),
    unit: z.string().optional(),
  }),
  length: z.object({
    value: z.string().min(1, { message: "Length must be a positive number" }).refine(val => parseFloat(val) > 0, {
      message: "Length must be greater than zero"
    }),
    unit: z.string().optional(),
  }),
  breadth: z.object({
    value: z.string().min(1, { message: "Breadth must be a positive number" }).refine(val => parseFloat(val) > 0, {
      message: "Breadth must be greater than zero"
    }),
    unit: z.string().optional(),
  }),
  height: z.object({
    value: z.string().min(1, { message: "Height must be a positive number" }).refine(val => parseFloat(val) > 0, {
      message: "Height must be greater than zero"
    }),
    unit: z.string().optional(),
  })
});

export function CardWithForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
    } catch (error) {
      console.error("Form submission error", error);
    }
  }
  return (

    <div className='w-full space-y-2 h-full flex p-6 flex-col'>
      <div className="topbar w-full flex items-center justify-between">
        <Link href="./">
          <Button variant="outline" size="icon" className="w-8 h-8 mr-4">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <Heading className='leading-tight' title='Create Lot Inventory' />
          <p className='text-muted-foreground text-sm'>Fill in the form below to add new Lot to your inventory</p>
        </div>
      </div>
      {/* <Separator orientation='horizontal' /> */}
      <div className="container mx-auto">
        <Card className="w-[700px] ml-2 mt-2">
          <CardHeader>
            <CardTitle>Add New Lot</CardTitle>
            <CardDescription>A form to input raw material data including lot details, blocks, and dimensions</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="grid gap-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                  <div className="grid gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <FormField
                        control={form.control}
                        name="lotName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lot Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Eg: Lot ABC"
                                type="text"
                                {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <FormField
                        control={form.control}
                        name="materialType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material Type</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Eg: Material ABC"
                                type="text"
                                {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={form.control}
                          name="weight.value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (Inch)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Eg: 15"
                                  type="number"
                                  step="any"
                                  min="0"
                                  {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={form.control}
                          name="weight.value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Breadth (Inch)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Eg: 17.5"
                                  type="number"
                                  step="any"
                                  min="0"
                                  {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={form.control}
                          name="weight.value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (Inch)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Eg: 10.5"
                                  type="number"
                                  step="any"
                                  min="0"
                                  {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity (Numbr of blocks)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Eg: 12"
                                  type="number"
                                  step="any"
                                  min="0"
                                  {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className='w-full grid gap-3 grid-cols-3'>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default CardWithForm;