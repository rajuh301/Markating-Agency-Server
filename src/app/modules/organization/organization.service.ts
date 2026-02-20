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
    const result = await prisma.organization.findMany({
        where: {
        }
    });
    return result;
};

export const OrganizationService = {
    updateOrganization,
    getOrganization,
    getAllOrganizations
};