'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuote(formData: FormData) {
  const dateStr = formData.get('date') as string;
  const date = dateStr ? new Date(dateStr) : new Date();
  const customerName = formData.get('customerName') as string;
  const jobDescription = formData.get('jobDescription') as string;
  const items = formData.get('items') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);
  const notes = formData.get('notes') as string || '';

  await prisma.quote.create({
    data: {
      date,
      customerName,
      jobDescription,
      items,
      totalAmount,
      notes,
      status: 'Pending'
    }
  });

  revalidatePath('/quotes');
}

export async function updateQuote(id: string, formData: FormData) {
  const dateStr = formData.get('date') as string;
  const date = dateStr ? new Date(dateStr) : new Date();
  const customerName = formData.get('customerName') as string;
  const jobDescription = formData.get('jobDescription') as string;
  const items = formData.get('items') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);
  const status = formData.get('status') as string;
  const notes = formData.get('notes') as string || '';

  await prisma.quote.update({
    where: { id },
    data: {
      date,
      customerName,
      jobDescription,
      items,
      totalAmount,
      notes,
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
  const jobDescription = formData.get('jobDescription') as string;
  const items = formData.get('items') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);

  // Parse items to get first item for backward compatibility with Sale model
  const itemsArray = JSON.parse(items);
  const firstItem = itemsArray[0] || { description: jobDescription, quantity: 1, price: totalAmount };

  // Create Sale (Job Card) with adjusted values
  await prisma.sale.create({
    data: {
      date: new Date(),
      customerName,
      jobDescription: `${jobDescription} - ${itemsArray.map((i: any) => i.description).join(', ')}`,
      quantity: firstItem.quantity,
      price: firstItem.price,
      amount: totalAmount,
      status: 'In Progress',
      paymentStatus: 'Pending',
      paymentType: 'Credit'
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
