"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { transactions } from "@/lib/gst-data";
import { calculateGSTBalance } from "@/lib/utils/gst-calculations";
import { calculateGSTSettlement } from "@/lib/utils/gst-settlement";
import { MonthlyBalance } from "@/types/gst";
import { IndianRupee, TrendingUp, TrendingDown, Scale } from "lucide-react";

interface SummaryCardsProps {
  currentBalance: MonthlyBalance;
}

export function SummaryCards({ currentBalance }: SummaryCardsProps) {
  const gstBalance = calculateGSTBalance(transactions);
  const gstSettlement = calculateGSTSettlement(gstBalance);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="bg-white dark:bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Opening Balance</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{currentBalance.closingBalance.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {currentBalance.openingBalance.toLocaleString()} last month <br />
            {currentBalance.closingBalance > currentBalance.openingBalance && '+'}
            {((currentBalance.closingBalance - currentBalance.openingBalance) / currentBalance.openingBalance * 100).toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales this month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{
            transactions.reduce((acc, transaction) => {
              return transaction.type === 'sale' ? acc + transaction.amount : acc;
            }
              , 0).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Monthly sales volume
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases this month</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold">₹{
            transactions.reduce((acc, transaction) => {
              return transaction.type === 'purchase' ? acc + transaction.amount : acc;
            }
              , 0).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Monthly purchase volume
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{currentBalance.totalPurchases.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Monthly Expense volume
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closing Balance</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{(gstBalance.input.total + currentBalance.igstBalance + currentBalance.cgstBalance + currentBalance.sgstBalance -
            (
              gstSettlement.igst.settledWithIgst +
              gstSettlement.cgst.settledWithIgst +
              gstSettlement.sgst.settledWithIgst +
              gstSettlement.igst.settledWithCgst +
              gstSettlement.cgst.settledWithCgst +
              gstSettlement.sgst.settledWithCgst +
              gstSettlement.igst.settledWithSgst +
              gstSettlement.cgst.settledWithSgst +
              gstSettlement.sgst.settledWithSgst
            )
          ).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Total Closing Balance after GST settlement
          </p>
        </CardContent>
      </Card>
    </div>
  );
}