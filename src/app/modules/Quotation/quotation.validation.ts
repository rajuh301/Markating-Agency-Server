import { z } from 'zod';

const createQuotationZodSchema = z.object({
  body: z.object({
    companyLogo: z.string().optional(),
    signature: z.string().optional(),
taxRate: z.coerce.number().default(0),
    quotationDate: z.string(),
    dueDate: z.string({
      required_error: 'Due date is required',
    }),

    // সমাধান: z.array() এর ভেতরে z.object() ব্যবহার করতে হয়
    items: z.array(
      z.object({
        description: z.string({
          required_error: 'Description is required',
        }),
        quantity: z.number({
          required_error: 'Quantity is required',
        }),
        rate: z.number({
          required_error: 'Rate is required',
        }),
      })
    ).min(1, "At least one item is required"),

    fromName: z.string().optional(),
    fromAddress: z.string().optional(),
    fromEmail: z.string().optional(),
    fromPhone: z.string().optional(),
    toName: z.string().optional(),
    toAddress: z.string().optional(),
    toEmail: z.string().optional(),
    toPhone: z.string().optional(),
    notes: z.string().optional(),
    terms: z.string().optional(),
    themeColor: z.string().optional(),
  }),
});



const updateQuotationZodSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'SENT', 'ACCEPTED', 'DECLINED', 'INVOICED']).optional(),
  }),
    fromName: z.string().optional(),
    fromAddress: z.string().optional(),
    fromEmail: z.string().optional(),
    fromPhone: z.string().optional(),
    toName: z.string().optional(),
    toAddress: z.string().optional(),
    toEmail: z.string().optional(),
    toPhone: z.string().optional(),
    notes: z.string().optional(),
    terms: z.string().optional(),
    themeColor: z.string().optional(),


     companyLogo: z.string().optional(),
    signature: z.string().optional(),
taxRate: z.coerce.number().default(0),
quotationDate: z.string().optional(),
dueDate: z.string().optional(),
  description: z.string().optional(),
quantity: z.coerce.number().default(0),
rate: z.coerce.number().default(0),

});

export const QuotationValidation = {
  createQuotationZodSchema,
  updateQuotationZodSchema
};