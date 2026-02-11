import prisma from '../../../shared/prisma';

const createExpense = async (payload: {
    title: string;
    amount: number;
    category: string;
    description?: string;
    organizationId: string;
    date?: string;
}) => {
    const result = await prisma.expense.create({
        data: {
            title: payload.title,
            amount: payload.amount,
            category: payload.category,
            description: payload.description,
            organizationId: payload.organizationId,
            date: payload.date ? new Date(payload.date) : new Date(),
        }
    });
    return result;
};

const getAllExpenses = async (organizationId: string) => {
    return await prisma.expense.findMany({
        where: { organizationId },
        orderBy: { date: 'desc' }
    });
};




const bulkCreateExpenses = async (payload: any[]) => {
    // ডাটাকে প্রিজমা ফরম্যাটে ম্যাপ করা
    const expenseData = payload.map(item => ({
        title: item.title,
        amount: item.amount,
        category: item.category,
        description: item.description || null,
        organizationId: item.organizationId,
        date: item.date ? new Date(item.date) : new Date()
    }));

    const result = await prisma.expense.createMany({
        data: expenseData,
        skipDuplicates: true, // ডুপ্লিকেট ডাটা থাকলে এরর দেবে না
    });

    return result;
};


export const ExpenseService = { createExpense, getAllExpenses, bulkCreateExpenses };