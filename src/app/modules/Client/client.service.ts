import { Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createClient = async (payload: any) => {
    const organization = await prisma.organization.findUnique({
        where: { id: payload.organizationId }
    });

    if (!organization) {
        throw new Error(`Organization with ID '${payload.organizationId}' not found. Please provide a valid ID.`);
    }

    const existingClient = await prisma.client.findFirst({
        where: {
            email: payload.email,
            organizationId: payload.organizationId
        }
    });

    if (existingClient) {
        throw new Error("Client with this email already exists in your agency.");
    }

    try {
        const result = await prisma.client.create({
            data: {
                contactPerson: payload.contactPerson,
                email: payload.email,
                phoneNumber: payload.phoneNumber,
                companyName: payload.companyName || null,
                website: payload.website || null,
                address: payload.address || null,
                city: payload.city || null,
                country: payload.country || null,
                taxId: payload.taxId || null,
                notes: payload.notes || null,
                organizationId: payload.organizationId,
            }
        });
        
        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new Error("A unique constraint failed on the database (duplicate data).");
            }
            if (error.code === 'P2003') {
                throw new Error("Foreign key constraint failed. Ensure the Organization ID is correct.");
            }
        }
        
        throw new Error("An unexpected error occurred while creating the client.");
    }
};

export const ClientService = { createClient };