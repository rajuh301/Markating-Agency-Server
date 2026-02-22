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
const getAllClients = async (organizationId: string, query: any) => {
    const { searchTerm, city, country } = query;

    const andConditions: any[] = [{ organizationId }];

    if (searchTerm) {
        andConditions.push({
            OR: [
                { contactPerson: { contains: searchTerm, mode: 'insensitive' } },
                { companyName: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
            ],
        });
    }

    if (city) andConditions.push({ city });
    if (country) andConditions.push({ country });

    const result = await prisma.client.findMany({
        where: {
            AND: andConditions,
            status: "ACTIVE"
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return result;
};



const updateClient = async (id: string, payload: any) => {
  try {

    const client = await prisma.client.findUnique({
      where: { id,
        status:"ACTIVE"
       },
    });

    if (!client) {
        throw new Error("Client not found or already deleted.");
    }


    const result = await prisma.client.update({
      where: { id },
      data: payload,
    });

    return result;
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error("Client not found or already deleted.");
    }
    throw error;
  }
};


const deleteClient = async (id: string) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client || client.status === "DELETED") {
      throw new Error("Client not found or already deleted.");
    }

    const result = await prisma.client.update({
      where: { id },
      data: { status: "DELETED" },
    });

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete client");
  }
};


const getSingleClient = async (id: string) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client || client.status === "DELETED") {
      throw new Error("Client not found or already deleted.");
    }

    return client;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch client");
  }
};


export const ClientService = { createClient, getAllClients,updateClient,
    deleteClient,
    getSingleClient
 };