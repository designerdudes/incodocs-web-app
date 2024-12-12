
import { z } from "zod"

export const shipmentSchema = z.object({
  _id:z.string(),
  bookingDetails:z.object(
    {
      containerNumber: z.string().optional(),
        portOfLoading: z.string().optional(),
        destinationPort: z.string().optional(),
        vesselSailingDate: z.date().optional(),
        vesselArrivingDate: z.date().optional(),
        truckNumber: z.string().optional(),
        truckDriverNumber: z.string().optional(),

    }
  ),

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

export type shipment = z.infer<typeof shipmentSchema>
