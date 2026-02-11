import { z } from 'zod';

const createExpenseZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    amount: z.number({ required_error: "Amount is required" }),
    category: z.string({ required_error: "Category is required" }),
    description: z.string().optional(),
    date: z.string().optional(), // ISO Date String
    organizationId: z.string({ required_error: "Organization ID is required" })
  }),
});

export const ExpenseValidation = { createExpenseZodSchema };