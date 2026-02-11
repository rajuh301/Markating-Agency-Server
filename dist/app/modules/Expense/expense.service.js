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
exports.ExpenseService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createExpense = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.expense.create({
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
});
const getAllExpenses = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.expense.findMany({
        where: { organizationId },
        orderBy: { date: 'desc' }
    });
});
const bulkCreateExpenses = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // ডাটাকে প্রিজমা ফরম্যাটে ম্যাপ করা
    const expenseData = payload.map(item => ({
        title: item.title,
        amount: item.amount,
        category: item.category,
        description: item.description || null,
        organizationId: item.organizationId,
        date: item.date ? new Date(item.date) : new Date()
    }));
    const result = yield prisma_1.default.expense.createMany({
        data: expenseData,
        skipDuplicates: true, // ডুপ্লিকেট ডাটা থাকলে এরর দেবে না
    });
    return result;
});
exports.ExpenseService = { createExpense, getAllExpenses, bulkCreateExpenses };
