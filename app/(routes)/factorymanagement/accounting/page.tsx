"use client";

import { SummaryCards } from "@/components/dashboard/summary-cards";
import { GSTChart } from "@/components/dashboard/gst-chart";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { GSTSummary } from "@/components/dashboard/gst-summary";
import { transactions, monthlyBalances } from "@/lib/gst-data";

export default function Home() {
  const currentMonth = monthlyBalances[monthlyBalances.length - 1];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">GST Ledger Dashboard</h2>
      </div>
      <SummaryCards currentBalance={currentMonth} />
      <GSTSummary transactions={transactions} />
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Monthly Balances</h2>

        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GSTChart data={monthlyBalances} />
      </div>
      <div className="grid gap-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Recent Transactions</h2>
        </div>
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}