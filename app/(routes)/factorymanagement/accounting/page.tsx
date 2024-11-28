import { FinancialCard } from "@/components/dashboard/FinancialCard"
import { GSTLedger } from "@/components/dashboard/GSTLedger"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { calculateProfits, financialData } from "@/lib/data/accountingData"

export default function DashboardPage() {
  const { grossProfit, netProfit } = calculateProfits()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accounting Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FinancialCard
          title="Accounts Payable"
          amount={financialData.accountsPayable}
          description="Total amount owed to vendors"
        />
        <FinancialCard
          title="Accounts Receivable"
          amount={financialData.accountsReceivable}
          description="Total amount owed by customers"
        />
        <FinancialCard
          title="Gross Profit"
          amount={grossProfit}
          description="Revenue minus direct costs"
        />
        <FinancialCard
          title="Net Profit"
          amount={netProfit}
          description="Profit after all deductions"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <RevenueChart /> */}
        <GSTLedger />
      </div>
    </div>
  )
}