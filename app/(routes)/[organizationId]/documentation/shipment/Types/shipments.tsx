// types/shipment.ts
export interface ShipmentData {
  _id?: string;
  bookingDetails?: {
    bookingNumber?: string;
    portOfLoading?: string;
    destinationPort?: string;
    vesselSailingDate?: string;
    vesselArrivingDate?: string;
    review?: string;
    containers?: {
      containerNumber?: string;
      type?: string;
      size?: string;
    }[];
  };
  shippingDetails?: {
    shippingLineName?: {
      shippingLineName?: string;
    };
    shippingLineInvoices?: {
      invoiceNumber?: string;
    }[];
    forwarderName?: {
      forwarderName?: string;
    };
    forwarderInvoices?: {
      invoiceNumber?: string;
    }[];
    transporterName?: {
      transporterName?: string;
    };
    transporterInvoices?: {
      invoiceNumber?: string;
    }[];
    review?: string;
  };
  shippingBillDetails?: {
    portCode?: string;
    cbName?: string;
    cdCode?: string;
    ShippingBills?: {
      shippingBillNumber?: string;
    }[];
    review?: string;
  };
  supplierDetails?: {
    clearance?: {
      supplierName?: string;
      invoices?: {
        supplierInvoiceNumber?: string;
      }[];
    };
    actual?: {
      actualSupplierName?: string;
      actualSupplierInvoiceValue?: string;
      actualSupplierInvoiceUrl?: string;
      shippingBillUrl?: string;
    };
    review?: string;
  };
  saleInvoiceDetails?: {
    consignee?: {
      name?: string;
    };
    actualBuyer?: string;
    commercialInvoices?: {
      commercialInvoiceNumber?: string;
    }[];
    review?: string;
  };
  blDetails?: {
    blNumber?: string;
    blDate?: string;
    telexDate?: string;
    uploadBL?: string;
    review?: string;
  };
  otherDetails?: {
    certificateNumber?: string;
  }[];
}