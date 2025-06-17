import { z } from "zod";


export const shipmentSchema = z.object({
  _id: z.string().optional(),
  shipmentId: z.string().optional(),
  status: z
    .enum([
      "Trucks Dispatched",
      "Trucks Arrived",
      "Trucks Halted",
      "Stuffing",
      "In Clearance",
      "Loaded On Vessel",
      "In Transit",
      "Arrived At POD",
      "Delivery Completed",
    ])
    .optional(),
  organizationId: z
    .object({
      _id: z.string().optional(),
      organizationName: z.string().optional(),
      address: z.string().optional(),
      email: z.string().optional(),
      mobileNo: z.number().optional(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      __v: z.number().optional(),
    })
    .optional(),
  bookingDetails: z
    .object({
      _id: z.string().optional(),
      invoiceNumber: z.string().optional(),
      bookingNumber: z.string().optional(),
      portOfLoading: z.string().optional(),
      destinationPort: z.string().optional(),
      vesselSailingDate: z.string().optional(),
      vesselArrivingDate: z.string().optional(),
      containers: z
        .array(
          z.object({
            containerNumber: z.string().optional(),
            truckNumber: z.string().optional(),
            truckDriverContactNumber: z.union([z.string(), z.number()]).optional(),
            containerType: z.string().optional(),
            addProductDetails: z.array(z.union([z.string(), z.object({ _id: z.string(), description: z.string().optional() })])).optional(),
          })
        )
        .optional(),
      review: z.string().optional(),
    })
    .optional(),
  shippingDetails: z
    .object({
      _id: z.string().optional(),
      review: z.string().optional(),
      noOfShipmentinvoices: z.number().optional(),
      shippingLineInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string(),
            date: z.string(),
            valueWithGst: z.union([z.string(), z.number()]).transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
            valueWithoutGst: z.union([z.string(), z.number()]).transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
            _id: z.string().optional(),
            uploadInvoiceUrl: z.string().optional(),
          })
        )
        .optional(),
      transporterName: z
        .union([
          z.string(),
          z.object({
            _id: z.string(),
            transporterName: z.string(),
            address: z.string().optional(),
            responsiblePerson: z.string().optional(),
            mobileNo: z.number().optional(),
            email: z.string().optional(),
            organizationId: z.string().optional(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional(),
            __v: z.number().optional(),
          }),
        ])
        .optional(),
      forwarderName: z
        .union([
          z.string(),
          z.object({
            _id: z.string(),
            forwarderName: z.string(),
            address: z.string().optional(),
            responsiblePerson: z.string().optional(),
            mobileNo: z.number().optional(),
            email: z.string().optional(),
            organizationId: z.string().optional(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional(),
            __v: z.number().optional(),
          }),
        ])
        .optional(),
      transporterInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string(),
            date: z.string(),
            valueWithGst: z.union([z.string(), z.number()]).transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
            valueWithoutGst: z.union([z.string(), z.number()]).transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
            _id: z.string().optional(),
            uploadInvoiceUrl: z.string().optional(),
          })
        )
        .optional(),
      forwarderInvoices: z
        .array(
          z.object({
            invoiceNumber: z.string(),
            date: z.string(),
            valueWithGst: z.union([z.string(), z.number()]).transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
            valueWithoutGst: z.union([z.string(), z.number()]).transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
            _id: z.string().optional(),
            uploadInvoiceUrl: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  shippingBillDetails: z
    .object({
      _id: z.string().optional(),
      review: z.string().optional(),
      portCode: z.string().optional(),
      cbName: z
        .union([
          z.string(),
          z.object({
            cbName: z.string(),
          }),
        ])
        .optional(),
      cbCode: z.string().optional(),
      cdCode: z.string().optional(),
      noOfShippingBills: z.number().optional(),
      ShippingBills: z
        .array(
          z.object({
            shippingBillNumber: z.string().optional(),
            shippingBillDate: z.string().optional(),
            shippingBillUrl: z.string().optional(),
            drawbackValue: z.string().optional(),
            rodtepValue: z.string().optional(),
            _id: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  NumberOfContainer: z.number().optional(),
  supplierDetails: z
    .object({
      _id: z.string().optional(),
      review: z.string().optional(),
      clearance: z
        .object({
          _id: z.string().optional(),
          noOfSuppliers: z.number().optional(),
          suppliers: z
            .array(
              z.object({
                supplierName: z
                  .union([
                    z.string(),
                    z.object({
                      _id: z.string(),
                      supplierName: z.string(),
                      gstNo: z.string().optional(),
                      mobileNumber: z.number().optional(),
                      state: z.string().optional(),
                      factoryAddress: z.string().optional(),
                      createdAt: z.string().optional(),
                      updatedAt: z.string().optional(),
                      __v: z.number().optional(),
                    }),
                  ])
                  .optional(),
                noOfInvoices: z.number().optional(),
                invoices: z
                  .array(
                    z.object({
                      supplierInvoiceNumber: z.string().optional(),
                      supplierInvoiceDate: z.string().optional(),
                      supplierInvoiceValueWithGST: z.string().optional(),
                      supplierInvoiceValueWithOutGST: z.string().optional(),
                      clearanceSupplierInvoiceUrl: z.string().optional(),
                      _id: z.string().optional(),
                    })
                  )
                  .optional(),
              })
            )
            .optional(),
        })
        .optional(),
      actual: z
        .object({
          _id: z.string().optional(),
          actualSupplierName: z.string().optional(),
          actualSupplierInvoiceValue: z.string().optional(),
          actualSupplierInvoiceUrl: z.string().optional(),
          shippingBillUrl: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  saleInvoiceDetails: z
    .object({
      _id: z.string().optional(),
      consignee: z
        .union([
          z.string(),
          z.object({
            _id: z.string(),
            name: z.string(),
            address: z.string().optional(),
            telephoneNo: z.number().optional(),
            email: z.string().optional(),
            organizationId: z.string().optional(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional(),
            __v: z.number().optional(),
          }),
        ])
        .optional(),
      actualBuyer: z.string().optional(),
      numberOfSalesInvoices: z.string().optional(),
      review: z.string().optional(),
      commercialInvoices: z
        .array(
          z.object({
            clearanceCommercialInvoiceNumber: z.string().optional(),
            clearanceCommercialInvoiceUrl: z.string().optional(),
            actualCommercialInvoiceUrl: z.string().optional(),
            saberInvoiceUrl: z.string().optional(),
            _id: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  blDetails: z
    .object({
      _id: z.string().optional(),
      shippingLineName: z
        .union([
          z.string(),
          z.object({
            _id: z.string(),
            shippingLineName: z.string(),
            address: z.string().optional(),
            responsiblePerson: z.string().optional(),
            mobileNo: z.number().optional(),
            email: z.string().optional(),
            organizationId: z.string().optional(),
            createdAt: z.string().optional(),
            updatedAt: z.string().optional(),
            __v: z.number().optional(),
          }),
        ])
        .optional(),
      noOfBl: z.number().optional(),
      review: z.string().optional(),
      Bl: z
        .array(
          z.object({
            blNumber: z.string().optional(),
            blDate: z.string().optional(),
            telexDate: z.string().optional(),
            uploadBLUrl: z.string().optional(),
            _id: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  otherDetails: z
    .array(
      z.object({
        _id: z.string().optional(),
        date: z.string().optional(),
        review: z.string().optional(),
        certificateName: z.string().optional(),
        certificateNumber: z.string().optional(),
        issuerOfCertificate: z.string().optional(),
        uploadCopyOfCertificate: z.string().optional(),
      })
    )
    .optional(),
  createdBy: z
    .object({
      _id: z.string(),
      email: z.string(),
      fullName: z.string(),
      profileImg: z.string(),
    })
    .optional(),
    shipmentLogs: z.any().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});


export interface Shipment {
  _id?: string;
  shipmentId?: string;
  status?: "Trucks Dispatched" | "Trucks Arrived" | "Trucks Halted" | "Stuffing" | "In Clearance" | "Loaded On Vessel" | "In Transit" | "Arrived At POD" | "Delivery Completed";
  organizationId?: {
    _id?: string;
    organizationName?: string;
    address?: string;
    email?: string;
    mobileNo?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  };
  bookingDetails?: {
    _id?: string;
    invoiceNumber?: string;
    bookingNumber?: string;
    portOfLoading?: string;
    destinationPort?: string;
    vesselSailingDate?: string;
    vesselArrivingDate?: string;
    containers?: Array<{
      containerNumber?: string;
      truckNumber?: string;
      truckDriverContactNumber?: string | number;
      containerType?: string;
       addProductDetails?: Array<{
    productType: "Tiles" | "Slabs" | "StepsAndRisers";
    tileDetails?: {
      stoneName?: string;
      stonePhoto?: string;
      size?: {
        length?: number;
        breadth?: number;
      };
      thickness?: {
        value?: number;
      };
      moulding?: {
        mouldingSide?: "one side" | "two side" | "three side" | "four side";
        typeOfMoulding?: "half bullnose" | "full bullnose" | "bevel";
      };
      noOfBoxes?: number;
      piecesPerBox?: number;
    };
    slabDetails?: {
      stoneName?: string;
      stonePhoto?: string;
      manualMeasurement?: string;
      uploadMeasurement?: string;
    };
    stepRiserDetails?: {
      stoneName?: string;
      stonePhoto?: string;
      mixedBox?: {
        noOfBoxes?: number;
        noOfSteps?: number;
        sizeOfStep?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
        noOfRiser?: number;
        sizeOfRiser?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
      };
      seperateBox?: {
        noOfBoxOfSteps?: number;
        noOfPiecesPerBoxOfSteps?: number;
        sizeOfBoxOfSteps?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
        noOfBoxOfRisers?: number;
        noOfPiecesPerBoxOfRisers?: number;
        sizeOfBoxOfRisers?: {
          length?: number;
          breadth?: number;
          thickness?: number;
        };
      };
    };
    organizationId?: string;
    createdBy?: string;
  }>;
    }>;
    review?: string;
  };
  shippingDetails?: {
    _id?: string;
    review?: string;
    noOfShipmentinvoices?: number;
    shippingLineInvoices?: Array<{
      invoiceNumber: string;
      date: string;
      valueWithGst: number;
      valueWithoutGst: number;
      _id?: string;
      uploadInvoiceUrl?: string;
    }>;
    transporterName?: string | {
      _id: string;
      transporterName: string;
      address?: string;
      responsiblePerson?: string;
      mobileNo?: number;
      email?: string;
      organizationId?: string;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    };
    forwarderName?: string | {
      _id: string;
      forwarderName: string;
      address?: string;
      responsiblePerson?: string;
      mobileNo?: number;
      email?: string;
      organizationId?: string;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    };
    transporterInvoices?: Array<{
      invoiceNumber: string;
      date: string;
      valueWithGst: number;
      valueWithoutGst: number;
      _id?: string;
      uploadInvoiceUrl?: string;
    }>;
    forwarderInvoices?: Array<{
      invoiceNumber: string;
      date: string;
      valueWithGst: number;
      valueWithoutGst: number;
      _id?: string;
      uploadInvoiceUrl?: string;
    }>;
  };
  shippingBillDetails?: {
    _id?: string;
    review?: string;
    portCode?: string;
    cbName?: string | { cbName: string };
    cbCode?: string;
    cdCode?: string;
    noOfShippingBills?: number;
    ShippingBills?: Array<{
      shippingBillNumber?: string;
      shippingBillDate?: string;
      shippingBillUrl?: string;
      drawbackValue?: string;
      rodtepValue?: string;
      _id?: string;
    }>;
  };
  NumberOfContainer?: number;
  supplierDetails?: {
    _id?: string;
    review?: string;
    clearance?: {
      _id?: string;
      noOfSuppliers?: number;
      suppliers?: Array<{
        supplierName?: string | {
          _id: string;
          supplierName: string;
          gstNo?: string;
          mobileNumber?: number;
          state?: string;
          factoryAddress?: string;
          createdAt?: string;
          updatedAt?: string;
          __v?: number;
        };
        noOfInvoices?: number;
        invoices?: Array<{
          supplierInvoiceNumber?: string;
          supplierInvoiceDate?: string;
          supplierInvoiceValueWithGST?: string;
          supplierInvoiceValueWithOutGST?: string;
          clearanceSupplierInvoiceUrl?: string;
          _id?: string;
        }>;
      }>;
    };
    actual?: {
      _id?: string;
      actualSupplierName?: string;
      actualSupplierInvoiceValue?: string;
      actualSupplierInvoiceUrl?: string;
      shippingBillUrl?: string;
    };
  };
  saleInvoiceDetails?: {
    _id?: string;
    consignee?: string | {
      _id: string;
      name: string;
      address?: string;
      telephoneNo?: number;
      email?: string;
      organizationId?: string;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    };
    actualBuyer?: string;
    numberOfSalesInvoices?: string;
    review?: string;
    commercialInvoices?: Array<{
      clearanceCommercialInvoiceNumber?: string;
      clearanceCommercialInvoiceUrl?: string;
      actualCommercialInvoiceUrl?: string;
      saberInvoiceUrl?: string;
      _id?: string;
    }>;
  };
  blDetails?: {
    _id?: string;
    shippingLineName?: string | {
      _id: string;
      shippingLineName: string;
      address?: string;
      responsiblePerson?: string;
      mobileNo?: number;
      email?: string;
      organizationId?: string;
      createdAt?: string;
      updatedAt?: string;
      __v?: number;
    };
    noOfBl?: number;
    review?: string;
    Bl?: Array<{
      blNumber?: string;
      blDate?: string;
      telexDate?: string;
      uploadBLUrl?: string;
      _id?: string;
    }>;
  };
  otherDetails?: Array<{
    _id?: string;
    date?: string;
    review?: string;
    certificateName?: string;
    certificateNumber?: string;
    issuerOfCertificate?: string;
    uploadCopyOfCertificate?: string;
  }>;
  createdBy?: {
    _id: string;
    email: string;
    fullName: string;
    profileImg: string;
  };
  shipmentLogs?: any;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}