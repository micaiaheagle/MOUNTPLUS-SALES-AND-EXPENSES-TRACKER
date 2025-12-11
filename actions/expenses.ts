'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData) {
  const dateStr = formData.get('date') as string;
  const purpose = formData.get('purpose') as string;
  const personnel = formData.get('personnel') as string;
  const descriptionRaw = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;
  const currency = formData.get('currency') as string || 'USD';

  const date = dateStr ? new Date(dateStr) : new Date();

  if (!purpose || !amount || !personnel) {
    throw new Error('Missing required fields');
  }

  const description = descriptionRaw ? `${purpose} - ${descriptionRaw}` : purpose;

  await prisma.expense.create({
    data: {
      date,
      personnel,
      description,
      amount,
      category,
      currency
    },
  });

  revalidatePath('/expenses');
  revalidatePath('/');
}

export async function updateExpense(id: string, formData: FormData) {
  const dateStr = formData.get('date') as string;
  const purpose = formData.get('purpose') as string;
  const personnel = formData.get('personnel') as string;
  const descriptionRaw = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;
  const currency = formData.get('currency') as string;

  const date = dateStr ? new Date(dateStr) : undefined;

  const description = descriptionRaw ? `${purpose} - ${descriptionRaw}` : purpose;

  await prisma.expense.update({
    where: { id },
    data: {
      date,
      personnel,
      amount,
      category,
      description,
      currency
    },
  });

  revalidatePath('/expenses');
  revalidatePath('/');
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath('/expenses');
  revalidatePath('/');
}
