'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createExpense(formData: FormData) {
  const dateStr = formData.get('date') as string;
  const purpose = formData.get('purpose') as string;
  const personnel = formData.get('personnel') as string;
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;

  const date = dateStr ? new Date(dateStr) : new Date();

  await prisma.expense.create({
    data: {
      date,
      purpose,
      personnel,
      description,
      amount,
      category,
    },
  });

  revalidatePath('/expenses');
  revalidatePath('/');
}

export async function updateExpense(id: string, formData: FormData) {
  const dateStr = formData.get('date') as string;
  const purpose = formData.get('purpose') as string;
  const personnel = formData.get('personnel') as string;
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const category = formData.get('category') as string;

  const date = dateStr ? new Date(dateStr) : undefined;

  await prisma.expense.update({
    where: { id },
    data: {
      date,
      purpose,
      personnel,
      description,
      amount,
      category,
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
