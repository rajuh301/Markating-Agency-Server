import { UserStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';

// প্রোফাইল আপডেট করার জন্য
const updateOrganization = async (id: string, payload: any) => {
    const result = await prisma.organization.update({
        where: { id },
        data: payload
    });
    return result;
};

// প্রোফাইল দেখার জন্য
const getOrganization = async (id: string) => {
    const result = await prisma.organization.findUnique({
        where: { id }
    });
    return result;
};


const getAllOrganizations = async (id: string) => {
    const result = await prisma.organization.findMany();
    return result;
};


const softDeleteOrganization = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const org = await tx.organization.findUnique({ where: { id } });
    
    if (!org || org.status === "DELETED") {
      throw new Error("Organization not found or already deleted.");
    }

    const deletedOrg = await tx.organization.update({
      where: { id },
      data: { status: "DELETED" }
    });

    await tx.user.updateMany({
      where: { organizationId: id },
      data: { status: UserStatus.INACTIVE }
    });

    return deletedOrg;
  });
};



export const OrganizationService = {
    updateOrganization,
    getOrganization,
    getAllOrganizations,
    softDeleteOrganization
};