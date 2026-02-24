import { z } from 'zod';

const createInvoiceZodSchema = z.object({
  body: z.object({
    taxRate: z.preprocess((val) => Number(val), z.number().min(0).max(100)).optional(),
    items: z.preprocess((val) => {
      if (typeof val === 'string') return JSON.parse(val);
      return val;
    }, z.array(
      z.object({
        description: z.string(),
        quantity: z.preprocess((val) => Number(val), z.number().min(1)),
        rate: z.preprocess((val) => Number(val), z.number().min(0)),
      })
    )) 
  }),
});

const updateInvoiceStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'], {
      required_error: "Valid status is required",
    }),
  }),
});

export const InvoiceValidation = {
  createInvoiceZodSchema,
  updateInvoiceStatusZodSchema
};