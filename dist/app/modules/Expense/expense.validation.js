"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseValidation = void 0;
const zod_1 = require("zod");
const createExpenseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        amount: zod_1.z.number({ required_error: "Amount is required" }),
        category: zod_1.z.string({ required_error: "Category is required" }),
        description: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(), // ISO Date String
        organizationId: zod_1.z.string({ required_error: "Organization ID is required" })
    }),
});
exports.ExpenseValidation = { createExpenseZodSchema };
