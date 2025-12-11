'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData) {
    const dateStr = formData.get('date') as string;
    const date = dateStr ? new Date(dateStr) : new Date();
    const dueDateStr = formData.get('dueDate') as string;
    const dueDate = dueDateStr ? new Date(dueDateStr) : new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000); // Default +14 days
    const customerId = formData.get('customerId') as string;
    const items = formData.get('items') as string;
    const totalAmount = parseFloat(formData.get('totalAmount') as string);
    const status = formData.get('status') as string || 'Unpaid';
    const currency = formData.get('currency') as string || 'USD';

    // Custom invoice number logic could be added here, currently sticking to UUID or simplified string if needed
    // For now using time-based random string if not provided (schema says unique)
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    await prisma.invoice.create({
        data: {
            invoiceNumber,
            date,
            dueDate,
            customerId,
            items,
            totalAmount,
            status,
            currency
        }
    });

    revalidatePath('/invoices');
    revalidatePath('/dashboard');
}

export async function updateInvoice(id: string, formData: FormData) {
    const dateStr = formData.get('date') as string;
    const date = dateStr ? new Date(dateStr) : new Date();
    const dueDateStr = formData.get('dueDate') as string;
    const dueDate = dueDateStr ? new Date(dueDateStr) : new Date();
    const customerId = formData.get('customerId') as string;
    const items = formData.get('items') as string;
    const totalAmount = parseFloat(formData.get('totalAmount') as string);
    const status = formData.get('status') as string;
    const currency = formData.get('currency') as string;

    await prisma.invoice.update({
        where: { id },
        data: {
            date,
            dueDate,
            customerId,
            items,
            totalAmount,
            status,
            currency
        }
    });

    revalidatePath('/invoices');
    revalidatePath('/dashboard');
}

export async function deleteInvoice(id: string) {
    try {
        await prisma.invoice.delete({ where: { id } });
        revalidatePath('/invoices');
        revalidatePath('/dashboard');
    } catch (error) {
        console.error('Failed to delete invoice:', error);
    }
}
