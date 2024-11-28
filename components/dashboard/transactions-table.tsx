"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/gst";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Party Name</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">IGST</TableHead>
            <TableHead className="text-right">CGST</TableHead>
            <TableHead className="text-right">SGST</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{transaction.type}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.partyName}</TableCell>
              <TableCell>{transaction.invoiceNumber}</TableCell>
              <TableCell className="text-right">₹{transaction.amount.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{transaction.igst.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{transaction.cgst.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{transaction.sgst.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}