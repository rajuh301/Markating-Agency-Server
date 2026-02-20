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
    const revenueData = await prisma.invoice.aggregate({
        where: { 
            organizationId,
            status: 'PAID'
        },
        _sum: {
            amount: true
        }
    });

    // ৪. ডাইনামিক এক্সপেন্স (Expense মডেল থেকে) <--- এটি নতুন যোগ করা হয়েছে
    const expenseData = await prisma.expense.aggregate({
        where: { 
            organizationId 
        },
        _sum: {
            amount: true
        }
    });

    // ৫. চার্টের জন্য মাসিক ডেটা
    const monthlyStats = await prisma.report.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 6
    });

    return {
        summary: {
            totalRevenue: Number(revenueData._sum.amount) || 0,
            activeProjects,
            totalClients,
            expense: Number(expenseData._sum.amount) || 0, // এখন এটি ডাইনামিক!
        },
        monthlyStats
    };
};

export const ReportService = {
    getOrganizationReports
};