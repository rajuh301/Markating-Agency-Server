import { z } from 'zod';

const createRoleZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Role name is required",
    }).min(2).max(50),
    
    description: z.string().max(255).optional(),

    // ফিগমার মডিউল পারমিশন লিস্ট ভ্যালিডেশন
    permissions: z.array(
      z.object({
        module: z.string({
          required_error: "Module name is required",
        }),
        view: z.boolean().default(false),
        create: z.boolean().default(false),
        edit: z.boolean().default(false),
        delete: z.boolean().default(false),
      })
    ).nonempty("At least one module permission must be defined")
  }),
});

const assignRoleZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
    }).uuid("Invalid User ID format"),
    
    roleId: z.string({
      required_error: "Role ID is required",
    }).uuid("Invalid Role ID format"),
  }),
});

const updateRoleZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    
    description: z.string().max(255).optional(),

    permissions: z.array(
      z.object({
        module: z.string({
          required_error: "Module name is required if permissions are provided",
        }),
        view: z.boolean().optional(),
        create: z.boolean().optional(),
        edit: z.boolean().optional(),
        delete: z.boolean().optional(),
      })
    ).optional()
  }),
});

export const RoleValidation = {
  createRoleZodSchema,
  assignRoleZodSchema,
  updateRoleZodSchema
};