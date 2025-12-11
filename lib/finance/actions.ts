'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// === ACCOUNT MANAGEMENT ===

export async function createAccount(data: {
    code: string;
    name: string;
    type: string;
    currency?: string;
}) {
    try {
        const account = await prisma.account.create({
            data: {
                code: data.code,
                name: data.name,
                type: data.type,
                currency: data.currency || 'USD',
            },
        });
        revalidatePath('/finance/accounting');
        return { success: true, data: account };
    } catch (error) {
        console.error('Failed to create account:', error);
        return { success: false, error: 'Failed to create account' };
    }
}

export async function getAccounts() {
    try {
        return await prisma.account.findMany({
            orderBy: { code: 'asc' },
        });
    } catch (error) {
        return [];
    }
}

// === JOURNAL ENTRIES ===

export async function postJournalEntry(data: {
    description: string;
    date?: Date;
    entries: {
        accountId: string;
        amount: number; // Positive for Debit, Negative for Credit (or handle logic)
        type: 'DEBIT' | 'CREDIT';
    }[];
}) {
    // Simple validation: Debits must equal Credits
    const totalDebits = data.entries
        .filter(e => e.type === 'DEBIT')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalCredits = data.entries
        .filter(e => e.type === 'CREDIT')
        .reduce((sum, e) => sum + e.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
        return { success: false, error: 'Debits and Credits must balance' };
    }

    try {
        // Transactional write
        await prisma.$transaction(async (tx) => {
            for (const entry of data.entries) {
                // Adjust account balance
                // Asset/Expense: Debit increases (+), Credit decreases (-)
                // Liability/Equity/Revenue: Credit increases (-), Debit decreases (+)
                // For simplicity in this specialized system, we might store raw balances and interpret them based on type.
                // Or store standard signed values. Let's assume standard: Debit +, Credit -

                const signedAmount = entry.type === 'DEBIT' ? entry.amount : -entry.amount;

                await tx.ledgerEntry.create({
                    data: {
                        description: data.description,
                        date: data.date || new Date(),
                        amount: signedAmount,
                        accountId: entry.accountId,
                        currency: 'USD', // Default for now
                    },
                });

                await tx.account.update({
                    where: { id: entry.accountId },
                    data: {
                        balance: { increment: signedAmount },
                    },
                });
            }
        });

        revalidatePath('/finance/accounting');
        return { success: true };
    } catch (error) {
        console.error('Failed to post journal entry:', error);
        return { success: false, error: 'Failed to post transaction' };
    }
}

export async function getLedgerEntries() {
    return await prisma.ledgerEntry.findMany({
        include: { account: true },
        orderBy: { date: 'desc' },
        take: 100,
    });
}
