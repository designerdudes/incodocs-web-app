import { z } from "zod";

export const shipmentSchema = z.object({
  _id: z.string(),
  shipmentId: z.string(), // Added based on real data
  bookingDetails: z.object({
    invoiceNumber: z.string(),
    bookingNumber: z.string(),
    portOfLoading: z.string(),
    destinationPort: z.string(),
    vesselSailingDate: z.string().datetime(),
    vesselArrivingDate: z.string().datetime(),
    containers: z.array(
      z.object({
        containerNumber: z.string().optional(),
        truckNumber: z.string().optional(),
        truckDriverContactNumber: z.number().optional(), // Optional since not always present
        addProductDetails: z
          .object({
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
          })
          .optional(), // Optional since not always present
        _id: z.string(),
      })
    ),
    _id: z.string(),
  }),
  shippingDetails: z.object({
    noOfShipmentinvoices: z.number().optional(),
    shippingLineInvoices: z.array(
      z.object({
        invoiceNumber: z.string(),
        uploadInvoiceUrl: z.string(),
        date: z.string().datetime(),
        valueWithGst: z.number(),
        valueWithoutGst: z.number(),
        _id: z.string(),
      })
    ),
    transporterName: z
      .object({
        _id: z.string(),
        transporterName: z.string(),
        address: z.string(),
        responsiblePerson: z.string(),
        mobileNo: z.number(),
        email: z.string(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        __v: z.number(),
      })
      .optional(),
    noOftransportinvoices: z.number().optional(),
    transporterInvoices: z.array(
      z.object({
        invoiceNumber: z.string(),
        uploadInvoiceUrl: z.string(),
        date: z.string().datetime(),
        valueWithGst: z.number(),
        valueWithoutGst: z.number(),
        _id: z.string(),
      })
    ),
    forwarderName: z
      .object({
        _id: z.string(),
        forwarderName: z.string(),
        address: z.string(),
        responsiblePerson: z.string(),
        mobileNo: z.number(),
        email: z.string(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        __v: z.number(),
      })
      .optional(),
    noOfForwarderinvoices: z.number().optional(),
    forwarderInvoices: z.array(
      z.object({
        invoiceNumber: z.string(),
        uploadInvoiceUrl: z.string(),
        date: z.string().datetime(),
        valueWithGst: z.number(),
        valueWithoutGst: z.number(),
        _id: z.string(),
      })
    ),
    _id: z.string(),
  }),
  shippingBillDetails: z.object({
    portCode: z.string(),
    cbName: z.string(), // Not always a datetime in data
    cdCode: z.string().optional(), // cdCode in data, not cbCode
    ShippingBills: z.array(
      z.object({
        shippingBillUrl: z.string(),
        shippingBillNumber: z.string(),
        shippingBillDate: z.string().datetime(),
        drawbackValue: z.string(),
        rodtepValue: z.string(), // Corrected typo from roadtepValue
        _id: z.string(),
      })
    ),
    _id: z.string(),
  }),
  supplierDetails: z.object({
    clearance: z.object({
      supplierName: z
        .object({
          _id: z.string(),
          supplierName: z.string(),
          gstNo: z.string().optional(),
          mobileNumber: z.number().optional(),
          state: z.string().optional(),
          factoryAddress: z.string().optional(),
          createdAt: z.string().datetime().optional(),
          updatedAt: z.string().datetime().optional(),
          __v: z.number().optional(),
        })
        .optional(),
      noOfInvoices: z.number().optional(),
      invoices: z.array(
        z.object({
          supplierGSTN: z.string(),
          supplierInvoiceNumber: z.string(),
          supplierInvoiceDate: z.string().datetime(),
          supplierInvoiceValueWithGST: z.string(), // Kept as string per data
          supplierInvoiceValueWithOutGST: z.string(),
          clearanceSupplierInvoiceUrl: z.string(),
          _id: z.string(),
        })
      ),
      _id: z.string(),
    }),
    actual: z.object({
      actualSupplierName: z.string(),
      actualSupplierInvoiceValue: z.string(), // Kept as string per data
      actualSupplierInvoiceUrl: z.string(),
      shippingBillUrl: z.string(),
      _id: z.string(),
    }),
    _id: z.string(),
  }),
  saleInvoiceDetails: z.object({
    consignee: z.object({
      _id: z.string(),
      name: z.string(),
      address: z.string(),
      telephoneNo: z.number(),
      email: z.string(),
      organizationId: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      __v: z.number(),
    }),
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
  }),
  otherDetails: z.array( // Changed to array to match data
    z.object({
      certificateName: z.string().optional(),
      certificateNumber: z.string().optional(),
      date: z.string().datetime().optional(),
      issuerOfCertificate: z.string().optional(),
      uploadCopyOfCertificate: z.string().optional(),
      _id: z.string().optional(),
    })
  ),
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
  createdBy: z.string(),
  updatedAt: z.string().datetime(),
  __v: z.number(),
});

export type Shipment = z.infer<typeof shipmentSchema>;