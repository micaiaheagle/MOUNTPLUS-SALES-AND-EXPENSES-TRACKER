import { prisma } from '@/lib/prisma';
import SalesTable from '@/components/SalesTable';

export const dynamic = 'force-dynamic';

export default async function SalesPage({ searchParams }: { searchParams: { action?: string } }) {
  const sales = await prisma.sale.findMany({
    orderBy: { date: 'desc' },
  });

  const serializedSales = sales.map(sale => ({
    ...sale,
    date: sale.date.toISOString(),
    createdAt: sale.createdAt.toISOString(),
    totalAmount: sale.totalAmount.toNumber(),
  }));

  return <SalesTable initialSales={serializedSales as any} initialAction={searchParams.action} />;
}
