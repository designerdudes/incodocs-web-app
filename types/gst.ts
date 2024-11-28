export interface Transaction {
  id: string;
  date: string;
  type: 'purchase' | 'sale';
  description: string;
  amount: number;
  igst: number;
  cgst: number;
  sgst: number;
  partyName: string;
  invoiceNumber: string;
}

export interface MonthlyBalance {
  month: string;
  openingBalance: number;
  closingBalance: number;
  totalPurchases: number;
  totalSales: number;
  igstBalance: number;
  cgstBalance: number;
  sgstBalance: number;
}