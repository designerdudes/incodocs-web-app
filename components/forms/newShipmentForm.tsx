"use client"
import React from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Heading from '../ui/heading'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Icons } from '../ui/icons'
import { Separator } from '../ui/separator'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    //Booking Details
    containerNumber: z.string().optional(),
    portOfLoading: z.string().optional(),
    destinationPort: z.string().optional(),
    vesselSailingDate: z.date().optional(),
    vesselArrivingDate: z.date().optional(),
    truckNumber: z.string().optional(),
    truckDriverNumber: z.string().optional(),

    //Shipping Details
    shippingLine: z.string().optional(),
    forwarder: z.string().optional(),
    forwarderInvoice: z.string().optional(),
    valueOfForwarderInvoice: z.string().optional(),
    transporter: z.string().optional(),
    transporterInvoice: z.string().optional(),
    valueOfTransporterInvoice: z.string().optional(),

    //Shipping Bill Details
    shippingBillNumber: z.string().optional(),
    shippingBillDate: z.date().optional(),
    uploadShippingBill: z.string().optional(),
    cbName: z.string().optional(),

    //Supplier Details
    supplierName: z.string().optional(),
    actualSupplierName: z.string().optional(),
    supplierGSTIN: z.string().optional(),
    supplierInvoiceNumber: z.string().optional(),
    supplierInvoiceDate: z.date().optional(),
    supplierInvoiceValueWithOutGST: z.string().optional(),
    supplierInvoiceValueWithGST: z.string().optional(),
    uploadSupplierInvoice: z.string().optional(),
    actualSupplierInvoice: z.string().optional(),
    actualSupplierInvoiceValue: z.string().optional(),

    //Sale Inovice Details
    commercialInvoiceNumber: z.string().optional(),
    commercialInvoiceDate: z.date().optional(),
    consigneeDetails: z.string().optional(),
    actualBuyer: z.string().optional(),

    //BL Details
    blNumber: z.string().optional(),
    blDate: z.date().optional(),
    telexDate: z.date().optional(),
    uploadBL: z.string().optional()
})

