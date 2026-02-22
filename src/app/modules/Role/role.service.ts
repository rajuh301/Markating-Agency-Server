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


const assignRoleToUser = async (organizationId: string, payload: { userId: string; roleId: string }) => {
  const { userId, roleId } = payload;

  // ১. চেক করুন রোলটি এই অর্গানাইজেশনের কি না
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId }
  });

  if (!role) {
    throw new Error("Role not found in your organization!");
  }

  // ২. চেক করুন ইউজারটি এই অর্গানাইজেশনের কি না
  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId }
  });

  if (!user) {
    throw new Error("User not found in your organization!");
  }

  // ৩. UserRoleMap এ ডাটা ইনসার্ট বা আপডেট (Upsert) করা
  const result = await prisma.userRoleMap.upsert({
    where: {
      userId_roleId: { userId, roleId }
    },
    update: {}, // যদি অলরেডি থাকে তবে কিছু করার দরকার নেই
    create: { userId, roleId }
  });

  return result;
};


export const RoleService = {
  createRole,
  assignRoleToUser
};