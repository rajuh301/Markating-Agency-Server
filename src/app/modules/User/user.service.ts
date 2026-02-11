import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createUser = async (data: any) => {
  const { fullName, email, password, companyName } = data;

  // পাসওয়ার্ড হ্যাশ করা
  const hashedPassword = await bcrypt.hash(password, 12);

  // Transaction: অর্গানাইজেশন এবং ইউজার একসাথে তৈরি হবে
  return await prisma.$transaction(async (tx) => {
    const newOrg = await tx.organization.create({
      data: {
        name: companyName,
        slug: companyName.toLowerCase().replace(/ /g, '-'),
      },
    });

    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: UserRole.OWNER, // প্রথম ইউজারকে মালিক বানানো হচ্ছে
        organizationId: newOrg.id,
      },
      include: {
        organization: true,
      },
    });

    return newUser;
  });
};

const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });
};


const getAllUsers = async (organizationId: string) => {
    const result = await prisma.user.findMany({
        where: {
            organizationId: organizationId // নির্দিষ্ট অর্গানাইজেশনের ইউজারদের জন্য
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            phoneNumber: true,
            avatarUrl: true,
            createdAt: true,
            organization: {
                select: {
                  id: true,
                    name: true
                }
            }
        }
    });
    return result;
};



const inviteUser = async (payload: {
    fullName: string;
    email: string;
    role: 'ADMIN' | 'MEMBER';
    organizationId: string;
}) => {
    // চেক করা ইউজার আগে থেকে আছে কিনা
    const isExist = await prisma.user.findUnique({
        where: { email: payload.email }
    });

    if (isExist) {
        throw new Error("User with this email already exists!");
    }

    const result = await prisma.user.create({
        data: {
            fullName: payload.fullName,
            email: payload.email,
            role: payload.role,
            organizationId: payload.organizationId,
            // পাসওয়ার্ড ছাড়া তৈরি হচ্ছে (social login বা পরে সেট করার জন্য)
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            organizationId: true
        }
    });

    return result;
};


const setPassword = async (email: string, password: string) => {
    // ১. চেক করা ইউজার আছে কি না
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("User not found!");
    }

    // ২. পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 12);

    // ৩. পাসওয়ার্ড আপডেট করা
    const result = await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword
        },
        select: {
            id: true,
            email: true,
            role: true
        }
    });

    return result;
};


const getMyProfile = async (userId: string) => {
    const result = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true,
            organizationId: true,
            organization: {
                select: {
                    name: true,
                    slug: true,
                    logoUrl: true
                }
            }
        }
    });

    if (!result) {
        throw new Error("User not found!");
    }

    return result;
};


export const UserService = {
  createUser,
  findUserByEmail,
  getAllUsers,
  inviteUser,
  setPassword,
  getMyProfile
};