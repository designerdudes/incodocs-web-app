import * as z from "zod";

// Define container types interface
export interface ContainerType {
  value: string;
  label: string;
  category: string;
}

// Define container types data
export const containerTypes: ContainerType[] = [
  // Dry Containers
  { value: "20-foot", label: "20-foot Dry Container (1 TEU)", category: "Dry Containers" },
  { value: "40-foot", label: "40-foot Dry Container (1 FFE)", category: "Dry Containers" },
  { value: "40HC", label: "40-foot High Cube Container (40HC)", category: "Dry Containers" },

  // Refrigerated Containers
  { value: "20-foot-reefer", label: "20-foot Refrigerated Container", category: "Refrigerated Containers" },
  { value: "40-foot-reefer", label: "40-foot Refrigerated Container", category: "Refrigerated Containers" },
  { value: "40HC-reefer", label: "40-foot High Cube Refrigerated Container", category: "Refrigerated Containers" },
  { value: "45HC-reefer", label: "45-foot High Cube Refrigerated Container", category: "Refrigerated Containers" },
  { value: "ca-container", label: "Controlled Atmosphere (CA) Container", category: "Refrigerated Containers" },

  // Special Dimensioned Containers
  { value: "open-top", label: "Open Top Container", category: "Special Dimensioned Containers" },
  { value: "flat-rack", label: "Flat Rack Container", category: "Special Dimensioned Containers" },
  { value: "platform", label: "Platform Container", category: "Special Dimensioned Containers" },
  { value: "transportable-tank", label: "Transportable Tank", category: "Special Dimensioned Containers" },
];

// Extract string values for z.enum()
const containerTypeValues = containerTypes.map((type) => type.value) as [string, ...string[]];

export const formSchema = z.object({
  bookingDetails: z
    .object({
      review: z.string().optional(),
      invoiceNumber: z.string().optional(),
      bookingNumber: z.string().optional(),
      portOfLoading: z.string().optional(),
      destinationPort: z.string().optional(),
      vesselSailingDate: z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
      vesselArrivingDate: z
        .string()
        .datetime({ message: "Invalid date format" })
        .optional(),
      containers: z
        .array(
          z.object({
            containerNumber: z.string().optional(),
            truckNumber: z.string().optional(),
            truckDriverContactNumber: z.string().optional(), // Note: Typo "truk" retained from payload
            addProductDetails: z.array(z.string()).optional(),
            containerType: z.enum(containerTypeValues).optional(), // Fixed to use containerTypeValues
          })
        )
        .optional(),
    })
    .optional(),
    shippingDetails: z
    .object({
      review: z.string().optional(),
      transporterName: z.string().optional(),
      noOftransportinvoices: z.number().min(1, "At least one invoice required").optional(),
      transporterInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
            date: z.string().datetime({ message: "Invalid date format" }).optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
          })
        )
        .optional(),
      forwarderName: z.string().optional(),
      noOfForwarderinvoices: z.number().min(1, "At least one invoice required").optional(),
      forwarderInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string().optional(),
            uploadInvoiceUrl: z.string().url("Invalid URL").optional(),
            date: z.string().datetime({ message: "Invalid date format" }).optional(),
            valueWithGst: z.number().optional(),
            valueWithoutGst: z.number().optional(),
          })
        )
        .optional(),
    })
    .optional(),
    shippingBillDetails: z
    .object({
      review: z.string().optional(),
      portCode: z.string().optional(),
      cbName: z.string().optional(),
      cbCode: z.string().optional(),
      ShippingBills: z
        .array(
          z.object({
            shippingBillUrl: z.string().url("Invalid URL").optional(),
            shippingBillNumber: z.string().optional(),
            shippingBillDate: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            drawbackValue: z.string().optional(),
            rodtepValue: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  supplierDetails: z
    .object({
      review: z.string().optional(),
      clearance: z
        .object({
          noOfSuppliers:z.number().optional(),
          suppliers: z
          .array(
            z.object({
            supplierName: z.string().optional(),
            noOfInvoices: z.number().optional(),
            invoices: z
              .array(
                z.object({
                  supplierInvoiceNumber: z.string().optional(),
                  supplierInvoiceDate: z
                    .string()
                    .datetime({ message: "Invalid date format" })
                    .optional(),
                  supplierInvoiceValueWithGST: z.string().optional(),
                  supplierInvoiceValueWithOutGST: z.string().optional(),
                  clearanceSupplierInvoiceUrl: z
                    .string()
                    .url("Invalid URL")
                    .optional(),
                })
              )
              .optional(),
          }))
          
        })
        .optional(),
      actual: z
        .object({
          actualSupplierName: z.string().optional(),
          actualSupplierInvoiceUrl: z.string().url("Invalid URL").optional(),
          actualSupplierInvoiceValue: z.string().optional(),
          shippingBillUrl: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  saleInvoiceDetails: z
    .object({
      review: z.string().optional(),
      consignee: z.string().optional(),
      actualBuyer: z.string().optional(),
      commercialInvoices: z
        .array(
          z.object({
            commercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoiceUrl: z.string().url("Invalid URL").optional(),
            actualCommercialInvoiceUrl: z.string().url("Invalid URL").optional(),
            saberInvoiceUrl: z.string().url("Invalid URL").optional(),
          })
        )
        .optional(),
    })
    .optional(),
  blDetails: z
    .object({
      review: z.string().optional(),
      shippingLineName: z.string().optional(),
      noOfBl: z.number().optional(),
      Bl: z
        .array(
          z.object({
            blNumber: z.string().optional(),
            blDate: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            telexDate: z
              .string()
              .datetime({ message: "Invalid date format" })
              .optional(),
            uploadBLUrl: z.string().url("Invalid URL").optional(),
          })
        )
        .optional(),
    })
    .optional(),
  otherDetails: z
    .array(
      z.object({
        review: z.string().optional(),
        certificateName: z.string().optional(),
        certificateNumber: z.string().optional(),
        date: z
          .string()
          .datetime({ message: "Invalid date format" })
          .optional(),
        issuerOfCertificate: z.string().optional(),
        uploadCopyOfCertificate: z.string().url("Invalid URL").optional(),
      })
    )
    .optional(),
  organizationId: z.string().optional(),
  shipmentId: z.string().optional(),
});