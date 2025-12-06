import { prisma } from '@/lib/prisma';
import ExpensesTable from '@/components/ExpensesTable';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage({ searchParams }: { searchParams: { action?: string } }) {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: 'desc' },
  });

  const serializedExpenses = expenses.map(expense => ({
    ...expense,
    date: expense.date.toISOString(),
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
    amount: expense.amount.toNumber(),
  }));

  return <ExpensesTable initialExpenses={serializedExpenses as any} initialAction={searchParams.action} />;
}
