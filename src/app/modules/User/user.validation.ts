import { z } from 'zod';

export const UserValidation = {
  register: z.object({
    body: z.object({
      fullName: z.string()("Full name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string()("Password must be required"),
      companyName: z.string().min(1, "Company name is required"),
    }),
  }),
  

  login: z.object({
    body: z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
    }),
  }),
};