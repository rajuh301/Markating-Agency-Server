import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createRole = async (userId: string, payload: any) => {
  const { name, description, permissions } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. ইউজারকে খুঁজে বের করে তার organizationId নেওয়া
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { organizationId: true }
    });

    if (!user || !user.organizationId) {
      throw new Error("User or Organization not found!");
    }

    const organizationId = user.organizationId;

    // ২. এখন প্রাপ্ত organizationId দিয়ে রোল তৈরি করা
    const role = await tx.role.create({
      data: {
        name,
        description,
        organizationId,
      },
    });

    // ৩. পারমিশন ম্যাপ করা
    const permissionData = permissions.map((p: any) => ({
      roleId: role.id,
      module: p.module,
      canView: p.view || false,
      canCreate: p.create || false,
      canEdit: p.edit || false,
      canDelete: p.delete || false,
    }));

    await tx.permission.createMany({
      data: permissionData,
    });

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