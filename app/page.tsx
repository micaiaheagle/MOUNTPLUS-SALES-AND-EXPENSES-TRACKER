import { prisma } from "@/lib/prisma";
import { startOfDay, startOfMonth, endOfDay, endOfMonth, format } from "date-fns";
import Image from "next/image";
import DashboardActions from "@/components/DashboardActions";
import QuickInsights from "@/components/QuickInsights";
import { TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const startOfThisMonth = startOfMonth(today);
  const endOfThisMonth = endOfMonth(today);

  // 1. Total Sales Today
  const todaysSales = await prisma.sale.aggregate({
    _sum: { amount: true },
    where: {
      date: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  // 2. Expenses This Month
  const monthsExpenses = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      date: {
        gte: startOfThisMonth,
        lte: endOfThisMonth,
      },
    },
  });

  // 3. Outstanding Credit
  const outstandingCredit = await prisma.sale.aggregate({
    _sum: { amount: true },
    where: {
      paymentType: "Credit",
      paymentStatus: "Pending",
    },
  });

  // 4. Jobs In Progress
  const jobsInProgressCount = await prisma.sale.count({
    where: {
      status: "In Progress",
    },
  });

  // 5. Top Customers (All Time)
  const topCustomers = await prisma.sale.groupBy({
    by: ['customerName'],
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
    take: 5,
  });

  // 6. Expenses by Category (All Time)
  const expensesByCategory = await prisma.expense.groupBy({
    by: ['category'],
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  });

  // 7. Financial Report Data (All Time) & Recent Sales
  const allSales = await prisma.sale.findMany({ orderBy: { date: 'desc' } });
  const allExpenses = await prisma.expense.findMany({ orderBy: { date: 'desc' } });
  
  // Use first 10 for recent activity
  const recentSales = allSales.slice(0, 10);

  // Calculate Reports Data
  const monthlyData: Record<string, { sales: number; expenses: number }> = {};

  allSales.forEach((s: any) => {
    const monthKey = format(new Date(s.date), 'yyyy-MM');
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { sales: 0, expenses: 0 };
    monthlyData[monthKey].sales += Number(s.amount);
  });

  allExpenses.forEach((e: any) => {
    const monthKey = format(new Date(e.date), 'yyyy-MM');
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { sales: 0, expenses: 0 };
    monthlyData[monthKey].expenses += Number(e.amount);
  });

  const sortedMonths = Object.keys(monthlyData).sort().reverse();

  const reportTotalSales = allSales.reduce((sum: number, s: any) => sum + Number(s.amount), 0);
  const reportTotalExpenses = allExpenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
  const netProfit = reportTotalSales - reportTotalExpenses;
  const profitMargin = reportTotalSales > 0 ? (netProfit / reportTotalSales) * 100 : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans text-sm">
      <div className="max-w-[1200px] mx-auto bg-white border border-gray-400 shadow-none">
        {/* Title Bar - Like Excel Title */}
        <div className="bg-[#217346] text-white px-4 py-3 font-bold text-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Logo Placeholder - User should save their logo as public/logo.png */}
            <div className="bg-white p-1 rounded">
               <span className="text-[#217346] font-extrabold text-xs tracking-tighter">MOUNT+PLUS</span>
            </div>
            <span>EXECUTIVE DASHBOARD</span>
          </div>
          <div className="flex items-center gap-4">
             <DashboardActions />
             <span className="text-sm font-normal opacity-90 border-l border-green-400 pl-4">
               {today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
          </div>
        </div>

        {/* Summary Section - Grid Style */}
        <div className="grid grid-cols-4 border-b border-gray-300">
          {/* Header Row */}
          <div className="col-span-4 grid grid-cols-4 bg-gray-100 border-b border-gray-300 font-bold text-gray-800">
            <div className="p-2 border-r border-gray-300">METRIC</div>
            <div className="p-2 border-r border-gray-300 text-right">VALUE</div>
            <div className="p-2 border-r border-gray-300">PERIOD</div>
            <div className="p-2">STATUS</div>
          </div>

          {/* Metric 1 */}
          <div className="col-span-4 grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="p-2 border-r border-gray-300 font-bold text-gray-700">Sales Income</div>
            <div className="p-2 border-r border-gray-300 text-right font-mono font-bold text-gray-900">
              ${Number(todaysSales._sum.amount || 0).toFixed(2)}
            </div>
            <div className="p-2 border-r border-gray-300 text-gray-600">Today</div>
            <div className="p-2 text-green-700 font-bold text-center bg-green-50">ACTIVE</div>
          </div>

          {/* Metric 2 */}
          <div className="col-span-4 grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="p-2 border-r border-gray-300 font-bold text-gray-700">Expenses</div>
            <div className="p-2 border-r border-gray-300 text-right font-mono font-bold text-red-700">
              ${Number(monthsExpenses._sum.amount || 0).toFixed(2)}
            </div>
            <div className="p-2 border-r border-gray-300 text-gray-600">This Month</div>
            <div className="p-2 text-gray-500 text-center">-</div>
          </div>

          {/* Metric 3 */}
          <div className="col-span-4 grid grid-cols-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="p-2 border-r border-gray-300 font-bold text-gray-700">Accounts Receivable</div>
            <div className="p-2 border-r border-gray-300 text-right font-mono font-bold text-orange-600">
              ${Number(outstandingCredit._sum.amount || 0).toFixed(2)}
            </div>
            <div className="p-2 border-r border-gray-300 text-gray-600">Total Outstanding</div>
            <div className="p-2 text-orange-600 font-bold text-center bg-orange-50">COLLECT</div>
          </div>

          {/* Metric 4 */}
          <div className="col-span-4 grid grid-cols-4 hover:bg-gray-50 transition-colors">
            <div className="p-2 border-r border-gray-300 font-bold text-gray-700">Jobs In Production</div>
            <div className="p-2 border-r border-gray-300 text-right font-mono font-bold text-blue-600">
              {jobsInProgressCount}
            </div>
            <div className="p-2 border-r border-gray-300 text-gray-600">Current</div>
            <div className="p-2 text-blue-600 font-bold text-center bg-blue-50">BUSY</div>
          </div>
        </div>

        {/* Business Intelligence Section */}
        <div className="p-6 border-b border-gray-300 bg-gradient-to-br from-gray-50 to-white">
           <h3 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
             <FileText className="w-4 h-4" />
             Business Intelligence
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Customers */}
              <div className="bg-white border border-gray-300 shadow-sm">
                 <div className="bg-blue-600 text-white px-3 py-2 font-bold text-xs uppercase tracking-wider">
                    Top 5 Customers
                 </div>
                 <div>
                   {topCustomers.map((c: any, i: number) => (
                      <div key={c.customerName} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-0 text-sm hover:bg-blue-50 transition-colors">
                         <div className="flex items-center gap-2">
                           <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">{i + 1}</span>
                           <span className="text-gray-800 font-semibold">{c.customerName}</span>
                         </div>
                         <span className="font-mono font-bold text-gray-900">${Number(c._sum.amount).toFixed(2)}</span>
                      </div>
                   ))}
                   {topCustomers.length === 0 && <div className="p-4 text-gray-500 text-center italic">No data available</div>}
                 </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white border border-gray-300 shadow-sm">
                 <div className="bg-red-600 text-white px-3 py-2 font-bold text-xs uppercase tracking-wider">
                    Expense Categories
                 </div>
                 <div>
                   {expensesByCategory.map((e: any) => (
                      <div key={e.category} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-0 text-sm hover:bg-red-50 transition-colors">
                         <div className="flex items-center gap-2">
                           <div className={`w-3 h-3 rounded-full ${
                              e.category === 'Fuel' ? 'bg-orange-500' :
                              e.category === 'Salaries' ? 'bg-blue-500' :
                              e.category === 'Rent' ? 'bg-purple-500' :
                              e.category === 'Printing Materials' ? 'bg-green-500' :
                              'bg-gray-500'
                           }`} />
                           <span className="text-gray-800">{e.category}</span>
                         </div>
                         <span className="font-mono font-bold text-red-700">${Number(e._sum.amount).toFixed(2)}</span>
                      </div>
                   ))}
                   {expensesByCategory.length === 0 && <div className="p-4 text-gray-500 text-center italic">No expenses recorded</div>}
                 </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white border border-gray-300 shadow-sm">
                 <div className="bg-green-600 text-white px-3 py-2 font-bold text-xs uppercase tracking-wider">
                    Financial Summary (All Time)
                 </div>
                 <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                       <span className="text-gray-600 text-sm">Total Revenue</span>
                       <span className="font-mono font-bold text-green-600">${reportTotalSales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                       <span className="text-gray-600 text-sm">Total Expenses</span>
                       <span className="font-mono font-bold text-red-600">${reportTotalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                       <span className="text-gray-600 text-sm">Net Profit</span>
                       <span className={`font-mono font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${netProfit.toFixed(2)}
                       </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                       <span className="text-gray-700 font-semibold text-sm">Profit Margin</span>
                       <span className={`text-xl font-bold ${profitMargin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {profitMargin.toFixed(1)}%
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Quick Insights */}
        <div className="px-6 pb-6">
          <QuickInsights
            todaySales={Number(todaysSales._sum.amount || 0)}
            monthExpenses={Number(monthsExpenses._sum.amount || 0)}
            outstandingCredit={Number(outstandingCredit._sum.amount || 0)}
            jobsInProgress={jobsInProgressCount}
            topCustomer={topCustomers[0]?.customerName || ''}
            topCustomerAmount={Number(topCustomers[0]?._sum.amount || 0)}
          />
        </div>

        {/* Monthly Performance Section */}
        <div className="p-6 border-b border-gray-300">
           <h3 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider">Monthly Performance Breakdown</h3>

           {/* Monthly Performance Table */}
           <div className="bg-white border border-gray-300 shadow-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-100">
                 <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Monthly Breakdown</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                      <th className="p-3 font-bold border-b border-gray-200">Month</th>
                      <th className="p-3 font-bold border-b border-gray-200 text-right">Income</th>
                      <th className="p-3 font-bold border-b border-gray-200 text-right">Expenses</th>
                      <th className="p-3 font-bold border-b border-gray-200 text-right">Net Profit</th>
                      <th className="p-3 font-bold border-b border-gray-200 text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMonths.map((monthKey) => {
                      const data = monthlyData[monthKey];
                      const profit = data.sales - data.expenses;
                      const margin = data.sales > 0 ? (profit / data.sales) * 100 : 0;
                      const monthLabel = format(new Date(`${monthKey}-01`), 'MMMM yyyy');

                      return (
                        <tr key={monthKey} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                          <td className="p-3 font-medium text-gray-900">{monthLabel}</td>
                          <td className="p-3 text-right font-mono text-gray-700">${data.sales.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono text-red-600">${data.expenses.toFixed(2)}</td>
                          <td className={`p-3 text-right font-mono font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${profit.toFixed(2)}
                          </td>
                          <td className={`p-3 text-right font-mono ${margin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {margin.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                    {sortedMonths.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-gray-500 italic">No data available yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="mt-0 p-6">
          <div className="bg-gray-200 px-4 py-2 font-bold border-y border-gray-300 text-gray-800">
            RECENT TRANSACTIONS LOG
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 font-bold text-gray-700 w-32">DATE</th>
                <th className="border border-gray-300 p-2 font-bold text-gray-700">CUSTOMER / PROJECT</th>
                <th className="border border-gray-300 p-2 font-bold text-gray-700 w-48">TYPE</th>
                <th className="border border-gray-300 p-2 font-bold text-gray-700 text-right w-32">AMOUNT (USD)</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale: any, i: number) => (
                <tr key={sale.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-2 font-mono text-gray-800">
                    {format(new Date(sale.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="border border-gray-300 p-2 text-gray-900">
                    <span className="font-bold">{sale.customerName}</span> - {sale.jobDescription}
                  </td>
                  <td className="border border-gray-300 p-2 text-gray-600">
                    Sale
                  </td>
                  <td className="border border-gray-300 p-2 text-right font-mono font-bold text-gray-900">
                    {Number(sale.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
