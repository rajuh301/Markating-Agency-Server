import { z } from 'zod';

const createClientZodSchema = z.object({
  body: z.object({
    contactPerson: z.string({ required_error: 'Contact person name is required' }),
    email: z.string({ required_error: 'Email is required' }).email("Invalid email format"),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    companyName: z.string().optional(),
    website: z.string().url("Invalid website URL").optional().or(z.literal('')),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    taxId: z.string().optional(),
    notes: z.string().optional(),
    organizationId: z.string({ required_error: 'Organization ID is required' }),
  }),
});

export const ClientValidation = {
  createClientZodSchema,
};