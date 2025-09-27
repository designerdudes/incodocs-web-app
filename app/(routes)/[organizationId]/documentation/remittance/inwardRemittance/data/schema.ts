import { z } from "zod";

export const remittanceSchema = z.object({
  _id: z.string().optional(),
  remittanceId: z.string().optional(),
  status: z
    .enum([
      "Balance Pending",
      "Recieved"
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

  createdBy: z
    .object({
      _id: z.string(),
      email: z.string(),
      fullName: z.string(),
      profileImg: z.string(),
    })
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  __v: z.number().optional(),
});

export interface Remittance {
  _id?: string;
  inwardRemittanceNumber?: string;
  inwardRemittanceDate?: string;
  inwardRemittanceValue?: number;
  inwardRemittanceCopy?: string;
  invoiceNumber?: string;
  invoiceValue?: number;
  invoiceDate?: string;
  invoiceCopy?: string;
  differenceAmount?: number;
  method?: "bank_transfer" | "cash" | "check" | "other";
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
  consigneeId?: string | {
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
  createdBy?: {
    _id: string;
    email: string;
    fullName: string;
    profileImg: string;
  };
    status?:  "recieved" | "balance_pending"
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}