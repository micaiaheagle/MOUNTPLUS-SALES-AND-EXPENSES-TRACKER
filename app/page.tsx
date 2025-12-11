import { prisma } from "@/lib/prisma";
import { startOfDay, startOfMonth, endOfDay, endOfMonth, format } from "date-fns";
import QuickInsights from "@/components/QuickInsights";
import { FlowChart } from "@/components/ui/FlowChart";
import { Card } from "@/components/ui/Card";
import { DollarSign, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const today = new Date();
  const startOfThisMonth = startOfMonth(today);
  const endOfThisMonth = endOfMonth(today);

  // 1. Calculations
  const metrics = await getDashboardMetrics(startOfThisMonth, endOfThisMonth);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#393a3d] tracking-tight">Get Things Done</h1>
        <div className="text-sm text-gray-500">
          {today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Process Flow Configuration */}
      <Card className="overflow-hidden">
        <FlowChart />
      </Card>

      {/* Business Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PROFIT AND LOSS CARD */}
        <Card
          title="Profit and Loss"
          action={
            <select className="text-xs border-none bg-transparent font-semibold text-gray-600 focus:ring-0 cursor-pointer">
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>This Quarter</option>
            </select>
          }
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-2xl font-bold text-[#393a3d]">${metrics.netProfit.toFixed(2)}</div>
              <div className="text-xs text-gray-500 font-medium uppercase mt-1">NET INCOME</div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Income Bar */}
            <div className="group">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Income</span>
                <span className="font-bold text-[#393a3d]">${metrics.income.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden relative">
                <div
                  className="bg-[#2ca01c] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${metrics.income > 0 ? (metrics.income / (metrics.income + metrics.expenses)) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Expenses Bar */}
            <div className="group">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 font-medium">Expenses</span>
                <span className="font-bold text-[#393a3d]">${metrics.expenses.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden relative">
                <div
                  className="bg-[#d52b1e] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${metrics.expenses > 0 ? (metrics.expenses / (metrics.income + metrics.expenses)) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* INVOICES CARD */}
        <Card title="Invoices" action={<Link href="/invoices" className="text-[#0077c5] text-sm font-bold hover:underline">Go to Invoices</Link>}>
          <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 p-4 rounded border-l-4 border-gray-400">
              <div className="text-xs text-gray-500 font-bold uppercase mb-1">UNPAID (Last 365 Days)</div>
              <div className="text-xl font-bold text-[#393a3d]">${metrics.unpaidInvoices.toFixed(2)}</div>
            </div>
            <div className="flex-1 bg-[#fff0f0] p-4 rounded border-l-4 border-[#d52b1e]">
              <div className="text-xs text-[#d52b1e] font-bold uppercase mb-1">OVERDUE</div>
              <div className="text-xl font-bold text-[#d52b1e]">$0.00</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="bg-[#2ca01c] h-3 rounded-full w-full opacity-20"></div>
            <div className="text-xs text-gray-400 mt-2 text-center">No recent invoice activity to visualize</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Recents">
            {/* Using the logic from previous implementation for recents */}
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="pb-3 pl-2">Date</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentSales.map((sale: any) => (
                  <tr key={sale.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-2 text-gray-600">{format(new Date(sale.date), 'dd/MM/yyyy')}</td>
                    <td className="py-3 font-medium text-[#393a3d]">{sale.customerName}</td>
                    <td className="py-3 text-right font-bold text-[#393a3d]">${Number(sale.totalAmount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <Card title="Bank Accounts" action={<Link href="/finance/banking" className="text-[#0077c5] text-sm font-bold hover:underline">Connect</Link>}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded">
                  <DollarSign size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#393a3d]">Business Checking</div>
                  <div className="text-xs text-gray-500">**** 1234</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#393a3d]">${metrics.bankBalance.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Updated today</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

async function getDashboardMetrics(start: Date, end: Date) {
  // 1. Income (Sales)
  const salesAgg = await prisma.sale.aggregate({
    _sum: { totalAmount: true },
    where: { date: { gte: start, lte: end } }
  });
  const income = Number(salesAgg._sum?.totalAmount || 0);

  // 2. Expenses
  const expensesAgg = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: { date: { gte: start, lte: end } }
  });
  const expenses = Number(expensesAgg._sum?.amount || 0);

  // 3. Unpaid Invoices
  const unpaidAgg = await prisma.invoice.aggregate({
    _sum: { totalAmount: true },
    where: { status: 'Unpaid' }
  });
  const unpaidInvoices = Number(unpaidAgg._sum?.totalAmount || 0);

  // 4. Bank Balance
  const bankAgg = await prisma.bankAccount.aggregate({
    _sum: { balance: true }
  });
  const bankBalance = Number(bankAgg._sum?.balance || 0);

  // 5. Recent Sales
  const recentSales = await prisma.sale.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    select: { id: true, date: true, customerName: true, totalAmount: true }
  });

  return {
    income,
    expenses,
    netProfit: income - expenses,
    unpaidInvoices,
    bankBalance,
    recentSales
  };
}
