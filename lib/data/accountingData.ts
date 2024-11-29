export const financialData = {
  accountsPayable: 45000,
  accountsReceivable: 72000,
  revenue: 150000,
  expenses: {
    operatingCosts: 35000,
    salaries: 42000,
    utilities: 8000,
    rent: 12000,
    marketing: 15000
  },
  gstData: {
    collected: 15000,
    paid: 12000
  },
  monthlyRevenue: [
    { month: 'Jan', amount: 12000 },
    { month: 'Feb', amount: 15000 },
    { month: 'Mar', amount: 18000 },
    { month: 'Apr', amount: 14000 },
    { month: 'May', amount: 16000 },
    { month: 'Jun', amount: 19000 },
    { month: 'Jul', amount: 22000 },
    { month: 'Aug', amount: 20000 },
    { month: 'Sep', amount: 18000 },
    { month: 'Oct', amount: 21000 },
    { month: 'Nov', amount: 23000 },
    { month: 'Dec', amount: 25000 }
  ]
}

export const calculateProfits = () => {
  const totalExpenses = Object.values(financialData.expenses).reduce((a, b) => a + b, 0)
  const grossProfit = financialData.revenue - totalExpenses
  const netProfit = grossProfit - (financialData.gstData.collected - financialData.gstData.paid)
  
  return {
    grossProfit,
    netProfit
  }
}