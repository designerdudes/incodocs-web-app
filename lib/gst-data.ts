import { Transaction, MonthlyBalance } from '@/types/gst';

export const transactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-01',
    type: 'purchase',
    description: 'Raw Materials',
    amount: 100000,
    igst: 18000,
    cgst: 0,
    sgst: 0,
    partyName: 'ABC Suppliers',
    invoiceNumber: 'INV-001',
  },
  {
    id: '2',
    date: '2024-03-01',
    type: 'sale',
    description: 'Finished Goods',
    amount: 100000,
    igst: 0,
    cgst: 6750,
    sgst: 6750,
    partyName: 'ABC Suppliers',
    invoiceNumber: 'INV-001',
  },
  {
    id: '3',
    date: '2024-03-05',
    type: 'purchase',
    description: 'Raw Materials',
    amount: 100000,
    igst: 0,
    cgst: 9000,
    sgst: 9000,
    partyName: 'XYZ Traders',
    invoiceNumber: 'SALE-001',
  },
  {
    id: '4',
    date: '2024-03-05',
    type: 'sale',
    description: 'Finished Goods',
    amount: 100000,
    igst: 21600,
    cgst: 0,
    sgst: 0,
    partyName: 'XYZ Traders',
    invoiceNumber: 'SALE-001',
  },
 
];

export const monthlyBalances: MonthlyBalance[] = [
  {
    month: 'March 2024',
    openingBalance: 48000,
    closingBalance: 62000,
    totalPurchases: 50000,
    totalSales: 120000,
    igstBalance: 0, // Updated to reflect settlement
    cgstBalance: 6750, // Updated to reflect settlement
    sgstBalance: 1350, // Updated to reflect settlement
  }
];