import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import ReportsClient from "@/components/ReportsClient";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const sales = await prisma.sale.findMany();
  const expenses = await prisma.expense.findMany();

  // Group by month
  const monthlyData: Record<string, { sales: number; expenses: number }> = {};

  sales.forEach((s: any) => {
    const monthKey = format(new Date(s.date), 'yyyy-MM');
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { sales: 0, expenses: 0 };
    monthlyData[monthKey].sales += Number(s.amount);
  });

  expenses.forEach((e: any) => {
    const monthKey = format(new Date(e.date), 'yyyy-MM');
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { sales: 0, expenses: 0 };
    monthlyData[monthKey].expenses += Number(e.amount);
  });

  const sortedMonths = Object.keys(monthlyData).sort().reverse();

  // Totals
  const totalSales = sales.reduce((sum: number, s: any) => sum + Number(s.amount), 0);
  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
  const netProfit = totalSales - totalExpenses;
  const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  // Prepare monthly data for client
  const monthlyDataArray = sortedMonths.map((monthKey) => {
    const data = monthlyData[monthKey];
    const profit = data.sales - data.expenses;
    const margin = data.sales > 0 ? (profit / data.sales) * 100 : 0;
    const monthLabel = format(new Date(`${monthKey}-01`), 'MMMM yyyy');

    return {
      month: monthLabel,
      sales: data.sales,
      expenses: data.expenses,
      profit,
      margin
    };
  });

  return (
    <ReportsClient
      totalSales={totalSales}
      totalExpenses={totalExpenses}
      netProfit={netProfit}
      profitMargin={profitMargin}
      monthlyData={monthlyDataArray}
    />
  );
}
