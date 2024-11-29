import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { formatCurrency } from "@/lib/utils"

interface FinancialCardProps {
  title: string
  amount: number
  description?: string
}

export function FinancialCard({ title, amount, description }: FinancialCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}