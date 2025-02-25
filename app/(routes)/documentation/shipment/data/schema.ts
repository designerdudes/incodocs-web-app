import { z } from "zod";

export const shipmentSchema = z.object({
  _id: z.string(),
  bookingDetails: z.object({
    bookingNumber: z.string(),
    portOfLoading: z.string(),
    destinationPort: z.string(),
    vesselSailingDate: z.string().datetime(),
    vesselArrivingDate: z.string().datetime(),
    containers: z.array(
      z.object({
        containerNumber: z.string().optional(),
        truckNumber: z.string().optional(),
        trukDriverContactNumber: z.number(),
        addProductDetails: z.object({
          tiles: z.object({
            sizePerTile: z.object({
              length: z.object({ value: z.number(), units: z.string() }),
              breadth: z.object({ value: z.number(), units: z.string() }),
            }),
            noOfBoxes: z.number(),
            noOfPiecesPerBoxes: z.number(),
          }),
          productCategory: z.string(),
          graniteAndMarble: z.string(),
          _id: z.string(),
        }),
        _id: z.string(),
      })
    ),
    _id: z.string(),
  }),

  shippingDetails: z.object({
    shippingLine: z.string(),
    forwarderInvoice: z.string(),
    valueOfForwarderInvoice: z.string(),
    transporter: z.string(),
    transporterInvoice: z.string(),
    valueOfTransporterInvoice: z.string(),
    _id: z.string(),
    shippingLineInvoices: z.array(z.string()),
    transporterInvoices: z.array(z.string()),
    forwarderInvoices: z.array(z.string()),
  }),

  shippingBillDetails: z.object({
    portCode: z.string(),
    cbName: z.string().datetime(),
    cbCode: z.string(),
    ShippingBills: z.array(
      z.object({
        shippingBillUrl: z.string(),
        shippingBillNumber: z.string(),
        shippingBillDate: z.string().datetime(),
        drawbackValue: z.string(),
        roadtepValue: z.string(),
        _id: z.string(),
      })
    ),
    _id: z.string(),
  }),

  supplierDetails: z.object({
    clearance: z.object({
      supplierName: z.string(),
      supplierGSTN: z.string(),
      supplierInvoiceNumber: z.string(),
      supplierInvoiceDate: z.string().datetime(),
      supplierInvoiceValueWithGST: z.string(),
      supplierInvoiceValueWithOutGST: z.string(),
      clearanceSupplierInvoiceUrl: z.string(),
      _id: z.string(),
      invoices: z.array(z.string()),
    }),
    actual: z.object({
      actualSupplierName: z.string(),
      actualSupplierInvoiceValue: z.string(),
      actualSupplierInvoiceUrl: z.string(),
      shippingBillUrl: z.string(),
      _id: z.string(),
    }),
    _id: z.string(),
  }),

  saleInvoiceDetails: z.object({
    consignee: z.string(),
    actualBuyer: z.string(),
    commercialInvoices: z.object({
      commercialInvoiceNumber: z.string(),
      clearanceCommercialInvoiceUrl: z.string(),
      actualCommercialInvoiceUrl: z.string(),
      saberInvoiceUrl: z.string(),
      _id: z.string(),
    }),
    _id: z.string(),
  }),

  blDetails: z.object({
    blNumber: z.string(),
    blDate: z.string().datetime(),
    telexDate: z.string().datetime(),
    _id: z.string(),
    uploadBL: z.string(),
  }),

  OtherDetails: z.object({
    certificateOfOriginNumber: z.string(),
    date: z.string().datetime(),
    issuerOfCOO: z.string(),
    uploadCopyOfFumigationCertificate: z.string(),
    _id: z.string(),
  }),

  organizationId: z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    owner: z.string(),
    members: z.array(z.string()),
    address: z.object({
      coordinates: z.object({
        type: z.string(),
        coordinates: z.tuple([z.number(), z.number()]),
      }),
      location: z.string(),
      pincode: z.string(),
      _id: z.string(),
    }),
    shipments: z.array(z.string()),
    factory: z.array(z.string()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    __v: z.number(),
    teams: z.array(z.string()),
    employees: z.array(z.string()),
  }),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  __v: z.number(),
});



export type Shipment = z.infer<typeof shipmentSchema>;
