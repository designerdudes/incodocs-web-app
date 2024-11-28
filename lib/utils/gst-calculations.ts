import { Transaction } from "@/types/gst";

export interface GSTBalance {
  input: {
    igst: number;
    cgst: number;
    sgst: number;
    total: number;
  };
  output: {
    igst: number;
    cgst: number;
    sgst: number;
    total: number;
  };
  net: {
    igst: number;
    cgst: number;
    sgst: number;
    total: number;
  };
}

export function calculateGSTBalance(transactions: Transaction[]): GSTBalance {
  const initialBalance = {
    igst: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
  };


  const input = transactions
    .filter((t) => t.type === 'purchase')
    .reduce(
      (acc, t) => ({
        igst: acc.igst + t.igst,
        cgst: acc.cgst + t.cgst,
        sgst: acc.sgst + t.sgst,
        total: acc.total + t.igst + t.cgst + t.sgst,
      }),
      { ...initialBalance }
    );

  const output = transactions
    .filter((t) => t.type === 'sale')
    .reduce(
      (acc, t) => ({
        igst: acc.igst + t.igst,
        cgst: acc.cgst + t.cgst,
        sgst: acc.sgst + t.sgst,
        total: acc.total + t.igst + t.cgst + t.sgst,
      }),
      { ...initialBalance }
    );

  // Net payable = Output GST - Input GST (credits)
  const net = {
    igst: output.igst - input.igst,
    cgst: output.cgst - input.cgst,
    sgst: output.sgst - input.sgst,
    total: output.total - input.total,
  };

  

  return { input, output, net };
}