import { z } from 'zod';

export const UserValidation = {
  register: z.object({
    body: z.object({
      fullName: z.string().min(1, "Full name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(4, "Password must be at least 4 characters"),
      companyName: z.string().min(2, "Company name is required"),
    }),
  }),
  

  login: z.object({
    body: z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
    }),
  }),
};