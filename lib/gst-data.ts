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
    igst: 18000,
    cgst: 0,
    sgst: 0,
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
    igst: 0,
    cgst: 4000,
    sgst: 4000,
    partyName: 'XYZ Traders',
    invoiceNumber: 'SALE-001',
  },
 
];

export const monthlyBalances: MonthlyBalance[] = [
  {
    month: 'Oct 2024',
    openingBalance: 0,
    closingBalance: 18000,
    totalPurchases: 50000,
    totalSales: 120000,
    totalExpenses: 0,
    igstBalance: 18000, // Updated to reflect settlement
    cgstBalance: 0, // Updated to reflect settlement
    sgstBalance: 0, // Updated to reflect settlement
  }
];