import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createRole = async (organizationId: string, payload: any) => {
  const { name, description, permissions } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. রোল তৈরি করা
    const role = await tx.role.create({
      data: {
        name,
        description,
        organizationId,
      },
    });

    // ২. ফিগমা ডিজাইনের মডিউল পারমিশনগুলো ম্যাপ করা
    const permissionData = permissions.map((p: any) => ({
      roleId: role.id,
      module: p.module,
      canView: p.view || false,
      canCreate: p.create || false,
      canEdit: p.edit || false,
      canDelete: p.delete || false,
    }));

    // ৩. পারমিশন টেবিলে ইনসার্ট করা
    await tx.permission.createMany({
      data: permissionData,
    });

    // পূর্ণাঙ্গ ডাটা রিটার্ন করা (সহজ দেখার জন্য)
    return tx.role.findUnique({
      where: { id: role.id },
      include: { permissions: true }
    });
  });
};

export const RoleService = {
  createRole,
};