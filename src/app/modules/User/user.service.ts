import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createUser = async (data: any) => {
  const { fullName, email, password, companyName } = data;

  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) {
    throw new Error("This email is already registered. Please try logging in instead.");
  }

  const slug = companyName.toLowerCase().replace(/ /g, '-');

  const isOrgExist = await prisma.organization.findUnique({ where: { slug } });
  
  if (isOrgExist) {
    throw new Error(`The agency name "${companyName}" is already taken. Please try adding a city name or a unique word (e.g., ${companyName} BD).`);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.$transaction(async (tx) => {
    try {
      const newOrg = await tx.organization.create({
        data: {
          name: companyName,
          slug: slug,
        },
      });

      const newUser = await tx.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          role: UserRole.OWNER,
          organizationId: newOrg.id,
        },
        include: { organization: true },
      });

      return newUser;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error("This organization name or email is already in use. Please try a different one.");
      }
      throw new Error("Something went wrong during registration. Please try again later.");
    }
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
            organizationId: organizationId 
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
    
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("User not found!");
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

    
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



const getProjectManagers = async (organizationId: string) => {
  const result = await prisma.user.findMany({
    where: {
      organizationId,
      role: 'PROJECT_MANAGER', 
      status: 'ACTIVE',   
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      role: true,
    }
  });

  return result;
};

const getProjectMembers = async (organizationId: string) => {
  const result = await prisma.user.findMany({
    where: {
      organizationId,
      role: 'MEMBER', 
      status: 'ACTIVE',   
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      role: true,
    }
  });

  return result;
};


export const UserService = {
  createUser,
  findUserByEmail,
  getAllUsers,
  inviteUser,
  setPassword,
  getMyProfile,
  getProjectManagers,
  getProjectMembers

};