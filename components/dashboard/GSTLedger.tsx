import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { financialData } from "@/lib/data/accountingData"
import { formatCurrency } from "@/lib/utils"

export function GSTLedger() {
  const { collected, paid } = financialData.gstData
  const balance = collected - paid

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>GST Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm">GST Collected:</span>
            <span className="font-medium">{formatCurrency(collected)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">GST Paid:</span>
            <span className="font-medium">{formatCurrency(paid)}</span>
          </div>
          <div className="flex justify-between border-t pt-4">
            <span className="text-sm font-medium">Net GST Balance:</span>
            <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}