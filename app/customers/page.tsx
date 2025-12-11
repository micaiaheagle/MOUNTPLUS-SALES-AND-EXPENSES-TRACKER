import { prisma } from "@/lib/prisma";
import { CustomersTable } from "@/components/CustomersTable";

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const serializedCustomers = customers.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString()
    }));

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
                <p className="text-gray-500">Manage your customer database and view their details.</p>
            </div>

            <CustomersTable customers={serializedCustomers} />
        </div>
    );
}
