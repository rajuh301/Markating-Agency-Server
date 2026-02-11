import prisma from '../../../shared/prisma';

const createClient = async (payload: {
    name: string,
    email: string,
    companyName?: string,
    organizationId: string
}) => {
    const result = await prisma.client.create({
        data: payload
    });
    return result;
};

export const ClientService = { createClient };