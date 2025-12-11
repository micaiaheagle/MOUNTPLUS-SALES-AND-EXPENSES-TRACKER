import { prisma } from "@/lib/prisma";
import { InvoicesTable } from "@/components/InvoicesTable";

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
    const invoices = await prisma.invoice.findMany({
        include: { customer: true },
        orderBy: { createdAt: 'desc' }
    });

    const customers = await prisma.customer.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });

    const serializedInvoices = invoices.map(invoice => ({
        ...invoice,
        date: invoice.date.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        createdAt: invoice.createdAt.toISOString(),
        updatedAt: invoice.updatedAt.toISOString(),
        totalAmount: Number(invoice.totalAmount),
        customer: invoice.customer ? {
            ...invoice.customer,
            createdAt: invoice.customer.createdAt.toISOString(),
            updatedAt: invoice.customer.updatedAt.toISOString(),
        } : null
    }));

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
                <p className="text-gray-500">Manage invoices and track payments.</p>
            </div>

            <InvoicesTable invoices={serializedInvoices as any} customers={customers} />
        </div>
    );
}
