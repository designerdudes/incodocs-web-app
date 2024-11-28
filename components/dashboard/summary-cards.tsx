"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthlyBalance } from "@/types/gst";
import { IndianRupee, TrendingUp, TrendingDown, Scale } from "lucide-react";

interface SummaryCardsProps {
  currentBalance: MonthlyBalance;
}

export function SummaryCards({ currentBalance }: SummaryCardsProps) {
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
            +{((currentBalance.closingBalance - currentBalance.openingBalance) / currentBalance.openingBalance * 100).toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{currentBalance.totalSales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Monthly sales volume
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{currentBalance.totalPurchases.toLocaleString()}</div>
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
          <div className="text-2xl font-bold">₹{(currentBalance.igstBalance + currentBalance.cgstBalance + currentBalance.sgstBalance).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Total Closing Balance after GST settlement
          </p>
        </CardContent>
      </Card>
    </div>
  );
}