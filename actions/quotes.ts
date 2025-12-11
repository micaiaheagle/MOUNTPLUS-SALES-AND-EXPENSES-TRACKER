'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuote(formData: FormData) {
  const dateStr = formData.get('date') as string;
  const date = dateStr ? new Date(dateStr) : new Date();
  const customerName = formData.get('customerName') as string;
  const items = formData.get('items') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);

  await prisma.quote.create({
    data: {
      date,
      customerName,
      items,
      totalAmount,
      status: 'Pending',
      quoteNumber: `QT-${Date.now().toString().slice(-6)}` // Generate quote number
    }
  });

  revalidatePath('/quotes');
}

export async function updateQuote(id: string, formData: FormData) {
  const dateStr = formData.get('date') as string;
  const date = dateStr ? new Date(dateStr) : new Date();
  const customerName = formData.get('customerName') as string;
  const items = formData.get('items') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);
  const status = formData.get('status') as string;

  await prisma.quote.update({
    where: { id },
    data: {
      date,
      customerName,
      items,
      totalAmount,
      status
    }
  });

  revalidatePath('/quotes');
}

export async function deleteQuote(id: string) {
  await prisma.quote.delete({ where: { id } });
  revalidatePath('/quotes');
}

export async function convertQuoteToJob(formData: FormData) {
  const quoteId = formData.get('quoteId') as string;
  const customerName = formData.get('customerName') as string;
  const items = formData.get('items') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);

  // Create Sale (Job Card) with adjusted values
  await prisma.sale.create({
    data: {
      date: new Date(),
      customerName,
      items,
      totalAmount,
      paymentStatus: 'Pending',
    }
  });

  // Update Quote status
  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: 'Converted' }
  });

  revalidatePath('/quotes');
  revalidatePath('/sales');
}
