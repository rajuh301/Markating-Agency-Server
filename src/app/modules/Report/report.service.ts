import prisma from '../../../shared/prisma';


const getOrganizationReports = async (organizationId: string) => {
    // ১. মোট ক্লায়েন্ট সংখ্যা
    const totalClients = await prisma.client.count({
        where: { organizationId }
    });

    // ২. সক্রিয় প্রজেক্ট সংখ্যা
    const activeProjects = await prisma.project.count({
        where: { 
            organizationId,
            status: 'ACTIVE' 
        }
    });

    // ৩. ডাইনামিক রেভিনিউ (Invoices থেকে)
    const invoices = await prisma.invoice.findMany({
        where: { 
            organizationId,
            status: 'PAID'
        },
        select: {
            totalAmount: true
        }
    });
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

    // ৪. ডাইনামিক এক্সপেন্স (Expense মডেল থেকে) <--- এটি নতুন যোগ করা হয়েছে
    const expenses = await prisma.expense.findMany({
        where: { 
            organizationId 
        },
        select: {
            amount: true
        }
    });
    const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    // ৫. চার্টের জন্য মাসিক ডেটা
    const monthlyStats = await prisma.report.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 6
    });

    return {
        summary: {
            totalRevenue,
            activeProjects,
            totalClients,
            expense: totalExpense,
        },
        monthlyStats
    };
};

export const ReportService = {
    getOrganizationReports
};