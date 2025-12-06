import { prisma } from "@/lib/prisma";
import QuotesTable from "@/components/QuotesTable";

export const dynamic = 'force-dynamic';

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    orderBy: { date: 'desc' }
  });

  // Serialize for client component
  const serializedQuotes = quotes.map((quote: any) => ({
    ...quote,
    date: quote.date.toISOString(),
    createdAt: quote.createdAt.toISOString(),
    updatedAt: quote.updatedAt.toISOString(),
    validUntil: quote.validUntil ? quote.validUntil.toISOString() : null,
    totalAmount: quote.totalAmount.toString(),
  }));

  return <QuotesTable initialQuotes={serializedQuotes} />;
}
