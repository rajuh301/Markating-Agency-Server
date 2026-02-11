"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getDashboardSummary = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    // ১. মোট আয় (শুধু PAID ইনভয়েস থেকে)
    const totalRevenue = yield prisma_1.default.invoice.aggregate({
        where: { organizationId, status: 'PAID' },
        _sum: { amount: true }
    });
    // ২. মোট খরচ
    const totalExpenses = yield prisma_1.default.expense.aggregate({
        where: { organizationId },
        _sum: { amount: true }
    });
    // ৩. একটিভ প্রজেক্টের সংখ্যা
    const activeProjectsCount = yield prisma_1.default.project.count({
        where: { organizationId, status: 'ACTIVE' }
    });
    // ৪. নতুন লিড (Leads)
    const totalLeads = yield prisma_1.default.lead.count({
        where: { organizationId }
    });
    const revenue = Number(totalRevenue._sum.amount) || 0;
    const expenses = Number(totalExpenses._sum.amount) || 0;
    return {
        revenue,
        expenses,
        netProfit: revenue - expenses,
        activeProjects: activeProjectsCount,
        totalLeads
    };
});
exports.StatsService = {
    getDashboardSummary
};
