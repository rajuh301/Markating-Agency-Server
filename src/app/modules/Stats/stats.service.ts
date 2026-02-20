import prisma from '../../../shared/prisma';

const getDashboardSummary = async (organizationId: string) => {
    // ১. মোট আয় (PAID ইনভয়েস থেকে totalAmount এর যোগফল)
    const totalRevenue = await prisma.invoice.aggregate({
        where: { 
            organizationId, 
            status: 'PAID' 
        },
        _sum: { 
            totalAmount: true // এখানে 'amount' এর বদলে 'totalAmount' হবে
        }
    });

    // ২. মোট খরচ
    const totalExpenses = await prisma.expense.aggregate({
        where: { organizationId },
        _sum: { 
            amount: true 
        }
    });

    // ৩. একটিভ প্রজেক্টের সংখ্যা
    const activeProjectsCount = await prisma.project.count({
        where: { organizationId, status: 'ACTIVE' }
    });

    // ৪. নতুন লিড (Leads)
    const totalLeads = await prisma.lead.count({
        where: { organizationId }
    });

    // Optional Chaining ব্যবহার করে undefined এরর সমাধান করা হয়েছে
    const revenue = Number(totalRevenue._sum?.totalAmount) || 0;
    const expenses = Number(totalExpenses._sum?.amount) || 0;

    return {
        revenue,
        expenses,
        netProfit: revenue - expenses,
        activeProjects: activeProjectsCount,
        totalLeads
    };
};

export const StatsService = {
    getDashboardSummary
};