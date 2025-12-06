'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createSale(formData: FormData) {
  const dateStr = formData.get('date') as string;
  const customerName = formData.get('customerName') as string;
  const jobDescription = formData.get('jobDescription') as string;
  const quantity = parseInt(formData.get('quantity') as string);
  const price = parseFloat(formData.get('price') as string);
  const paymentType = formData.get('paymentType') as string;
  const status = formData.get('status') as string;

  const amount = quantity * price;
  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.sale.create({
    data: {
      date,
      customerName,
      jobDescription,
      quantity,
      price,
      amount,
      paymentType,
      status,
      paymentStatus: paymentType === 'Cash' ? 'Received' : 'Pending',
    },
  });

  revalidatePath('/sales');
  revalidatePath('/');
}

export async function updateSale(id: string, formData: FormData) {
  const dateStr = formData.get('date') as string;
  const customerName = formData.get('customerName') as string;
  const jobDescription = formData.get('jobDescription') as string;
  const quantity = parseInt(formData.get('quantity') as string);
  const price = parseFloat(formData.get('price') as string);
  const paymentType = formData.get('paymentType') as string;
  const status = formData.get('status') as string;

  const amount = quantity * price;
  const date = dateStr ? new Date(dateStr) : undefined;

  await prisma.sale.update({
    where: { id },
    data: {
      date,
      customerName,
      jobDescription,
      quantity,
      price,
      amount,
      paymentType,
      status,
    },
  });

  revalidatePath('/sales');
  revalidatePath('/');
}

export async function deleteSale(id: string) {
  await prisma.sale.delete({ where: { id } });
  revalidatePath('/sales');
  revalidatePath('/');
}
