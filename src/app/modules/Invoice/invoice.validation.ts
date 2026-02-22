import { z } from 'zod';

const createInvoiceZodSchema = z.object({
  body: z.object({
    clientId: z.string({
      required_error: "Client ID is required",
    }),
    projectId: z.string().optional(),
    issueDate: z.string().optional(),
    dueDate: z.string({
      required_error: "Due date is required",
    }),
    currency: z.string().optional(),
    taxRate: z.number().min(0).max(100).optional(),
    themeColor: z.string().optional(),
    
    // Sender Information
    fromName: z.string().optional(),
    fromAddress: z.string().optional(),
    fromEmail: z.string().email().optional().or(z.literal('')),
    fromPhone: z.string().optional(),

    // Receiver Information
    toName: z.string().optional(),
    toAddress: z.string().optional(),
    toEmail: z.string().email().optional().or(z.literal('')),
    toPhone: z.string().optional(),

    poNumber: z.string().optional(),
    paymentTerms: z.string().optional(),
    
    // আপনার স্কিমা অনুযায়ী 'notes' এবং 'terms'
    notes: z.string().optional(),
    note: z.string().optional(), // সার্ভিস লেভেলে হ্যান্ডেল করার জন্য রাখা হয়েছে
    terms: z.string().optional(),
    
    // Items Validation
    items: z.array(
      z.object({
        description: z.string({
          required_error: "Description is required",
        }),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        rate: z.number().min(0, "Rate cannot be negative"),
      })
    ).min(1, "At least one item is required"),
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