export function NewShipmentForm() {

    const [currentStep, setCurrentStep] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false)

    const totalSteps = 6

    const stepNames = [
        {
            index: 1,
            title: "Booking Details"
        },

        {
            index: 2,
            title: "Shipping Details"
        },

        {
            index: 3,
            title: "Shipping Bill Details"
        },

        {
            index: 4,
            title: "Supplier Details"
        },

        {
            index: 5,
            title: "Sale Invoice Details"
        },

        {
            index: 6,
            title: "Bill Of Landing Details"
        },

    ]

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            containerNumber: "",
            portOfLoading: "",
            destinationPort: "",

            truckNumber: "",
            truckDriverNumber: "",
        },
    })
    const router = useRouter()
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true)
        try {
            console.log(values)
            const res = await axios.post('/api/shipment/createnew', values)
            console.log(res)
            setIsLoading(false)
            router.push('/shipments')
            console.log(values)
        } catch (error: any) {
            console.log(error)
            setIsLoading(false)
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3 w-full p-3 '>
                <div className='flex justify-between'>
                    <Heading className='text-xl' title={
                        stepNames.map((step) => {
                            if (step.index === currentStep) {
                                return step.title.toString()
                            }
                        })
                    } />
                    <p className=' text-sm text-muted-foreground'>Step {currentStep} of {totalSteps}</p>

                </div>
                <Separator className='my-2' orientation='horizontal' />

                {currentStep === 1 &&
                    // Booking Details
                    <div className="grid grid-cols-4 gap-3">

                        <FormField
                            control={form.control}
                            name="containerNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Container Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. MRKU6998040" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="portOfLoading"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Port Of Loading</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. CHENNAI" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="destinationPort"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination Port</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. UMM QASAR" className=' uppercase'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vesselSailingDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>Vessel Sailing Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    size={'lg'} variant={"outline"}
                                                // className={cn(
                                                //     "w-[240px] pl-3 text-left font-normal",
                                                //     !field.value && "text-muted-foreground"
                                                // )}
                                                >
                                                    {field.value ? (
                                                        format(field.value as Date, "PPPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vesselArrivingDate"

                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>Vessel Arriving Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    size={'lg'} variant={"outline"}

                                                >
                                                    {field.value ? (
                                                        format(field.value as Date, "PPPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="truckNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Truck Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. TN01BQ2509" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="truckDriverNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Truck Driver Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} type='tel' placeholder="eg. TN01BQ2509" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}
                {currentStep === 2 &&
                    // SHIPPING DETAILS
                    <div className="grid grid-cols-4 gap-3">

                        <FormField
                            control={form.control}
                            name="shippingLine"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shipping Line</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. MAERSK" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="forwarder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Forwarder Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. VTRANS" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="forwarderInvoice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Forwarder Invoice</FormLabel>
                                    <FormControl>
                                        <Input type='text' disabled={isLoading} placeholder="eg. https://drive.google.com/file/d/1zskHj_SAun0LoGhiG_dppiHFy78rKIFI/view?usp=share_link"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="valueOfForwarderInvoice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value Of Forwarder Invoice</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            maximumFractionDigits: 0,
                                            currency: "INR",
                                        }).format(122394)
                                            }`}
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transporter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transporter</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. VS TRANS" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transporterInvoice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transporter Invoice</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} type='tel' placeholder="eg. https://drive.google.com/file/d/1zskHj_SAun0LoGhiG_dppiHFy78rKIFI/view?usp=share_link"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="valueOfTransporterInvoice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value Of Transporter Invoice</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            maximumFractionDigits: 0,
                                            currency: "INR",
                                        }).format(123000)
                                            }`}
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="uploadShippingBill"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Shipping Bill</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder=""
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}
                {currentStep === 3 &&
                    // SHIPPING BILL DETAILS
                    <div className="grid grid-cols-4 gap-3">

                        <FormField
                            control={form.control}
                            name="shippingBillNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shipping Bill Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. 5151992" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='shippingBillDate'
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>Shipping Bill Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    size={'lg'} variant={"outline"}
                                                >
                                                    {field.value ? (
                                                        format(field.value as Date, "PPPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='cbName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CB Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. VTRANS" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}
                {currentStep === 4 &&
                    // SUPPLIER DETAILS
                    <div className="grid grid-cols-4 gap-3">

                        <FormField
                            control={form.control}
                            name="supplierName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. VTRANS" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='actualSupplierName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Actual Supplier Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. VTRANS" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='supplierGSTIN'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier GSTIN</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. 33AAACV1234A1ZV" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='supplierInvoiceNumber'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier Invoice Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. 5151992" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='supplierInvoiceDate'
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>Supplier Invoice Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    size={'lg'} variant={"outline"}
                                                >
                                                    {field.value ? (
                                                        format(field.value as Date, "PPPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='supplierInvoiceValueWithOutGST'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier Invoice Value Without GST</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            maximumFractionDigits: 0,
                                            currency: "INR",
                                        }).format(123000)
                                            }`}
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='supplierInvoiceValueWithGST'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier Invoice Value With GST</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder={`eg ${new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            maximumFractionDigits: 0,
                                            currency: "INR",
                                        }).format(123000)
                                            }`}
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='uploadSupplierInvoice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Supplier Invoice</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder=""
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='actualSupplierInvoice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Actual Supplier Invoice</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder=""
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='actualSupplierInvoiceValue'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Actual Supplier Invoice Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="" {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}
                {currentStep === 5 &&
                    // SALE INVOICE DETAILS
                    <div className="grid grid-cols-4 gap-3">

                        <FormField
                            control={form.control}
                            name="commercialInvoiceNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Commercial Invoice Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. 5151992" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='commercialInvoiceDate'
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>Commercial Invoice Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    size={'lg'} variant={"outline"}
                                                >
                                                    {field.value ? (
                                                        format(field.value as Date, "PPPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='consigneeDetails'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Consignee Details</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. VTRANS" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='actualBuyer'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Actual Buyer</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. VTRANS" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}
                {currentStep === 6 &&
                    // BL DETAILS
                    <div className="grid grid-cols-4 gap-3">

                        <FormField
                            control={form.control}
                            name="blNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BL Number</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="eg. 5151992" className=' uppercase' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='blDate'
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>BL Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    size={'lg'} variant={"outline"}
                                                >
                                                    {field.value ? (
                                                        format(field.value as Date, "PPPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='telexDate'
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>Telex Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    size={'lg'} variant={"outline"}
                                                >
                                                    {field.value ? (
                                                        format(field.value as Date, "PPPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='uploadBL'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload BL</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder=""
                                            {...field} />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}
                <div className='grid grid-cols-4 gap-2'>

                    {currentStep > 1 && <Button disabled={isLoading} type='button' size={'lg'} variant="outline" onClick={() => { setCurrentStep(currentStep - 1) }} > Back {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />} </Button>}
                    {currentStep < totalSteps && <Button size={'lg'} disabled={isLoading} type='button' onClick={() => { setCurrentStep(currentStep + 1) }} >
                        Next {isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />} </Button>}
                    {currentStep === totalSteps && <Button size={'lg'} disabled={isLoading} type='submit' >
                        Submit{isLoading && <Icons.spinner className="ml-2 w-4 animate-spin" />}
                    </Button>}


                </div>
            </form>
        </Form>
    )
}

