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
    const { searchTerm, city, country, page, limit } = query;

    // পজিনেশন ক্যালকুলেশন
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    const skip = (p - 1) * l;

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

    const whereConditions = {
        AND: andConditions,
        status: "ACTIVE"
    };

    // ডাটা এবং টোটাল সংখ্যা একসাথে বের করা
    const [result, total] = await Promise.all([
        prisma.client.findMany({
            where: whereConditions,
            skip,
            take: l,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.client.count({
            where: whereConditions
        })
    ]);

    return {
        meta: {
            page: p,
            limit: l,
            total,
            totalPage: Math.ceil(total / l)
        },
        data: result
    };
};



const getSingleClient = async (clientId: string, organizationId: string) => {
  const result = await prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId: organizationId, // সিকিউরিটি চেক: নিশ্চিত করে ক্লায়েন্টটি ইউজারের অর্গানাইজেশনের
      status: "ACTIVE",
    },
    // আপনি চাইলে ক্লায়েন্টের সাথে তার প্রজেক্টগুলোর লিস্টও নিয়ে আসতে পারেন
    include: {
      projects: {
        select: {
          id: true,
          status: true,
          createdAt: true
        }
      }
    }
  });

  if (!result) {
    throw new Error("Client not found or you don't have access to this client!");
  }

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


export const ClientService = { 
    createClient, 
    getAllClients,
    updateClient,
    deleteClient,
    getSingleClient
 };