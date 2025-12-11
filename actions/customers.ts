'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    await prisma.customer.create({
        data: {
            name,
            email: email || null,
            phone: phone || null,
            address: address || null,
        }
    });

    revalidatePath('/customers');
}

export async function updateCustomer(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    await prisma.customer.update({
        where: { id },
        data: {
            name,
            email: email || null,
            phone: phone || null,
            address: address || null,
        }
    });

    revalidatePath('/customers');
}

export async function deleteCustomer(id: string) {
    try {
        await prisma.customer.delete({ where: { id } });
        revalidatePath('/customers');
    } catch (error) {
        console.error('Failed to delete customer:', error);
        // Ideally return an error state, but for now we log it.
    }
}
